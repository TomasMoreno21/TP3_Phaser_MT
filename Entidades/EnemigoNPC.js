class EnemigoNPC extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture || null);
    scene.add.existing(this);
  }

  update() {
  }
}
