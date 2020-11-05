import 'phaser';
import PlayerScore from './playerscore';

export default class Card extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Graphics;
    private leftMessage: Phaser.GameObjects.Text;
    private rightMessage: Phaser.GameObjects.Text;
    private debugMessage: Phaser.GameObjects.Text;
    private image: Phaser.GameObjects.Image;
    private card;
    private deck;
    private activateLeft: boolean;
    private activateRight: boolean;

    private audioTurnCard: Phaser.Sound.BaseSound;
    private audioCharacter: Phaser.Sound.BaseSound;

    private dragLimit: number = 150;

    constructor({ scene, x, y, card, deck }) {
        super(scene, -320, -320);
        this.card = card;
        this.deck = deck;
        this.name = card.id;
        const width = 320;
        const height = 320;
        this.setSize(width, height);

        this.setInteractive();

        this.scene.input.setDraggable(this);

        // Setup card flip audio
        this.audioTurnCard = this.scene.sound.add('shuffle');
        const audioMarker: Phaser.Types.Sound.SoundMarker = {
            name: 'card-flip',
            start: 1.5,
            duration: 600
        };
        this.audioTurnCard.addMarker(audioMarker);

        // Setup character audio
        this.audioCharacter = this.scene.sound.add('grumbling');

        this.on('drag', (pointer, x: number, y: number) => {
            let deltaX = this.input.dragStartX - x;
            let deltaY = this.input.dragStartY - y;

            if (deltaX < this.dragLimit && deltaX > -this.dragLimit) {
                this.x = x;
            }

            if (deltaY < this.dragLimit && deltaY > -this.dragLimit) {
                this.y = y;
            }

            if (deltaX > 100) {
                this.activateRight = true;
                this.leftMessage.setVisible(true);
            } else {
                this.activateRight = false;
                this.leftMessage.setVisible(false);
            }

            if (deltaX < -100) {
                this.activateLeft = true;
                this.rightMessage.setVisible(true);
            } else {
                this.activateLeft = false;
                this.rightMessage.setVisible(false);
            }

            // console.log('Drag card', this.input.dragStartX, this.input.dragStartY, this.x, this.y, x, y, deltaX, this.dragLimit);
        });

        this.on('dragend', (pointer, card, dropped, drop, tesst) => {
            console.log('Drag end', card, dropped, drop, tesst);

            if (this.activateRight) {
                this.scene.tweens.add({
                    targets: this,
                    duration: 300,
                    angle: -90,
                    ease: 'easeOut',
                    y: this.y + 500,
                    x: this.x - 50
                });
                this.rightDecision();
            } else if(this.activateLeft) {
                this.scene.tweens.add({
                    targets: this,
                    duration: 300,
                    angle: 90,
                    ease: 'easeOut',
                    y: this.y + 500,
                    x: this.x + 50
                });
                this.leftDecision();
            } else {
                this.scene.tweens.add({
                    targets: this,
                    duration: 150,
                    ease: 'easeIn',
                    x: this.input.dragStartX,
                    y: this.input.dragStartY
                });
                this.noDecision();
            }
        });

        this.background = new Phaser.GameObjects.Graphics(this.scene);
        this.background.lineStyle(2, 0x000000, 1);
        this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

        console.log('Loading image', card.character);

        this.image = this.scene.add.image(0, 0, `back`)
            .setSize(320, 320)
            .setScale(0.5);
        deck.setMessage(card.message);

        this.leftMessage = new Phaser.GameObjects.Text(this.scene, -(width / 2), -(height / 2), card.leftDecision.message, {
            backgroundColor: '#000000',
            color: '#ffffff',
        });
        this.leftMessage.setVisible(false);

        this.rightMessage = new Phaser.GameObjects.Text(this.scene, 50, -(height / 2), card.rightDecision.message, {
            backgroundColor: '#000000',
            color: '#ffffff',
        });
        this.rightMessage.setVisible(false);

        this.debugMessage = new Phaser.GameObjects.Text(this.scene, 50, 140, card.id, {
            backgroundColor: '#000000',
            color: '#ffffff'
        });


        this.add(this.image);
        this.add(this.leftMessage);
        this.add(this.rightMessage);
        this.add(this.debugMessage);
        this.add(this.background);

        this.scene.tweens.add({
            targets: this,
            duration: 300,
            ease: 'Linear',
            x, y
        });

        this.on('destroy', () => {
            this.audioTurnCard.stop();
            this.audioCharacter.stop();
        })
        // Add this card to the scene
        this.scene.add.existing(this);
    }

    public getMessage() {
        return this.card.message;
    }

    public leftDecision() {
        console.log('Left');
        PlayerScore.applyDesicion(this.card.leftDecision);
        this.deck.popCard();
    }

    public rightDecision() {
        console.log('Right');
        PlayerScore.applyDesicion(this.card.rightDecision);
        this.deck.popCard();
    }

    public noDecision() {
        console.log('No decision');
    }

    public setActiveCard(active: boolean) {


        const timeline = this.scene.tweens.createTimeline();
        this.audioTurnCard.play('card-flip');
        timeline.add({
            targets: this,
            duration: 150,
            ease: 'Linear',
            scaleX: 0.01,
            onComplete: (tween, targets) => {
                console.log('Change card', tween, targets);
                this.image.setTexture(`character-${targets[0].card.character}`);
                PlayerScore.emit('changebackground', targets[0].card.background);
            }
        });
        timeline.add({
            targets: this,
            duration: 150,
            ease: 'Linear',
            scaleX: 1,
            onComplete: () => {
                this.audioCharacter.play();
            }
        });
        timeline.play();
    }
}