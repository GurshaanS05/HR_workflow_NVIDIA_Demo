"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export default function TopNav() {
  return (
    <div className="flex w-full items-center gap-3">
      <Link href="/" className="font-semibold text-gray-900">
        HR Mobility Workflow Tool
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <div className="w-56 sm:w-72">
          <Input placeholder="Search by employee" aria-label="Search by employee" />
        </div>
        <Button asChild>
          <Link href="/transfers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Link>
        </Button>
      </div>
    </div>
  )
}
