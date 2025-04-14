import React, { useState } from 'react';
import ResumeIcon from '../../../../../assets/seeker/cv.png';
import DeleteIcon from '../../../../../assets/seeker/delete.png';
import './Modal.css';

const Step2 = ({ handleChange, values, actionType, isReadOnly }) => {
    const [isDragging, setIsDragging] = useState(false);

    // Debug log to verify isReadOnly value
    console.log('Step2 - actionType:', actionType, 'isReadOnly:', isReadOnly);

    const handleFileChange = (event) => {
        if (isReadOnly) return;
        const file = event.target.files[0];
        if (file) {
            console.log('Uploaded file:', file);
            handleChange({ target: { name: 'resume', value: file } });
        } else {
            console.log('No file selected');
        }
    };

    const handleDrop = (event) => {
        if (isReadOnly) return;
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log('Dropped file:', file);
            handleChange({ target: { name: 'resume', value: file } });
        }
    };

    const handleDragOver = (event) => {
        if (isReadOnly) return;
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        if (isReadOnly) return;
        setIsDragging(false);
    };

    const handleDelete = () => {
        if (isReadOnly) return;
        handleChange({ target: { name: 'resume', value: null } });
    };

    const showStaticData = ['View Applications Response', 'Edit Your Application'].includes(actionType);

    return (
        <div className="resumes">
            <div className="resume title align-right">
                <h2>Resume*</h2>
                <p>Be sure to upload an updated resume</p>
            </div>
            <input
                type="file"
                name="resume"
                id="resume-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isReadOnly}
            />
            <label
                htmlFor="resume-input"
                className={`custom-file-input ${isDragging && !isReadOnly ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={isReadOnly ? { cursor: 'not-allowed' } : {}}
            >
                {(values.resume || (showStaticData && values.resume)) ? (
                    <div className="uploaded-file-preview">
                        <img src={ResumeIcon} alt="Upload" className="upload-icon" />
                        <span>{typeof values.resume === 'string' ? values.resume : values.resume?.name}</span>
                        <img
                            src={DeleteIcon}
                            alt="Delete"
                            className="delete-icon"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            style={isReadOnly ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                        />
                    </div>
                ) : (
                    <>
                        <img src={ResumeIcon} alt="Resume" className="resume-icon" />
                        <div className="upload-resume">
                            <span>Upload Resume</span>
                            <p>Accepted file types are PDF, DOC, DOCX</p>
                        </div>
                    </>
                )}
            </label>
        </div>
    );
};

export default Step2;