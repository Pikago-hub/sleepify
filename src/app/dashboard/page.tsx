"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

async function createJob(youtubeUrl: string) {
  const res = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  })
  if (!res.ok) {
    throw new Error(`Failed to create job: ${res.status}`)
  }
  return res.json()
}

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: createJob,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!youtubeUrl.trim()) return
    mutate(youtubeUrl.trim())
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Process Audio</CardTitle>
          <CardDescription>
            Paste a YouTube URL to process audio for better sleep listening
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Process"
              )}
            </Button>
          </form>
          {isSuccess && (
            <p className="text-sm text-green-400">
              Job created! Your audio is being processed.
            </p>
          )}
          {isError && (
            <p className="text-sm text-red-400">
              {error?.message || "Something went wrong. Please try again."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
