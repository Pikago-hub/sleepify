"use client"

import { cn } from "@/lib/utils"
import { easeOutCubic } from "@/lib/animation"
import type { StepState, StreamStatus } from "@/hooks/use-job-stream"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Circle, Download, Loader2, XCircle } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

// --- Typewriter Message ---

function TypewriterMessage({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")
  const prevTextRef = useRef("")

  useEffect(() => {
    const prev = prevTextRef.current

    // If new text extends old text, only type the new portion
    if (text.startsWith(prev)) {
      const newPortion = text.slice(prev.length)
      let i = 0
      setDisplayed(prev)

      const interval = setInterval(() => {
        if (i < newPortion.length) {
          setDisplayed((d) => d + newPortion[i])
          i++
        } else {
          clearInterval(interval)
        }
      }, 15)

      prevTextRef.current = text
      return () => clearInterval(interval)
    }

    // Completely new text — type from scratch
    setDisplayed("")
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((d) => d + text[i])
        i++
      } else {
        clearInterval(interval)
      }
    }, 15)

    prevTextRef.current = text
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="text-sm text-muted-foreground">
      {displayed}
      <motion.span
        className="ml-0.5 inline-block h-3.5 w-[2px] bg-primary align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  )
}

// --- Step Icon ---

function StepIcon({ status }: { status: StepState["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
    case "started":
    case "progress":
      return (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
      )
    case "failed":
      return <XCircle className="h-4 w-4 shrink-0 text-red-400" />
    case "pending":
    default:
      return (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )
  }
}

// --- Step Row ---

function StepRow({ step }: { step: StepState }) {
  const isActive = step.status === "started" || step.status === "progress"
  const isCompleted = step.status === "completed"
  const isFailed = step.status === "failed"
  const isPending = step.status === "pending"

  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-2 py-1">
        <StepIcon status={step.status} />
        <span
          className={cn(
            "text-sm transition-colors duration-200",
            isActive && "font-medium text-foreground",
            isCompleted && "text-muted-foreground",
            isFailed && "font-medium text-red-400",
            isPending && "text-muted-foreground/40"
          )}
        >
          {step.label}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {(isActive || isFailed) && step.latestMessage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutCubic }}
            className="overflow-hidden"
          >
            <div className="pb-1.5 pl-6">
              {isFailed ? (
                <span className="text-sm text-red-400">
                  {step.latestMessage}
                </span>
              ) : (
                <TypewriterMessage text={step.latestMessage} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Progress Bar ---

function ProgressBar({
  steps,
  totalSteps,
}: {
  steps: StepState[]
  totalSteps: number
}) {
  const completedCount = steps.filter((s) => s.status === "completed").length
  const total = totalSteps || steps.length || 1
  const pct = Math.round((completedCount / total) * 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: easeOutCubic }}
        />
      </div>
    </div>
  )
}

// --- Main Component ---

interface JobProgressStreamProps {
  steps: StepState[]
  streamStatus: StreamStatus
  totalSteps: number
  downloadUrl: string | null
  error: string | null
}

export function JobProgressStream({
  steps,
  streamStatus,
  totalSteps,
  downloadUrl,
  error,
}: JobProgressStreamProps) {
  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener")
    }
  }, [downloadUrl])

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {steps.length > 0 && (
        <ProgressBar steps={steps} totalSteps={totalSteps} />
      )}

      {/* Connecting state */}
      {streamStatus === "connecting" && steps.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </div>
      )}

      {/* Step list */}
      <div className="space-y-0.5">
        {steps.map((step) => (
          <StepRow key={step.key} step={step} />
        ))}
      </div>

      {/* Completion message + download */}
      {streamStatus === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeOutCubic }}
          className="space-y-2"
        >
          <p className="text-sm text-green-400">Processing complete!</p>
          {downloadUrl && (
            <Button onClick={handleDownload} size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Download Audio
            </Button>
          )}
        </motion.div>
      )}

      {/* Error states */}
      {streamStatus === "error" && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
