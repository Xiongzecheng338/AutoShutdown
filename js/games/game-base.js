export const GAME_CONFIG = {
  STORAGE_KEY: 'autobat_games',
  MAX_HIGH_SCORES: 10,
  DEFAULT_DIFFICULTY: 'normal'
};

export const GAME_EVENTS = {
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  SCORE_UPDATE: 'game:score',
  LEVEL_UP: 'game:levelup',
  HIGH_SCORE: 'game:highscore'
};

class GameBase {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.config = config;
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.level = 1;
    this.animationId = null;
    this.lastTime = 0;
    this.deltaTime = 0;
  }

  init() {
    this.score = 0;
    this.level = 1;
    this.isRunning = false;
    this.isPaused = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  gameLoop() {
    if (!this.isRunning || this.isPaused) return;
    
    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(this.deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  update(dt) {}
  render() {}

  addScore(points) {
    this.score += points;
  }

  saveHighScore() {
    const scores = this.getHighScores();
    scores.push({ score: this.score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, GAME_CONFIG.MAX_HIGH_SCORES);
    localStorage.setItem(`${GAME_CONFIG.STORAGE_KEY}_${this.constructor.name}`, JSON.stringify(topScores));
  }

  getHighScores() {
    try {
      return JSON.parse(localStorage.getItem(`${GAME_CONFIG.STORAGE_KEY}_${this.constructor.name}`)) || [];
    } catch {
      return [];
    }
  }
}

export { GameBase };
export default { GAME_CONFIG, GAME_EVENTS, GameBase };
