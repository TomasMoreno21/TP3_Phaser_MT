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
  loseLife() { this.lives--; },
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
