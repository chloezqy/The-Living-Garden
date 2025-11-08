
import { Spirit } from '../types';

// Simple hash function to get a consistent number from a string.
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Number of available assets per archetype.
// In a real project, this might be dynamic or a larger number.
const ASSET_COUNT = 100; 

/**
 * Selects a sprite image path based on the spirit's archetype and traits.
 * This provides a pseudo-random but consistent visual for each unique spirit.
 * @param spirit - The spirit object.
 * @returns A URL path to the sprite image.
 */
export function matchSprite(spirit: Spirit): string {
  if (spirit.archetype === 'plant') {
    // Plants are rendered procedurally, so they don't need a sprite.
    return '';
  }

  const folder = spirit.archetype + 's'; // 'animals' or 'clouds'
  const traitKey = spirit.traits.sort().join('_'); // Sort for consistency
  
  // Use a hash to pick a consistent image number
  const hash = Math.abs(hashCode(traitKey)) % ASSET_COUNT;
  
  // Assumes images are named 0.png, 1.png, etc. in the public assets folder
  return `/assets/spirits/${folder}/${hash}.png`;
}
