class Round {
    public readonly deck: Deck;
    public readonly hand: Hand;
    // public readonly bet: number;

    public constructor () {
        // this.bet = bet;
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }

    public draw (): void {
        for (let i = 0; i < 12; i++) {
            this.hand.cards.push(this.deck.draw());
        }
    }

    public getCards(): Card[] {
        return this.hand.cards;
    }
}