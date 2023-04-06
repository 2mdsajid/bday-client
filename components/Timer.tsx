import React, {  } from 'react'
import { useTimer } from 'react-timer-hook';

function Timer({ expiryTimestamp, min, sec }) {

  function convertToTwoDigit(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  const expiryDate = new Date(`${expiryTimestamp} 00:${min}:${sec}`);

  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp: expiryDate });

  return (
    <div className='text-sm sm:text-lg'>
      {`${days}D ${hours}H ${convertToTwoDigit(minutes)}M ${convertToTwoDigit(seconds)}S`}
    </div>
  )
}

export default Timer
