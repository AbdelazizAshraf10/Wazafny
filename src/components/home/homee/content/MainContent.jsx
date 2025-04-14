import  { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './poppedForm/Modal';
import vodafone from '../../../../assets/seeker/vod.png';
import google from '../../../../assets/seeker/google.png';
import blink from '../../../../assets/seeker/blink.png';
import yo from '../../../../assets/seeker/yoitconsulting_logo.jpeg';
import foodics from '../../../../assets/seeker/foodics.png';

import '../../homee/content/MainContent.css'; 

const companies = [
    {
        id: 1,
        logo: vodafone,
        name: "Vodafone Egypt",
        jobTitle: "Flutter Mobile App Developer",
        location: "Egypt (Remote). 2days ago ",
        time: "2d",
        description: "We're seeking an experienced Mobile Software Engineer with a passion for development and a team-oriented attitude, ready to bring powerful software to life.",
        requirements: "Required Technical skills: A bachelor's degree in computer science, Software Engineering, or a related field. 3+ years of experience in developing and maintaining mobile applications (Native, Hybrid..). Experienced in the architectural patterns MVC, MVP, MVVM, VIPER and other trending patterns. Hands-on experience in one or more mobile technologies such as Swift, Kotlin, RN, and Dart. Solid understanding of the full mobile development life cycle. Solid understanding of software engineering principles and practices. Knowledge of API service connection paradigms. Understanding of client/server architectures. Mastery of mobile development standard methodologies. Open to learn new technologies / platforms. Good understanding of Agile development methodologies. Strong problem-solving and analytical skills. Prior experience with Git or other version control systems. Being able to give and receive constructive and effective code reviews. Ability to work well independently and as part of a team.",
        benefits: "Flexible working hours, in addition to the 'Work from Home' policy. Competitive salary. Weekly team lunches. Access to various educational resources. Additional accessories for your computer. In-office entertainment and lounge spaces.",
        skills: ["Flutter", "Dart", "REST APIs", "Git"]
    },
    {
        id: 2,
        logo: blink,
        name: "Blink22",
        jobTitle: "Mobile Software Engineer",
        location: "Cairo, Egypt (Remote). 3days ago ",
        time: "4d",
        description: "Blink22 is looking for a Mobile Software Engineer to join our team. You will be responsible for developing and maintaining mobile applications, ensuring high performance and responsiveness.",
        requirements: "Required Technical skills: A bachelor's degree in computer science, Software Engineering, or a related field. 3+ years of experience in developing and maintaining mobile applications (Native, Hybrid..). Experienced in the architectural patterns MVC, MVP, MVVM, VIPER and other trending patterns. Hands-on experience in one or more mobile technologies such as Swift, Kotlin, RN, and Dart. Solid understanding of the full mobile development life cycle. Solid understanding of software engineering principles and practices. Knowledge of API service connection paradigms. Understanding of client/server architectures. Mastery of mobile development standard methodologies. Open to learn new technologies / platforms. Good understanding of Agile development methodologies. Strong problem-solving and analytical skills. Prior experience with Git or other version control systems. Being able to give and receive constructive and effective code reviews. Ability to work well independently and as part of a team.",
        benefits: "Flexible working hours, in addition to the 'Work from Home' policy. Competitive salary. Weekly team lunches. Access to various educational resources. Additional accessories for your computer. In-office entertainment and lounge spaces.",
        skills: ["React Native", "JavaScript", "Redux"]
    },
    {
        id: 3,
        logo: yo,
        name: "YO IT CONSULTING",
        jobTitle: "Python Developer - LLM",
        location: "Egypt (Remote/Contract) 7days ago",
        time: "1w",
        description: "YO IT CONSULTING is seeking a Python Developer with experience in LLM to join our team. You will work on various projects, collaborating with cross-functional teams to deliver high-quality software solutions.",
        requirements: "Required Technical skills: A bachelor's degree in computer science, Software Engineering, or a related field. 3+ years of experience in developing and maintaining mobile applications (Native, Hybrid..). Experienced in the architectural patterns MVC, MVP, MVVM, VIPER and other trending patterns. Hands-on experience in one or more mobile technologies such as Swift, Kotlin, RN, and Dart. Solid understanding of the full mobile development life cycle. Solid understanding of software engineering principles and practices. Knowledge of API service connection paradigms. Understanding of client/server architectures. Mastery of mobile development standard methodologies. Open to learn new technologies / platforms. Good understanding of Agile development methodologies. Strong problem-solving and analytical skills. Prior experience with Git or other version control systems. Being able to give and receive constructive and effective code reviews. Ability to work well independently and as part of a team.",
        benefits: "Flexible working hours, in addition to the 'Work from Home' policy. Competitive salary. Weekly team lunches. Access to various educational resources. Additional accessories for your computer. In-office entertainment and lounge spaces.",
        skills: ["Python", "Django", "NLP"]
    },
    {
        id: 4,
        logo: foodics,
        name: "Foodics",
        jobTitle: "Android Developer",
        location: "Cairo, Egypt (Remote/Full-time). 2days ago",
        time: "2w",
        description: "Foodics is looking for an Android Developer to join our team. You will be responsible for developing and maintaining Android applications, ensuring high performance and responsiveness.",
        requirements: "Required Technical skills: A bachelor's degree in computer science, Software Engineering, or a related field. 3+ years of experience in developing and maintaining mobile applications (Native, Hybrid..). Experienced in the architectural patterns MVC, MVP, MVVM, VIPER and other trending patterns. Hands-on experience in one or more mobile technologies such as Swift, Kotlin, RN, and Dart. Solid understanding of the full mobile development life cycle. Solid understanding of software engineering principles and practices. Knowledge of API service connection paradigms. Understanding of client/server architectures. Mastery of mobile development standard methodologies. Open to learn new technologies / platforms. Good understanding of Agile development methodologies. Strong problem-solving and analytical skills. Prior experience with Git or other version control systems. Being able to give and receive constructive and effective code reviews. Ability to work well independently and as part of a team.",
        benefits: "Flexible working hours, in addition to the 'Work from Home' policy. Competitive salary. Weekly team lunches. Access to various educational resources. Additional accessories for your computer. In-office entertainment and lounge spaces.",
        skills: ["Java", "Kotlin", "Android SDK", "REST APIs"]
    },
    {
        id: 5,
        logo: google,
        name: "Google",
        jobTitle: "Flutter Mobile App Developer",
        location: "Egypt (Remote)",
        time: "2d",
        description: "Google is seeking an experienced Flutter Mobile App Developer to join our team. You will be responsible for developing and maintaining Flutter applications, ensuring high performance and responsiveness.",
        requirements: "Required Technical skills: A bachelor's degree in computer science, Software Engineering, or a related field. 3+ years of experience in developing and maintaining mobile applications (Native, Hybrid..). Experienced in the architectural patterns MVC, MVP, MVVM, VIPER and other trending patterns. Hands-on experience in one or more mobile technologies such as Swift, Kotlin, RN, and Dart. Solid understanding of the full mobile development life cycle. Solid understanding of software engineering principles and practices. Knowledge of API service connection paradigms. Understanding of client/server architectures. Mastery of mobile development standard methodologies. Open to learn new technologies / platforms. Good understanding of Agile development methodologies. Strong problem-solving and analytical skills. Prior experience with Git or other version control systems. Being able to give and receive constructive and effective code reviews. Ability to work well independently and as part of a team.",
        benefits: "Flexible working hours, in addition to the 'Work from Home' policy. Competitive salary. Weekly team lunches. Access to various educational resources. Additional accessories for your computer. In-office entertainment and lounge spaces.",
        skills: ["Flutter", "Dart", "Firebase", "Git"]
    }
];

const MainContent = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const selectedCompany = companies.find(company => company.id === parseInt(id));

    const handleApplyClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleNavigateToCompanyDesc = () => {
        navigate(`/companydesc/${selectedCompany.id}`);
    };

    if (!selectedCompany) {
        return <div>No company selected</div>;
    }

    return (
        <div className="main-content">
            
            <div className="main-content-container">
                
                
                <div className="main-content-header">
                    <div className="companys-logo" onClick={handleNavigateToCompanyDesc} style={{ cursor: 'pointer' }}>
                        <img src={selectedCompany.logo} alt={selectedCompany.name} />
                        <h5>{selectedCompany.name}</h5>
                    </div>
                    <div className="apply">
                        <button onClick={handleApplyClick}>Apply Now</button>
                    </div>
                </div>
                <div className="main-content-Title">
                    <h5>{selectedCompany.jobTitle}</h5>
                    <p>{selectedCompany.location}</p>
                    <div>
                        <span>Remote</span>
                        <span>Full-time</span>
                    </div>
                    <div className="skills">
                        <h5>Skills</h5>
                        <div>
                            {selectedCompany.skills.map((skill, index) => (
                                <span key={index}>{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <hr />
                <div className="main-content-Description">
                    <h5>About the Job</h5>
                    <p>{selectedCompany.description}</p>
                    <hr />
                    <h5>Requirements</h5>
                    <p>{selectedCompany.requirements}</p>
                    <hr />
                    <h5>Benefits</h5>
                    <p>{selectedCompany.benefits}</p>
                </div>
            </div>
            <Modal show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default MainContent;