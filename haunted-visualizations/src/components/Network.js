import React from 'react';

const Network = () => {
  return (
    <div>
      <h2>Network Plot</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/network.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Network Plot"
      />
    </div>
  );
};

export default Network;