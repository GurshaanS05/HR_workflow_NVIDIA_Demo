"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import TransferDetail from "@/components/transfer-detail"

export default function TransferDetailPage() {
  const params = useParams<{ id: string }>()
  const id = useMemo(() => (Array.isArray(params?.id) ? params.id[0] : params?.id), [params])
  if (!id) return null
  return <TransferDetail id={id} />
}
