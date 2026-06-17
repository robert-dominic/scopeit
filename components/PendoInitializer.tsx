"use client";

import { useEffect } from "react";

export default function PendoInitializer() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).pendo) {
        (window as any).pendo.initialize({
          visitor: { id: "" },
        });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}