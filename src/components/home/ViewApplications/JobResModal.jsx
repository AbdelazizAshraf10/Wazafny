import React from 'react';

function JobResModal({ isOpen, onClose, applicantName = "[Applicant's Name]", jobTitle = "[Job Title]", companyName = "[Company Name]", startDate = "[Start Date]", managerName = "[Manager's Name]", officeLocation = "[Office Location]", remoteDetails = "[Remote Setup Details]", forms = "[Mention any forms, employee handbook, or next steps]", yourName = "[Your Name]", yourPosition = "[Your Position]", contactInfo = "[Contact Information]" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50">
        
      <div className="bg-white rounded-lg p-16 w-[100%] md:w-[800px] max-w-6xl relative">
        {/* Modal Header */}
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Job Response
        </h2>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 scale-150 right-10 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        

        {/* Letter Content */}
        <div className="text-[#201A23] border  border-gray-300 rounded-lg p-6 text-base leading-relaxed space-y-4">
          <p>
            Dear {applicantName},
          </p>
          <p>
            We are delighted to confirm your acceptance of the {jobTitle} position at {companyName}. We look forward to welcoming you to our team and are excited about the contributions you will bring to our organization.
          </p>
          <p>
            As discussed, your start date will be {startDate}, and you will be reporting to {managerName} at {officeLocation} {remoteDetails}. Please find attached any necessary documents related to your onboarding, including {forms}.
          </p>
          <p>
            If you have any questions before your start date, feel free to reach out. We are thrilled to have you on board and look forward to working together!
          </p>
          <p>
            Best regards,
          </p>
          <p>
            {yourName}<br />
            {yourPosition}<br />
            {companyName}<br />
            {contactInfo}
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobResModal;