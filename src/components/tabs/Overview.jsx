import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation, translateAttribute, getConventField } from '../../translations';

const Overview = ({ convent }) => {
  const { language } = useLanguage();

  if (!convent) {
    return (
      <div>
        <h2>Overview Tab</h2>
        <p>{getTranslation('selectConvent', language)}</p>
      </div>
    );
  }

  // Use translations for content fields
  const name = getConventField(convent, 'name', language);
  const description = getConventField(convent, 'description', language);
  const specialTrait = getConventField(convent, 'special_trait', language);
  const arenaRule = getConventField(convent, 'arena_rule', language);
  const wineLabel = getConventField(convent, 'wine_stats.label', language);
  const wineQuality = getConventField(convent, 'wine_stats.quality', language);

  const { colors, stat_focus, data_flow, nature, hooligan_die, fanaticism, wine_stats } = convent;

  // Translate attribute keys
  const statFocusTranslated = translateAttribute(stat_focus, language);
  const dataFlowTranslated = translateAttribute(data_flow, language);
  const natureTranslated = translateAttribute(nature, language);

  return (
    <div style={{ padding: '20px', backgroundColor: colors.primary, color: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: colors.secondary, textAlign: 'center' }}>{name}</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontStyle: 'italic' }}>{description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('statFocus', language)}</h3>
          <p>{statFocusTranslated}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('dataFlow', language)}</h3>
          <p>{dataFlowTranslated}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('nature', language)}</h3>
          <p>{natureTranslated}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('specialTrait', language)}</h3>
          <p>{specialTrait}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('arenaRule', language)}</h3>
          <p>{arenaRule}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('hooliganDie', language)}</h3>
          <p>{hooligan_die}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>{getTranslation('fanaticism', language)}</h3>
          <p>Level: {fanaticism.level}, Frenzy Die: {fanaticism.frenzy_die}</p>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '8px' }}>
        <h2>{getTranslation('wineStats', language)}</h2>
        <p><strong>{getTranslation('label', language)}:</strong> {wineLabel}</p>
        <p><strong>{getTranslation('quantity', language)}:</strong> {wine_stats.quantity_liters} {getTranslation('liters', language)}</p>
        <p><strong>{getTranslation('quality', language)}:</strong> {wineQuality}</p>
      </div>
    </div>
  );
};

export default Overview;