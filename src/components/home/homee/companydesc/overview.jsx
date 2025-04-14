import React from 'react';

const OverviewAndPosts = ({ company }) => {
    return (
        <div>
            <div className="overview-and-posts">
                <div className="overview-and-posts-overview">
                    <div className="companydesc-info-contents">
                        <h3>About</h3>
                        <p>{company.about}</p>

                        <h4>Industry</h4>
                        <p>{company.industry}</p>

                        <h4>Company size</h4>
                        <p>{company.size}</p>

                        <h4>Headquarters</h4>
                        <p>{company.headquarters}</p>

                        <h4>Founded</h4>
                        <p>{company.founded}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewAndPosts;