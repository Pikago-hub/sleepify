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
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react"
import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

interface JobStatus {
  job_id: string
  status: "processing" | "completed" | "failed"
  current_step?: string
  failed_step?: string
  error?: string
}

const PIPELINE_STEPS = [
  { key: "downloading", label: "Downloading audio" },
  { key: "separating_vocals", label: "Separating vocals" },
  { key: "normalizing_volume", label: "Normalizing volume" },
  { key: "filtering_effects", label: "Filtering sound effects" },
  { key: "adjusting_pace", label: "Adjusting speaking pace" },
  { key: "lowering_pitch", label: "Lowering voice pitch" },
]

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

async function fetchJobStatus(
  jobId: string,
  token: string | null
): Promise<JobStatus> {
  const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch job status: ${res.status}`)
  }
  return res.json()
}

type StepState = "completed" | "active" | "failed" | "pending"

function StepIcon({ state }: { state: StepState }) {
  switch (state) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
    case "active":
      return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
    case "failed":
      return <XCircle className="h-4 w-4 shrink-0 text-red-400" />
    case "pending":
      return <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
  }
}

function JobProgress({ job }: { job: JobStatus }) {
  const activeKey = job.status === "failed" ? job.failed_step : job.current_step
  const activeIndex = PIPELINE_STEPS.findIndex((s) => s.key === activeKey)

  function getStepState(index: number): StepState {
    if (job.status === "completed") return "completed"
    if (job.status === "failed") {
      if (index < activeIndex) return "completed"
      if (index === activeIndex) return "failed"
      return "pending"
    }
    // processing
    if (index < activeIndex) return "completed"
    if (index === activeIndex) return "active"
    return "pending"
  }

  return (
    <div className="space-y-3">
      {job.status === "failed" && job.error && (
        <p className="text-sm text-red-400">{job.error}</p>
      )}
      {job.status === "completed" && (
        <p className="text-sm text-green-400">Processing complete!</p>
      )}
      <div className="space-y-1.5">
        {PIPELINE_STEPS.map((step, i) => {
          const state = getStepState(i)
          return (
            <div key={step.key} className="flex items-center gap-2">
              <StepIcon state={state} />
              <span
                className={cn(
                  "text-sm",
                  state === "active" && "text-foreground font-medium",
                  state === "completed" && "text-muted-foreground",
                  state === "failed" && "text-red-400",
                  state === "pending" && "text-muted-foreground/40"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [jobId, setJobId] = useState<string | null>(null)

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (url: string) => {
      const token = await getToken()
      return createJob({ youtubeUrl: url, token })
    },
    onSuccess: (data) => {
      setJobId(data.job_id)
    },
  })

  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const token = await getToken()
      return fetchJobStatus(jobId!, token)
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === "completed" || status === "failed") return false
      return 2000
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!youtubeUrl.trim()) return
    setJobId(null)
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
          {job && <JobProgress job={job} />}
        </CardContent>
      </Card>
    </div>
  )
}
