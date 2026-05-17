"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { isDemoEmail } from "@/lib/demo/config";

export function useDemoAccount() {
  const { user } = useAuth();

  const isDemo = useMemo(() => isDemoEmail(user?.email ?? null), [user?.email]);

  return {
    isDemo,
    email: user?.email ?? null,
  };
}
