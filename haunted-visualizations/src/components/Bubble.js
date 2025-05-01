import React from 'react';

const Bubble = () => {
  return (
    <div>
      <h2>Bubble Map</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/bubble.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Bubble Map"
      />
    </div>
  );
};

export default Bubble;