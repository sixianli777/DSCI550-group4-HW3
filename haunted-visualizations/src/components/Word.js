import React from 'react';
import wordCloudImage from './Word.jpg';

function Word() {
  return (
    <div className="image-wrapper">
      <h2 style={{ textAlign: 'left' }}>Word Cloud</h2>
      <img src={wordCloudImage} alt="Word Cloud" style={{ maxWidth: '100%' }} />
    </div>
  );
}

export default Word;
