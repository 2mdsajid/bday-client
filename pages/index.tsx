import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'

import ThemeProvider from '../components/themeprovider'

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Timer from '@/components/Timer'

function MyComponent() {
  return (
    <div>
      <FontAwesomeIcon icon={faTimes} />
    </div>
  );
}


const inter = Inter({ subsets: ['latin'] })
import { useState, useEffect, useContext } from 'react';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for tracking dark mode

  // defining the array of bdays
  const [people, setPeople] = useState([]);
  const [initialPeople, setinitialPeople] = useState([])



  // BIRTHDAY CARD --------------------------------------

  const onExpire = (id) => {
    // Find the person object in the array with the matching id
    // const person = people.find(p => p._id === id);

    // // Get the birth date as a Date object
    // const birthDate = new Date(`2000 ${person.dob}`);

    // // Get the current date as a Date object
    // const currentDate = new Date();

    // // Check if the birth date has already passed this year
    // birthDate.setFullYear(currentDate.getFullYear());

    // if (birthDate < currentDate) {
    //   console.log(`${person.name}'s birthday has already passed this year.`);
    //   return false;
    // }

    // // Check if the birth date is today
    // if (birthDate.getMonth() === currentDate.getMonth() && birthDate.getDate() === currentDate.getDate()) {
    //   console.log(`Happy birthday ${person.name}!`);
    //   return true;
    // }
  }

  const handleEdit = () => {
    console.log('edit')
  }

  // popup card--------------------------------
  function PopupCard({ id, index, name, picUrl, dob,bday, bio, closePopup, min, sec }) {
    const [daysLeft, setDaysLeft] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false)

    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
      id: id,
      name: name,
      bday: bday,
      image: "",
      bio: ""
    });

    const handleSubmit = async (event) => {
      event.preventDefault();

      // create a new form data object
      const data = new FormData();
      // append the form data to the object
      data.append('id', formData.id);
      data.append('name', formData.name);
      data.append('bday', formData.bday);
      data.append('bio', formData.bio);

      // append the image to the object
      if (image !== null) {
        data.append('pic', image);
      }

      console.log('bio', formData)

      // send the post request to the server
      const response = await fetch('/updateperson', {
        method: 'POST',
        body: data
      });

      // parse the response as JSON
      const result = await response.json();
      console.log(result)

      // // return the result
      // return result;
    };




    useEffect(() => {
      setShowPopup(true);
    }, []);

    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

    return (
      <>
        <div className={`overlay ${showPopup ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={closePopup}></div>
        <div className={`fixed z-10 top-3 sm:top-10 left-0 h-screen w-screen flex items-center justify-center ${showPopup ? 'visible' : 'invisible'}`}>
          <div className={`shadow-lg rounded-md p-2 sm:p-4 w-[70%] sm:w-96 transition duration-600 transform ${showPopup ? 'scale-100' : 'scale-0'} ${cardBg}`}>
            <div className="px-3 sm:px-0 flex justify-between items-center">
              <button className={`h-10 w-10 text-2xl rounded-full p-2 ${cardBg}`} onClick={() => { editMode ? setEditMode(false) : setEditMode(true); }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={closePopup} className={`h-10 w-10 text-2xl rounded-full p-2 ${cardBg}`}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {editMode ? (
              // FORM--------------------------------------
              <form className={`${cardBg} p-4 rounded-md shadow-md`} onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className={`${textColor} block mb-2`} htmlFor="name">
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className={`${textColor} block mb-2`} htmlFor="bday">
                    Birthday
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="bday"
                    type="text"
                    placeholder="eg. dec 25"
                    value={formData.bday}
                    onChange={(e) => setFormData({ ...formData, bday: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className={`${textColor} block mb-2`} htmlFor="image">
                    Image
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="image"
                    type="file"
                    onChange={(event) => setImage(event.target.files[0])}
                  />
                </div>
                <div className="mb-4">
                  <label className={`${textColor} block mb-2`} htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="bio"
                    placeholder="Bio - less than 10 words"
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className={`bg-green-500 text-white px-4 py-2 mr-2 rounded-md ${textColor}`}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className={`bg-red-500 text-white px-4 py-2 rounded-md ${textColor}`}
                    onClick={() => {
                      editMode ? setEditMode(false) : setEditMode(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </form>


              // FORM-------------------------------------------------
            ) : (
              <div className={editMode ? 'hidden' : 'block'}>
                <div className="mt-5">
                  <img src={picUrl ? picUrl : `https://source.unsplash.com/random/200x200?sig=${index}`} alt={`${name}'s picture`} className="h-[40%] sm:h-auto sm:w-full mx-auto object-cover rounded-t-md" />
                </div>
                <div className="p-4">
                  <div className={`flex items-center justify-between text-lg font-medium ${textColor}`}>
                    <span>{name}</span>
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{bday}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-2">{bio ? bio : `'This is a dummy bio'`}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xl mt-3 "><Timer expiryTimestamp={dob} onExpire={onExpire} min={min} sec={sec} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );



  }



  function BirthdayCard({ index, cat, id, name, picUrl, dob,bday, bio, min, sec }) {
    const [popupOpen, setPopupOpen] = useState(false);

    // console.log('key',id)

    const openPopup = () => {
      document.body.classList.add("no-scroll");
      setPopupOpen(true);
    };

    const closePopup = () => {
      document.body.classList.remove("no-scroll");
      setPopupOpen(false);
    };


    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';




    return (
      <>
        <div onClick={openPopup} className={`${cardBg} shadow-md rounded-md p-2 sm:p-4 m-0 w-[10rem] md:w-72 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}>
          <img src={picUrl ? picUrl : `https://source.unsplash.com/random/200x200?sig=${index}`} alt={`${name}'s picture`} className="w-full object-cover rounded-t-md" />
          <div className="p-2 sm:p-4 text-center sm:text-left">
            <div className={`flex flex-col sm:flex-row items-center justify-between text-md font-medium ${textColor}`}>
              <span>{name}</span>
              <span>{cat}</span>
              <span className="text-gray-600 dark:text-gray-400 capitalize">{bday}</span>
            </div>
            <Timer expiryTimestamp={dob} onExpire={() => onExpire(id)} min={min} sec={sec} />
          </div>
        </div>
        {popupOpen && <PopupCard id={id} index={index} name={name} picUrl={picUrl} dob={dob} bday={bday} bio={bio} closePopup={closePopup} min={min} sec={sec} />}
      </>
    );


  }



  // birthday card calling data--------------------------
  function BirthdayCards() {
    console.log('people in card',people)

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0 sm:p-4">
        {people.map((person, index) => (
          <BirthdayCard index={index} cat={person.category} id={person._id} name={person.name} picUrl={person.pic} dob={person.dob} bday={person.bday} bio={person.bio} min={person.min} sec={person.sec} />
        ))}
      </div>
    );
  }

  // BIRTHDAT CARD ENDS-----------------------------------

  // BIRTHDAY SEARCH ALGORITHM..........................
  const searchBdays = (e) => {
    const searchValue = e.currentTarget.value.toLowerCase();
    console.log(searchValue)

    if (searchValue === '') {
      return setPeople(initialPeople)
    } else {

      // Filter the people array based on the search value
      const filteredPeople = initialPeople.filter((person) =>
        person.name.toLowerCase().startsWith(searchValue)
      );

      // Update the people state with the filtered array
      setPeople(filteredPeople);
    }

  };



  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  // Define the class names for dark and light mode
  const appBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
  const appTextClass = isDarkMode ? 'text-white' : 'text-black';

  const checkCat = (data) => {

    const monthMap = {
      'jan': 0,
      'feb': 1,
      'mar': 2,
      'apr': 3,
      'may': 4,
      'jun': 5,
      'jul': 6,
      'aug': 7,
      'sep': 8,
      'oct': 9,
      'nov': 10,
      'dec': 11,
    };

    const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

data.forEach((person) => {
  const [monthStr, dayStr] = person.bday.split(' ');
  const month = monthMap[monthStr.toLowerCase()]+1;
  const day = parseInt(dayStr);

  let birthYear = todayYear;

  if (month < todayMonth || (month === todayMonth && day < todayDate)) {
    birthYear++;
  }else if (month === todayMonth && day === todayDate) {
    person.year = 'Happy Birthday';
    console.log('y',person.year)
  } else {
    person.year = '';
  }

  person.dob = `${birthYear} ${monthStr} ${dayStr}`;

});


    // Sort the data array by dob in ascending order
    data.sort((a, b) => {
      const dateA = new Date(`${a.dob}`).getTime();
      const dateB = new Date(`${b.dob}`).getTime();
      return dateA - dateB;
    });

    return data;
  };





  const fetchData = async () => {
    try {
      const response = await fetch('/getallperson');
      const result = await response.json();

      const res = await checkCat(result.data)

      setPeople(res);
      setinitialPeople(res);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData()
    // filterBdays()
  }, [])

  // useEffect(() => {
  //   people.sort((a, b) => {
  //     const dateA = new Date(`2000 ${a.dob}`).getTime();
  //     const dateB = new Date(`2000 ${b.dob}`).getTime();
  //     return dateA - dateB;
  //   });
  // }, [people]);


  return (
    <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className={`flex items-center justify-center w-1/2 mx-auto pt-20 ${appBgClass}`}>
        <input
          className={`bg-gray-200 focus:bg-white border-transparent focus:border-gray-300 w-full rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none ${appTextClass}`}
          type="text"
          placeholder="Search birthdays..."
          onChange={searchBdays}
        />
      </div>
      <div className='flex items-center justify-center pt-4'>
        {people && <BirthdayCards />}
      </div>
    </div>
  );

}
