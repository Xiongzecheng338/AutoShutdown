import { AirplaneGame } from './airplane-game.js';
import { MinesweeperGame } from './minesweeper-game.js';
import { GAME_CONFIG, GAME_EVENTS } from './game-base.js';
import { eventBus } from '../core/events.js';

class GameManager {
  constructor() {
    this.games = new Map();
    this.currentGame = null;
    this.highScores = this.loadHighScores();
  }

  register(name, GameClass) {
    this.games.set(name, GameClass);
  }

  loadHighScores() {
    try {
      return JSON.parse(localStorage.getItem(GAME_CONFIG.STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  saveHighScore(gameName, score) {
    if (!this.highScores[gameName]) {
      this.highScores[gameName] = [];
    }
    this.highScores[gameName].push({
      score,
      date: new Date().toISOString()
    });
    this.highScores[gameName].sort((a, b) => b.score - a.score);
    this.highScores[gameName] = this.highScores[gameName].slice(0, 10);
    localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(this.highScores));
  }

  getHighScores(gameName) {
    return this.highScores[gameName] || [];
  }

  start(gameName, canvasId, options = {}) {
    const GameClass = this.games.get(gameName);
    if (!GameClass) {
      console.error(`Game "${gameName}" not found`);
      return null;
    }

    if (this.currentGame) {
      this.currentGame.stop();
    }

    this.currentGame = new GameClass(canvasId);
    
    eventBus.on(GAME_EVENTS.GAME_END, ({ score }) => {
      if (this.currentGame) {
        this.saveHighScore(gameName, score);
      }
    });

    return this.currentGame;
  }

  stop() {
    if (this.currentGame) {
      this.currentGame.stop();
      this.currentGame = null;
    }
  }

  getAvailableGames() {
    return Array.from(this.games.keys());
  }
}

const gameManager = new GameManager();
gameManager.register('airplane', AirplaneGame);
gameManager.register('minesweeper', MinesweeperGame);

export { gameManager, AirplaneGame, MinesweeperGame, GAME_CONFIG, GAME_EVENTS };
export default gameManager;
