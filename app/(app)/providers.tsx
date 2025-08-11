"use client"

import { TransfersProvider } from "@/lib/store"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TransfersProvider>{children}</TransfersProvider>
}
