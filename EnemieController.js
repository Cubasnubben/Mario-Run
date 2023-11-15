import Danger from "./Danger.js";

export default class EnemieController {
  ENEMIES_INTERVAL_MIN = 500;
  ENEMIES_INTERVAL_MAX = 1800;

  nextEnemiesInterval = null;
  enemie = [];

  constructor(ctx, enemieImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.enemieImages = enemieImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextEnemiesTime();
  }

  setNextEnemiesTime() {
    const num = this.getRandomNumber(
      this.ENEMIES_INTERVAL_MIN,
      this.ENEMIES_INTERVAL_MAX,
    );

    this.nextEnemiesInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createEnemies() {
    const index = this.getRandomNumber(0, this.enemieImages.length - 1);
    const enemiesImage = this.enemieImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - enemiesImage.height;
    const danger = new Danger(
      this.ctx,
      x,
      y,
      enemiesImage.width,
      enemiesImage.height,
      enemiesImage.image,
    );

    this.enemie.push(danger);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextEnemiesInterval <= 0) {
      this.createEnemies();
      this.setNextEnemiesTime();
    }
    this.nextEnemiesInterval = this.nextEnemiesInterval -= frameTimeDelta;

    this.enemie.forEach((enemies) => {
      enemies.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.enemie = this.enemie.filter((enemies) => enemies.x > -enemies.width);
  }

  draw() {
    this.enemie.forEach((enemies) => enemies.draw());
  }

  collideWith(sprite) {
    return this.enemie.some((enemies) => enemies.collideWith(sprite));
  }

  reset() {
    this.enemie = [];
  }
}
