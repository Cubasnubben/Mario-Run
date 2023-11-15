export default class Ground {
  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.height = height;
    this.speed = speed;
    this.width = width;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    this.y = this.canvas.height - this.height;

    this.groundImage = new Image();
    this.groundImage.src = "images/game.png";
  }

  update(gameSpeed, frameTimeDelta) {
    this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
  }

  draw() {
    this.ctx.drawImage(
      this.groundImage,
      this.x,
      this.y,
      this.width,
      this.height,
    );

    this.ctx.drawImage(
      this.groundImage,
      this.x + this.width,
      this.y,
      this.width,
      this.height,
    );

    if (this.x < -this.width) {
      this.x = 0;
    }
  }
  reset() {
    this.x = 0;
  }
}
