import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { charTranslator } from '../../logic/dice_utils';

const Die = ({ faces, value=faces, attribute, style = 'fill' }) => {
  console.log(`Rendering Die: faces=${faces}, value=${value}, attribute=${attribute}, style=${style}`);
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
  console.log(selectedPlayer)
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
            <div className="attribute-row">
             <Atrributecard attribute="cuerpo" value={selectedPlayer.attributes.Cuerpo} />
              <Atrributecard attribute="Mente" value={selectedPlayer.attributes.Mente} />
              <Atrributecard attribute="Corazon" value={selectedPlayer.attributes.Corazon} />
            </div>
            <div className="attribute-row">
              <Atrributecard attribute="Emanacion" value={selectedPlayer.attributes.Emanacion} />
              <Atrributecard attribute="Percepcion" value={selectedPlayer.attributes.Percepcion} />
              <Atrributecard attribute="Esencia" value={selectedPlayer.attributes.Esencia} />
            </div>
            <div className="attribute-row">
              <Atrributecard attribute="Astucia" value={selectedPlayer.attributes.Astucia} />
              <Atrributecard attribute="Potencia" value={selectedPlayer.attributes.Potencia} />
              <Atrributecard attribute="Fortaleza" value={selectedPlayer.attributes.Fortaleza} />
            </div>
             
           </div>
         </div>
       ) : (
         <p>No player selected</p>
       )}
     </div>
  );
}

export default PlayerInfo;
