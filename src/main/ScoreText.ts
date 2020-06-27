/**
 * Score text is the text object which displays the score on the screne
 */
export class ScoreText {
    public text: Phaser.GameObjects.Text;

    /**
     * Creates the score text in a fixed location relative to the screen
     *
     * @param scene - the scene to add the score text to
     * @param x - the x position to create the score text at
     * @param y - the y position to create the score text at
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.text = scene.add.text(x, y, "", {
            fontFamily: "Chewy",
            fontSize: 100,
            color: "#EB4786",
        });

        this.text.setAlign("left");
        this.text.setOrigin(0, 0);
        this.text.setScrollFactor(0, 0);
    }

    /**
     * Updates score text to display a new value
     *
     * @param score - the new score to show
     */
    public update(score: number): void {
        this.text.setText(`Score: ${score}`);
    }
}