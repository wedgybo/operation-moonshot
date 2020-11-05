import 'phaser';
import Card from './card';
import PlayerScore from './playerscore';

import ScoreBoard from './scoreboard';

export default class Deck extends Phaser.GameObjects.Container {

    private message: Phaser.GameObjects.Text;
    private messageStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private stack: Card[] = [];
    private currentCard: Card;

    constructor({ scene, x, y, width, height }) {
        super(scene, x, y);

        this.setSize(width, height);

        // Message view to display the current cards message
        this.messageStyle = {
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            wordWrap: {
                width: 400
            }
        };

        this.message = this.scene.add.text(0, -150, '', this.messageStyle).setOrigin(0.5);
        this.add(this.message);

        // Add the deck to the scene
        this.scene.add.existing(this);
    }

    public setDeck(data: []) {
        const cards = data.reverse().map(card => new Card({
            scene: this.scene,
            x: this.scene.game.canvas.width / 2,
            y: this.scene.game.canvas.height / 2 + 100,
            card,
            deck: this
        }));

        // Set the current card to the last in the deck
        this.addCards(cards);
        this.setCurrentCard(cards[cards.length - 1]);
    }

    public setCurrentCard(card: Card) {
        this.currentCard = card;
        this.currentCard.setActiveCard(true);
        this.setMessage(this.currentCard.getMessage());

    }

    public setMessage(message: string) {
        this.message.setText(message);
    }

    public addCards(cards: Card[]) {
        this.stack = [...cards, ...this.stack];
        this.scene.sound.play('shuffle');
        PlayerScore.emit('cardsadded', cards);
    }

    public popCard() {
        this.stack.pop();
        this.setCurrentCard(this.stack[this.stack.length - 1]);
    }
}