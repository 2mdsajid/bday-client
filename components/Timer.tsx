import React, {  } from 'react'
import { useTimer } from 'react-timer-hook';

function Timer({ expiryTimestamp, min, sec, onExpire }) {

  function convertToTwoDigit(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  const expiryDate = new Date(`${expiryTimestamp} ${min}:${sec}`);

  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp: expiryDate, onExpire });

  return (
    <div className='text-sm'>
      {`${days}D ${hours}H ${convertToTwoDigit(minutes)}M ${convertToTwoDigit(seconds)}S`}
    </div>
  )
}

export default Timer
