
import p5 from 'p5';
import { Spirit } from '../types';
import { matchSprite } from '../lib/matchSprite';

// A simple cache to avoid reloading the same image every frame
const imageCache = new Map<string, p5.Image>();

export const renderCloud = (p: p5, spirit: Spirit) => {
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

  // Motion Style: gentle Perlin noise drift
  const noiseFactor = 0.001;
  const driftX = (p.noise((spirit.phase || 0) + p.frameCount * noiseFactor) - 0.5) * 2;
  const driftY = (p.noise((spirit.phase || 0) + 1000 + p.frameCount * noiseFactor) - 0.5) * 1;
  spirit.x += driftX;
  spirit.y += driftY;


  // Activity State visual changes
  let opacity = 255;
  let scale = 1;

  switch (spirit.activityState) {
    case 'active':
      const pulse = p.sin((p.frameCount + (spirit.phase || 0)) * 0.05 * (spirit.growth.pulse || 1));
      scale = 1 + pulse * 0.03;
      break;
    case 'idle':
      opacity = 255 * 0.7;
      break;
    case 'sleep':
      opacity = 255 * 0.3;
      break;
  }

  p.tint(255, opacity);
  p.imageMode(p.CENTER);
  p.image(img, 0, 0, spirit.size * 1.5 * scale, spirit.size * scale);

  p.pop();
};
