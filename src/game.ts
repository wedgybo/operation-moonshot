import 'phaser';

import Card from './card';
import PlayerScore from './playerscore';
import ScoreBoard from './scoreboard';
import Deck from './deck';
import Background from './background';

export default class OperationMoonshot extends Phaser.Scene {
    private scoreboard: ScoreBoard;

    private background: Background;
    private deck: Deck;
    private card: Card;

    private yesZone: Phaser.GameObjects.Zone;
    private noZone: Phaser.GameObjects.Zone;

    constructor() {
        super('demo');
    }

    preload() {

        // Audio
        this.load.audio('theme', 'assets/audio/theme.mp3');
        this.load.audio('shuffle', 'assets/audio/shuffle.mp3');
        this.load.audio('grumbling', 'assets/audio/grumbling.mp3');

        this.load.image('back', 'assets/cards/back.jpg');

        // Characters
        this.load.image('character-boris-johnson', 'assets/characters/boris_johnson.jpg');
        this.load.image('character-dominic-cummings', 'assets/characters/dominic_cummings.jpg');
        this.load.image('character-dominic-rabb', 'assets/characters/dominic_rabb.jpg');
        this.load.image('character-priti-patel', 'assets/characters/priti_patel.jpg');
        this.load.image('character-keir-starmer', 'assets/characters/keir_starmer.jpg');
        this.load.image('character-donald-trump', 'assets/characters/donald_trump.jpg');
        this.load.image('character-joe-biden', 'assets/characters/joe_biden.jpg');
        this.load.image('character-greta-thunberg', 'assets/characters/greta_thunberg.jpg');
        this.load.image('character-mark-zuckerberg', 'assets/characters/mark_zuckerberg.jpg');
        this.load.image('character-piers-morgan', 'assets/characters/piers_morgan.jpg');
        this.load.image('character-vladimir-putin', 'assets/characters/vladimir_putin.jpg');
        this.load.image('character-nicola-sturgeon', 'assets/characters/nicola_sturgeon.jpg');

        // Background
        this.load.image('background-default', 'assets/scenes/uk_number_10_outside.jpg');
        this.load.image('background-uk-number-10-outside', 'assets/scenes/uk_number_10_outside.jpg');
        this.load.image('background-uk-number-10-press-conference', 'assets/scenes/uk_number_10_press_conference.jpg');
        this.load.image('background-uk-number-10-1on1', 'assets/scenes/uk_number_10_1on1.jpg');
        this.load.image('background-uk-number-10-meeting', 'assets/scenes/uk_number_10_meeting.jpg');
        this.load.image('background-uk-news-room', 'assets/scenes/uk_news_room.jpg');
        this.load.image('background-uk-home-office', 'assets/scenes/uk_home_office.jpg');
        this.load.image('background-sc-holyrood', 'assets/scenes/sc_holyrood.jpg');
        this.load.image('background-sw-countryside', 'assets/scenes/sw_countryside.jpg');
        this.load.image('background-us-white-house-press-conference', 'assets/scenes/us_white_house_press_conference.jpg');

        // Cards
        this.load.json('cards', 'assets/cards/cards.json');
    }

    loadImages() {
        const cards = this.cache.json.get('cards');
        for (let card of cards.cards) {
            this.load.image(`card-${card.id}`, card.image);
        }
        this.load.start();
    }

    create() {
        let { width, height } = this.cameras.main

        this.loadImages();

        this.background = new Background({
            scene: this,
            x: 0,
            y: 150,
            width: width,
            height: height
        });

        this.deck = new Deck({
            scene: this,
            x: width / 2,
            y: height / 2,
            width: width - (200),
            height: height - (200)
        });

        PlayerScore.on('reset', () => {
            const cards = this.cache.json.get('cards');
            this.deck.setDeck(cards.cards);
        });

        this.scoreboard = new ScoreBoard({
            scene: this,
            x: width / 2,
            y: 0,
            width: width,
            height: 150
        });
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    scene: OperationMoonshot
};

const game = new Phaser.Game(config);
