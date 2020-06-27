import { Toasty } from "./objects/Toasty";
import { Hill } from "./objects/Hill";
import { Coin } from "./objects/Coin";
import { EventsManager } from "./EventsManager";
/**
 * InteractiveManager controls the interactive game objects and player interaction.
 * The core game logic is controlled from here
 */
export class InteractiveManager {
    private static readonly LEFTBOUNDS = -150;
    private static readonly RIGHTBOUNDS = 2000;
    private static readonly TOPBOUNDS = -200;
    private static readonly BOTTOMBOUNDS = 1300;

    private scene: Phaser.Scene;
    private maxScore: number;
    private currentScore: number;
    private toasty: Toasty;

    /**
     * Adds the interactive objects to the scene
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.setupAnimations(scene);
        this.setupCamera(scene);
        scene.matter.world.setBounds(
            InteractiveManager.LEFTBOUNDS,
            InteractiveManager.TOPBOUNDS,
            InteractiveManager.RIGHTBOUNDS,
            InteractiveManager.BOTTOMBOUNDS,
        );

        this.maxScore = 0;
        this.currentScore = 0;

        EventsManager.on("maxscore", this.handleMaxScore, this);
        EventsManager.on("collection", this.handleCollection, this);

        this.toasty = new Toasty(scene, scene.sys.canvas.width / 2, scene.sys.canvas.height / 3);

        this.createCoinRow(scene, 3, 200, 300);
        this.createCoinRow(scene, 3, 1400, 300);

        new Hill(scene);
    }

    /**
     * The main update loop for the scene.
     */
    public update(): void {
        this.toasty.update();
    }

    /**
     * Keeps track of the maximum score
     *
     * @param amount - the change in maximum score
     */
    private handleMaxScore(amount: number): void {
        this.maxScore += amount;
    }

    /**
     * Keeps track of score changes. Ends the game when the current score
     * reaches the maximum score.
     *
     * @param amount - the amount of score collected
     */
    private handleCollection(amount: number): void {
        this.currentScore += amount;
        if (this.currentScore >= this.maxScore) {
            EventsManager.removeAllListeners();
            this.scene.scene.start("Credits");
        }

        EventsManager.emit("scoreChange", this.currentScore);
    }

    /**
     * Setups the camera
     */
    private setupCamera(scene: Phaser.Scene): void {
        scene.cameras.main.setBackgroundColor(new Phaser.Display.Color(207, 239, 252).color);
        scene.cameras.main.setZoom(1.2);
        scene.cameras.main.setBounds(
            InteractiveManager.LEFTBOUNDS,
            InteractiveManager.TOPBOUNDS,
            InteractiveManager.RIGHTBOUNDS,
            InteractiveManager.BOTTOMBOUNDS,
        ); // Stops the camera moving off the edge of the screen
    }

    /**
     * Sets up the animations for game objects so that they are only created once
     *
     * @param scene - the scene to add the animation to
     */
    private setupAnimations(scene: Phaser.Scene): void {
        scene.anims.create({
            frameRate: 10,
            frames: scene.anims.generateFrameNames("sprites", {
                start: 1,
                end: 6,
                prefix: "gold_",
            }),

            key: "coinSpin",
            repeat: -1,
        });
    }

    /**
     * Creates a row of coins in a location
     *
     * @param scene - the scene to add the coins to
     * @param amount - the number of coins to add
     * @param x - the x position of the first coin
     * @param y - the y position for the coins
     */
    private createCoinRow(scene: Phaser.Scene, amount: number, x: number, y: number): void {
        for (let i = 0; i < amount; i++) {
            new Coin(scene, x, i, y);
        }
        EventsManager.emit("maxscore", amount);
    }
}