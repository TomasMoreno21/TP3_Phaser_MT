const gameState = {
  score: 0,
  lives: 3,
  npcsSaved: 0,
  npcsSavedInLevel: 0,
  npcsTotal: 0,
  npcsAddedLevels: [],
  currentLevel: 1,
  oxygen: 100,

  reset() {
    this.score = 0;
    this.lives = 3;
    this.npcsSaved = 0;
    this.npcsSavedInLevel = 0;
    this.npcsTotal = 0;
    this.npcsAddedLevels = [];
    this.currentLevel = 1;
    this.oxygen = 100;
  },

  addScore(points) { this.score += points; },
  loseLife() { this.lives--; this.score = Math.max(0, this.score - 100); },
  saveNPC() { this.npcsSaved++; this.npcsSavedInLevel++; },

  addNpcsFromLevel(count, levelNum) {
    if (!this.npcsAddedLevels.includes(levelNum)) {
      this.npcsTotal += count;
      this.npcsAddedLevels.push(levelNum);
    }
  },

  getStatus() {
    return {
      score: this.score,
      lives: this.lives,
      npcsSaved: this.npcsSaved,
      npcsTotal: this.npcsTotal,
      currentLevel: this.currentLevel
    };
  }
};
