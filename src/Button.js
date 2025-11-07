/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Graphics, Text } from "pixi.js";
import { gameConfig } from "./gameConfig.js";

export default class Button extends Graphics {
    constructor(name, x, y, buttonWidth, buttonHeight, color, radius) {
        super();
        this.buttonName = name;
        this.x = x;
        this.y = y;
        this.interactive = true;
        if (radius) {
            this.roundRect(0, 0, buttonWidth, buttonHeight, radius).fill(color);
            this.buttonText = new Text(this.buttonName, gameConfig.textStyle);
            this.buttonText.x = buttonWidth / 2;
            this.buttonText.y = buttonHeight / 2;
        } else {
            this.ellipse(0, 0, buttonWidth, buttonHeight).fill(color);
            this.buttonText = new Text(this.buttonName, gameConfig.signStyle);
            this.buttonText.x = buttonWidth / 2 - this.buttonText.width / 2 + 3;
            this.buttonText.y = buttonHeight / 2 - this.buttonText.height / 2 + 6;
        }
        this.buttonText.anchor.set(0.5);
        this.addChild(this.buttonText);
    }

    resize(ratio) {
        this.scale.set(ratio);
        this.buttonText.scale.set(ratio);
    }

    onButtonClick() {
        this.alpha = 0.5;
        this.buttonText.alpha = 0.75;
    }

    reset() {
        this.alpha = 1;
        this.buttonText.alpha = 1;
    }
}