import React from 'react';

const tabs = [
  //{ id: 'home', label: 'Home' },
  { id: 'overview', label: 'Overview' },
  { id: 'team', label: 'Team' },
  { id: 'friendly' , label: 'Friendly' },
];

const Home = ({setActiveTab}) => {
  const tabButtons = tabs.map(tab => (
    <button key={tab.id} className="tab-button" onClick={() => setActiveTab(tab.id)}>
      {tab.label}
    </button>
  ));
  return (
    <div>
      {tabButtons}
    </div>
  );
}

export default Home;
