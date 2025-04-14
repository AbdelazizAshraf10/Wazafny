import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './companydesc.css';

import OverviewAndPosts from './overview';
import Posts from './posts';
import vodafone from '../../../../assets/seeker/vod.png';
import google from '../../../../assets/seeker/google.png';
import blink from '../../../../assets/seeker/blink.png';
import yo from '../../../../assets/seeker/google.png';
import foodics from '../../../../assets/seeker/foodics.png';
import follow from '../../../../assets/seeker/follow.png';
import banner from '../../../../assets/seeker/profile-banner.png';
import email from '../../../../assets/seeker/email.png';

const companies = [
    {
        id: 1,
        logo: vodafone,
        name: "Vodafone Egypt",
        slogan: "Together We Can",
        website: "https://www.vodafone.com.eg",
        followers: "1.5M",
        jobs: 5,
        about: "The Vodafone Tech Innovation Center Dresden is Vodafone’s new global center for innovation and co-creation with other top tech world-wide companies, universities and research institutes. The scope of this new hub is to improve peoples' lives by innovating communications and empower businesses for a digital and sustainable future. We use newest technologies such as 5G, 6G, Augmented Reality, Artificial Intelligence, Data Analytics and Security by Design in order to build new products and propositions for health, industry, transport, automotive, agriculture and many more. Dresden is a dynamically growing high tech region in the heart of Europe with a strong industrial focus, excellent research landscape. At the same time Dresden is a great place to live with manifold culture, unspoiled nature and an international and family friendly environment. The ideal spot for creativity and innovation.",
        industry: "Telecommunications",
        size: "201-500 employees",
        headquarters: "Dresden, Saxony",
        founded: "2021"
    },
    {
        id: 2,
        logo: blink,
        name: "Blink22",
        slogan: "Innovate with Us",
        website: "https://www.blink22.com",
        followers: "500K",
        jobs: 3,
        about: "Blink22 is a software development company specializing in mobile and web applications, offering innovative solutions to clients worldwide.",
        industry: "Software Development",
        size: "51-200 employees",
        headquarters: "Cairo, Egypt",
        founded: "2015"
    },
    {
        id: 3,
        logo: yo,
        name: "YO IT CONSULTING",
        slogan: "Your IT Partner",
        website: "https://www.yoitconsulting.com",
        followers: "200K",
        jobs: 2,
        about: "YO IT CONSULTING provides IT consulting services, helping businesses to optimize their technology and improve their operations.",
        industry: "IT Consulting",
        size: "11-50 employees",
        headquarters: "Cairo, Egypt",
        founded: "2010"
    },
    {
        id: 4,
        logo: foodics,
        name: "Foodics",
        slogan: "Empowering F&B",
        website: "https://www.foodics.com",
        followers: "300K",
        jobs: 4,
        about: "Foodics is a technology company that provides point-of-sale solutions for the food and beverage industry, helping businesses to streamline their operations.",
        industry: "Technology",
        size: "101-250 employees",
        headquarters: "Riyadh, Saudi Arabia",
        founded: "2014"
    },
    {
        id: 5,
        logo: google,
        name: "Google",
        slogan: "Do the Right Thing",
        website: "https://www.google.com",
        followers: "10M",
        jobs: 20,
        about: "Google is a global technology company specializing in internet-related services and products, including online advertising, search engine, cloud computing, and software.",
        industry: "Technology",
        size: "100,000+ employees",
        headquarters: "Mountain View, California",
        founded: "1998"
    }
];

