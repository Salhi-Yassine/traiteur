import React from 'react';

const NextImage = ({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  style, 
  sizes,
  quality,
  priority,
  placeholder,
  ...props 
}: any) => {
  const imgStyle: any = fill 
    ? { position: 'absolute', height: '100%', width: '100%', inset: 0, color: 'transparent', objectFit: 'cover', ...style } 
    : style;
    
  // Handle static imports which pass an object
  const imageSrc = typeof src === 'string' ? src : src?.src || '';

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className} 
      style={imgStyle} 
      {...props} 
    />
  );
}

export default NextImage;
