import React from 'react';

const Scatter = () => {
  return (
    <div>
      <h2>Scatter Plot</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/scatter.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Scatter Plot"
      />
    </div>
  );
};

export default Scatter;