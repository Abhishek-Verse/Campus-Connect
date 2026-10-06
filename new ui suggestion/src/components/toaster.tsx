"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="light"
      position="top-center"
      toastOptions={{
        style: {
          background: "#fdfbf4",
          border: "1.5px solid #181611",
          boxShadow: "5px 5px 0 rgba(24,22,17,0.9)",
          color: "#181611",
        },
      }}
    />
  );
}
