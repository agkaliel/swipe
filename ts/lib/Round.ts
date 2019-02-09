class Round {
    public readonly deck: Deck;
    public readonly hand: Hand;
    private parent: Element;
    
    private playingAreaElement: Element;
    public readonly confirmMoveButton: HTMLButtonElement;
    private _cardsInPlayingAreaMap: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand(parent);
        this.confirmMoveButton = <HTMLButtonElement> parent.querySelector('.confirm-move-button');
        this.confirmMoveButton.hidden = true;
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
    public playMode (): void {
        // this.confirmMoveButton.disabled = true;
        this.confirmMoveButton.hidden = false;
    }

    // Stay
    public setNewTurn(): void {
        this.hand.enableCards();
        // this.confirmMoveButton.disabled = true;
    }

    // Stay
    playSelectedCards() {
        this.clearPlayingArea();
        this.hand.cardsInHandMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        })

        this.setNewTurn();
    }

    // Playing Area
    clearPlayingArea() {
        this._cardsInPlayingAreaMap = new Map();

        while (this.playingAreaElement.firstChild) {
            this.playingAreaElement.removeChild(this.playingAreaElement.firstChild);
        }
    }

    // Stay
    playCard(card: Card) {
        this.addCardToPlayingArea(card);
        this.hand.removeCardFromHand(card);
    }

    // Playing area
    addCardToPlayingArea(card: Card): UICard {
        let u = new UICard(card);
        this._cardsInPlayingAreaMap.set(card, u);
        this.playingAreaElement.appendChild(u.element);
        return u;
    }

    public newRound() {
        this.clearPlayingArea();
        this.clearCards();
        this.hand.enableCards();
    }

    clearCards() {
        this.hand.clearCards();
        this.clearPlayingArea();
    }
}