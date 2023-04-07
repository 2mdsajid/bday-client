{/* <svg className="w-8 h-8 mr-2" fill={headIconFill} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,3a1,1,0,0,0,0-2H4A1,1,0,0,0,4,3H5.049c.146,1.836.743,5.75,3.194,8-2.585,2.511-3.111,7.734-3.216,10H4a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2H18.973c-.105-2.264-.631-7.487-3.216-10,2.451-2.252,3.048-6.166,3.194-8Zm-6.42,7.126a1,1,0,0,0,.035,1.767c2.437,1.228,3.2,6.311,3.355,9.107H7.03c.151-2.8.918-7.879,3.355-9.107a1,1,0,0,0,.035-1.767C7.881,8.717,7.227,4.844,7.058,3h9.884C16.773,4.844,16.119,8.717,13.58,10.126ZM12,13s3,2.4,3,3.6V20H9V16.6C9,15.4,12,13,12,13Z" />
</svg> */}

import React, { useState } from 'react';
import Link from 'next/link';

const Header = ({ isDarkMode, toggleDarkMode }) => {
    // const {toggleDarkMode,isDarkMode} = props
    // const [isDarkMode, setIsDarkMode] = useState(false); // State for tracking dark mode
    const [isNavOpen, setIsNavOpen] = useState(false); // State for tracking mobile navigation open/closed

    // Function to toggle dark mode
    // const toggleDarkMode = () => {
    //     setIsDarkMode(!isDarkMode);
    // }

    // Function to toggle mobile navigation
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    // Define the class names for dark and light mode
    const navBgClass = isDarkMode ? 'bg-dark' : 'bg-light';
    const navTextClass = isDarkMode ? 'text-white' : 'text-dark-gray';
    const headIconFill = isDarkMode ? '#fff' : '#000'; // Update fill color for headicon.svg

    return (
        <header>
            <nav className={`flex items-center  justify-between fixed z-50 w-screen py-4 px-2 sm:px-8 ${navBgClass}`}>
                <div className={`flex items-center text-xl font-bold ${navTextClass}`}>
                    {/* <img className="w-8 h-8 mr-2" src={headicon} alt="Logo" /> */}
                    <svg className="w-8 h-8 mr-2" fill={headIconFill} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20,3a1,1,0,0,0,0-2H4A1,1,0,0,0,4,3H5.049c.146,1.836.743,5.75,3.194,8-2.585,2.511-3.111,7.734-3.216,10H4a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2H18.973c-.105-2.264-.631-7.487-3.216-10,2.451-2.252,3.048-6.166,3.194-8Zm-6.42,7.126a1,1,0,0,0,.035,1.767c2.437,1.228,3.2,6.311,3.355,9.107H7.03c.151-2.8.918-7.879,3.355-9.107a1,1,0,0,0,.035-1.767C7.881,8.717,7.227,4.844,7.058,3h9.884C16.773,4.844,16.119,8.717,13.58,10.126ZM12,13s3,2.4,3,3.6V20H9V16.6C9,15.4,12,13,12,13Z" />
                    </svg>
                    Countdown
                </div>
                <ul className={`flex flex-col pl-2 justify-center items-center sm:hidden w-screen ${isNavOpen ? 'block' : 'hidden'} ${navBgClass} ${navTextClass} `}
                    style={{ position: 'absolute', top: '3.5rem', right: 0, zIndex: 999 }}>
                    <Link href="/" className={`block py-2 ${navTextClass}`}>
                        <li>
                            Home
                        </li>
                    </Link><Link href="/addnew" className={`block py-2 ${navTextClass}`}>
                        <li>
                            Add New
                        </li>
                    </Link>
                    <Link href="/review" className={`block py-2 ${navTextClass}`}>
                        <li>
                            Review
                        </li>
                    </Link>
                </ul>
                <div className="hidden sm:flex">
                    <ul className={`flex space-x-4`}>
                    <Link href="/" className={`${navTextClass}`}>
                        <li>
                            Home
                        </li>
                    </Link><Link href="/addnew" className={`${navTextClass}`}>
                        <li>
                            Add New
                        </li>
                    </Link>
                    <Link href="/review" className={`${navTextClass}`}>
                        <li>
                            Review
                        </li>
                    </Link>
                    </ul>
                </div>
                <div className='flex'>
                    <div>
                        <button
                            className={`mx-2 rounded-full w-10 h-10 focus:outline-none ${isDarkMode ? 'bg-white' : 'bg-dark'} ${navTextClass}`}
                            onClick={toggleDarkMode}
                        >
                            {isDarkMode ? '🌞' : '🌙'}
                        </button>
                    </div>
                    <div className="sm:hidden ">
                        <button
                            className={`mx-2 text-3xl rounded-full w-10 h-10 focus:outline-none ${isDarkMode ? 'bg-dark' : 'bg-white'} ${navTextClass}`}
                            onClick={toggleNav}
                        >
                            {isNavOpen ? 'X' : '☰'}
                        </button>
                    </div>
                </div>

            </nav>
        </header>
    );
};

export default Header;
