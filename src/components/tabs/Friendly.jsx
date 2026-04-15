import React from 'react';
import Field from '../Field';
const Friendly = ({ opponent }) => {
  return (
    <div>
      <h2>Friendly Tab</h2>
      <p>Friendly Opponent: {opponent ? opponent.name : 'None'}</p>
      <Field />
    </div>
  );
};

export default Friendly;