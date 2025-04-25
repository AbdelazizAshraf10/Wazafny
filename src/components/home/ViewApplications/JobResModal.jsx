import React from 'react';

function JobResModal({
  isOpen,
  onClose,
  applicantName = "[Applicant's Name]",
  jobTitle = "[Job Title]",
  companyName = "[Company Name]",
  startDate = "[Start Date]",
  managerName = "[Manager's Name]",
  officeLocation = "[Office Location]",
  remoteDetails = "[Remote Setup Details]",
  forms = "[Mention any forms, employee handbook, or next steps]",
  yourName = "[Your Name]",
  yourPosition = "[Your Position]",
  contactInfo = "[Contact Information]",
  response,
}) {
  if (!isOpen) return null;

  console.log("JobResModal Response:", response); // Debug log

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-16 w-[100%] md:w-[800px] my-auto max-w-6xl relative">
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
        <div className="text-[#201A23] border border-gray-300 rounded-lg p-6 text-base leading-relaxed space-y-4">
          {response === null ? (
            <div className="text-center text-gray-600">
              <p>No response available for this application.</p>
            </div>
          ) : (
            <div className="whitespace-pre-line">
              {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobResModal;