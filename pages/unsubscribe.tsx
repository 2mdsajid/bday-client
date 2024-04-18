import Link from 'next/link';
import React, { useState } from 'react';

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      setIsBtnClicked(true)
      if (!email) return setMessage('Please enter a valid email address')
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND + '/addunsubnotificemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setIsBtnClicked(false)
      if (response.ok) setIsUnsubscribed(true)
    } catch (error) {
      setMessage('some error happened while unsubscribing!')
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      {!isUnsubscribed &&
        <form onSubmit={handleSubmit}>
          <p className='mb-2'>So you really wanna unsubscribe? bro......</p>
          <div className="mb-4">
            {/* <label htmlFor="email" className="block text-gray-700">Email:</label> */}
            <input
              id="email"
              type="email"
              value={email}
              placeholder='email plzzz..'
              onChange={handleEmailChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isBtnClicked ? '...' : 'Unsubscribe Kardo'}
          </button>
        </form>}
      {message && <p className="text-green-600">{message}</p>}
      {isUnsubscribed && <Link href={'/'} className="text-blue-500 underline">Visit Home Page</Link>}
    </div>
  );
};

export default Unsubscribe;
