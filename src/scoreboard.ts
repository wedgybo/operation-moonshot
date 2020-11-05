import PlayerScore from './playerscore';

export default class ScoreBoard extends Phaser.GameObjects.Container {

    private background: Phaser.GameObjects.Rectangle;
    private economyScore: Phaser.GameObjects.Text;
    private healthScore: Phaser.GameObjects.Text;
    private obedienceScore: Phaser.GameObjects.Text;
    private testingScore: Phaser.GameObjects.Text;

    private resetButton: Phaser.GameObjects.Text;
    private backgroundButton: Phaser.GameObjects.Text;

    private textProperties = {
        color: '#ff00ff'
    };

    constructor ({ scene, x, y, width, height }) {
        super(scene, x, y);
        this.setSize(width, height);

        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0xffffff);
        // this.background.lineWidth = 3;
        // this.background. strokeColor = 0x000000;
        this.background.isStroked = false;
        this.add(this.background);

        this.economyScore = this.scene.add.text(-350, 20, `Economy: ${PlayerScore.economy}`, this.textProperties);
        this.healthScore = this.scene.add.text(-200, 20, `Health: ${PlayerScore.health}`, this.textProperties);
        this.obedienceScore = this.scene.add.text(-50, 20, `Obedience ${PlayerScore.obedience}`, this.textProperties);
        this.testingScore = this.scene.add.text(100, 20, `Testing: ${PlayerScore.testing}`, this.textProperties);

        this.resetButton = this.scene.add.text(300, 10, 'Reset', { color: '#0000000' })
        .setInteractive()
        .on('pointerdown', () => {
            console.log('Reset clicked');
        })
        .on('pointerup', () => {
            PlayerScore.emit('reset');
        });

        this.backgroundButton = this.scene.add.text(300, 30, 'Switch Background', { color: '#0000000' })
        .setInteractive()
        .on('pointerdown', () => {
            console.log('Background clicked');
        })
        .on('pointerup', () => {
            const randomBackground = 'background-white-house';
            PlayerScore.emit('changebackground', randomBackground);
        });

        this.add(this.economyScore);
        this.add(this.healthScore);
        this.add(this.obedienceScore);
        this.add(this.testingScore);

        this.add(this.resetButton);
        this.add(this.backgroundButton);

        PlayerScore.on('scoreupdate', this.updateScores.bind(this));
        this.scene.add.existing(this);
    }

    public updateScores (decision) {
        console.log('Updating scores', decision, this.economyScore);
        this.economyScore.setText(`Economy: ${PlayerScore.economy}`);
        this.healthScore.setText(`Health: ${PlayerScore.health}`);
        this.obedienceScore.setText(`Obedience: ${PlayerScore.obedience}`);
        this.testingScore.setText(`Testing: ${PlayerScore.testing}`);
    }
}