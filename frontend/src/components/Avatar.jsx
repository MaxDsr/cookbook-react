import React from 'react';
import './Avatar.css';

const Avatar = ({ image, alt = "User Avatar", size = 40 }) => {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <img 
        src={image} 
        alt={alt}
        onError={(e) => {
          // Fallback to local placeholder avatar if image fails to load
          e.target.src = '/placeholder-avatar.svg';
        }}
      />
    </div>
  );
};

export default Avatar;
