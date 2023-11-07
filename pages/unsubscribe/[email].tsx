import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UnsubscribeMailNotificationPage = () => {
  const router = useRouter();
  const { email } = router.query;
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (email) {
      addEmailToDatabase(email as string);
    }
  }, [email]);

  const addEmailToDatabase = async (email: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND + '/addunsubnotificemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json()
      setMessage(data.message)
      if (response.ok) {
        setIsUnsubscribed(true);
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen w-screen bg-white text-black pt-20 flex flex-col items-center justify-center'>
      {isUnsubscribed ? (
        <div className='text-center'>{message}!</div>
      ) : (
        <div className='text-center'>Processing...</div>
      )}
      <div className='w-full flex justify-center'>
        <button onClick={() => router.push('/')} className="px-3 py-2 w-max bg-blue-700 hover:bg-blue-500 mx-auto my-5 text-white font-semibold rounded-md">Return To Home Page</button>
      </div>
    </div>
  );
};

export default UnsubscribeMailNotificationPage;
