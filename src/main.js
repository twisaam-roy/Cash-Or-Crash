/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Application, Container, Graphics, Text } from "pixi.js";
import { gameConfig } from "./gameConfig.js";
import Panel from "./panel.js";
import Player from "./player.js";
import Button from "./Button.js";

(async () => {
  // Create a new application
  const app = new Application();
  globalThis.__PIXI_APP__ = app;

  // Initialize the application
  await app.init({ background: "#ffd883ff", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);

  //game properties
  let multiplier = 1.0;
  let bet = 100;
  let result = "";
  let crashPoint = Math.random() * 3 + 1.5; //random crashPoint vetween 1.5 to 4.5
  let gameState = gameConfig.gameState.IDLE; // IDLE, RUNNING, ENDED
  let gameStatus = "Status: " + gameState;
  let gameResult = false;

  //curve points
  const startPoint = { x: 25, y: app.screen.height - 100 };
  let controlPoint = {
    x: Math.random() < 0.5 ? app.screen.width - 50 : app.screen.width + 50,
    y: Math.random() < 0.5 ? app.screen.height - 75 : app.screen.height - 25,
  };
  const endPoint = { x: app.screen.width - 25, y: 100 };

  //game stat board
  const gameStatsBoard = new Panel("top panel", "#ffa12dff", 0, 0, app.screen.width, 75);
  let multiplierText = new Text(
    "Multiplier: " + multiplier.toFixed(2) + "x",
    gameConfig.textStyle,
  );
  multiplierText.x = 10;
  multiplierText.y = 25;
  let betText = new Text("Bet: $" + bet.toFixed(2), gameConfig.textStyle);
  betText.x = app.screen.width / 2 - betText.width / 2 - 25;
  betText.y = 25;

  let gameStatusText = new Text(gameStatus, gameConfig.textStyle);
  gameStatusText.x = app.screen.width - gameStatusText.width - 50;
  gameStatusText.y = 25;

  let betIncreaseButton = new Button("+", betText.x + 140, betText.y + 10, 12, 18, "#d0def5ff");
  let betDecreaseButton = new Button("-", betText.x + 180, betText.y + 10, 12, 18, "#d0def5ff");
  gameStatsBoard.addChild(multiplierText, betText, betIncreaseButton, betDecreaseButton, gameStatusText);


  //game control panel
  const gameControlBoard = new Panel("bottom panel", "#ffa12dff", 0, app.screen.height - 75, app.screen.width, 75);
  let startGameButton = new Button("START GAME", 5, app.screen.height - gameControlBoard.height / 2 - 10, 150, 25, "#7aff3cff", 15);
  let cashOutButton = new Button("CASH OUT", app.screen.width / 2 - 100, app.screen.height - gameControlBoard.height / 2 - 10, 150, 25, "#7aff3cff", 15);
  let resetGameButton = new Button("RESET GAME", app.screen.width - 170, app.screen.height - gameControlBoard.height / 2 - 10, 150, 25, "#7aff3cff", 15);
  gameControlBoard.addChild(startGameButton, cashOutButton, resetGameButton);

  //game area panel
  const gameArea = new Panel("middle pannel", "#fbdea1ff", 0, 76, app.screen.width, app.screen.height - (gameStatsBoard.height + gameControlBoard.height));
  let player = new Player(startPoint.x, startPoint.y, 10, "red", "#02ccdaff");
  let animate = 0;
  const duration = 4000; // duration of the animation in milliseconds
  let resultText = new Text(result, gameConfig.resultStyle);
  resultText.x = app.screen.width / 2 - resultText.width / 2;
  resultText.y = app.screen.height / 2 - resultText.height / 2;
  resultText.scale.set(0.5);
  resultText.anchor.set(0.5);
  resultText.alpha = 0;
  resultText.visible = false;
  gameArea.addChild(player.trail, player, resultText);

  //mouse,pen,touch button click controls all together using pointerdown
  betIncreaseButton.on("pointerdown", () => {
    if (gameState === gameConfig.gameState.IDLE) {
      bet += 50;
      betText.text = "Bet: $" + bet.toFixed(2);
    }
  });
  betDecreaseButton.on("pointerdown", () => {
    if (gameState === gameConfig.gameState.IDLE) {
      bet -= bet > 0 ? 50 : bet;
      betText.text = "Bet: $" + bet.toFixed(2);
    }
  });

  startGameButton.on("pointerdown", () => {
    if (gameState === gameConfig.gameState.IDLE) {
      gameState = gameConfig.gameState.RUNNING;
      gameStatus = "Status: " + gameState;
      gameStatusText.text = gameStatus;
      startGameButton.onButtonClick();
    }
  });

  cashOutButton.on("pointerdown", () => {
    if (gameState === gameConfig.gameState.RUNNING) {
      gameState = gameConfig.gameState.ENDED;
      gameStatus = "Status: " + gameState;
      gameResult = true;
      resultText.alpha = 1;
      resultText.visible = true;
      gameStatusText.text = gameStatus;
      cashOutButton.onButtonClick();
    }
  });
  resetGameButton.on("pointerdown", () => {
    if (gameState === gameConfig.gameState.ENDED || gameState === gameConfig.gameState.RUNNING) {
      resetGameButton.onButtonClick();
      clearTimeout();
      gameState = gameConfig.gameState.IDLE;
      gameStatus = "Status: " + gameState;
      gameStatusText.text = gameStatus;
      gameResult = false;
      startGameButton.reset();
      cashOutButton.reset();
      multiplier = 1.0;
      multiplierText.text = "Multiplier: " + multiplier.toFixed(2) + "x";
      bet = 100;
      betText.text = "Bet: $" + bet.toFixed(2);
      resultText.alpha = 0;
      resultText.visible = false;
      resultText.scale.set(0.5);
      player.resetPlayer(startPoint.x, startPoint.y);
      controlPoint = {
        x: Math.random() < 0.5 ? app.screen.width - 50 : app.screen.width + 50,
        y:
          Math.random() < 0.5 ? app.screen.height - 75 : app.screen.height - 25,
      };
      animate = 0;
      crashPoint = Math.random() * 3 + 1.5; //random crashPoint vetween 1.5 to 4.5
      setTimeout(() => {
        resetGameButton.reset();
      }, 500);
    }
  });

  app.stage.addChild(gameStatsBoard, gameControlBoard, gameArea);

  // // Listen for animate update
  app.ticker.add((time) => {
    if (gameState === gameConfig.gameState.RUNNING) {
      multiplier += 0.05;
      multiplierText.text = "Multiplier: " + multiplier.toFixed(2) + "x";
      animate += (time.elapsedMS - time.deltaTime) / duration;

      // Reverse the animation direction for a smoother loop
      let progress = animate < 0.5 ? animate * 2 : animate * -2;

      // Calculate the current position using the quadratic Bezier formula
      // (1-p)^2 * P0 + 2*(1-p)*p * P1 + p^2 * P2
      let x =
        Math.pow(1 - progress, 2) * startPoint.x +
        2 * (1 - progress) * progress * controlPoint.x +
        Math.pow(progress, 2) * endPoint.x;

      let y =
        Math.pow(1 - progress, 2) * startPoint.y +
        2 * (1 - progress) * progress * controlPoint.y +
        Math.pow(progress, 2) * endPoint.y;

      if (
        (x <= endPoint.x && x >= startPoint.x) ||
        (y <= endPoint.y && y >= startPoint.y)
      ) {
        player.position.set(x, y);
        player.trail
          .quadraticCurveTo(x, y, player.x - 2, player.y - 2)
          .setStrokeStyle({
            width: 3,
            color: "#14e3f2ff",
            cap: "round",
            alpha: 1,
            join: "round",
          })
          .stroke();
      } else if (multiplier >= crashPoint) {
        x = 0;
        y = 0;
        progress = 0;
        gameState = gameConfig.gameState.ENDED;
        gameStatus = "Status: " + gameState;
        gameStatusText.text = gameStatus;
        resultText.alpha = 1;
        resultText.visible = true;
      } else {
        gameState = gameConfig.gameState.ENDED;
        gameStatus = "Status: " + gameState;
        gameStatusText.text = gameStatus;
        resultText.alpha = 1;
        resultText.visible = true;
      }
    }
    if (gameState === gameConfig.gameState.ENDED) {
      if (gameResult) {
        result = "Player Won at: " + (bet * multiplier).toFixed(2) + "$";
        resultText.text = result;
        resultText.style.fill = "#04d700ff";
        if (resultText.scale.x < 1 && resultText.scale.y < 1) {
          resultText.scale.x += 0.01 * time.deltaTime;
          resultText.scale.y += 0.01 * time.deltaTime;
        }
      }
      if (!gameResult) {
        result = "Player crashed at: " + multiplier.toFixed(2) + "x";
        resultText.style.fill = "#de0000fe";
        resultText.text = result;
        if (resultText.scale.x < 1 && resultText.scale.y < 1) {
          resultText.scale.x += 0.01 * time.deltaTime;
          resultText.scale.y += 0.01 * time.deltaTime;
        }
      }
    }
  });
})();