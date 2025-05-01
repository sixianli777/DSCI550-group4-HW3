import React from 'react';

const Word = () => {
  return (
    <div>
      <h2>Word Cloud</h2>
      <iframe
        src={`${process.env.PUBLIC_URL}/Visuals/word.html`}
        width="100%"
        height="700"
        style={{ border: 'none' }}
        title="Word Cloud"
      />
    </div>
  );
};

export default Word;