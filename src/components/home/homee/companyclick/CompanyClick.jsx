
import React, { useState } from 'react';
import Header from '../navbar/header';
import "../companyclick/companyclickdesc.css";
import search from '../../assests/search.png';
import vodafone from '../../assests/vod.png';
import google from '../../assests/google.png';
import blink from '../../assests/blink.png';
import yo from '../../assests/yoitconsulting_logo.jpeg';
import foodics from '../../assests/foodics.png';
import Desc from './companyclickdesc';

const companies = [
    {
        id: 1,
        logo: vodafone,
        name: "Vodafone Egypt",
        followers: "1.2M",
        jobs: "46",
        about: "Here at Vodafone, we do amazing things to empower everybody to be confidently connected, and that could be providing superfast network speeds to smartphones or enabling people to work from anywhere.",
        location: "Cairo, Egypt"
    },
    {
        id: 2,
        logo: google,
        name: "Google",
        followers: "10M",
        jobs: "120",
        about: "Google is a global leader in technology, providing innovative solutions to make the world's information universally accessible and useful.",
        location: "Mountain View, CA"
    },
    {
        id: 3,
        logo: blink,
        name: "Blink22",
        followers: "500K",
        jobs: "15",
        about: "Blink22 is a software development company that builds high-quality web and mobile applications for startups and enterprises.",
        location: "Cairo, Egypt"
    },
    {
        id: 4,
        logo: foodics,
        name: "Foodics",
        followers: "800K",
        jobs: "30",
        about: "Foodics is a leading restaurant management platform that helps businesses streamline operations and grow their revenue.",
        location: "Riyadh, Saudi Arabia"
    }
];

const CompanyClick = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <Header />
                </div>
                
                <div className="search">
                    <img src={search} alt="search icon"/>
                    <input
                        type="text"
                        placeholder="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="container">
                    <Desc companies={filteredCompanies} />
                    
                </div>
                


                
            </div>
        </div>
    );
};

export default CompanyClick;