import React from 'react';
import { charTranslator } from '../logic/dice_utils';

const Die = ({ faces, value = faces, attribute, style = 'fill' }) => {
  const char = charTranslator(faces, value, style === 'fill');
  return (
    <div className={`die ${attribute ? attribute.toLowerCase() : ''}`}>
      <span className={`d${faces} die-char`}>{char}</span>
      <span className={`d${faces} die-char back`}>/</span>
    </div>
  );
};

export default Die;
