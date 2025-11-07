/* eslint-disable prettier/prettier */
import { Graphics } from "pixi.js";

export default class Player extends Graphics {
    constructor(positionX, positionY, radius, playerColor, trailColor) {
        super();
        this.radius = radius;
        this.playerColor = playerColor;
        this.trailColor = trailColor;
        this.circle(0, 0, this.radius).fill(this.playerColor);
        this.x = positionX;
        this.y = positionY;
        this.trail = new Graphics().moveTo(this.x, this.y).stroke({ width: 2, color: this.trailColor });
    }

    resize(ratio) {
        this.scale.set(ratio);
        this.trail.scale.set(ratio);
    }

    resetPlayer(x, y) {
        this.trail.clear();
        this.position.set(x, y);
        this.trail.moveTo(x, y);
    }
}