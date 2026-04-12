// src/world/world.js
import { convents } from './convents';
import { createRandomTeam } from '../logic/utils';

/**
 * Generates the world object with convents and their monks teams.
 * Each convent gets a full team of monks generated using createRandomTeam.
 * 
 * @returns {Array} - Array of convents with added monks property
 */
export const generateWorld = () => {
  return convents.map(convent => ({
    ...convent,
    monks: createRandomTeam()
  }));
};

/**
 * Retrieves a convent by its ID from the world data.
 * 
 * @param {number} id - Convent ID
 * @param {Array} world - World data (optional, will generate if not provided)
 * @returns {Object|null} - The convent object or null if not found
 */
export const getConventById = (id, world) => {
  if (!world) {
    world = generateWorld();
  }
  return world.find(c => c.id === id) || null;
};