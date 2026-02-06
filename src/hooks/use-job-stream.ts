"use client"

import { useCallback, useEffect, useReducer, useRef } from "react"

// --- Types ---

export interface StepState {
  key: string
  stepNumber: number
  label: string
  status: "pending" | "started" | "progress" | "completed" | "failed"
  messages: string[]
  latestMessage: string
  timestamp: string | null
}

export type StreamStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "completed"
  | "failed"
  | "error"

interface StreamState {
  steps: StepState[]
  streamStatus: StreamStatus
  totalSteps: number
  downloadUrl: string | null
  error: string | null
}

// --- SSE Event Types ---

interface SSEStepEvent {
  step: string
  step_number: number
  total_steps: number
  message: string
  timestamp: string
}

interface SSECompletedEvent {
  download_url: string
  timestamp: string
}

interface SSEFailedEvent {
  step: string
  error: string
  timestamp: string
}

// --- Reducer ---

type Action =
  | { type: "RESET" }
  | { type: "SET_CONNECTING" }
  | { type: "SET_STREAMING" }
  | { type: "STEP_STARTED"; payload: SSEStepEvent }
  | { type: "STEP_PROGRESS"; payload: SSEStepEvent }
  | { type: "STEP_COMPLETED"; payload: SSEStepEvent }
  | { type: "JOB_COMPLETED"; payload: SSECompletedEvent }
  | { type: "JOB_FAILED"; payload: SSEFailedEvent }
  | { type: "SET_ERROR"; payload: string }

function stepKeyToLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
}

function upsertStep(
  steps: StepState[],
  key: string,
  stepNumber: number,
  status: StepState["status"],
  message: string,
  timestamp: string
): StepState[] {
  const existing = steps.find((s) => s.key === key)
  if (existing) {
    return steps.map((s) =>
      s.key === key
        ? {
            ...s,
            status,
            messages:
              message && message !== s.latestMessage
                ? [...s.messages, message]
                : s.messages,
            latestMessage: message || s.latestMessage,
            timestamp,
          }
        : s
    )
  }
  return [
    ...steps,
    {
      key,
      stepNumber,
      label: stepKeyToLabel(key),
      status,
      messages: message ? [message] : [],
      latestMessage: message,
      timestamp,
    },
  ]
}

const initialState: StreamState = {
  steps: [],
  streamStatus: "idle",
  totalSteps: 0,
  downloadUrl: null,
  error: null,
}

function reducer(state: StreamState, action: Action): StreamState {
  switch (action.type) {
    case "RESET":
      return initialState

    case "SET_CONNECTING":
      return { ...state, streamStatus: "connecting", error: null }

    case "SET_STREAMING":
      return { ...state, streamStatus: "streaming" }

    case "STEP_STARTED": {
      const { step, step_number, total_steps, message, timestamp } =
        action.payload
      // Mark any previously started/progress steps as completed
      const updatedSteps = state.steps.map((s) =>
        s.status === "started" || s.status === "progress"
          ? { ...s, status: "completed" as const }
          : s
      )
      return {
        ...state,
        streamStatus: "streaming",
        totalSteps: total_steps,
        steps: upsertStep(
          updatedSteps,
          step,
          step_number,
          "started",
          message,
          timestamp
        ),
      }
    }

    case "STEP_PROGRESS": {
      const { step, step_number, total_steps, message, timestamp } =
        action.payload
      return {
        ...state,
        totalSteps: total_steps,
        steps: upsertStep(
          state.steps,
          step,
          step_number,
          "progress",
          message,
          timestamp
        ),
      }
    }

    case "STEP_COMPLETED": {
      const { step, step_number, total_steps, message, timestamp } =
        action.payload
      return {
        ...state,
        totalSteps: total_steps,
        steps: upsertStep(
          state.steps,
          step,
          step_number,
          "completed",
          message,
          timestamp
        ),
      }
    }

    case "JOB_COMPLETED": {
      const completedSteps = state.steps.map((s) => ({
        ...s,
        status: "completed" as const,
      }))
      return {
        ...state,
        streamStatus: "completed",
        steps: completedSteps,
        downloadUrl: action.payload.download_url,
      }
    }

    case "JOB_FAILED": {
      const { step, error, timestamp } = action.payload
      const failedSteps = state.steps.map((s) =>
        s.key === step
          ? { ...s, status: "failed" as const, latestMessage: error, timestamp }
          : s.status === "started" || s.status === "progress"
            ? { ...s, status: "pending" as const }
            : s
      )
      return {
        ...state,
        streamStatus: "failed",
        steps: failedSteps,
        error,
      }
    }

    case "SET_ERROR":
      return { ...state, streamStatus: "error", error: action.payload }

    default:
      return state
  }
}

