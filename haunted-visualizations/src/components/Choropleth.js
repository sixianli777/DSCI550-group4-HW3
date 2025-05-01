import React from 'react';

const Choropleth = () => {
  return (
    <div>
      <h2>Choropleth Map</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/choropleth.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Choropleth Map"
      />
    </div>
  );
};

export default Choropleth;