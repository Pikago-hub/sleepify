"use client"

import Link from "next/link"
import { AudioLines } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LibraryPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <AudioLines className="h-16 w-16 text-muted-foreground" />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">No processed audio yet</h2>
          <p className="text-muted-foreground">
            Process a YouTube URL to see your audio here
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Process a URL</Link>
        </Button>
      </div>
    </div>
  )
}
