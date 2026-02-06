"use client"

import { useCallback, useEffect, useRef } from "react"

interface MediaSessionOptions {
  title: string
  artist?: string
  artwork?: string
}

interface MediaSessionControls {
  onPlay?: () => void
  onPause?: () => void
  onSeekForward?: () => void
  onSeekBackward?: () => void
  onNextTrack?: () => void
  onPreviousTrack?: () => void
}

/**
 * Hook to integrate with the Media Session API for lock screen / OS-level
 * media controls. Call updatePositionState whenever playback position changes.
 */
export function useMediaSession(
  controls: MediaSessionControls,
  audioRef: React.RefObject<HTMLAudioElement | null>
) {
  const controlsRef = useRef(controls)
  controlsRef.current = controls

  const updateMetadata = useCallback(
    (opts: MediaSessionOptions) => {
      if (!("mediaSession" in navigator)) return

      navigator.mediaSession.metadata = new MediaMetadata({
        title: opts.title,
        artist: opts.artist ?? "Sleepify",
        artwork: [
          {
            src: opts.artwork ?? "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      })
    },
    []
  )

  const updatePositionState = useCallback(() => {
    if (!("mediaSession" in navigator)) return
    const audio = audioRef.current
    if (!audio || !audio.duration || !isFinite(audio.duration)) return

    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime,
    })
  }, [audioRef])

  // Register action handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return

    const actions: [MediaSessionAction, (() => void) | undefined][] = [
      ["play", controlsRef.current.onPlay],
      ["pause", controlsRef.current.onPause],
      ["seekforward", controlsRef.current.onSeekForward],
      ["seekbackward", controlsRef.current.onSeekBackward],
      ["nexttrack", controlsRef.current.onNextTrack],
      ["previoustrack", controlsRef.current.onPreviousTrack],
    ]

    for (const [action, handler] of actions) {
      if (handler) {
        navigator.mediaSession.setActionHandler(action, handler)
      }
    }

    return () => {
      for (const [action] of actions) {
        navigator.mediaSession.setActionHandler(action, null)
      }
    }
  })

  return { updateMetadata, updatePositionState }
}
