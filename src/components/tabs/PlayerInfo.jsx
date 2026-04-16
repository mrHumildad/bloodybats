import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { charTranslator } from '../../logic/dice_utils';

const Die = ({ faces, value, attribute, style = 'fill' }) => {
  const char = charTranslator(faces, value, style === 'fill');
  return (
    <div className={`die ${attribute.toLowerCase()}`}>
      <span className={`d${faces} die-char `}>{char}</span>
      <span className={`d${faces} die-char back`}>/</span>
    </div>
  );
};

const Atrributecard = ({ attribute, value }) => {
  return (
    <div className="attribute-card">
      <p>{attribute.toUpperCase().slice(0, 3)}</p>
      <Die faces={value} value={value} attribute={attribute} style="fill" />
    </div>
  );
};

const PlayerInfo = ( {setSelectedPlayer, selectedPlayer}) => {
  const attributesCards = selectedPlayer ? Object.entries(selectedPlayer.attributes).map(([attr, val]) => (
    <Atrributecard key={attr} attribute={attr} value={val} />
  )) : null;
  return (
     <div>
       {selectedPlayer ? (
         <div>
           <h2>{selectedPlayer.name}</h2>
           <p>{selectedPlayer.role}</p>
           <p>Age: {selectedPlayer.age}</p>
           <p>{playerStars(selectedPlayer)}</p>
           <div className="attributes-container">
             {attributesCards}
           </div>
         </div>
       ) : (
         <p>No player selected</p>
       )}
     </div>
  );
}

export default PlayerInfo;
