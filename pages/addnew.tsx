import React, { useState } from 'react';
import Header from '../components/Header';
import Alert from '@mui/material/Alert';

function AddNew() {

    const [isDarkMode, setIsDarkMode] = useState(false); // State for tracking dark mode


    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    }

    // Define the class names for dark and light mode
    const appBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
    const appTextClass = isDarkMode ? 'text-white' : 'text-black';

    const [formData, setFormData] = useState({
        name: '',
        bday: '',
        bio: '',
        pic: null
    });

    // dialogue box for messages
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };


    const handleChange = async (event) => {
        const { name, value, type, files } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            const response = await fetch('/addperson', {
                method: 'POST',
                body: data
            });

            const res = await response.json()
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

            } else{

                setAlertSeverity('warning');
            }

        } catch (error) {
            setAlertSeverity('warning');
            setAlertMessage(error.message);
        }
        setIsAlertOpen(true);
        
        setTimeout(() => {
            setIsAlertOpen(false);
            
        }, 1000);

    };

    return (
        <div className={`w-screen min-h-screen ${appBgClass} ${appTextClass}`}>
            <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <div className={`flex items-center justify-center w-4/5 sm:w-1/2 mx-auto pt-20 ${appBgClass}`}>
                <form onSubmit={handleSubmit} class="max-w-md mx-auto">
                    <>{isAlertOpen && <Alert severity={alertSeverity}>{alertMessage}</Alert>}</>
                    <div className="mt-6">
                        <label for="name" className={`block text-lg font-medium ${appTextClass}`}>
                            Name
                        </label>
                        <div className="mt-2">
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label for="bday" className={`block text-lg font-medium ${appTextClass}`}>
                            Birthday
                        </label>
                        <div className="mt-2">
                            <input type="text" id="bday" name="bday" value={formData.bday} onChange={handleChange} required placeholder="e.g. Dec 25" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label for="bio" className={`lock text-lg font-medium t${appTextClass}`}>
                            Bio
                        </label>
                        <div className="mt-2">
                            <textarea id="bio" name="bio" placeholder='Bio - less than 10 words' value={formData.bio} onChange={handleChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label for="pic" className={`lock text-lg font-medium t${appTextClass}`}>
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
