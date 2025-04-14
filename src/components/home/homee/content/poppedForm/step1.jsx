import  { useState, useEffect } from 'react';
import Egypt from '../../../../../assets/seeker/egypt.png';
import saudia from '../../../../../assets/seeker/saudia.png';
import './Modal.css';

const Step1 = ({ handleChange, values, actionType, isReadOnly }) => {
    const [selectedCountry, setSelectedCountry] = useState({
        img: Egypt,
        code: '+20',
        name: 'Egypt',
    });
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    // Debug log to verify isReadOnly value
    console.log('Step1 - actionType:', actionType, 'isReadOnly:', isReadOnly);

    // Pre-fill the selectedCountry based on static data in values
    useEffect(() => {
        if (['View Applications Response', 'Edit Your Application'].includes(actionType)) {
            if (values.country === 'Egypt') {
                setSelectedCountry({ img: Egypt, code: '+20', name: 'Egypt' });
            } else if (values.country === 'Saudi Arabia') {
                setSelectedCountry({ img: saudia, code: '+020', name: 'Saudi Arabia' });
            }
        }
    }, [actionType, values.country]);

    const handleSelect = (img, code, name) => {
        if (isReadOnly) return;
        setSelectedCountry({ img, code, name });
        setIsPhoneDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        handleChange({ target: { name: 'country', value: name } });
    };

    const togglePhoneDropdown = () => {
        if (isReadOnly) return;
        setIsPhoneDropdownOpen((prev) => {
            console.log("Phone dropdown toggled:", !prev);
            return !prev;
        });
        setIsCountryDropdownOpen(false);
    };

    const toggleCountryDropdown = () => {
        if (isReadOnly) return;
        setIsCountryDropdownOpen((prev) => {
            console.log("Country dropdown toggled:", !prev);
            return !prev;
        });
        setIsPhoneDropdownOpen(false);
    };

    return (
        <div className="step1">
            <h5>Add your contact information</h5>
            <label className="form-label">
                First Name*:
                <input
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>
            <label className="form-label">
                Last Name*:
                <input
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>

            <label className="form-label phone-number">
                Phone Number*:
                <div className="phone-input mb-2">
                    <div className="dropdown-button">
                        <button
                            className="dropdown-toggle"
                            onClick={togglePhoneDropdown}
                            type="button"
                            disabled={isReadOnly}
                            style={isReadOnly ? { cursor: 'not-allowed' } : {}}
                        >
                            <div className="dropdown-title">
                                <img
                                    src={selectedCountry.img}
                                    alt="Country"
                                    className="dropdown-image"
                                />
                                <span>{selectedCountry.code}</span>
                            </div>
                        </button>
                        {isPhoneDropdownOpen && (
                            <ul className="dropdown-menu phone-dropdown-menu">
                                <li
                                    className="dropdown-item"
                                    onClick={() => handleSelect(saudia, '+020', 'Saudi Arabia')}
                                >
                                    <div className="dropdown-item-content">
                                        <img
                                            src={saudia}
                                            alt="Saudia"
                                            className="dropdown-image"
                                        />
                                        <span>+020</span>
                                    </div>
                                </li>
                                <li
                                    className="dropdown-item"
                                    onClick={() => handleSelect(Egypt, '+20', 'Egypt')}
                                >
                                    <div className="dropdown-item-content">
                                        <img
                                            src={Egypt}
                                            alt="Egypt"
                                            className="dropdown-image"
                                        />
                                        <span>+20</span>
                                    </div>
                                </li>
                            </ul>
                        )}
                    </div>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        placeholder="0122******"
                        className="phone-number-input"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    />
                </div>
            </label>

            <label className="form-label">
                Email address*:
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="eamer2178@gmail.com"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>

            <label className="form-label">
                Country*:
                <div className="country-dropdown" id="dropdown-country">
                    <button
                        className="dropdown-toggle"
                        onClick={toggleCountryDropdown}
                        type="button"
                        disabled={isReadOnly}
                        style={isReadOnly ? { cursor: 'not-allowed' } : {}}
                    >
                        {selectedCountry.name}
                    </button>
                    {isCountryDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li
                                className="dropdown-item"
                                onClick={() => handleSelect(Egypt, '+20', 'Egypt')}
                            >
                                Egypt
                            </li>
                            <li
                                className="dropdown-item"
                                onClick={() => handleSelect(saudia, '+020', 'Saudi Arabia')}
                            >
                                Saudi Arabia
                            </li>
                        </ul>
                    )}
                </div>
            </label>

            <label className="form-label">
                City state [Optional]:
                <input
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    placeholder="Cairo"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    style={isReadOnly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                />
            </label>
        </div>
    );
};

export default Step1;