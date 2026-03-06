import { GameBase, GAME_CONFIG, GAME_EVENTS } from './game-base.js';
import { eventBus } from '../core/events.js';

class MinesweeperGame extends GameBase {
  constructor(canvasId) {
    super(canvasId, {
      difficulties: {
        easy: { rows: 9, cols: 9, mines: 10 },
        normal: { rows: 16, cols: 16, mines: 40 },
        hard: { rows: 16, cols: 30, mines: 99 }
      }
    });
    
    this.difficulty = 'normal';
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.rows = 0;
    this.cols = 0;
    this.mines = 0;
    this.minesLeft = 0;
    this.gameOver = false;
    this.gameWon = false;
    this.firstClick = true;
    this.timer = 0;
    this.timerInterval = null;
    this.cellSize = 30;
  }

  init(difficulty = 'normal') {
    super.init();
    this.difficulty = difficulty;
    const config = this.config.difficulties[difficulty];
    this.rows = config.rows;
    this.cols = config.cols;
    this.mines = config.mines;
    this.minesLeft = config.mines;
    this.gameOver = false;
    this.gameWon = false;
    this.firstClick = true;
    this.timer = 0;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize + 50;
    
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      this.revealed[r] = [];
      this.flagged[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = 0;
        this.revealed[r][c] = false;
        this.flagged[r][c] = false;
      }
    }
    
    this.bindEvents();
    this.render();
    eventBus.emit(GAME_EVENTS.GAME_START, { game: 'MinesweeperGame', difficulty });
  }

  bindEvents() {
    this.clickHandler = (e) => this.handleClick(e);
    this.contextMenuHandler = (e) => this.handleRightClick(e);
    
    this.canvas.addEventListener('click', this.clickHandler);
    this.canvas.addEventListener('contextmenu', this.contextMenuHandler);
    
    this.touchHandler = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      if (y < 50) return;
      
      const col = Math.floor(x / this.cellSize);
      const row = Math.floor((y - 50) / this.cellSize);
      
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        if (!this.flagged[row][col] && !this.revealed[row][col]) {
          this.reveal(row, col);
        }
      }
    };
    
    this.longPressHandler = null;
    let pressTimer;
    this.canvas.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        this.handleRightClick(e);
      }, 500);
    });
    this.canvas.addEventListener('touchend', () => clearTimeout(pressTimer));
    this.canvas.addEventListener('touchmove', () => clearTimeout(pressTimer));
  }

  unbindEvents() {
    this.canvas.removeEventListener('click', this.clickHandler);
    this.canvas.removeEventListener('contextmenu', this.contextMenuHandler);
  }

  placeMines(excludeRow, excludeCol) {
    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      
      if (this.grid[r][c] !== -1 && 
          !(Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1)) {
        this.grid[r][c] = -1;
        placed++;
      }
    }
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] !== -1) {
          this.grid[r][c] = this.countAdjacentMines(r, c);
        }
      }
    }
  }

  countAdjacentMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          if (this.grid[nr][nc] === -1) count++;
        }
      }
    }
    return count;
  }

  handleClick(e) {
    if (this.gameOver || this.gameWon) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (y < 50) return;
    
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor((y - 50) / this.cellSize);
    
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      if (!this.flagged[row][col] && !this.revealed[row][col]) {
        this.reveal(row, col);
      }
    }
  }

  handleRightClick(e) {
    e.preventDefault();
    if (this.gameOver || this.gameWon) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (y < 50) return;
    
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor((y - 50) / this.cellSize);
    
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      if (!this.revealed[row][col]) {
        this.flagged[row][col] = !this.flagged[row][col];
        this.minesLeft += this.flagged[row][col] ? -1 : 1;
        this.render();
      }
    }
  }

  reveal(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
    if (this.revealed[row][col] || this.flagged[row][col]) return;
    
    if (this.firstClick) {
      this.firstClick = false;
      this.placeMines(row, col);
      this.startTimer();
    }
    
    this.revealed[row][col] = true;
    
    if (this.grid[row][col] === -1) {
      this.endGame(false);
      return;
    }
    
    this.addScore(1);
    eventBus.emit(GAME_EVENTS.SCORE_UPDATE, { score: this.score });
    
    if (this.grid[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          this.reveal(row + dr, col + dc);
        }
      }
    }
    
    this.checkWin();
    this.render();
  }

  checkWin() {
    let unrevealed = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.revealed[r][c] && this.grid[r][c] !== -1) {
          unrevealed++;
        }
      }
    }
    
    if (unrevealed === 0) {
      this.endGame(true);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.render();
    }, 1000);
  }

  endGame(won) {
    this.gameOver = !won;
    this.gameWon = won;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    if (won) {
      this.addScore(this.mines * 10);
      this.saveHighScore();
    }
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === -1) {
          this.revealed[r][c] = true;
        }
      }
    }
    
    this.render();
    eventBus.emit(GAME_EVENTS.GAME_END, { won, score: this.score, time: this.timer });
  }

  render() {
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawHeader();
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.drawCell(r, c);
      }
    }
    
    if (this.gameOver || this.gameWon) {
      this.drawEndScreen();
    }
  }

  drawHeader() {
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(0, 0, this.canvas.width, 50);
    
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = 'bold 24px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`💣 ${String(this.minesLeft).padStart(3, '0')}`, 10, 35);
    
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`⏱ ${String(this.timer).padStart(3, '0')}`, this.canvas.width - 10, 35);
    
    this.ctx.textAlign = 'center';
    const emoji = this.gameOver ? '😵' : this.gameWon ? '😎' : '🙂';
    this.ctx.font = '28px Arial';
    this.ctx.fillText(emoji, this.canvas.width / 2, 38);
  }

  drawCell(row, col) {
    const x = col * this.cellSize;
    const y = row * this.cellSize + 50;
    const size = this.cellSize - 2;
    
    if (this.revealed[row][col]) {
      if (this.grid[row][col] === -1) {
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(x + 1, y + 1, size, size);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('💣', x + this.cellSize / 2, y + this.cellSize / 2);
      } else {
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(x + 1, y + 1, size, size);
        
        if (this.grid[row][col] > 0) {
          const colors = ['', '#3b82f6', '#22c55e', '#ef4444', '#1e40af', '#7c2d12', '#06b6d4', '#000000', '#64748b'];
          this.ctx.fillStyle = colors[this.grid[row][col]];
          this.ctx.font = 'bold 18px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(this.grid[row][col], x + this.cellSize / 2, y + this.cellSize / 2);
        }
      }
    } else {
      const gradient = this.ctx.createLinearGradient(x, y, x, y + size);
      gradient.addColorStop(0, '#64748b');
      gradient.addColorStop(1, '#475569');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + 1, y + 1, size, size);
      
      this.ctx.strokeStyle = '#94a3b8';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x + 2, y + 2, size - 2, size - 2);
      
      if (this.flagged[row][col]) {
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🚩', x + this.cellSize / 2, y + this.cellSize / 2);
      }
    }
  }

  drawEndScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 50, this.canvas.width, this.rows * this.cellSize);
    
    this.ctx.fillStyle = this.gameWon ? '#22c55e' : '#ef4444';
    this.ctx.font = 'bold 28px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.gameWon ? '🎉 胜利!' : '💥 游戏结束', this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`用时: ${this.timer}秒  |  分数: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 35);
  }

  stop() {
    super.stop();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.unbindEvents();
  }
}

export { MinesweeperGame };
export default MinesweeperGame;
