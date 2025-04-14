import React, { useState } from 'react';

import '../my application/all.css';
import Delete from '../../../../assets/seeker/Vector.png';
import foodics from '../../../../assets/seeker/foodics.png';
import vodafone from '../../../../assets/seeker/vod.png';
import Blink22 from '../../../../assets/seeker/blink.png';
import Modal from '../content/poppedForm/Modal';

const MyApplication = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState([
    {
      id: 1,
      logo: foodics,
      company: 'Foodics',
      jobTitle: 'Flutter Mobile App Developer',
      location: 'Egypt (Remote)',
      action: 'View Applications Response',
      status: 'Accepted',
      date: '2d',
    },
    {
      id: 2,
      logo: vodafone,
      company: 'Vodafone Egypt',
      jobTitle: 'Flutter Mobile App Developer',
      location: 'Egypt (Remote)',
      action: 'Edit Your Application',
      status: 'Pending',
      date: '2d',
    },
    {
      id: 3,
      logo: Blink22,
      company: 'Blink22',
      jobTitle: 'Mobile Software Engineer',
      location: 'Cairo, Egypt (Remote)',
      action: '',
      status: 'Rejected',
      date: '2d',
    },
  ]);

  const handleOpenModal = (action) => {
    setModalContent(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent('');
  };

  const handleDeleteRow = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleSaveData = (values) => {
    console.log('Saved data:', values);
    // Add your save logic here
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return { color: 'green' };
      case 'Pending':
        return { color: '#EFA600' };
      case 'Rejected':
        return { color: 'red' };
      default:
        return { color: 'black' };
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'All') return true;
    return app.status === filter || (filter === 'Not qualified' && app.status === 'Rejected');
  });

  return (
    <div className="all-container">
      <div className="all-header">
        <Header />
      </div>
      <div className="all-content">
        <div className="My-app">
          <span>My Applications</span>
        </div>
        <div className="content">
          <div className="process">
            <ul>
              <li className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>
                All
              </li>
              <li className={filter === 'Accepted' ? 'active' : ''} onClick={() => setFilter('Accepted')}>
                Accepted
              </li>
              <li className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>
                Pending
              </li>
              <li
                className={filter === 'Not qualified' ? 'active' : ''}
                onClick={() => setFilter('Not qualified')}
              >
                Not qualified
              </li>
            </ul>
          </div>
          {filteredApplications.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr className="tablerow1" key={app.id}>
                      <td className="col1">
                        <img src={Delete} alt="delete" onClick={() => handleDeleteRow(app.id)} />
                      </td>
                      <td className="col2">
                        <img src={app.logo} alt={app.company} className="companyimage" />
                        <span>{app.company}</span>
                      </td>
                      <td className="col3">
                        <div className="jobtitle">{app.jobTitle}</div>
                        <div>{app.location}</div>
                      </td>
                      <td className="col4">
                        {app.action && <a onClick={() => handleOpenModal(app.action)}>{app.action}</a>}
                      </td>
                      <td className="col5">
                        <div className="date" style={{ textAlign: 'end' }}>{app.date}</div>
                        <div className="state" style={getStatusStyle(app.status)}>{app.status}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No applications available.</p>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          handleClose={handleCloseModal}
          actionType={modalContent}
          onSave={handleSaveData}
        />
      )}
    </div>
  );
};

export default MyApplication;