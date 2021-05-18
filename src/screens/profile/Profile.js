import React, { Component } from 'react';
import './Profile.css';
import Header from '../../common/header/Header';

class Profile extends Component {
  render() {
    return (
      <div>
        {/** Header component included here */}
        <Header />

        Profile Page
      </div>
    )
  }
}

export default Profile;