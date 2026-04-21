import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations';

const tabs = [
  { id: 'overview', labelKey: 'overview' },
  { id: 'team', labelKey: 'team' },
  { id: 'match', labelKey: 'match' },
  { id: 'fixtures', labelKey: 'fixtures' },
  { id: 'leaderboard', labelKey: 'leaderboard' },
];

const Home = ({ setActiveTab }) => {
  const { language } = useLanguage();

  const tabButtons = tabs.map(tab => (
    <button key={tab.id} className="tab-button" onClick={() => setActiveTab(tab.id)}>
      {getTranslation(tab.labelKey, language)}
    </button>
  ));
  return (
    <div>
      {tabButtons}
    </div>
  );
}

export default Home;
