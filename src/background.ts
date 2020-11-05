import PlayerScore from "./playerscore";

export default class Background extends Phaser.GameObjects.Container {

    private backgroundImage: Phaser.GameObjects.Image;

    constructor ({ scene, x, y, width, height }) {
        super(scene, width / 2, height / 3);
        this.setSize(width, height);

        this.backgroundImage = new Phaser.GameObjects.Image(this.scene, x, y, 'background-default');
        this.backgroundImage.setScale(0.5);
        this.add(this.backgroundImage);
        console.log('Background', width, height, this.backgroundImage.texture);
        PlayerScore.on('changebackground', (background) => {
            console.log('Changing background', background);
            const timeline = this.scene.tweens.createTimeline();

            timeline.add({
                targets: this,
                duration: 150,
                ease: 'Linear',
                alpha: 0.01,
                onComplete: () => {
                    this.backgroundImage.setTexture(`background-${background}`);
                }
            });
            timeline.add({
                targets: this,
                duration: 150,
                ease: 'Linear',
                alpha: 1
            });
            timeline.play();
        });

        this.scene.add.existing(this);
    }
}