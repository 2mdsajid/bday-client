import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import Link from 'next/link'

import { FormEventHandler } from 'react';

// import ThemeProvider from '../components/themeprovider'

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

import { Alert, AlertColor } from '@mui/material';

import Timer from '@/components/Timer'

// clear the input field
import { XIcon } from '@heroicons/react/outline';

// LOCAL STORAGE FOR UNIQUE USER ID
import { storelocalStorage, loadlocalStorage } from '../components/functions'

// COOKIES TO STORE THE THEME MODE
import Cookies from 'js-cookie';

const inter = Inter({ subsets: ['latin'] })
import { useState, useEffect, useContext, useRef } from 'react';

// SCROLL REVEAL IMPORT
// import ScrollReveal from 'react-scroll-reveal';
// import ScrollReveal from 'scrollreveal'
// import "animate.css/animate.min.css";
// import { AnimationOnScroll } from 'react-animation-on-scroll';

// SCROLL REVEAL
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function Home() {



  const [isDarkMode, setIsDarkMode] = useState(true); // State for tracking dark mode

  // defining the array of bdays
  const [people, setPeople] = useState([]);
  const [initialPeople, setinitialPeople] = useState([])

  const [todaybirthdays, settodayBirthdays] = useState([])


  const [search, setSearch] = useState('')

  // to show a dialogue at the beginning
  const [showDialog, setShowDialog] = useState(false);
  const [dialogcount, setdialogCount] = useState(0)

  // ANIMATION TYPE
  const [animationtype, setanimationType] = useState('')

  // prevent useeffect running twice




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
    const [originalPic, setOriginalPic] = useState(picUrl);



    const [formData, setFormData] = useState({
      id: id,
      name: name,
      bday: bday,
      pic: picUrl,
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
      data.append('pic', pic !== null ? pic : formData.pic);


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
                  <CircularProgress color="success" />
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

                {/* update image uploading */}

                <div className="mb-4">
                  <label className={`${textColor} block mb-2`} htmlFor="image">
                    Image
                  </label>
                  <div className="flex items-center">
                    <div className="w-full">
                      <label className="flex flex-col items-center p-2 bg-white rounded-md shadow-md tracking-wide uppercase border border-black cursor-pointer hover:bg-blue hover:text-black text-black ease-linear transition-all duration-150">
                        {/* <svg
                          className="w-8 h-8 text-blue-400"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-9a1 1 0 00-1 1v1.586a1 1 0 11-2 0V2a3 3 0 116 0v1.586a1 1 0 11-2 0V2a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg> */}
                        <span className=" text-base leading-normal">{originalPic.name ? originalPic.name : `select an image`}</span>
                        <input
                          className="hidden"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            if (event.target.files !== null) {
                              setPic(event.target.files[0]);
                              setOriginalPic(event.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {originalPic.name && (
                      <div className="ml-4">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setOriginalPic(formData.pic);
                            setPic(null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>



                {/* updatesd image uploader */}
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
    // 
    return (
      <>
        {/* <AnimationOnScroll animateIn="animate__bounceIn" offset={150} initiallyVisible={true}  animatePreScroll={false}> */}
        <div data-aos={animationtype} key={id} onClick={openPopup} className={`bdaycards ${cardBg} shadow-md rounded-md p-2 sm:p-4 m-0 w-[10rem] sm:w-[15rem] md:w-72 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}>
          <img src={picUrl ? picUrl : `https://randomuser.me/api/portraits/men/${index}.jpg`} alt={`${name}'s picture`} className="w-full object-cover rounded-t-md" />
          <div className="p-2 sm:p-4 text-center sm:text-left">
            <div className={`flex flex-col sm:flex-row items-center justify-between text-lg font-medium ${textColor}`}>
              <span>{name}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xl capitalize">{bday}</span>
            </div>
            <Timer expiryTimestamp={dob} min={min} sec={sec} />
          </div>
        </div>
        {popupOpen && <PopupCard id={id} index={index} name={name} picUrl={picUrl} dob={dob} bday={bday} bio={bio} popupOpen={popupOpen} openPopup={openPopup} closePopup={closePopup} min={min} sec={sec} />}
        {/* </AnimationOnScroll> */}
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
    // console.log('key')
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
    setanimationType('slide-up')

    if (searchValue === '') {
      setanimationType('slide-up')
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
      } else {
        person.isbirthday = false;
      }

      const dob = new Date(`${birthYear}-${monthStr}-${dayStr}`).toISOString();
      person.dob = dob;
    });

    // Sort the data array by dob in ascending order
    data.sort((a, b) => {
      return a.dob.localeCompare(b.dob);
    });

    // data.map((dta) => {
    //   console.log(dta.dob)
    // })

    return data;
  };


  // random image api
  async function fetchRandomUser() {
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      const imageUrl = data.results[0].picture.large;
      console.log(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  const [runuse, setrunUse] = useState(true)

  // first use effect and fetch data
  // useEffect(() => {
  //   console.log('render useeffect')
  //   let isMounted = true;
  //   const fetchData = async () => {
  //     setrunUse(false)

  //     try {
  //       console.log('fetching..................')
  //       const response = await fetch('/getallperson');
  //       const result = await response.json();
  //       const res = await checkCat(result.data)
  //       const newpeople = await filterBdays(res)
  //       console.log('getting response')

  //       if (isMounted) {
  //         console.log(isMounted)
  //         setPeople(newpeople);
  //         setinitialPeople(newpeople);
  //       }

  //     } catch (error) {
  //       console.error('Error fetching data:', error.message);
  //     }
  //   }
  //     fetchData();


  //   return () => {
  //     isMounted = false;
  //   };

  // }, []);




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
    console.log('render useeffect')
    fetchData()
  }, [])


  // to store the dark-light mode in cookies
  useEffect(() => {
    const savedIsDarkMode = Cookies.get('isDarkMode');
    setIsDarkMode(savedIsDarkMode === 'true');
  }, []);

  // first dialoge appear
  useEffect(() => {
    const hasShownDialog = localStorage.getItem('hasShownDialog');
    if (!hasShownDialog) {
      // If the dialog hasn't been shown before, show it and set the hasShownDialog flag
      localStorage.setItem('hasShownDialog', true);
      setShowDialog(true)
    }

    // Add or remove the modal-open class on the body element depending on whether the dialog is open
    if (showDialog) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }


  }, [showDialog]);


  // ANIMATE USEEFFECT usnig AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
      once: false
    });

    setanimationType('zoom-in')

  }, []);


  return (
    <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      {/* dialogue box */}
      {showDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75">
          <div className="relative p-8 mx-auto mt-20 bg-white rounded-md shadow-lg w-1/2">
            <button className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800" onClick={() => setShowDialog(false)}>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="text-gray-800">
              Please visit the{' '}
              <Link href="/about" className="underline cursor-pointer">about
              </Link>{' '}
              page.
            </p></div>
        </div>
      )}
      {/* dialogue ends here */}
      <div className={`flex items-center justify-center w-1/2 mx-auto pt-24 ${appBgClass}`}>
        <div className="relative w-full">
          <input
            className={`bg-gray-200 focus:bg-white border-transparent focus:border-gray-300 w-full rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none text-black`}
            type="text"
            placeholder="Search Your Name..."
            onChange={searchBdays}
            value={search}
          />
          {search && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 hover:text-gray-900"
              onClick={() => {
                setSearch('')
                setPeople(initialPeople)
              }}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="heroicon-ui"
                  d="M9.29289,12 L4.64645,7.35355 C4.45118,7.15829 4.45118,6.84171 4.64645,6.64645 C4.84171,6.45118 5.15829,6.45118 5.35355,6.64645 L10,11.29289 L14.64645,6.64645 C14.84171,6.45118 15.15829,6.45118 15.35355,6.64645 C15.5488,6.84171 15.5488,7.15829 15.35355,7.35355 L10.70711,12 L15.35355,16.64645 C15.5488,16.8417 15.5488,17.1583 15.35355,17.3536 C15.15829,17.5488 14.84171,17.5488 14.64645,17.3536 L10,12.70711 L5.35355,17.3536 C5.15829,17.5488 4.84171,17.5488 4.64645,17.3536 C4.45118,17.1583 4.45118,16.8417 4.64645,16.64645 L9.29289,12 Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div>
        {people.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (<><div className='flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center space-x-2 py-5'>
          {(todaybirthdays && search.length === 0) &&
            <>
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
