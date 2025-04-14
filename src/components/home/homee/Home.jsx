import React, { useState } from 'react';

import './Home.css';
import search from '../../../assets/seeker/search.png';
import vodafone from '../../../assets/seeker/vod.png';
import google from '../../../assets/seeker/google.png';
import blink from '../../../assets/seeker/blink.png';
import yo from '../../../assets/seeker/yoitconsulting_logo.jpeg';
import foodics from '../../../assets/seeker/foodics.png';
import Sidebar from './content/Sidebar';

const companies = [
    {
        id: 1,
        logo: vodafone,
        name: "Vodafone Egypt",
        time: "2d",
        jobTitle: "Flutter Mobile App Developer",
        location: "Cairo, Egypt",
        skills: ["iOS", "Flutter"," Mobile App Development", "Firebase"],
        "jobDescription": "We are looking for an experienced Senior Flutter Software Engineer/Developer to join our highly skilled technical team."
    },
    {
        id: 2,
        logo: google,
        name: "Google",
        time: "3d",
        jobTitle: "Backend Developer",
        location: "Mountain View, CA",
        skills: ["Python", "Django", "Google Cloud"],
        "jobDescription": "Join Google as a Backend Developer to build scalable and efficient backend systems for our global products."
    },
    {
        id: 3,
        logo: blink,
        name: "Blink22",
        time: "7d",
        jobTitle: "Mobile Software Engineer",
        location: "Cairo, Egypt",
        skills: ["React", "JavaScript", "CSS"],
        "jobDescription": "Blink22 is seeking a Mobile Software Engineer to develop cutting-edge mobile applications using React Native."
    },
    {
        id: 4,
        logo: foodics,
        name: "Foodics",
        time: "2d",
        jobTitle: "Android Developer",
        location: "Riyadh, Saudi Arabia",
        skills: ["Kotlin", "Android Studio", "Firebase"],
        "jobDescription": "Foodics is hiring an Android Developer to create innovative mobile solutions for the food and beverage industry."
    }
];

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCompanies = companies.filter(company =>
        company.jobTitle.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <div className="home-content">
                
                
                <div className="search">
                    <img src={search} alt="search icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* starts left sidebar */}
                <div className="container">
                    <Sidebar companies={filteredCompanies} />
                    {/* left sidebar ends */}
                </div>
            </div>
        </div>
    );
};

export default Home;