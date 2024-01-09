/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.css'; // Import CSS file for styling
import axios from 'axios';
import {message} from 'antd';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const {token}=useContext(AuthContext);

  const fetchData=async()=>{
    try {
      const response=await axios.get('https://docsbackend-cvv1.onrender.com/profile/',{
        headers:{
          Authorization:`token ${token}`
        }
      })
      if(response && response?.data?.user){
        setUserData(response.data.user);
      }
      else{
        console.log(response);
        message.error('Some error occurred!.')
      }
    } catch (error) {
      message.error(error?.response?.data?.detail ||error?.response?.data?.detail ||'Some error occurred!.');
    }
  }
  useEffect(() => {
    fetchData();
  },[token]);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {userData ? (
        <div className="user-details">
          <img src={userData.profile_pic} alt="Profile" className="profile-pic" />
          <div className="info">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Full Name:</strong> {userData.first_name} {userData.last_name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Joined:</strong> {userData.created_at}
            </p>
            <p>
              <strong>Last Updated:</strong> {userData.updated_at}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
