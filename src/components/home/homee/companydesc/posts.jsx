import React from 'react';
import './companydesc.css';

const Posts = ({ posts }) => {
    // Ensure posts is an array to avoid errors if undefined or null
    if (!Array.isArray(posts)) {
        return <div>No posts available</div>;
    }

    return (
        <div className="overview-and-posts">
            <div className="overview-and-posts-posts">
                <div className="companydesc-info-content">
                    {posts.map((post, index) => {
                        // Fallback values for post properties
                        const jobTitle = post.jobTitle || 'Untitled Job';
                        const location = post.location || 'Unknown Location';
                        const status = post.status || 'Unknown'; // Default status if undefined
                        const time = post.time || 'N/A';
                        const companyLogo = post.companyLogo || 'default-logo.png'; // Provide a default logo path
                        const companyName = post.companyName || 'Unknown Company';

                        return (
                            <div key={post.id || index}>
                                <div className="companydesc-info-content-header">
                                    <div className="company-logo">
                                        <div className="companys-logo">
                                            <img src={companyLogo} alt={companyName} />
                                            <div className="job-details">
                                                <p>{jobTitle}</p>
                                                <span>{location}</span>
                                            </div>
                                        </div>
                                        <div className="job-status-time">
                                            <span
                                                className={`status ${
                                                    status ? status.toLowerCase() : 'unknown'
                                                }`}
                                            >
                                                {status}
                                            </span>
                                            <span className="time">{time}</span>
                                        </div>
                                    </div>
                                </div>
                                {index !== posts.length - 1 && <hr />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Posts;