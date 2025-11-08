
import p5 from 'p5';
import { Spirit } from '../types';
import { getPrimaryColor } from '../lib/colormaps';

export const renderPlant = (p: p5, spirit: Spirit) => {
  if (!spirit.x || !spirit.y || !spirit.size) {
    return;
  }
  
  p.push();
  p.translate(spirit.x, spirit.y);

  const primaryColor = p.color(getPrimaryColor(spirit.colorPalette));
  
  // Activity State visual changes
  let alpha = 255;
  let growthFactor = 1;

  switch (spirit.activityState) {
    case 'active':
      const pulse = p.sin((p.frameCount + (spirit.phase || 0)) * 0.1 * (spirit.growth.pulse || 1));
      primaryColor.setAlpha(255);
      p.strokeWeight(2 + pulse * 0.5);
      break;
    case 'idle':
      alpha = 255 * 0.7;
      growthFactor = 0.95;
      p.strokeWeight(1.5);
      break;
    case 'sleep':
      alpha = 255 * 0.4;
      growthFactor = 0.9;
      p.strokeWeight(1);
      break;
  }
  
  primaryColor.setAlpha(alpha);
  p.stroke(primaryColor);
  p.noFill();

  // Procedural vine drawing using bezier curves
  const segments = 5;
  const maxLen = (spirit.size || 50) * growthFactor;

  for (let i = 0; i < segments; i++) {
    const angle = p.noise((spirit.phase || 0) + i * 0.5) * p.TWO_PI * (spirit.growth.branching || 0.5);
    const len = maxLen * (1 - i / segments);

    const x1 = 0;
    const y1 = 0;
    const x2 = p.cos(angle) * len;
    const y2 = p.sin(angle) * len;

    const curl = (spirit.growth.curl || 0.5) * len * 0.5;
    const cp1x = p.cos(angle + p.HALF_PI) * curl;
    const cp1y = p.sin(angle + p.HALF_PI) * curl;
    const cp2x = x2 + p.cos(angle - p.HALF_PI) * curl;
    const cp2y = y2 + p.sin(angle - p.HALF_PI) * curl;

    p.bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2);
    p.translate(x2, y2);
    p.rotate(angle * 0.1);
  }

  p.pop();
};