// --- SSE Parser ---

function parseSSEChunk(raw: string): { event: string; data: string }[] {
  const events: { event: string; data: string }[] = []
  const blocks = raw.split("\n\n")

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed || trimmed.startsWith(":")) continue

    let event = "message"
    const dataLines: string[] = []

    for (const line of trimmed.split("\n")) {
      if (line.startsWith(":")) continue
      if (line.startsWith("event:")) {
        event = line.slice(6).trim()
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim())
      }
    }

    if (dataLines.length > 0) {
      events.push({ event, data: dataLines.join("\n") })
    }
  }

  return events
}

// --- Hook ---

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000]

export function useJobStream() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const abortRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const activeJobIdRef = useRef<string | null>(null)

  const disconnect = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    activeJobIdRef.current = null
    retryCountRef.current = 0
  }, [])

  const connect = useCallback(
    (jobId: string, getTokenFn: () => Promise<string | null>) => {
      // Disconnect any existing stream
      disconnect()

      activeJobIdRef.current = jobId
      retryCountRef.current = 0
      dispatch({ type: "RESET" })

      const startStream = async () => {
        if (activeJobIdRef.current !== jobId) return

        dispatch({ type: "SET_CONNECTING" })

        const controller = new AbortController()
        abortRef.current = controller

        try {
          const token = await getTokenFn()
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

          const res = await fetch(`${apiBase}/api/jobs/${jobId}/stream`, {
            headers: {
              Accept: "text/event-stream",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            signal: controller.signal,
          })

          if (!res.ok) {
            throw new Error(`Stream request failed: ${res.status}`)
          }

          if (!res.body) {
            throw new Error("No response body for stream")
          }

          dispatch({ type: "SET_STREAMING" })
          retryCountRef.current = 0

          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Process complete events (separated by double newline)
            const lastDoubleNewline = buffer.lastIndexOf("\n\n")
            if (lastDoubleNewline === -1) continue

            const complete = buffer.slice(0, lastDoubleNewline + 2)
            buffer = buffer.slice(lastDoubleNewline + 2)

            const events = parseSSEChunk(complete)

            for (const { event, data } of events) {
              try {
                const parsed = JSON.parse(data)

                if (event === "step") {
                  // Backend sends event: step with status in the data payload
                  switch (parsed.status) {
                    case "started":
                      dispatch({ type: "STEP_STARTED", payload: parsed })
                      break
                    case "progress":
                      dispatch({ type: "STEP_PROGRESS", payload: parsed })
                      break
                    case "completed":
                      dispatch({ type: "STEP_COMPLETED", payload: parsed })
                      break
                    case "failed":
                      dispatch({
                        type: "JOB_FAILED",
                        payload: {
                          step: parsed.step,
                          error: parsed.message || "Step failed",
                          timestamp: parsed.timestamp,
                        },
                      })
                      disconnect()
                      return
                  }
                } else if (event === "job_completed" || event === "complete") {
                  dispatch({ type: "JOB_COMPLETED", payload: parsed })
                  disconnect()
                  return
                } else if (event === "job_failed" || event === "error") {
                  dispatch({
                    type: "JOB_FAILED",
                    payload: {
                      step: parsed.step ?? "",
                      error: parsed.error || parsed.message || "Job failed",
                      timestamp: parsed.timestamp ?? new Date().toISOString(),
                    },
                  })
                  disconnect()
                  return
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }

          // Stream ended without terminal event — may need retry
          if (
            activeJobIdRef.current === jobId &&
            retryCountRef.current < MAX_RETRIES
          ) {
            const delay = RETRY_DELAYS[retryCountRef.current]
            retryCountRef.current++
            setTimeout(startStream, delay)
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") return

          if (
            activeJobIdRef.current === jobId &&
            retryCountRef.current < MAX_RETRIES
          ) {
            const delay = RETRY_DELAYS[retryCountRef.current]
            retryCountRef.current++
            setTimeout(startStream, delay)
          } else {
            dispatch({
              type: "SET_ERROR",
              payload:
                err instanceof Error
                  ? err.message
                  : "Connection to stream failed",
            })
          }
        }
      }

      startStream()
    },
    [disconnect]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    steps: state.steps,
    streamStatus: state.streamStatus,
    totalSteps: state.totalSteps,
    downloadUrl: state.downloadUrl,
    error: state.error,
    connect,
    disconnect,
  }
}
