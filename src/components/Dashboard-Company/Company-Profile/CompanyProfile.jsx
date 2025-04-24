import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FirstSection from './FristSection';
import SecondSection from './SecondSection';
import { Navigate } from 'react-router-dom';
function CompanyProfile() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const comId = localStorage.getItem("company_id");
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://wazafny.online/api/show-company-profile/${comId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data)
        setCompanyData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          Navigate("/LoginCompany")
        } else if (err.response?.status === 404) {
          console.log('Company profile not found.');
        } else if (err.response?.status === 500) {
          console.log('Internal server Error');
        } else {
          setError('Failed to fetch company data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  return (
    <div className="">
      <div>
        <FirstSection
          companyId={companyData.company_id}
          companyName={companyData.company_name}
          headline={companyData.headline}
          website={companyData.company_website_link}
          email={companyData.company_email}
          followers={companyData.followers_count.toString()}
          jobs={companyData.jobs_count.toString()}
          bannerPhoto={companyData.cover_img}
          profilePhoto={companyData.profile_img}
        />
      </div>

      <div className="my-10">
        <SecondSection
          companyId={companyData.company_id}
          about={companyData.about}
          industry={companyData.company_industry}
          companySize={companyData.company_size}
          headquarters={companyData.company_heads}
          founded={companyData.company_founded}
          country={companyData.company_country}
          city={companyData.company_city}
        />
      </div>
    </div>
  );
}

export default CompanyProfile;