/* eslint-disable prettier/prettier */
import { Container, Graphics } from "pixi.js";

export default class Panel extends Container {
    constructor(label, color, panelX, panelY, panelWidth, panelHeight) {
        super();
        this.label = label;
        this.panel = new Graphics().rect(0, 0, panelWidth, panelHeight).fill(color);
        this.pivot.set(0.5);
        this.panel.pivot.set(0.5);
        this.panel.x = panelX;
        this.panel.y = panelY;
        this.addChild(this.panel);
    }

    resize(ratio) {
        this.panel.scale.set(ratio);
        this.scale.set(ratio);
    }
}