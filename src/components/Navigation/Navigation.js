import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({onRouteChange, isSignedIn}) => {
    if(isSignedIn) {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <ProfileIcon />
          <p className="f3 link dim black pa3 pointer" onClick={() => onRouteChange('signout')}>Sign Out</p>
        </nav>
      );
    } else {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p className="f3 link dim black pa3 pointer" onClick={() => onRouteChange('signin')}>Sign In</p>
          <p className="f3 link dim black pa3 pointer" onClick={() => onRouteChange('register')}>Register</p>
        </nav>
      );
    }
};

export default Navigation;