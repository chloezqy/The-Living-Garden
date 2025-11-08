
// In-memory storage for all spirits. A Map is used for efficient lookups.
const spirits = new Map();

/**
 * Adds or updates a spirit in the world state.
 * @param {object} spirit - The spirit object to upsert.
 */
export const upsertSpirit = (spirit) => {
  if (!spirit || !spirit.id) {
    console.error('Attempted to upsert invalid spirit:', spirit);
    return;
  }
  spirits.set(spirit.id, { ...spirits.get(spirit.id), ...spirit });
  console.log(`Upserted spirit ${spirit.id}. Total spirits: ${spirits.size}`);
};

/**
 * Updates the activity state of a specific spirit.
 * @param {string} id - The ID of the spirit.
 * @param {string} activityState - The new activity state ('active', 'idle', 'sleep').
 */
export const updateSpiritState = (id, activityState) => {
  const spirit = spirits.get(id);
  if (spirit) {
    spirit.activityState = activityState;
    spirits.set(id, spirit);
  }
};

/**
 * Removes a spirit from the world state.
 * @param {string} id - The ID of the spirit to remove.
 */
export const removeSpirit = (id) => {
  spirits.delete(id);
  console.log(`Removed spirit ${id}. Total spirits: ${spirits.size}`);
};

/**
 * Returns the current state of the world as an object.
 * @returns {object} The world state.
 */
export const getWorld = () => {
  return {
    spirits: Object.fromEntries(spirits),
  };
};
