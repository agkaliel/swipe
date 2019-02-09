class Round {
    public readonly deck: Deck;
    public readonly hand: Hand;
    public readonly playingArea: PlayingArea;
    public confirmMoveButton: ConfirmMoveButton;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand(parent, () => this.confirmMoveButton.enable());
        this.playingArea = new PlayingArea(parent);
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
    }

    public draw (): void {
        for (let i = 0; i < 4; i++) {
            this.hand.addCardToHand(this.deck.draw());
        }
    }

    public setPlayMode (): void {
        this.confirmMoveButton.disable();
        this.confirmMoveButton.show();
    }

    public setNewTurn(): void {
        this.hand.enableCards();
        this.confirmMoveButton.disable();
    }

    public newRound() {
        this.playingArea.clear();
        this.clearCards();
        this.hand.enableCards();
    }

    private playSelectedCards() {
        this.hand.cardsMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        })
    }

    private playCard(card: Card) {
        this.playingArea.addCard(card);
        this.hand.removeCardFromHand(card);
    }

    private onConfirmMoveClick(): void {
        this.playingArea.clear();
        this.playSelectedCards();
        this.setNewTurn();
    }

    private clearCards() {
        this.hand.clearCards();
        this.playingArea.clear();
    }
}