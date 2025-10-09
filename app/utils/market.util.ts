import dayjs, { Dayjs } from 'dayjs'
import { UTCTimestamp } from 'lightweight-charts'

import { GetCollectionPriceCandlesResponse } from '@/services/finance/type'

import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK } from '@/constants'
import { OHLCV, Timeframe, TimeRange } from '@/types/market.type'

export const timeRangeToTimeframe = (
  timeRange: TimeRange,
  endTime: Dayjs,
  minStartTime: Dayjs,
) => {
  const startTime = getStartTimeByTimeRange(endTime, timeRange, minStartTime)

  const diff = endTime.diff(startTime) / 1000
  if (diff <= ONE_DAY) return Timeframe.HalfHour
  if (diff <= ONE_WEEK) return Timeframe.FourHours
  if (diff <= ONE_MONTH) return Timeframe.OneDay
  if (diff <= ONE_MONTH * 6) return Timeframe.ThreeDays
  return Timeframe.OneWeek
}

export const timeFrameToCandleGap = (timeFrame: Timeframe) => {
  return (
    {
      [Timeframe.HalfHour]: 30 * ONE_MINUTE,
      [Timeframe.FourHours]: 4 * ONE_HOUR,
      [Timeframe.OneDay]: ONE_DAY,
      [Timeframe.ThreeDays]: 3 * ONE_DAY,
      [Timeframe.OneWeek]: 7 * ONE_DAY,
    }[timeFrame] ?? ONE_HOUR
  )
}

export const transformCandles = (
  candles: GetCollectionPriceCandlesResponse,
  leftBounded: OHLCV | null,
  endTime: Dayjs,
  timeRange: TimeRange,
  minStartTime: Dayjs,
) => {
  const values: {
    time: UTCTimestamp
    close: bigint
    volume: bigint
  }[] = []

  const startTime = getStartTimeByTimeRange(endTime, timeRange, minStartTime)
  const timeFrame = timeRangeToTimeframe(timeRange, startTime, endTime)
  const candleGap = timeFrameToCandleGap(timeFrame) * 1000

  let lastCandleIndex = -1
  let i = 0
  do {
    const currentTimestamp = startTime.add(candleGap * i)
    const nextTimestamp = currentTimestamp.add(candleGap)
    values.push({
      time: currentTimestamp.unix() as UTCTimestamp,
      close: values[i - 1]?.close ?? BigInt(leftBounded?.close ?? 0),
      volume: 0n,
    })

    let candle
    for (let j = lastCandleIndex + 1; j < candles.length; j++) {
      if (
        dayjs(candles[j].time).isAfter(currentTimestamp) &&
        dayjs(candles[j].time).isBefore(nextTimestamp)
      ) {
        lastCandleIndex = j
        candle = candles[j]
        break
      }
    }

    if (candle) {
      values[i].close = BigInt(candle.close)
      values[i].volume = BigInt(candle.volume)
    }
    i++
  } while (startTime.add(candleGap * i).isBefore(endTime))
  return values
}

export const getStartTimeByTimeRange = (
  to: Dayjs,
  timeRange: TimeRange,
  minStartTime: Dayjs,
) => {
  let startTime = minStartTime
  switch (timeRange) {
    case TimeRange.OneDay:
      startTime = to.subtract(1, 'day')
      break
    case TimeRange.OneWeek:
      startTime = to.subtract(1, 'week')
      break
    case TimeRange.OneMonth:
      startTime = to.subtract(1, 'month')
      break
    case TimeRange.ThreeMonths:
      startTime = to.subtract(3, 'months')
      break
    case TimeRange.HalfYear:
      startTime = to.subtract(6, 'months')
      break
    case TimeRange.AllTime:
    default:
      startTime = minStartTime
      break
  }
  const _startTime = minStartTime.isAfter(startTime) ? minStartTime : startTime

  if (_startTime.isAfter(to)) {
    return to
  }
  return _startTime
}

export const getBoundedToByTimeFrame = (
  timestampInSeconds: number,
  timeFrame: Timeframe,
) => {
  let boundedTo =
    Math.floor(timestampInSeconds / (ONE_MINUTE * 30)) * (ONE_MINUTE * 30)
  switch (timeFrame) {
    case Timeframe.HalfHour:
      boundedTo =
        Math.floor(timestampInSeconds / (ONE_MINUTE * 30)) * (ONE_MINUTE * 30)
      break
    case Timeframe.FourHours:
      boundedTo =
        Math.floor(timestampInSeconds / (ONE_HOUR * 4)) * (ONE_HOUR * 4)
      break
    case Timeframe.OneDay:
      boundedTo = Math.floor(timestampInSeconds / ONE_DAY) * ONE_DAY
      break
    case Timeframe.ThreeDays:
      boundedTo = Math.floor(timestampInSeconds / (ONE_DAY * 3)) * (ONE_DAY * 3)
      break
    case Timeframe.OneWeek:
      boundedTo = Math.floor(timestampInSeconds / (ONE_DAY * 7)) * (ONE_DAY * 7)
      break
  }

  return dayjs.unix(boundedTo)
}
