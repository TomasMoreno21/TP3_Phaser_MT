class GeneradorTexturas {
  static asegurar(scene) {
    if (scene.textures.exists('bomberoBody')) return;

    const g = scene.add.graphics();
    g.fillStyle(0xCC0000, 1);
    g.fillTriangle(18, 2, 8, 18, 28, 18);
    g.fillStyle(0xE8B800, 1);
    g.fillRect(8, 18, 20, 34);
    g.fillStyle(0xFFFFFF, 1);
    g.fillRect(12, 10, 3, 3);
    g.fillRect(19, 10, 3, 3);
    g.generateTexture('bomberoBody', 36, 52);
    g.clear();
    g.fillStyle(0x33cc33, 1);
    g.fillRect(0, 0, 32, 64);
    g.generateTexture('civilBody', 32, 64);
    g.clear();
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 32, 48);
    g.generateTexture('enemigoBody', 32, 48);
    g.destroy();
  }
}
