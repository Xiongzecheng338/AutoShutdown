import { gameManager, GAME_EVENTS } from '../games/index.js';
import { eventBus } from '../core/events.js';
import { showToast } from '../modules/toast.js';

let currentGameModal = null;
let currentGameInstance = null;

const gameTemplates = [
  {
    id: 'game-airplane',
    name: '飞机大战',
    category: '游戏',
    icon: 'fa-fighter-jet',
    iconColor: 'terminal-cyan',
    security: 'safe',
    tags: ['射击', '经典', '休闲'],
    description: '经典飞机射击游戏，躲避敌机、收集道具、挑战高分！支持键盘和触屏操作。',
    usage: '方向键/WASD移动，空格键射击，触屏滑动控制。',
    warning: '游戏过程中请勿关闭页面。',
    code: ''
  },
  {
    id: 'game-minesweeper',
    name: '扫雷',
    category: '游戏',
    icon: 'fa-bomb',
    iconColor: 'terminal-red',
    security: 'safe',
    tags: ['益智', '经典', '策略'],
    description: '经典扫雷游戏，三种难度可选，考验你的逻辑推理能力！',
    usage: '左键揭开格子，右键标记地雷。',
    warning: '无特殊注意事项。',
    code: ''
  }
];

const createGameModal = () => {
  const modal = document.createElement('div');
  modal.id = 'gameModal';
  modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/80 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="relative w-full max-w-4xl mx-4 bg-terminal-bg border border-terminal-border rounded-2xl overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-terminal-border">
        <h2 id="gameTitle" class="text-xl font-bold text-white">游戏</h2>
        <div class="flex items-center gap-3">
          <span id="gameScore" class="text-terminal-cyan font-mono">分数: 0</span>
          <button id="closeGameBtn" class="p-2 rounded-lg hover:bg-terminal-surface transition-colors text-gray-400 hover:text-white">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>
      <div class="p-4 flex justify-center bg-terminal-surface/50">
        <canvas id="gameCanvas" class="rounded-lg border border-terminal-border"></canvas>
      </div>
      <div class="p-4 border-t border-terminal-border flex justify-between items-center">
        <div id="gameControls" class="flex gap-2">
          <button id="restartGameBtn" class="px-4 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-terminal-green hover:bg-terminal-green/10 transition-all text-sm font-medium">
            <i class="fas fa-redo mr-2"></i>重新开始
          </button>
        </div>
        <div id="gameDifficulty" class="flex gap-2 hidden">
          <button class="difficulty-btn px-4 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-gray-300 hover:text-white text-sm" data-difficulty="easy">简单</button>
          <button class="difficulty-btn px-4 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-gray-300 hover:text-white text-sm active" data-difficulty="normal">普通</button>
          <button class="difficulty-btn px-4 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-gray-300 hover:text-white text-sm" data-difficulty="hard">困难</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
};

const openGame = (gameId) => {
  const template = gameTemplates.find(g => g.id === gameId);
  if (!template) return;
  
  if (!currentGameModal) {
    currentGameModal = createGameModal();
    setupModalEvents();
  }
  
  document.getElementById('gameTitle').textContent = template.name;
  
  const difficultyContainer = document.getElementById('gameDifficulty');
  if (gameId === 'game-minesweeper') {
    difficultyContainer.classList.remove('hidden');
  } else {
    difficultyContainer.classList.add('hidden');
  }
  
  currentGameModal.classList.remove('hidden');
  currentGameModal.classList.add('flex');
  
  startGame(gameId);
};

const startGame = (gameId, difficulty = 'normal') => {
  const gameName = gameId.replace('game-', '');
  
  if (currentGameInstance) {
    currentGameInstance.stop();
  }
  
  const canvas = document.getElementById('gameCanvas');
  
  if (gameName === 'airplane') {
    canvas.width = 400;
    canvas.height = 600;
    currentGameInstance = gameManager.start('airplane', 'gameCanvas');
    currentGameInstance.init();
    currentGameInstance.start();
  } else if (gameName === 'minesweeper') {
    currentGameInstance = gameManager.start('minesweeper', 'gameCanvas');
    currentGameInstance.init(difficulty);
  }
};

const setupModalEvents = () => {
  document.getElementById('closeGameBtn').addEventListener('click', closeGame);
  document.getElementById('restartGameBtn').addEventListener('click', () => {
    if (currentGameInstance) {
      const gameName = currentGameInstance.constructor.name.toLowerCase().replace('game', '');
      const difficulty = currentGameInstance.difficulty || 'normal';
      startGame(`game-${gameName}`, difficulty);
    }
  });
  
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active', 'text-terminal-cyan'));
      e.target.classList.add('active', 'text-terminal-cyan');
      const difficulty = e.target.dataset.difficulty;
      if (currentGameInstance) {
        startGame('game-minesweeper', difficulty);
      }
    });
  });
  
  currentGameModal.addEventListener('click', (e) => {
    if (e.target === currentGameModal) {
      closeGame();
    }
  });
  
  eventBus.on(GAME_EVENTS.SCORE_UPDATE, ({ score }) => {
    document.getElementById('gameScore').textContent = `分数: ${score}`;
  });
  
  eventBus.on(GAME_EVENTS.GAME_END, ({ score }) => {
    showToast(`游戏结束！最终分数: ${score}`);
  });
};

const closeGame = () => {
  if (currentGameInstance) {
    currentGameInstance.stop();
    currentGameInstance = null;
  }
  if (currentGameModal) {
    currentGameModal.classList.add('hidden');
    currentGameModal.classList.remove('flex');
  }
};

const viewGame = (gameId) => {
  openGame(gameId);
};

export { gameTemplates, viewGame, closeGame, openGame };
export default { gameTemplates, viewGame, closeGame, openGame };
