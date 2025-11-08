
export type Archetype = 'plant' | 'animal' | 'cloud';

export type ActivityState = 'active' | 'idle' | 'sleep';

export interface Growth {
  branching: number;
  curl: number;
  pulse: number;
}

export interface Spirit {
  id: string;
  archetype: Archetype;
  traits: string[];
  colorPalette: string[];
  motionStyle: string;
  growth: Growth;
  activityState: ActivityState;
  // Position and other dynamic properties will be managed by the p5 sketch
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  size?: number;
  phase?: number; // for animation timing
}

export interface WorldState {
  spirits: { [id: string]: Spirit };
}
