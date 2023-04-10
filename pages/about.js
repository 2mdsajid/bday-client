import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

import Cookies from 'js-cookie'

// material ui accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// MATERIAL UI ALERTS
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';

const About = () => {

    const [isDarkMode, setIsDarkMode] = useState(true); // State for tracking dark mode


    // TOSTORE THE SUGGESTION
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [suggestion, setSuggestion] = useState('');

    // material ui alert status
    const [alertSeverity, setAlertSeverity] = useState();
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [showprogress, setshowProgress] = useState(false)

    // TO STORE THE SUGGESTION INPUT
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSuggestionChange = (e) => {
        setSuggestion(e.target.value);
    };

    // TO SEND THE INPUT TO DATABASE
    const handleSubmit = async (e) => {
        setshowProgress(true)
        e.preventDefault();
        try {
            const response = await fetch('/addsuggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    suggestion
                })
            });

            const resp = await response.json();
            setAlertMessage(resp.message)
            console.log(resp)

            if (resp.status === 201) {
                setName('');
                setEmail('');
                setSuggestion('');
                setAlertSeverity('success')
            } else {
                setAlertSeverity('warning')
            }

            setIsAlertOpen(true)
            setshowProgress(false)

            setTimeout(() => {
                setIsAlertOpen(false)
            }, 2000);

        } catch (error) {
            console.error(error);
            alert('Failed to submit suggestion. Please try again later.');
        }
    };

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        Cookies.set('isDarkMode', !isDarkMode);
    }

    // to store the dark-light mode in cookies
    useEffect(() => {
        const savedIsDarkMode = Cookies.get('isDarkMode');
        setIsDarkMode(savedIsDarkMode === 'true');
    }, []);

    // Define the class names for dark and light mode
    const appBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
    const appTextClass = isDarkMode ? 'text-white' : 'text-black';

    // for cards
    const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-800';


    return (
        <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <div className="p-4 pt-20 w-full sm:w-[70%] md:w-[55%] lg:w-1/3 mx-auto">
                <p className="text-lg mb-4">
                    This page is all about our application and its purpose.
                </p>

                <div className='mb-10'>
                    <h2 className="text-2xl font-bold mb-2">What to Do</h2>
                    <p className="text-lg mb-4">
                        Our application allows you to add your friend&rsquo;s birthdays and get a
                        countdown until their special day. You can also search for your
                        friends and see their upcoming birthdays.
                    </p>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="h5" className="text-xl font-bold">
                                Instructions
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul className="list-disc ml-4">
                                <li className='font-medium text-xl mt-2'>How to change photo ?</li>
                                <ol className="list-decimal ml-4">
                                    <li>Click your profile card</li>
                                    <li>Click the edit icon</li>
                                    <li>Choose your image. Choose a 1:1 image as far as possible</li>
                                </ol>
                                <li className='font-medium text-xl mt-2'>How to delete your profile card ?</li>
                                <ol className="list-decimal ml-4">
                                    <li>Click your profile card</li>
                                    <li>Click the edit icon</li>
                                    <li>Double-click &rdquo;Delete my profile&rdquo;</li>
                                </ol>
                                <li className='font-medium text-xl mt-2'>How to update bio ?</li>
                                <ol className="list-decimal ml-4">
                                    <li>Click your profile card</li>
                                    <li>Click the edit icon</li>
                                    <li>Update your bio</li>
                                </ol>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </div>

                {/* DATA SOURCE */}
                <h2 className="text-2xl font-bold mb-2">Data Source</h2>
                <p className="text-lg italic mt-3 mb-10">
                    All birthday data is collected from public profiles such as Facebook and Instagram. No privacy was harmed during the data collection. However, please note that the dates may be wrong. If you want to opt-out of our service, please contact us or respond through the site by clicking &rdquo;Delete My Profile&rdquo;.
                </p>


                <h2 className="text-2xl font-bold mb-2 mt-5">Future Updates</h2>
                <p className="text-lg mb-4">
                    We are constantly working on improving our application and adding new
                    features. Some of the upcoming updates include:
                </p>
                <ul className="list-disc list-inside mb-10">
                    <li>Ability to set reminders for upcoming birthdays</li>
                    <li>Option to import birthdays from your contacts</li>
                    <li>Integration with social media to send birthday wishes</li>
                </ul>

                <h2 className="text-2xl font-bold mb-2">Suggestions and Feedbacks</h2>
                <p className="text-lg mb-4">
                    We value your input and would love to hear your suggestions and
                    feedback on how we can improve our application.
                </p>

                {/* suggestion form */}
                {/* <h2 className="text-2xl font-bold mb-2">Suggestions and Feedback</h2> */}
                <form onSubmit={handleSubmit}>
                    {/* to show the progress bar before the response*/}
                    <>{showprogress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color="success" />
                    </Box>}
                    </>

                    {/* to show the alert after getting the response */}
                    <>{isAlertOpen && <Alert severity={alertSeverity}>{alertMessage}</Alert>}</>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="suggestion">
                            Suggestion
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="suggestion"
                            placeholder="Your suggestion"
                            rows={4}
                            value={suggestion}
                            onChange={handleSuggestionChange}
                            required
                        />
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>


                {/* CREATORS SECTION */}
                <section class="py-12 {{appBgClass}} {{appTextClass}}">
                    <div class="   ">
                        <div class="lg:text-center">
                            <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Creators</h2>
                            <h2 className="text-2xl font-bold mb-2 mt-5">People Behind The Scene</h2>
                        </div>

                        <div className={`${cardBg} mt-5 rounded-lg shadow-lg p-6 md:p-8`}>
                            <h3 className={`text-lg font-medium ${textColor}`}>Raj Basel</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Domain Provider</p>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">"Your domain donation can create an online world of possibilities."</p>
                        </div>
                        <div className={`${cardBg} mt-5 rounded-lg shadow-lg p-6 md:p-8`}>
                            <h3 className={`text-lg font-medium ${textColor}`}>Nishant Pandey</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">UX/UI Designer</p>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">"Design is not just what it looks like and feels like. Design is how it works."</p>
                        </div>
                        <div className={`${cardBg} mt-5 rounded-lg shadow-lg p-6 md:p-8`}>
                            <h3 className={`text-lg font-medium ${textColor}`}>Mr. C</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Hardcore Coder</p>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">"Coding is five sleepless nights and you get this site"</p>
                        </div>

                    </div>
                </section>
                {/* creators */}
            </div>
        </div>
    );
};

export default About;
