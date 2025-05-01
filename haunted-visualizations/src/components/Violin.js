import React from 'react';

const Violin = () => {
  return (
    <div>
      <h2>Violin Plot</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/violin.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Violin Plot"
      />
    </div>
  );
};

export default Violin;
