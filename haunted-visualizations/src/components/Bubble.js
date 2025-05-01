import React from 'react';
import bubbleImage from './Bubble.jpg';

function Bubble() {
  return (
    <div className="image-wrapper">
      <h2 style={{ textAlign: 'left' }}>Bubble Map</h2>
      <img src={bubbleImage} alt="Bubble Map" style={{ maxWidth: '100%' }} />
    </div>
  );
}

export default Bubble;