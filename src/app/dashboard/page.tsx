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
import { JobProgressStream } from "@/components/dashboard/job-progress-stream"
import { useJobStream } from "@/hooks/use-job-stream"
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "@tanstack/react-query"
import { Clock, Loader2 } from "lucide-react"
import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

async function createJob({
  youtubeUrl,
  token,
}: {
  youtubeUrl: string
  token: string | null
}): Promise<{ job_id: string }> {
  const res = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  })
  if (!res.ok) {
    throw new Error(`Failed to create job: ${res.status}`)
  }
  return res.json()
}

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const stream = useJobStream()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (url: string) => {
      const token = await getToken()
      return createJob({ youtubeUrl: url, token })
    },
    onSuccess: (data) => {
      stream.connect(data.job_id, getToken)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!youtubeUrl.trim()) return
    stream.disconnect()
    mutate(youtubeUrl.trim())
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Process Audio</CardTitle>
          <CardDescription>
            Paste a YouTube URL to process audio for better sleep listening
          </CardDescription>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>Free plan: only the first 5 minutes of audio will be cleaned</span>
            </div>
            <p className="pl-[18px]">
              Videos longer than 5 min?{" "}
              <a href="/#pricing" className="underline underline-offset-2 hover:text-foreground">
                Upgrade for full-length audio cleaning
              </a>
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
          {isError && (
            <p className="text-sm text-red-400">
              {error?.message || "Something went wrong. Please try again."}
            </p>
          )}
          {stream.streamStatus !== "idle" && (
            <JobProgressStream
              steps={stream.steps}
              streamStatus={stream.streamStatus}
              totalSteps={stream.totalSteps}
              downloadUrl={stream.downloadUrl}
              error={stream.error}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
