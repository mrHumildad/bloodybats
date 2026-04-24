import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { getRoleColorClass } from '../../logic/utils';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole, translateAttribute } from '../../translations';
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
  console.log(selectedPlayer);

  // Extract team colors from the convent
  const primaryColor = myConvent?.colors?.primary || '#660000';
  const secondaryColor = myConvent?.colors?.secondary || '#1a0000';

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
            />
          </div>

          <p id="info-role" className={getRoleColorClass(selectedPlayer.role)}>{translateRole(selectedPlayer.role, language)}</p>
          <p>{getTranslation('position', language)}: <span className="player-position">{selectedPlayer.position}</span></p>
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
