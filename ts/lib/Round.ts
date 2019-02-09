class Round {
    public readonly deck: Deck;
    public readonly hand: Hand;
    
    private playingAreaElement: Element;
    public confirmMoveButton: ConfirmMoveButton;
    private _cardsInPlayingAreaMap: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand(parent, () => this.confirmMoveButton.enable());
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this._cardsInPlayingAreaMap = new Map();
    }

    //Stay
    public draw (): void {
        for (let i = 0; i < 12; i++) {
            this.hand.addCardToHand(this.deck.draw());
        }
    }

    // Stay
    public setPlayMode (): void {
        this.confirmMoveButton.disable();
        this.confirmMoveButton.show();
    }

    // Stay
    public setNewTurn(): void {
        this.hand.enableCards();
        this.confirmMoveButton.disable();
    }

    public newRound() {
        this.clearPlayingArea();
        this.clearCards();
        this.hand.enableCards();
    }

    // Stay
    private playSelectedCards() {
        this.hand.cardsInHandMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        })
    }

    // Stay
    private playCard(card: Card) {
        this.addCardToPlayingArea(card);
        this.hand.removeCardFromHand(card);
    }

    private onConfirmMoveClick(): void {
        this.clearPlayingArea();
        this.playSelectedCards();
        this.setNewTurn();
    }

    // Playing Area
    clearPlayingArea() {
        this._cardsInPlayingAreaMap = new Map();

        while (this.playingAreaElement.firstChild) {
            this.playingAreaElement.removeChild(this.playingAreaElement.firstChild);
        }
    }

    // Playing area
    addCardToPlayingArea(card: Card): UICard {
        let u = new UICard(card);
        this._cardsInPlayingAreaMap.set(card, u);
        this.playingAreaElement.appendChild(u.element);
        return u;
    }


    clearCards() {
        this.hand.clearCards();
        this.clearPlayingArea();
    }
}