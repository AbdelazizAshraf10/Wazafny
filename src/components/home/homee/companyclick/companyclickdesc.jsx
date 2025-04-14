import React from 'react';
import { NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import location from "../../assests/location.png";

const Sidebar = ({ companies }) => {
    const navigate = useNavigate();

    const handleCompanyClickAndNavigate = (company) => {
        navigate(`/companydesc/${company.id}`); 
    };
    return (
        <div className="sidebar-left">
            <div className="company-experience-item">
                {companies.map((company, index) => (
                    <div 
                        className="company-experience-info" 
                        key={company.id} 
                        onClick={() => handleCompanyClickAndNavigate(company)}
                    >
                        <div className="company-logo">
                            <NavLink to="">
                                <div className="companys-logo">
                                    <img src={company.logo} alt={company.name} />
                                    <h5>{company.name}</h5>
                                </div>
                            </NavLink>
                            <div className='company-followers'>
                           
                            <div className="company-followers-item">
                                
                                <span  >{company.followers}  </span> <br/>
                                <span>Followers</span>
    
                                
                                </div>
                                <div className="company-followers-item">                    
                                 <span>{company.jobs} </span><br/>
                                 <span>Jobs</span> 
                            </div>
                        </div>
                        </div>
                        <div className="company-info">
                            <div className="company-about">
                                
                            <span>About</span>
                            <p>{company.about}</p>
                            </div> 
                            <br />
                            <div className="company-info-location">
                                <div className="company-info-location-item">
                                    <img src={location} alt="location" />  
                                    <span>{company.location}</span>
                                </div>
                            </div>
                        </div>
                        {index !== companies.length - 1 && <hr />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;




































