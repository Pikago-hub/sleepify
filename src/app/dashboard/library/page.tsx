"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AudioLines,
  CheckCircle2,
  Loader2,
  XCircle,
  Download,
  Play,
  Pause,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

interface Job {
  job_id: string
  youtube_url: string
  title: string | null
  status: "processing" | "completed" | "failed"
  current_step: string | null
  failed_step: string | null
  download_url: string | null
  error: string | null
  created_at: string
}

interface JobsResponse {
  jobs: Job[]
  total: number
  limit: number
  offset: number
}

async function fetchJobs(): Promise<JobsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/jobs`)
  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status}`)
  }
  return res.json()
}

function StatusBadge({ status }: { status: Job["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "completed" && "bg-green-400/10 text-green-400",
        status === "processing" && "bg-primary/10 text-primary",
        status === "failed" && "bg-red-400/10 text-red-400"
      )}
    >
      {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
      {status === "processing" && (
        <Loader2 className="h-3 w-3 animate-spin" />
      )}
      {status === "failed" && <XCircle className="h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }, [isPlaying])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current
      const bar = progressRef.current
      if (!audio || !bar || !duration) return
      const rect = bar.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      audio.currentTime = ratio * duration
    },
    [duration]
  )

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col gap-2">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5 ml-0.5" />
          )}
        </button>
        <div className="flex flex-1 flex-col gap-1">
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="group relative h-1.5 w-full cursor-pointer rounded-full bg-muted"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
        <a
          href={src}
          download
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Download"
        >
          <Download className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

export default function LibraryPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.jobs?.some(
        (j) => j.status === "processing"
      )
      return hasProcessing ? 5000 : false
    },
  })

  const jobs = data?.jobs

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="h-16 w-16 text-red-400" />
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Failed to load library</h2>
            <p className="text-sm text-muted-foreground">
              {error?.message || "Something went wrong."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Library</h1>
          <p className="text-sm text-muted-foreground">
            Your processed audio files
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Process new URL</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.job_id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-base">
                  {job.title ?? job.youtube_url}
                </CardTitle>
                <StatusBadge status={job.status} />
              </div>
              <CardDescription className="flex flex-col gap-0.5">
                <span>
                  {new Date(job.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                {job.title && (
                  <a
                    href={job.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                  >
                    {job.youtube_url}
                  </a>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {job.status === "processing" && job.current_step && (
                <p className="text-sm text-muted-foreground">
                  {job.current_step}
                </p>
              )}
              {job.status === "failed" && job.error && (
                <p className="text-sm text-red-400">{job.error}</p>
              )}
              {job.status === "completed" && job.download_url && (
                <AudioPlayer src={job.download_url} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
