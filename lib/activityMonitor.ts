
import { ActivityState } from '../types';

const IDLE_TIMEOUT = 30 * 1000; // 30 seconds
const SLEEP_TIMEOUT = 2 * 60 * 1000; // 2 minutes

export class ActivityMonitor {
  private idleTimer: number | null = null;
  private sleepTimer: number | null = null;
  private currentState: ActivityState = 'active';
  private onStateChange: (state: ActivityState) => void;

  constructor(onStateChange: (state: ActivityState) => void) {
    this.onStateChange = onStateChange;
  }

  public start() {
    this.resetTimers();
    window.addEventListener('mousemove', this.handleActivity);
    window.addEventListener('keydown', this.handleActivity);
    window.addEventListener('mousedown', this.handleActivity);
    window.addEventListener('scroll', this.handleActivity);
  }

  public stop() {
    this.clearTimers();
    window.removeEventListener('mousemove', this.handleActivity);
    window.removeEventListener('keydown', this.handleActivity);
    window.removeEventListener('mousedown', this.handleActivity);
    window.removeEventListener('scroll', this.handleActivity);
  }

  private handleActivity = () => {
    if (this.currentState !== 'active') {
      this.setState('active');
    }
    this.resetTimers();
  };

  private setState(newState: ActivityState) {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.onStateChange(newState);
    }
  }

  private clearTimers() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.sleepTimer) clearTimeout(this.sleepTimer);
  }

  private resetTimers = () => {
    this.clearTimers();
    this.idleTimer = window.setTimeout(() => this.setState('idle'), IDLE_TIMEOUT);
    this.sleepTimer = window.setTimeout(() => this.setState('sleep'), SLEEP_TIMEOUT);
  };
}
