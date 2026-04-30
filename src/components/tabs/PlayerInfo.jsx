import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { getRoleColorClass, getBackupPlayerIds } from '../../logic/utils';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole, translateAttribute } from '../../translations';
import { getRoleFromPosition, getPositionForPlayer, getBattingOrderPosition } from '../../logic/positionUtils';
import Player from '../Player';
import Die from '../Die';

const AttributeCard = ({ attribute, value }) => {
  const { language } = useLanguage();
  const attributeName = translateAttribute(attribute, language);
  return (
    <div className="attribute-card">
      <p>{attributeName.toUpperCase().slice(0, 3)}</p>
      <Die faces={value} value={value} attribute={attribute} style="fill" />
    </div>
  );
};

const PlayerInfo = ({ selectedPlayer, setActiveTab, myConvent }) => {
  const { language } = useLanguage();

  // Extract team colors from the convent
  const primaryColor = myConvent?.colors?.primary || '#660000';
  const secondaryColor = myConvent?.colors?.secondary || '#1a0000';

   // Derive player's field position and role from team data
   const fieldPos = selectedPlayer && myConvent ? getPositionForPlayer(selectedPlayer, myConvent) : null;
   
   let playerRole;
   if (selectedPlayer && myConvent) {
     const backupIds = getBackupPlayerIds(myConvent);
     if (backupIds.includes(selectedPlayer.id)) {
       playerRole = 'backup';
     } else if (fieldPos) {
       playerRole = fieldPos === 'DH' ? 'dh' : getRoleFromPosition(fieldPos);
     } else {
       playerRole = 'reserve';
     }
   } else {
     playerRole = fieldPos ? getRoleFromPosition(fieldPos) : 'reserve';
   }
  const battingNum = selectedPlayer && myConvent?.battingOrder
    ? getBattingOrderPosition(selectedPlayer.id, myConvent.battingOrder)
    : null;

  return (
    <div>
      {selectedPlayer ? (
        <div>
          <button className="back-button" onClick={() => setActiveTab('team')}>
            {getTranslation('back', language)}
          </button>
          <h2>{selectedPlayer.name}</h2>

          {/* Player SVG Visualization */}
          <div className="player-visualization">
            <Player
              player={selectedPlayer}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              role={playerRole}
            />
          </div>

           <p id="info-role" className={getRoleColorClass(playerRole)}>{translateRole(playerRole, language)}</p>
           <p>
             {getTranslation('position', language)}: <span className="player-position">{fieldPos === 'DH' ? '-' : (fieldPos || '-')}</span>
             {battingNum !== null && <span> (Batting #{battingNum})</span>}
           </p>
          <p>{getTranslation('number', language)}: <span className="player-number">{selectedPlayer.shirtNumber}</span></p>
          <p>{getTranslation('age', language)}: {selectedPlayer.age}</p>
          <p>{playerStars(selectedPlayer)}</p>
          <div className="attributes-container">
            <div className="attribute-row">
              <AttributeCard attribute="body" value={selectedPlayer.attributes.body} />
              <AttributeCard attribute="mind" value={selectedPlayer.attributes.mind} />
              <AttributeCard attribute="heart" value={selectedPlayer.attributes.heart} />
            </div>

            <div className="attribute-row">
              <AttributeCard attribute="cunning" value={selectedPlayer.attributes.cunning} />
              <AttributeCard attribute="power" value={selectedPlayer.attributes.power} />
              <AttributeCard attribute="fortitude" value={selectedPlayer.attributes.fortitude} />
            </div>
          </div>
        </div>
      ) : (
        <p>{getTranslation('noPlayerSelected', language)}</p>
      )}
    </div>
  );
};

export default PlayerInfo;
