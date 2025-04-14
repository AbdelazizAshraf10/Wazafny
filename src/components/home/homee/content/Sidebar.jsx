
import { NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import location from '../../../../assets/seeker/location.png';

const Sidebar = ({ companies }) => {
    const navigate = useNavigate();

    const handleCompanyClickAndNavigate = (company) => {
        navigate(`/Home/maincontent/${company.id}`); // Include "/Home" in the path
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
                            <div>                    
                                <span>{company.time}</span>
                            </div>
                        </div>
                        <div className="company-info">
                            <h3>{company.jobTitle}</h3>
                            <p>{company.jobDescription}</p>
                            <br />
                            <div className="company-info-location">
                                <div className="company-info-location-item">
                                    <img src={location} alt="location" />  
                                    <span>{company.location}</span>
                                </div>
                                <div className="company-info-job-item">
                                    {company.skills.map((skill, index) => (
                                        <span key={index} className="skill-item">{skill}</span>
                                    ))}
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











