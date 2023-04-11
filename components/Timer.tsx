import React from 'react';
import { useTimer } from 'react-timer-hook';
import moment from 'moment';

interface TimerProps {
  expiryTimestamp: string;
  min: number;
  sec: number;
}

function Timer({ expiryTimestamp, min, sec }: TimerProps) {
  const expiryDate = moment(expiryTimestamp).toDate();
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp: expiryDate });

  function convertToTwoDigit(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  return (
    <div className='text-sm md:text-lg'>
      {`${days}D ${hours}H ${convertToTwoDigit(minutes)}M ${convertToTwoDigit(seconds)}S`}
    </div>
  );
}

export default Timer;
