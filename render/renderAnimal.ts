
import p5 from 'p5';
import { Spirit } from '../types';
import { matchSprite } from '../lib/matchSprite';

// A simple cache to avoid reloading the same image every frame
const imageCache = new Map<string, p5.Image>();

export const renderAnimal = (p: p5, spirit: Spirit) => {
  const spritePath = matchSprite(spirit);
  let img = imageCache.get(spritePath);

  if (!img) {
    p.loadImage(spritePath, loadedImg => {
      imageCache.set(spritePath, loadedImg);
      img = loadedImg;
    }, () => {
        // console.error(`Failed to load image: ${spritePath}`);
    });
  }

  if (!img || !spirit.x || !spirit.y || !spirit.size) {
    return; // Don't draw if image not loaded or position is undefined
  }

  p.push();
  p.translate(spirit.x, spirit.y);

  // Motion Style: floating sine wave
  const floatOffset = p.sin((p.frameCount + (spirit.phase || 0)) * 0.05) * (spirit.size * 0.2);
  p.translate(0, floatOffset);

  // Activity State visual changes
  let opacity = 255;
  let scale = 1;

  switch (spirit.activityState) {
    case 'active':
      // "Breathing" effect
      const pulse = p.sin((p.frameCount + (spirit.phase || 0)) * 0.1 * (spirit.growth.pulse || 1));
      scale = 1 + pulse * 0.05;
      break;
    case 'idle':
      opacity = 255 * 0.7;
      break;
    case 'sleep':
      opacity = 255 * 0.4;
      break;
  }
  
  p.tint(255, opacity);
  p.imageMode(p.CENTER);
  p.image(img, 0, 0, spirit.size * scale, spirit.size * scale);
  
  p.pop();
};
