import React, { useState, useEffect } from 'react';


import Header from '@/components/Header';

import Cookies from 'js-cookie';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';

function Review() {
    const [reviewpersons, setReviewPersons] = useState([]);
    const [newpersons, setnewPersons] = useState([])
    const [deletepersons, setdeletePersons] = useState([])
    const [show, setShow] = useState('review'); // default to showing reviewpersons

    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(false); // State for tracking dark mode


    const [password, setPassword] = useState('sajidispassword');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputPassword, setInputPassword] = useState('');

    const [showprogress, setshowProgress] = useState(true)

    // store suggestions
    const [suggestions, setSuggestions] = useState([])

    function handleInputChange(event) {
        setInputPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (inputPassword === password) {
            Cookies.set('authenticated', 'true', { expires: 7 })
            setIsAuthenticated(true);
        } else {
            setInputPassword('');
        }
    }


    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    }

    // Define the class names for dark and light mode
    const appBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
    const appTextClass = isDarkMode ? 'text-white' : 'text-black';

    // for cards
    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';


    const handleApprove = async (person, type) => {

        if (type === 'publish') {
            person.published = true;
            person.review = false;
            person.id = person._id
        } else if (type === 'delete') {
            person.todelete = true;
        } else if (type === 'approve') {
            person.review = false;
        } else if (type === 'reject') {
            person.reject = true;
        }

        try {
            // Send a POST request to the backend API
            const response = await fetch('/updateperson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ person: person })
            });

            // parse the response as JSON
            const resp = await response.json();
            setAlertMessage(resp.message)
            console.log(resp)

            if (resp.status === 201 || resp.status === 200) {
                console.log('201')
                setAlertSeverity('success')
            } else {
                setAlertSeverity('warning')
            }

            setIsAlertOpen(true)

            setTimeout(() => {
                setIsAlertOpen(false)
                // setalertText('')
            }, 2000);


        } catch (error) {
            console.log(error.message)
        }

    }

    function card(person, index) {
        return (<>
            <div key={person._id} className={`${cardBg} shadow-md rounded-md p-2 sm:p-4 m-1 w-[13.5rem] md:w-72 transition duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}>
                <img src={person.pic ? person.pic : `https://source.unsplash.com/random/200x200?sig=${index}`} alt={`${person.name}'s picture`} className="w-full object-cover rounded-t-md" />
                <div className="p-2 sm:p-4 text-center sm:text-left">
                    <div className={`flex flex-col items-center justify-between text-md font-medium ${appTextClass}`}>
                        <span>{person.name}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm capitalize">{person.bday}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm capitalize">{person.bio}</span>
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                        {(person.published === false) && (
                            <>
                                <button onClick={() => handleApprove(person, 'publish')} className="p-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-300">Publish</button>
                                {/* <button onClick={() => handleApprove(person, 'reject')} className="p-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-300">Reject</button> */}
                            </>
                        )}
                        {(person.review === true && person.todelete === true) && (
                            <>
                                <button onClick={() => handleApprove(person, 'delete')} className="p-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-300">Delete</button>
                                {/* <button onClick={() => handleApprove(person, 'reject')} className="p-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-300">Reject</button> */}
                            </>
                        )}
                        {(person.review === true && person.todelete === false && person.published === true) && (
                            <>
                                <button onClick={() => handleApprove(person, 'approve')} className="p-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-300">Approve</button>
                            </>
                        )}
                        <button onClick={() => handleApprove(person, 'reject')} className="p-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition duration-300">Reject</button>
                    </div>

                </div>
            </div>
        </>)

    }

    useEffect(() => {
        const fetchReviewPersons = async () => {
            try {
                const response = await fetch('/getreviewperson');
                const data = await response.json();

                const persons = data.data;
                const reviewPersons = persons.filter(person => person.review === true && person.todelete === false && person.published === true);
                const newPersons = persons.filter(person => person.published === false && person.review === true);
                const deletePersons = persons.filter(person => person.review === true && person.todelete === true);

                setReviewPersons(reviewPersons);
                setnewPersons(newPersons);
                setdeletePersons(deletePersons);

                console.log(reviewPersons)

                setshowProgress(false)

            } catch (error) {
                console.error(error);
            }
        };

        fetchReviewPersons();
    }, []);

    useEffect(() => {
        async function getSuggestions() {
            try {
                const response = await fetch('/getsuggestions');
                const data = await response.json();
                setSuggestions(data.data)
            } catch (error) {
                console.log(error.message);
            }
        }
        getSuggestions()
    }, [])

    useEffect(() => {
        const authenticated = Cookies.get('authenticated');
        if (authenticated === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // dark and light mode
    useEffect(() => {
        const savedIsDarkMode = Cookies.get('isDarkMode');
        setIsDarkMode(savedIsDarkMode === 'true');
    }, []);

    const handleShowReview = () => setShow('review');
    const handleShowNew = () => setShow('new');
    const handleShowDelete = () => setShow('delete');
    const handleShowSuggestions = () => setShow('suggestions');

    if (!isAuthenticated) {
        return (
            <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
                <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                <div className={`flex justify-center items-center h-screen `}>
                    <form className={`w-2/3 sm:w-1/2 max-w-md p-4 rounded-lg shadow-lg ${cardBg}`} onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-bold mb-2" htmlFor="password">
                                Enter Admin Password:
                            </label>
                            <input
                                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                value={inputPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );

    }

    return (
        <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

            {showprogress ? (
                <div className='w-full min-h-screen pt-[5rem] px-4'>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                </div>
            ) : (<div className='w-full min-h-screen pt-[5rem] px-4'>
                {/* BUTTONS ---------------------------------- */}
                <div className="flex justify-center flex-wrap space-x-4 space-y-2 mt-4">
                    <button
                        className={`py-2 px-4 rounded-md shadow hover:bg-green-600 transition duration-300 ${show === 'review' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600'
                            }`}
                        onClick={handleShowReview}
                    >
                        Review
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md shadow hover:bg-green-600 transition duration-300 ${show === 'new' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600'
                            }`}
                        onClick={handleShowNew}
                    >
                        Newly Added
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md shadow hover:bg-green-600 transition duration-300 ${show === 'delete' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600'
                            }`}
                        onClick={handleShowDelete}
                    >
                        Delete Requests
                    </button>
                    <button
                        className={`py-2 px-4 rounded-md shadow hover:bg-green-600 transition duration-300 ${show === 'suggestions' ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600'
                            }`}
                        onClick={handleShowSuggestions}
                    >
                        Suggestions
                    </button>
                </div>
                {/* ALERT ------------------------------- */}
                <>{isAlertOpen && <Alert severity={alertSeverity}>{alertMessage}</Alert>}</>

                {/* CARDS--------------------------------------------------- */}
                <div className="flex w-full sm:flex-row flex-wrap items-start justify-center space-x-2 py-3">
                    {show === 'review' &&
                        reviewpersons.map((person, index) => (
                            card(person, index)
                        ))}
                    {show === 'new' &&
                        newpersons.map((person, index) => (
                            card(person, index)
                        ))}
                    {show === 'delete' &&
                        deletepersons.map((person, index) => (
                            card(person, index)
                        ))}
                    {show === 'suggestions' &&
                        <div className="container mx-auto my-10">
                            {/* <h2 className="text-3xl font-bold mb-6 text-center">Suggestions</h2> */}
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion._id}
                                        className={` ${cardBg} ${appTextClass} rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300`}
                                    >
                                        <h3 className={`text-xl font-bold mb-4 `}>{suggestion.name}</h3>
                                        <p className=" mb-2">
                                            <span className="font-bold">Email:</span> {suggestion.email}
                                        </p>
                                        <p className=" mb-2">
                                            <span className="font-bold">Suggestion:</span> {suggestion.suggestion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    }
                </div>
            </div>)}

        </div>
    );
}


/* 


                

*/


export default Review;
