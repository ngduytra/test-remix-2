import React, { useState, useEffect } from 'react'

interface CountdownProps {
  endTime: number
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime * 1000 - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0')
  }

  return (
    <div className="text-base font-vipnagorgialla">
      {timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0 ? (
        <div className="font-bold animate-pulse">TIME&apos;S UP!</div>
      ) : (
        <div className="flex flex-row gap-3">
          {timeLeft.days > 0 && (
            <div className="w-10 flex flex-nowrap">
              <div className="w-[27px]">{formatNumber(timeLeft.days)}</div>
              <span className="text-neutral-500">D</span>
            </div>
          )}
          <div className="w-10 flex flex-nowrap">
            <div className="w-[27px]">{formatNumber(timeLeft.hours)}</div>
            <span className="text-neutral-500">H</span>
          </div>
          <div className="w-10 flex flex-nowrap">
            <div className="w-[27px]">{formatNumber(timeLeft.minutes)}</div>
            <span className="text-neutral-500">M</span>
          </div>
          <div className="w-10 flex flex-nowrap">
            <div className="w-[27px]">{formatNumber(timeLeft.seconds)}</div>
            <span className="text-neutral-500">S</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Countdown
