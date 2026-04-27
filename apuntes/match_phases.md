possible actions for each role are stored in actions.js

i need a rolling-dice div where to show the dice rolling animation when needed, in the bottom right corner of Field container

each match has 3 innings
each inning has 3 outs
each phase has 3 balls
each ball has 3 actions: picher, cathcer, batter

picher and cathcer announced in commentator log
player clicks continue
catcher choses his action (player choses, cpu randomly 4 now)
action is announced in commentator log and dice for the actiion are rolled
picher choses his action (player choses, cpu randomly 4 now)
action is announced in commentator log
batter choses his action (player choses, cpu randomly 4 now)
action is announced in commentator log
dice for the actiions of batter and picher are rolled
outcome of the ball is calculated
outcome is announced in commentator log
strikes and balls are updated
... repeat until game is over
player clicks continue
if game is over, game over screen is shown
else, game continues