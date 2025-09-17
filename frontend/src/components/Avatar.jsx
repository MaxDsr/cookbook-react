import React from 'react';
import './Avatar.css';

const Avatar = ({ image, alt = "User Avatar", size = 40 }) => {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <img 
        src={image} 
        alt={alt}
        onError={(e) => {
          // Fallback to a default avatar if image fails to load
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=3b82f6&color=ffffff&size=${size}`;
        }}
      />
    </div>
  );
};

export default Avatar;
