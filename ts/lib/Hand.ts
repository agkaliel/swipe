class Hand {
    public readonly cards: Card[];

    public constructor (cards?: Card[]) {
        if (cards !== undefined) {
            this.cards = cards;
        } else {
            this.cards = [];
        }
    }
}
