import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { Marketplace } from "@/types/marketplace";
import { toast } from "sonner";

// Все возможные типы маркетплейсов с базовой информацией
const ALL_MARKETPLACE_TYPES = [
  { type: "ozon", name: "Ozon", icon: "ozon" },
  { type: "yandex", name: "Яндекс Маркет", icon: "yandex" },
  { type: "wildberries", name: "Wildberries", icon: "wildberries" },
  { type: "sber", name: "СберМегаМаркет", icon: "sber" },
  { type: "aliexpress", name: "AliExpress", icon: "aliexpress" },
];

export function useMarketplacesWithSupabase() {
  const { user } = useAuth();
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка маркетплейсов из БД и объединение с полным списком
  useEffect(() => {
    if (!user) {
      // Если пользователь не авторизован, показываем только базовые карточки (неподключённые)
      const baseMarketplaces: Marketplace[] = ALL_MARKETPLACE_TYPES.map(
        (item) => ({
          id: `${item.type}-placeholder`, // временный id для React-ключа
          name: item.name,
          type: item.type as any,
          icon: item.icon,
          connected: false,
          status: "inactive",
        }),
      );
      setMarketplaces(baseMarketplaces);
      setLoading(false);
      return;
    }

    async function loadMarketplaces() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("marketplaces")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Создаём мапу для быстрого доступа к данным из БД по type
        const dbMap = new Map(
          data?.map((item) => [
            item.type,
            {
              id: item.id.toString(),
              name: item.name,
              type: item.type,
              icon: item.type,
              connected: item.status === "active",
              apiKey: item.api_key,
              clientId: item.client_id,
              lastSync: item.last_sync ? new Date(item.last_sync) : undefined,
              status: item.status,
            },
          ]) || [],
        );

        // Объединяем с базовым списком
        const combined: Marketplace[] = ALL_MARKETPLACE_TYPES.map((base) => {
          const dbEntry = dbMap.get(base.type);
          if (dbEntry) {
            return dbEntry;
          } else {
            return {
              id: `${base.type}-placeholder`,
              name: base.name,
              type: base.type as any,
              icon: base.icon,
              connected: false,
              status: "inactive",
            };
          }
        });

        setMarketplaces(combined);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load marketplaces",
        );
        toast.error("Ошибка загрузки маркетплейсов");
      } finally {
        setLoading(false);
      }
    }

    loadMarketplaces();
  }, [user]);

  // Подключение/обновление маркетплейса
  const connectMarketplace = async (
    type: string,
    name: string,
    apiKey: string,
    clientId?: string,
  ) => {
    if (!user) throw new Error("Not authenticated");

    try {
      // Проверяем, есть ли уже запись с таким type
      const { data: existing } = await supabase
        .from("marketplaces")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", type)
        .maybeSingle();

      let result;
      if (existing) {
        // Обновляем существующую
        const { data, error } = await supabase
          .from("marketplaces")
          .update({
            name,
            api_key: apiKey,
            client_id: clientId,
            status: "active",
            last_sync: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        // Создаём новую
        const { data, error } = await supabase
          .from("marketplaces")
          .insert({
            user_id: user.id,
            type,
            name,
            api_key: apiKey,
            client_id: clientId,
            status: "active",
            last_sync: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      // Формируем объект для обновления стейта
      const updated: Marketplace = {
        id: result.id.toString(),
        name: result.name,
        type: result.type,
        icon: result.type,
        connected: true,
        apiKey: result.api_key,
        clientId: result.client_id,
        lastSync: result.last_sync ? new Date(result.last_sync) : undefined,
        status: result.status,
      };

      // Обновляем локальный стейт: заменяем элемент с таким же type
      setMarketplaces((prev) =>
        prev.map((mp) => (mp.type === type ? updated : mp)),
      );

      toast.success("Маркетплейс подключён");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка подключения");
      return false;
    }
  };

  // Отключение маркетплейса
  const disconnectMarketplace = async (id: string) => {
    // Здесь id – это настоящий id из БД (не плейсхолдер)
    // Если id содержит "-placeholder", значит это неподключённый маркетплейс – просто ничего не делаем
    if (id.includes("-placeholder")) {
      toast.info("Этот маркетплейс ещё не подключён");
      return false;
    }

    try {
      const { error } = await supabase
        .from("marketplaces")
        .update({ status: "inactive" })
        .eq("id", id);

      if (error) throw error;

      setMarketplaces((prev) =>
        prev.map((mp) =>
          mp.id === id
            ? {
                ...mp,
                connected: false,
                status: "inactive",
                apiKey: undefined,
                clientId: undefined,
                lastSync: undefined,
              }
            : mp,
        ),
      );
      toast.success("Маркетплейс отключён");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка отключения");
      return false;
    }
  };

  // Синхронизация маркетплейса
  const syncMarketplace = async (id: string) => {
    if (id.includes("-placeholder")) {
      toast.info("Сначала подключите маркетплейс");
      return false;
    }

    try {
      const { error } = await supabase
        .from("marketplaces")
        .update({ last_sync: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setMarketplaces((prev) =>
        prev.map((mp) => (mp.id === id ? { ...mp, lastSync: new Date() } : mp)),
      );
      toast.success("Синхронизация запущена");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка синхронизации");
      return false;
    }
  };

  // Получение подключённых маркетплейсов
  const getConnectedMarketplaces = () => {
    return marketplaces.filter((mp) => mp.connected);
  };

  return {
    marketplaces,
    loading,
    error,
    connectMarketplace,
    disconnectMarketplace,
    syncMarketplace,
    getConnectedMarketplaces,
  };
}
