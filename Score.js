export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highscore";

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 15 * this.scaleRatio;
    this.ctx.font = `${fontSize}px Verdana`;
    this.ctx.fillStyle = "ForestGreen";
    const scoreX = this.canvas.width - 100 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePad = Math.floor(this.score).toString().padStart(4, 0);
    const highScorePad = highScore.toString().padStart(4, 0);

    this.ctx.fillText(scorePad, scoreX, y);
    this.ctx.fillText(`Topp: ${highScorePad}`, highScoreX, y);
  }

  // clearHighScore() {
  //   localStorage.removeItem("highScore");
  // }
}
