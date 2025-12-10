"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function useRequireAuth() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  // Функция, которая проверяет аутентификацию
  async function requireAuth(action) {
    if (!user) {
      // если не авторизован — показываем модалку
      setOpen(true);
      return;
    }

    // если авторизован — выполняем действие
    if (typeof action === "function") {
      return action();
    }
  }

  return { requireAuth, open, setOpen };
}
