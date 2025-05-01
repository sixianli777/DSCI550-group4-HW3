import React from 'react';

const Heatmap = () => {
  return (
    <div>
      <h2>Heat Map</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/Heatmap.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Heat Map"
      />
    </div>
  );
};

export default Heatmap;