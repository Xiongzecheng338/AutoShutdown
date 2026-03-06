import { GameBase, GAME_CONFIG, GAME_EVENTS } from './game-base.js';
import { eventBus } from '../core/events.js';

class AirplaneGame extends GameBase {
  constructor(canvasId) {
    super(canvasId, {
      playerSpeed: 300,
      bulletSpeed: 500,
      enemySpeed: 150,
      enemySpawnRate: 1.5,
      powerUpChance: 0.1
    });
    
    this.player = null;
    this.bullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.particles = [];
    this.explosions = [];
    this.keys = {};
    this.lastShot = 0;
    this.shootDelay = 200;
    this.enemySpawnTimer = 0;
    this.difficultyMultiplier = 1;
    this.lives = 3;
    this.isInvincible = false;
    this.invincibleTimer = 0;
    this.powerUpType = null;
    this.powerUpTimer = 0;
  }

  init() {
    super.init();
    this.lives = 3;
    this.bullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.particles = [];
    this.explosions = [];
    this.difficultyMultiplier = 1;
    this.isInvincible = false;
    this.powerUpType = null;
    
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 80,
      width: 40,
      height: 40,
      speed: this.config.playerSpeed
    };
    
    this.bindEvents();
    eventBus.emit(GAME_EVENTS.GAME_START, { game: 'AirplaneGame' });
  }

  bindEvents() {
    this.keydownHandler = (e) => {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    this.keyupHandler = (e) => {
      this.keys[e.key] = false;
    };
    
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    
    this.touchStartHandler = (e) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    };
    
    this.touchMoveHandler = (e) => {
      if (!this.touchStartX || !this.touchStartY) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      
      this.player.x += deltaX * 0.5;
      this.player.y += deltaY * 0.5;
      
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      
      e.preventDefault();
    };
    
    this.canvas.addEventListener('touchstart', this.touchStartHandler, { passive: false });
    this.canvas.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
  }

  unbindEvents() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    this.canvas.removeEventListener('touchstart', this.touchStartHandler);
    this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
  }

  update(dt) {
    if (!this.isRunning) return;
    
    this.updatePlayer(dt);
    this.updateBullets(dt);
    this.updateEnemies(dt);
    this.updatePowerUps(dt);
    this.updateParticles(dt);
    this.updateExplosions(dt);
    this.spawnEnemies(dt);
    this.checkCollisions();
    this.updateDifficulty();
    this.updatePowerUp(dt);
    this.updateInvincibility(dt);
  }

  updatePlayer(dt) {
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.x -= this.player.speed * dt;
    }
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.x += this.player.speed * dt;
    }
    if (this.keys['ArrowUp'] || this.keys['w']) {
      this.player.y -= this.player.speed * dt;
    }
    if (this.keys['ArrowDown'] || this.keys['s']) {
      this.player.y += this.player.speed * dt;
    }
    
    this.player.x = Math.max(this.player.width / 2, Math.min(this.canvas.width - this.player.width / 2, this.player.x));
    this.player.y = Math.max(this.player.height / 2, Math.min(this.canvas.height - this.player.height / 2, this.player.y));
    
    if (this.keys[' '] || this.keys['Enter']) {
      this.shoot();
    }
  }

  shoot() {
    const now = Date.now();
    const shootDelay = this.powerUpType === 'rapid' ? this.shootDelay / 3 : this.shootDelay;
    
    if (now - this.lastShot < shootDelay) return;
    this.lastShot = now;
    
    if (this.powerUpType === 'spread') {
      for (let angle = -30; angle <= 30; angle += 15) {
        const rad = angle * Math.PI / 180;
        this.bullets.push({
          x: this.player.x,
          y: this.player.y - this.player.height / 2,
          vx: Math.sin(rad) * this.config.bulletSpeed,
          vy: -Math.cos(rad) * this.config.bulletSpeed,
          width: 4,
          height: 12
        });
      }
    } else {
      this.bullets.push({
        x: this.player.x,
        y: this.player.y - this.player.height / 2,
        vx: 0,
        vy: -this.config.bulletSpeed,
        width: 4,
        height: 12
      });
    }
  }

  updateBullets(dt) {
    this.bullets = this.bullets.filter(bullet => {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      return bullet.y > -20 && bullet.y < this.canvas.height + 20 && 
             bullet.x > -20 && bullet.x < this.canvas.width + 20;
    });
  }

  spawnEnemies(dt) {
    this.enemySpawnTimer += dt;
    const spawnRate = this.config.enemySpawnRate / this.difficultyMultiplier;
    
    if (this.enemySpawnTimer >= spawnRate) {
      this.enemySpawnTimer = 0;
      
      const types = ['basic', 'fast', 'tank'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const enemyConfig = {
        basic: { width: 30, height: 30, hp: 1, speed: 1, score: 10, color: '#ef4444' },
        fast: { width: 25, height: 25, hp: 1, speed: 1.5, score: 20, color: '#f59e0b' },
        tank: { width: 40, height: 40, hp: 3, speed: 0.6, score: 50, color: '#8b5cf6' }
      };
      
      const config = enemyConfig[type];
      
      this.enemies.push({
        x: Math.random() * (this.canvas.width - 60) + 30,
        y: -30,
        width: config.width,
        height: config.height,
        speed: this.config.enemySpeed * config.speed * this.difficultyMultiplier,
        hp: config.hp,
        maxHp: config.hp,
        score: config.score,
        type,
        color: config.color
      });
    }
  }

  updateEnemies(dt) {
    this.enemies = this.enemies.filter(enemy => {
      enemy.y += enemy.speed * dt;
      
      if (enemy.y > this.canvas.height + 50) {
        return false;
      }
      
      return true;
    });
  }

  updatePowerUps(dt) {
    this.powerUps = this.powerUps.filter(powerUp => {
      powerUp.y += 100 * dt;
      return powerUp.y < this.canvas.height + 50;
    });
  }

  updateParticles(dt) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = p.life / p.maxLife;
      return p.life > 0;
    });
  }

  updateExplosions(dt) {
    this.explosions = this.explosions.filter(exp => {
      exp.radius += 200 * dt;
      exp.alpha -= dt * 2;
      return exp.alpha > 0;
    });
  }

  updateDifficulty() {
    this.difficultyMultiplier = 1 + Math.floor(this.score / 500) * 0.1;
    const newLevel = Math.floor(this.score / 500) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      eventBus.emit(GAME_EVENTS.LEVEL_UP, { level: this.level });
    }
  }

  updatePowerUp(dt) {
    if (this.powerUpType) {
      this.powerUpTimer -= dt;
      if (this.powerUpTimer <= 0) {
        this.powerUpType = null;
      }
    }
  }

  updateInvincibility(dt) {
    if (this.isInvincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
      }
    }
  }

  checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (this.collides(bullet, enemy)) {
          this.bullets.splice(i, 1);
          enemy.hp--;
          
          this.createParticles(bullet.x, bullet.y, '#fbbf24', 5);
          
          if (enemy.hp <= 0) {
            this.addScore(enemy.score);
            this.createExplosion(enemy.x, enemy.y, enemy.color);
            this.createParticles(enemy.x, enemy.y, enemy.color, 10);
            
            if (Math.random() < this.config.powerUpChance) {
              this.spawnPowerUp(enemy.x, enemy.y);
            }
            
            this.enemies.splice(j, 1);
            eventBus.emit(GAME_EVENTS.SCORE_UPDATE, { score: this.score });
          }
          break;
        }
      }
    }
    
    if (!this.isInvincible) {
      for (const enemy of this.enemies) {
        if (this.collides(this.player, enemy)) {
          this.lives--;
          this.isInvincible = true;
          this.invincibleTimer = 2;
          this.createExplosion(this.player.x, this.player.y, '#3b82f6');
          
          if (this.lives <= 0) {
            this.gameOver();
            return;
          }
          break;
        }
      }
    }
    
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      if (this.collides(this.player, powerUp)) {
        this.powerUpType = powerUp.type;
        this.powerUpTimer = 5;
        this.powerUps.splice(i, 1);
        this.createParticles(powerUp.x, powerUp.y, '#22c55e', 15);
      }
    }
  }

  collides(a, b) {
    return Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
           Math.abs(a.y - b.y) < (a.height + b.height) / 2;
  }

  createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        alpha: 1,
        size: 2 + Math.random() * 3
      });
    }
  }

  createExplosion(x, y, color) {
    this.explosions.push({
      x, y,
      radius: 5,
      color,
      alpha: 1
    });
  }

  spawnPowerUp(x, y) {
    const types = ['rapid', 'spread', 'shield'];
    this.powerUps.push({
      x, y,
      width: 20,
      height: 20,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }

  render() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawStars();
    this.drawExplosions();
    this.drawParticles();
    this.drawPowerUps();
    this.drawEnemies();
    this.drawBullets();
    this.drawPlayer();
    this.drawUI();
  }

  drawStars() {
    if (!this.stars) {
      this.stars = [];
      for (let i = 0; i < 50; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 50 + 20
        });
      }
    }
    
    this.ctx.fillStyle = '#ffffff';
    for (const star of this.stars) {
      star.y += star.speed * this.deltaTime;
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }
      this.ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    this.ctx.globalAlpha = 1;
  }

  drawPlayer() {
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    
    if (this.isInvincible) {
      this.ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.3;
    }
    
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.player.height / 2);
    this.ctx.lineTo(-this.player.width / 2, this.player.height / 2);
    this.ctx.lineTo(0, this.player.height / 3);
    this.ctx.lineTo(this.player.width / 2, this.player.height / 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.fillStyle = '#60a5fa';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.player.height / 3);
    this.ctx.lineTo(-this.player.width / 4, this.player.height / 4);
    this.ctx.lineTo(this.player.width / 4, this.player.height / 4);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawBullets() {
    this.ctx.fillStyle = '#22c55e';
    for (const bullet of this.bullets) {
      this.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
    }
  }

  drawEnemies() {
    for (const enemy of this.enemies) {
      this.ctx.fillStyle = enemy.color;
      this.ctx.beginPath();
      this.ctx.moveTo(enemy.x, enemy.y + enemy.height / 2);
      this.ctx.lineTo(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
      this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - enemy.height / 2);
      this.ctx.closePath();
      this.ctx.fill();
      
      if (enemy.hp < enemy.maxHp) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(enemy.x - 15, enemy.y - enemy.height / 2 - 8, 30, 4);
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(enemy.x - 15, enemy.y - enemy.height / 2 - 8, 30 * (enemy.hp / enemy.maxHp), 4);
      }
    }
  }

  drawPowerUps() {
    for (const powerUp of this.powerUps) {
      this.ctx.fillStyle = '#22c55e';
      this.ctx.beginPath();
      this.ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const icon = powerUp.type === 'rapid' ? 'R' : powerUp.type === 'spread' ? 'S' : 'H';
      this.ctx.fillText(icon, powerUp.x, powerUp.y);
    }
  }

  drawParticles() {
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  drawExplosions() {
    for (const exp of this.explosions) {
      this.ctx.globalAlpha = exp.alpha;
      this.ctx.strokeStyle = exp.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1;
  }

  drawUI() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`分数: ${this.score}`, 10, 25);
    this.ctx.fillText(`等级: ${this.level}`, 10, 50);
    
    this.ctx.fillText('生命: ', 10, 75);
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.beginPath();
      this.ctx.moveTo(60 + i * 25, 70);
      this.ctx.lineTo(50 + i * 25, 80);
      this.ctx.lineTo(70 + i * 25, 80);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    if (this.powerUpType) {
      this.ctx.fillStyle = '#22c55e';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`道具: ${this.powerUpType} (${Math.ceil(this.powerUpTimer)}s)`, this.canvas.width - 10, 25);
    }
  }

  gameOver() {
    this.stop();
    this.unbindEvents();
    this.saveHighScore();
    eventBus.emit(GAME_EVENTS.GAME_END, { score: this.score, level: this.level });
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`最终分数: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    this.ctx.fillText(`最高等级: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 45);
    
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillText('点击"重新开始"再来一局', this.canvas.width / 2, this.canvas.height / 2 + 90);
  }
}

export { AirplaneGame };
export default AirplaneGame;
