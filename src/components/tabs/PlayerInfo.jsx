import React from 'react';
import { playerStars } from '../../logic/ui_utils';
const PlayerInfo = ( {setSelectedPlayer, selectedPlayer}) => {
  return (
     <div>
       {selectedPlayer ? (
         <div>
           <h2>{selectedPlayer.name}</h2>
           <p>Role: {selectedPlayer.role}</p>
           <p>Age: {selectedPlayer.age}</p>
           <p>{playerStars(selectedPlayer)}</p>
           <h3>Attributes:</h3>
           <ul>
             {Object.entries(selectedPlayer.attributes).map(([key, value]) => (
               <li key={key}>{key}: {value}</li>
             ))}
           </ul>
         </div>
       ) : (
         <p>No player selected</p>
       )}
     </div>
  );
}

export default PlayerInfo;
