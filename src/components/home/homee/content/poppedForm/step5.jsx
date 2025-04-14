import React from 'react';

const Step5 = ({ handleClose, actionType, isReadOnly }) => {
    // Debug log to verify isReadOnly value
    console.log('Step5 - actionType:', actionType, 'isReadOnly:', isReadOnly);

    return (
        <div className="JobResponse">
            <div className="JobResponse-header">
                <h3>Job Response</h3>
                <span className="close" onClick={handleClose}>×</span>
            </div>
            <div className="JobResponse-content">
                <span className="JobResponse-text">Dear [Applicant’s Name]</span>,<br/>
                <p>We are delighted to confirm your acceptance of the [Job Title] position at [Company Name]. We look forward to welcoming you to our team and are excited about the contributions you will bring to our organization.
                As discussed, your start date will be [Start Date], and you will be reporting to [Manager’s Name] at [Office Location / Remote Setup Details]. Please find attached any necessary documents related to your onboarding, including [mention any forms, employee handbooks, or next steps].
                If you have any questions before your start date, feel free to reach out. We are thrilled to have you on board and look forward to working together!
                </p>
                <span className="JobResponse-text">Best regards,<br/>[Your Name]<br/>[Your Position]<br/>[Company Name]<br/>[Contact Information]</span>
            </div>  
        </div>
    );
};

export default Step5;