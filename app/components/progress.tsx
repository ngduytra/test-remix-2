import { useEffect, useMemo, useState } from 'react'

import FixedProgress from './fixed-progress'

type ProgressProps = {
  progress?: number
  rootClassName?: string
  indicatorClassName?: string
  label?: string | ((progress: number) => string)
} & {
  toProgress?: number
  estimatedDuration?: number
  intervalTime?: number
  finished?: boolean
}

const Progress = ({
  progress: progressProp = 0,
  rootClassName,
  indicatorClassName,
  label,
  toProgress,
  estimatedDuration,
  intervalTime = 50,
  finished = false,
}: ProgressProps) => {
  const [progress, setProgress] = useState(progressProp)
  const getValueLabel = useMemo(() => {
    if (typeof label === 'function' && label !== undefined) {
      return label
    }
    return () => label ?? ''
  }, [label])

  useEffect(() => {
    if (toProgress === undefined || estimatedDuration === undefined) return
    if (finished) {
      setProgress(toProgress)
      return
    }

    const progressDiff = toProgress - progressProp
    // Note: interval time should be greater than 50ms
    const progressPerInterval =
      Math.floor((progressDiff * intervalTime * 1000) / estimatedDuration) /
      1000
    const timer = setInterval(
      () =>
        setProgress((prev) => {
          return Math.min(prev + progressPerInterval, toProgress - 1)
        }),
      intervalTime,
    )
    return () => clearInterval(timer)
  }, [progressProp, toProgress, estimatedDuration, finished, intervalTime])

  return (
    <FixedProgress
      progress={progress}
      label={getValueLabel(progress)}
      indicatorClassName={indicatorClassName}
      rootClassName={rootClassName}
    />
  )
}

export default Progress
