import React, { useState, useEffect } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';

const Modal = ({ show, handleClose, actionType, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    additionalInfo: '',
    expectedSalary: '',
    graduationYear: '',
    yearsExperience: '',
    resume: null,
    country: '',
    city: '',
  });

  // Static data to pre-fill the form
  const staticData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+201234567890',
    additionalInfo: '',
    expectedSalary: '5000 USD',
    graduationYear: '2020',
    yearsExperience: '3',
    resume: 'John_Doe_Resume.pdf',
    country: 'Egypt',
    city: '',
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add('no-scroll');
      // Pre-fill values if actionType is "View Applications Response" or "Edit Your Application"
      if (['View Applications Response', 'Edit Your Application'].includes(actionType)) {
        setValues(staticData);
      }
      // Set initial step based on actionType
      if (actionType === 'View Applications Response') {
        setCurrentStep(4); // Go directly to Step5
      } else {
        setCurrentStep(1); // Start at Step1
      }
    }
    return () => {
      document.body.classList.remove('no-scroll');
      if (!show) {
        setCurrentStep(1);
        setValues({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          additionalInfo: '',
          expectedSalary: '',
          graduationYear: '',
          yearsExperience: '',
          resume: null,
          country: '',
          city: '',
        });
      }
    };
  }, [show, actionType]);

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    if (isReadOnly) return; // Prevent changes in read-only mode
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(values);
    handleClose(); // Close modal after saving
  };

  // Define steps based on actionType
  const steps = actionType === 'View Applications Response'
    ? [{ component: Step5 }]
    : [
        { component: Step1 },
        { component: Step2 },
        { component: Step3 },
      ];

  const CurrentStep = steps[Math.min(currentStep - 1, steps.length - 1)].component;

  // Determine if the form should be read-only based on actionType
  const isReadOnly = actionType === 'View Applications Response';

  // Debug log to verify isReadOnly value
  console.log('Modal - actionType:', actionType, 'isReadOnly:', isReadOnly);

  const progress = (currentStep <= 3 ? currentStep / 3 : 1) * 100;

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div
        style={{
          backgroundColor: '#fefefe',
          margin: '5% auto',
          border: '1px solid #888',
          width: '80%',
          maxWidth: actionType === 'View Applications Response' ? '900px' : '600px',
          textAlign: actionType === 'View Applications Response' ? 'left' : 'center',
          borderRadius: '10px',
          position: 'relative',
        }}
      >
        {actionType !== 'View Applications Response' && (
          <>
            <div className="all">
              <div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
                <div className="counter">
                  <p>Page {currentStep} of 3</p>
                </div>
              </div>
              <span className="close" onClick={handleClose}>×</span>
            </div>
            <hr />
          </>
        )}

        <div className="step-content">
          <CurrentStep
            handleChange={handleChange}
            values={values}
            handleClose={handleClose}
            actionType={actionType}
            isReadOnly={isReadOnly}
          />
        </div>

        {actionType !== 'View Applications Response' && currentStep <= steps.length && (
          <div className="modal-buttons">
            <button
              className="back-button"
              onClick={handlePreviousStep}
              style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            {currentStep === 3 ? (
              <button className="save-button" onClick={handleSave} disabled={isReadOnly}>
                Save
              </button>
            ) : (
              <button className="next-button" onClick={handleNextStep}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;