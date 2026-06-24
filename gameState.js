const gameState = {
  score: 0,
  lives: 3,
  npcsSaved: 0,
  currentLevel: 1,
  oxygen: 100,

  reset() {
    this.score = 0;
    this.lives = 3;
    this.npcsSaved = 0;
    this.currentLevel = 1;
    this.oxygen = 100;
  },

  addScore(points) { this.score += points; },
  loseLife() { this.lives--; this.score = Math.max(0, this.score - 100); },
  saveNPC() { this.npcsSaved++; },

  getStatus() {
    return {
      score: this.score,
      lives: this.lives,
      npcsSaved: this.npcsSaved,
      currentLevel: this.currentLevel
    };
  }
};
