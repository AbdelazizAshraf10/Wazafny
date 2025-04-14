import React from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../../../../../assets/seeker/icon.png';
import './Modal.css';

const Step4 = ({ handleClose }) => {
    const navigate = useNavigate(); 

    const handleDoneClick = () => {
        handleClose(); 
       
    };

    return (
        <div className="step4">
            <div className="final step">
                <img src={icon} alt="Step 4 illustration" /><br/><br/>
                <h4>Application Submitted Successfully!</h4><br/>
                <p>Thank you for applying for<br/>
                the [Job Title] position at [Company Name].</p><br/>
                <p>Your application has been received and is under review.</p><br/>
                <button className='Done' onClick={handleDoneClick}>Done</button>
            </div>
        </div>
    );
};

export default Step4;