const posts = [
    // Vodafone Egypt posts
    {
        id: 1,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "2d",
        jobTitle: "Flutter Mobile App Developer",
        location: "Egypt (Remote)",
        status: "Active"
    },
    {
        id: 2,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "5d",
        jobTitle: "Flutter Mobile App Developer",
        location: "Egypt (Remote)",
        status: "Active"
    },
    {
        id: 3,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "1w",
        jobTitle: "Flutter Mobile App Developer",
        location: "Egypt (Remote)",
        status: "Closed"
    },
    {
        id: 4,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "1w",
        jobTitle: "Data Scientist",
        location: "Egypt (Remote)",
        status: "Closed"
    },
    {
        id: 5,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "2w",
        jobTitle: "DevOps Engineer",
        location: "Egypt (Remote)",
        status: "Closed"
    },
    {
        id: 6,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "3w",
        jobTitle: "Project Manager",
        location: "Egypt (Remote)",
        status: "Closed"
    },
    {
        id: 7,
        companyId: 1,
        companyLogo: vodafone,
        companyName: "Vodafone Egypt",
        time: "1m",
        jobTitle: "QA Engineer",
        location: "Egypt (Remote)",
        status: "Closed"
    },
    // Google posts
    {
        id: 8,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "2d",
        jobTitle: "Software Engineer",
        location: "Mountain View, CA",
        status: "Active"
    },
    {
        id: 9,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "3d",
        jobTitle: "Data Scientist",
        location: "Mountain View, CA",
        status: "Active"
    },
    {
        id: 10,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "4d",
        jobTitle: "Product Manager",
        location: "Mountain View, CA",
        status: "Active"
    },
    {
        id: 11,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "1w",
        jobTitle: "UX Designer",
        location: "Mountain View, CA",
        status: "Closed"
    },
    {
        id: 12,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "2w",
        jobTitle: "DevOps Engineer",
        location: "Mountain View, CA",
        status: "Closed"
    },
    {
        id: 13,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "3w",
        jobTitle: "Security Engineer",
        location: "Mountain View, CA",
        status: "Closed"
    },
    {
        id: 14,
        companyId: 5,
        companyLogo: google,
        companyName: "Google",
        time: "1m",
        jobTitle: "QA Engineer",
        location: "Mountain View, CA",
        status: "Closed"
    },
    // Blink22 posts
    {
        id: 15,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "2d",
        jobTitle: "React Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 16,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "3d",
        jobTitle: "Backend Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 17,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "4d",
        jobTitle: "Frontend Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 18,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "1w",
        jobTitle: "Data Scientist",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 19,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "2w",
        jobTitle: "DevOps Engineer",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 20,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "3w",
        jobTitle: "Project Manager",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 21,
        companyId: 2,
        companyLogo: blink,
        companyName: "Blink22",
        time: "1m",
        jobTitle: "QA Engineer",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    // YO IT CONSULTING posts
    {
        id: 22,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "2d",
        jobTitle: "Python Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 23,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "3d",
        jobTitle: "Backend Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 24,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "4d",
        jobTitle: "Frontend Developer",
        location: "Cairo, Egypt",
        status: "Active"
    },
    {
        id: 25,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "1w",
        jobTitle: "Data Scientist",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 26,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "2w",
        jobTitle: "DevOps Engineer",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 27,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "3w",
        jobTitle: "Project Manager",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    {
        id: 28,
        companyId: 3,
        companyLogo: yo,
        companyName: "YO IT CONSULTING",
        time: "1m",
        jobTitle: "QA Engineer",
        location: "Cairo, Egypt",
        status: "Closed"
    },
    // Foodics posts
    {
        id: 29,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "2d",
        jobTitle: "Android Developer",
        location: "Riyadh, Saudi Arabia",
        status: "Active"
    },
    {
        id: 30,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "3d",
        jobTitle: "Backend Developer",
        location: "Riyadh, Saudi Arabia",
        status: "Active"
    },
    {
        id: 31,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "4d",
        jobTitle: "Frontend Developer",
        location: "Riyadh, Saudi Arabia",
        status: "Active"
    },
    {
        id: 32,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "1w",
        jobTitle: "Data Scientist",
        location: "Riyadh, Saudi Arabia",
        status: "Closed"
    },
    {
        id: 33,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "2w",
        jobTitle: "DevOps Engineer",
        location: "Riyadh, Saudi Arabia",
        status: "Closed"
    },
    {
        id: 34,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "3w",
        jobTitle: "Project Manager",
        location: "Riyadh, Saudi Arabia",
        status: "Closed"
    },
    {
        id: 35,
        companyId: 4,
        companyLogo: foodics,
        companyName: "Foodics",
        time: "1m",
        jobTitle: "QA Engineer",
        location: "Riyadh, Saudi Arabia",
        status: "Closed"
    }
];

const CompanyDesc = () => {
    const { id } = useParams();
    const company = companies.find(company => company.id === parseInt(id));
    const companyPosts = posts.filter(post => post.companyId === parseInt(id));
    const [activeTab, setActiveTab] = useState('overview');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (!company) {
        return <div>Company not found</div>;
    }

    return (
        <div className="companydesc">
            
            <div className="companydesc-content">
                <div className="companydesc-info">
                    <div className="companydesc-info-header-logo-banner">
                        <img src={banner} alt="Banner" className="banner-image" />
                    </div>
                    <div className="companydesc-info-header">
                        <div className="companydesc-info-header-logo">
                            <img src={company.logo} alt={`${company.name} logo`} />
                            <h4>{company.name}</h4>
                            <p>{company.slogan}</p>
                            <span>
                                <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                                <img src={email} alt="Link icon" />
                            </span>
                            <div className="followers-jobs">
                                <div className="email-icon">
                                    <span>Email
                                        <img src={email} alt="Email icon" />
                                    </span>
                                </div>
                                <div className="followers">
                                    <p>{company.followers}</p>
                                    <p>Followers</p>
                                </div>
                                <div className="jobs">
                                    <p>{company.jobs}</p>
                                    <p>Jobs</p>
                                </div>
                            </div>
                        </div>
                        <div className="companydesc-info-header-follow">
                            <button aria-label="Follow company">Follow</button>
                            <img src={follow} alt="Follow icon" />
                        </div>
                    </div>
                    <hr />
                    <div className="overview-posts-tabs">
                        <button
                            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => handleTabClick('overview')}
                            aria-selected={activeTab === 'overview'}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => handleTabClick('posts')}
                            aria-selected={activeTab === 'posts'}
                        >
                            Posts
                        </button>
                    </div>
                </div>
                <div className="contents">
                    {activeTab === 'overview' && <OverviewAndPosts company={company} />}
                    {activeTab === 'posts' && <Posts posts={companyPosts} />}
                </div>
            </div>
        </div>
    );
};

export default CompanyDesc;