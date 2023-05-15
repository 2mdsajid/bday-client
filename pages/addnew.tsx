import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Alert, AlertColor } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// import { AlertColor } from '@material-ui/core';

import { ChangeEvent, FormEvent } from "react";

import Cookies from 'js-cookie';

import Box from '@mui/material/Box'
import { BACKEND } from '@/components/functions';

// define a list of valid alert severities
const validAlertSeverities: AlertColor[] = ['error', 'warning', 'info', 'success'];



interface FormData {
    name: string;
    bday: string;
    bio: string;
    pic: File | null;
}


function AddNew() {

    const [isDarkMode, setIsDarkMode] = useState(false); // State for tracking dark mode

    const [showprogress, setshowProgress] = useState(false)

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    }

    // Define the class names for dark and light mode
    const appBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
    const appTextClass = isDarkMode ? 'text-white' : 'text-black';

    const [formData, setFormData] = useState<FormData>({
        name: '',
        bday: '',
        bio: '',
        pic: null
    });

    // dialogue box for messages
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>();
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            setFormData({
                ...formData,
                [name]: files?.[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setshowProgress(true)
        setIsAlertOpen(false);
        
        // check bday format
        const birthdayRegex = /^[A-Za-z]{3} \d{1,2}$/; // regex to match 'mon day' format
        if (!birthdayRegex.test(formData.bday.trim())) {
            setAlertSeverity('error');
            setAlertMessage('Format birthday correctly : Not like "December 25" but "Dec 25"');
            
            
            setIsAlertOpen(true);
            setshowProgress(false)
            return;
        }


        // Check if name and bday fields are empty
        if (formData.name.trim() === '' || formData.bday.trim() === '') {
            setAlertSeverity('error');
            setAlertMessage('Name and birthday are required');
            setIsAlertOpen(true);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('bday', formData.bday);
        data.append('bio', formData.bio);

        if (formData.pic) {
            data.append('pic', formData.pic);
        }

        try {
            const response = await fetch(BACKEND+'/addperson', {
                method: 'POST',
                body: data
            });

            const res = await response.json()
            console.log(res)
            setAlertMessage(res.message);


            // Submit form data
            if (res.status === 201) {
                setAlertSeverity('success');

                setFormData({
                    name: '',
                    bday: '',
                    bio: '',
                    pic: null
                });

            } else {

                setAlertSeverity('warning');
            }

        } catch (error) {
            if (error instanceof Error) {
                setAlertSeverity('warning');
                setAlertMessage(error.message);
            }
        }
        setIsAlertOpen(true);
        setshowProgress(false)

        setTimeout(() => {
            setIsAlertOpen(false);

        }, 1000);

    };

    // to store the dark-light mode in cookies
    useEffect(() => {
        const savedIsDarkMode = Cookies.get('isDarkMode');
        setIsDarkMode(savedIsDarkMode === 'true');
    }, []);


    return (
        <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <div className={`flex flex-col items-center justify-center w-4/5 sm:w-1/2 mx-auto pt-20 ${appBgClass}`}>
                <h1 className={`mt-6 mb-3 block text-xl font-bold ${appTextClass}`}>Add New Birthday</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <>{showprogress && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color="success" />
                    </Box>}
                    </>
                    <>{isAlertOpen && <Alert severity={alertSeverity}>{alertMessage}</Alert>}</>
                    <div className="mt-6">
                        <label htmlFor="name" className={`block text-lg font-medium ${appTextClass}`}>
                            Name
                        </label>
                        <div className="mt-2">
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="block w-full py-2 px-3 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="bday" className={`block text-lg font-medium ${appTextClass}`}>
                            Birthday
                        </label>
                        <div className="mt-2">
                            <input type="text" id="bday" name="bday" value={formData.bday} onChange={handleChange} required placeholder="*format like this : Dec 25" className="block w-full py-2 px-3 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="bio" className={`lock text-lg font-medium t${appTextClass}`}>
                            Bio
                        </label>
                        <div className="mt-2">
                            <textarea id="bio" name="bio" placeholder='Bio - less than 10 words' value={formData.bio} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e)} className="block w-full py-2 px-3 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea></div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="pic" className={`lock text-lg font-medium t${appTextClass}`}>
                            Picture
                        </label>
                        <div className="mt-2">
                            <input type="file" id="pic" name="pic" onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AddNew;
