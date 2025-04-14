import React from 'react';

const Step3 = ({ handleChange, values, actionType, isReadOnly }) => {
    // Debug log to verify isReadOnly value
    console.log('Step3 - actionType:', actionType, 'isReadOnly:', isReadOnly);

    return (
        <div className="additional-questions">
            <h2>Additional Questions</h2>
            <label className="form-label">
                Expected Monthly Salary*:
                <input
                    type="text"
                    name="expectedSalary"
                    value={values.expectedSalary}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>
            <label className="form-label">
                Graduation Year*:
                <input
                    type="text"
                    name="graduationYear"
                    value={values.graduationYear}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>
            <label className="form-label">
                Number of Years Experience in Mobile Development*:
                <input
                    type="text"
                    name="yearsExperience"
                    value={values.yearsExperience}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>
        </div>
    );
};

export default Step3;