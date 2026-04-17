import React from 'react';
import Field from '../Field';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations';

const Friendly = ({ opponent }) => {
  const { language } = useLanguage();

  return (
    <div>
      <h2>{getTranslation('friendly', language)}</h2>
      <p>{getTranslation('friendlyOpponent', language)}: {opponent ? opponent.name : getTranslation('none', language)}</p>
      <Field />
    </div>
  );
};

export default Friendly;