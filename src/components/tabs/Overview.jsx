import React from 'react';

const Overview = ({convent}) => {
  if (!convent) {
    return (
      <div>
        <h2>Overview Tab</h2>
        <p>Select a convent to view overview.</p>
      </div>
    );
  }

  const { name, colors, description, stat_focus, data_flow, nature, special_trait, arena_rule, wine_stats, hooligan_die, fanaticism } = convent;

  return (
    <div style={{ padding: '20px', backgroundColor: colors.primary, color: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: colors.secondary, textAlign: 'center' }}>{name}</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ fontStyle: 'italic' }}>{description}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Stat Focus</h3>
          <p>{stat_focus}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Data Flow</h3>
          <p>{data_flow}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Nature</h3>
          <p>{nature}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Special Trait</h3>
          <p>{special_trait}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Arena Rule</h3>
          <p>{arena_rule}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Hooligan Die</h3>
          <p>{hooligan_die}</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '8px' }}>
          <h3>Fanaticism</h3>
          <p>Level: {fanaticism.level}, Frenzy Die: {fanaticism.frenzy_die}</p>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '8px' }}>
        <h2>Wine Stats</h2>
        <p><strong>Label:</strong> {wine_stats.label}</p>
        <p><strong>Quantity:</strong> {wine_stats.quantity_liters} liters</p>
        <p><strong>Quality:</strong> {wine_stats.quality}</p>
      </div>
    </div>
  );
};

export default Overview;