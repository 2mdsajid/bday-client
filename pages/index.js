import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'

import { FormEventHandler } from 'react';

// import ThemeProvider from '../components/themeprovider'

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

import { Alert, AlertColor } from '@mui/material';

import Timer from '@/components/Timer'

// LOCAL STORAGE FOR UNIQUE USER ID
import {storelocalStorage,loadlocalStorage} from '../components/functions'

// COOKIES TO STORE THE THEME MODE
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] })
import { useState, useEffect, useContext } from 'react';

export default function Home() {

  const [isDarkMode, setIsDarkMode] = useState(true); // State for tracking dark mode

  // defining the array of bdays
  const [people, setPeople] = useState([]);
  const [initialPeople, setinitialPeople] = useState([])

  const [todaybirthdays, settodayBirthdays] = useState([])


  const [search,setSearch] = useState('')



  // BIRTHDAY CARD --------------------------------------

  // popup card--------------------------------
  // function PopupCard({ id, index, name, picUrl, dob, bday, bio, popupOpen, openPopup, closePopup, min, sec }: { id: string, index: any, name: string, picUrl: string, dob: string, bday: string, bio: string, popupOpen: boolean, openPopup: any, closePopup: any, min: string, sec: string }) {
  function PopupCard({ id, index, name, picUrl, dob, bday, bio, popupOpen, openPopup, closePopup, min, sec }) {

    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false)

    const [alertSeverity, setAlertSeverity] = useState();
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // const [alerttext,setalertText] = useState('')
    // const [alertcolor,setalertColor] = useState('text-green-900')

    const [hidesubmit, sethideSubmit] = useState(false)
    const [deleteFlag, setDeleteFlag] = useState(false);

    const [showprogress, setshowProgress] = useState(false)

    const [pic, setPic] = useState(null);

  

    const [formData, setFormData] = useState({
      id: id,
      name: name,
      bday: bday,
      pic: "",
      bio: bio
    });

    const handleDelete = () => {
      setDeleteFlag(true);
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, val: string): Promise<void> => {
    const handleSubmit = async (e, val) => {
      e.preventDefault();

      setshowProgress(true)

      // e.preventDefault();
      let todelete = false

      // console.log(event.currentTarget.value)
      if (val === 'delete') {
        todelete = true
      } else {
        todelete = false
      }

      // create a new form data object
      const data = new FormData();
      // append the form data to the object
      data.append('id', formData.id);
      data.append('name', formData.name);
      data.append('bday', formData.bday);
      data.append('bio', formData.bio);
      data.append('del', todelete.toString());

      // append the pic to the object
      if (pic !== null) {
        data.append('pic', pic);
      }

      // console.log('bio', formData)
      try {
        // send the post request to the server
        const response = await fetch('/addreview', {
          method: 'POST',
          body: data
        });

        // parse the response as JSON
        const resp = await response.json();
        setAlertMessage(resp.message)
        console.log(resp)

        if (resp.status === 201) {
          console.log('201')
          setAlertSeverity('success')
        } else {
          setAlertSeverity('warning')
        }

        setIsAlertOpen(true)
        setshowProgress(false)

        setTimeout(() => {
          setIsAlertOpen(false)
          // setalertText('')
        }, 2000);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
      }


      // // return the result
      // return result;
    };




    useEffect(() => {
      openPopup();
    }, [openPopup]);

    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

    return (
      <>
        <div className={`overlay ${popupOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={closePopup}></div>
        <div className={`fixed z-10 top-3 sm:top-10 left-0 h-screen w-screen flex items-center justify-center ${popupOpen ? 'visible' : 'invisible'}`}>
          <div className={`shadow-lg rounded-md p-2 sm:p-4 w-[70%] sm:w-96 transition duration-600 transform ${popupOpen ? 'scale-100' : 'scale-0'} ${cardBg}`}>
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
              <form className={`${cardBg} p-4 rounded-md shadow-md`}>

              {/* to show the progress bar before the response*/}
                <>{showprogress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="success"/>
                </Box>}
                </>

                {/* to show the alert after getting the response */}
                <>{isAlertOpen && <Alert severity={alertSeverity}>{alertMessage}</Alert>}</>
                {/* <p className={`text-center ${alertcolor}`}>{alerttext}</p> */}
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
                    onChange={(event) => {
                      if (event.target.files !== null) {
                        setPic(event.target.files[0]);
                      }
                    }}
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
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  ></textarea>
                </div>
                <div className={`flex ${hidesubmit ? 'justify-center' : 'justify-end'} mt-3 text-sm sm:text-md`}>
                  {!hidesubmit && <button
                    type="submit"
                    value='submit'
                    onClick={(e) => handleSubmit(e, 'submit')}
                    className={`bg-green-500 text-white p-2 mr-2 rounded-md ${textColor}`}
                  >
                    Update
                  </button>}
                  <button
                    type="button"
                    value='delete'
                    className={`bg-red-500 text-white p-2 rounded-md ${textColor}`}
                    onClick={(e) => {
                      { hidesubmit && handleSubmit(e, 'delete') }
                      sethideSubmit(true)
                    }}
                  >
                    {hidesubmit ? 'Confirm Deletion' : 'Delete My Profile'}
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
                  <div className="text-gray-600 text-center dark:text-gray-400 mt-2">{bio ? `'${bio}'` : `'This is a dummy bio'`}</div>
                  <div className={`${textColor} font-medium text-center  text-xl mt-3`}><Timer expiryTimestamp={dob} min={min} sec={sec} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }


  const TodayBirthday = ({ key, person, index }) => {

    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

    // getBirthdayQuote()

    return (
      <div className={`${cardBg} shadow-md rounded-md py-2 my-2 h-full w-[18rem] md:w-96 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}>
        <div className="relative">
          <img src={person.pic ? person.pic : `https://source.unsplash.com/random/200x200?sig=${index}`} alt={`${person.name}'s picture`} className="w-4/5 mx-auto object-cover rounded-md" />
          {/* <div className="absolute inset-0 bg-opacity-70 bg-gray-900 dark:bg-gray-800 rounded-md"></div> */}
        </div>
        <div className="p-2">
          <div className={`flex flex-col sm:flex-row items-center justify-center  sm:space-x-2 text-lg font-medium ${textColor}`}>
            {/* <span>{person.name}</span> */}
            <h3 className={`text-center text-xl font-bold ${textColor} tracking-wide `}>Happy Birthday, {person.name}!</h3>
            {/* <span className="text-gray-600 dark:text-gray-400 capitalize">{person.bday}</span> */}
          </div>

          <div className={`pt-4 ${textColor}`}>
            <h4 className="text-md font-medium pb-2 text-center">{"Another year of beating like a healthy heart - happy birthday!"}</h4>
            {/* <p>{quote}</p> */}
          </div>

        </div>
      </div>
    );
  };

  function BirthdayCard({ index, cat, id, name, picUrl, dob, bday, bio, min, sec }) {
    const [popupOpen, setPopupOpen] = useState(false);

    // console.log('key',id)

    const openPopup = () => {
      document.body.classList.add("no-scroll");
      setPopupOpen(true);
    };

    const closePopup = () => {
      // console.log('closed pipup')
      document.body.classList.remove("no-scroll");
      setPopupOpen(false);
    };


    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

    return (
      <>
        <div key={id} onClick={openPopup} className={`${cardBg} shadow-md rounded-md p-2 sm:p-4 m-0 w-[10rem] md:w-72 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}>
          <img src={picUrl ? picUrl : `https://source.unsplash.com/random/200x200?sig=${index}`} alt={`${name}'s picture`} className="w-full object-cover rounded-t-md" />
          <div className="p-2 sm:p-4 text-center sm:text-left">
            <div className={`flex flex-col sm:flex-row items-center justify-between text-lg font-medium ${textColor}`}>
              <span>{name}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xl capitalize">{bday}</span>
            </div>
            <Timer expiryTimestamp={dob} min={min} sec={sec} />
          </div>
        </div>
        {popupOpen && <PopupCard id={id} index={index} name={name} picUrl={picUrl} dob={dob} bday={bday} bio={bio} popupOpen={popupOpen} openPopup={openPopup} closePopup={closePopup} min={min} sec={sec} />}
      </>
    );
  }

  // FILTER BIRTHDAYS
  const filterBdays = (people) => {

    const filteredPeople = people.filter(person => person.isbirthday === true);
    settodayBirthdays(filteredPeople);

    // console.log('people', filteredPeople)

    // Remove the filtered people from the people array
    const remainingPeople = people.filter(person => person.isbirthday !== true);
    return remainingPeople

  }



  // birthday card calling data--------------------------
  function BirthdayCards() {
    // console.log('people in card', people)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0 sm:p-4">
        {people.map((person, index) => (
          <BirthdayCard index={index} key={index} cat={person.category} id={person._id} name={person.name} picUrl={person.pic} dob={person.dob} bday={person.bday} bio={person.bio} min={person.min} sec={person.sec} />
        ))}

      </div>
    );
  }

  // BIRTHDAT CARD ENDS-----------------------------------

  // BIRTHDAY SEARCH ALGORITHM..........................
  const searchBdays = (e) => {
    const searchValue = e.currentTarget.value.toLowerCase();
    // console.log(searchValue)

    setSearch(searchValue)

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
    Cookies.set('isDarkMode', !isDarkMode);
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
      const month = monthMap[monthStr.toLowerCase()] + 1;
      const day = parseInt(dayStr);

      let birthYear = todayYear;

      if (month < todayMonth || (month === todayMonth && day < todayDate)) {
        birthYear++;
      } else if (month === todayMonth && day === todayDate) {
        person.isbirthday = true;
        // settodaysBirthdays([...todaybirthdays, person])
      } else {
        person.isbirthday = false;
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
      console.log('fetching..................')
      const response = await fetch('/getallperson');
      const result = await response.json();

      const res = await checkCat(result.data)

      const newpeople = await filterBdays(res)

      setPeople(newpeople);
      setinitialPeople(newpeople);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData()
    // filterBdays()
  }, [])

  // to store the dark-light mode in cookies
  useEffect(() => {
    const savedIsDarkMode = Cookies.get('isDarkMode');
    setIsDarkMode(savedIsDarkMode === 'true');
  }, []);
  


  return (
    <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className={`flex items-center justify-center w-1/2 mx-auto pt-20 ${appBgClass}`}>
        <input
          className={`bg-gray-200 focus:bg-white border-transparent focus:border-gray-300 w-full rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none text-black`}
          type="text"
          placeholder="Search Your Name..."
          onChange={searchBdays}
        />
      </div>
      <div>
        {people.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (<><div className='flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center space-x-2 py-5'>
          {(todaybirthdays && search.length === 0) && <>
            {todaybirthdays.map((person, index) => {
              return <TodayBirthday key={index} person={person} index={index} />
            })}
          </>
          }
        </div>
          <div className='flex items-center justify-center pt-4'>
            {people && <BirthdayCards />}
          </div></>)}
      </div>
    </div>
  );

}
