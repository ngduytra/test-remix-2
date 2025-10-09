import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(duration)

export const formatRelativeTime = (timestamp: string): string => {
  return dayjs(timestamp).fromNow(true)
}

export const calculateTimeLeft = (endTime: number) => {
  const now = dayjs()
  const end = dayjs(endTime)
  const diff = end.diff(now)
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }

  const duration = dayjs.duration(diff)
  return {
    hours: Math.floor(duration.asHours()),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  }
}
