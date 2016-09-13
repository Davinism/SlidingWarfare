class RigidObject {
  constructor(options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
    this.height = options.height;
    this.width = options.width;

    this.draw = this.draw.bind(this);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}

module.exports = RigidObject;
