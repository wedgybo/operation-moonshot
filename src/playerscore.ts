
interface Decision {
    economy: number;
    health: number;
    obedience: number;
    testing: number;
}

class PlayerScore extends Phaser.Events.EventEmitter {

    public economy: number;
    public health: number;
    public obedience: number;
    public testing: number;

    constructor () {
        super();

        this.economy = 50;
        this.health = 50;
        this.obedience = 50;
        this.testing = 50;
    }

    public applyDesicion (decision: Decision) {
        this.economy += decision.economy;
        this.health += decision.health;
        this.obedience += decision.obedience;
        this.testing += decision.testing;

        this.emit('scoreupdate', decision);
        console.log('Score', this.economy, this.health, this.obedience, this.testing);
    }
}

export default new PlayerScore();