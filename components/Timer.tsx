import React, {  } from 'react'
import { useTimer } from 'react-timer-hook';

interface TimerProps {
  expiryTimestamp: number;
  min: number;
  sec: number;
}

function Timer({ expiryTimestamp, min, sec }: TimerProps) {

  function convertToTwoDigit(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  const expiryDate = new Date(`${expiryTimestamp} 00:00:${sec}`);

  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp: expiryDate });

  return (
    <div className='text-sm md:text-lg'>
      {`${days}D ${hours}H ${convertToTwoDigit(minutes)}M ${convertToTwoDigit(seconds)}S`}
    </div>
  )
}

export default Timer
