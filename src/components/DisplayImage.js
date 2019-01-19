import React from 'react';

const DisplayImage = ({ image, style }) => {
  const buffer = image.content.data;
  const b64 = new Buffer(buffer).toString('base64')
  const mimeType = image.mimeType;

  return <img src={`data:${mimeType};base64,${b64}`} style={style} />
};

export default DisplayImage;