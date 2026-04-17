import React from 'react';
import { playerStars } from '../../logic/ui_utils';
import { getRoleColorClass } from '../../logic/utils';
import { charTranslator } from '../../logic/dice_utils';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateRole, translateAttribute } from '../../translations';

const Die = ({ faces, value = faces, attribute, style = 'fill' }) => {
  console.log(`Rendering Die: faces=${faces}, value=${value}, attribute=${attribute}, style=${style}`);
  const char = charTranslator(faces, value, style === 'fill');
  return (
    <div className={`die ${attribute.toLowerCase()}`}>
      <span className={`d${faces} die-char `}>{char}</span>
      <span className={`d${faces} die-char back`}>/</span>
    </div>
  );
};

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

const PlayerInfo = ({ selectedPlayer }) => {
  const { language } = useLanguage();
  console.log(selectedPlayer);

  return (
    <div>
      {selectedPlayer ? (
        <div>
          <h2>{selectedPlayer.name}</h2>
          <p className={getRoleColorClass(selectedPlayer.role)}>{translateRole(selectedPlayer.role, language)}</p>
          <p>{getTranslation('age', language)}: {selectedPlayer.age}</p>
          <p>{playerStars(selectedPlayer)}</p>
          <div className="attributes-container">
            <div className="attribute-row">
              <AttributeCard attribute="body" value={selectedPlayer.attributes.body} />
              <AttributeCard attribute="mind" value={selectedPlayer.attributes.mind} />
              <AttributeCard attribute="heart" value={selectedPlayer.attributes.heart} />
            </div>
            <div className="attribute-row">
              <AttributeCard attribute="emanation" value={selectedPlayer.attributes.emanation} />
              <AttributeCard attribute="perception" value={selectedPlayer.attributes.perception} />
              <AttributeCard attribute="essence" value={selectedPlayer.attributes.essence} />
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
