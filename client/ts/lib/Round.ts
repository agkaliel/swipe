class Round {
    private deck: Deck;
    private playerHands: Hand[] = [];
    private currentHand: Hand;
    private currentTurnIndex: number;
    private playingArea: PlayingArea;
    private pickupPile: PickupPile;
    private confirmMoveButton: ConfirmMoveButton;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
        this.confirmMoveButton.hide();
        this.playingArea = new PlayingArea();
        this.pickupPile = new PickupPile();

        this.playerHands.push(new Hand(
            parent.querySelector('.playerOne')!,
            (isEnabled: boolean) => this.confirmMoveButton.setEnabled(isEnabled),
            this.playingArea));

        this.playerHands.push(new Hand(
            parent.querySelector('.playerTwo')!, 
            (isEnabled: boolean) => this.confirmMoveButton.setEnabled(isEnabled),
            this.playingArea));;
    }

    public startRound() {
        this.clearAllCards();
        this.draw();
        this.currentTurnIndex = 0;
        this.setupNextTurn();
        this.confirmMoveButton.show();
    }

    private draw (): void {
        this.playerHands.forEach(hand => {
            let cards: Card[] = [];
            for (let i = 0; i < CONSTANTS.handSize; i++) {
                cards.push(this.deck.draw());
            }

            hand.addCards(cards);
            cards.sort(Round.compareCards);
        })
    }

    public static compareCards(a: Card, b: Card) {
        if (a.rank < b.rank)
            return -1;
        if (a.rank > b.rank)
            return 1;
        return 0;
    }

    private setupNextTurn(repeatTurn: boolean = false): void {
        if (!repeatTurn) {
            this.currentTurnIndex++;
            if (this.currentTurnIndex >= this.playerHands.length) {
                this.currentTurnIndex = 0;
            }
        }

        this.currentHand = this.playerHands[this.currentTurnIndex];
        let otherHands: Hand[] = [];

        this.playerHands.forEach((hand: Hand, index: number) => {
            if (index !== this.currentTurnIndex) {
                otherHands.push(hand);
            }
        });

        this.currentHand.enable();

        // If a player doesn't have an available move, they pickup the pickup pile and lose their turn
        if (!this.currentHand.hasAvailableMove()) {
            this.currentHand.addCards(this.pickupPile.cards);
            this.currentHand.addCards(this.playingArea.cards);

            this.pickupPile.clear();
            this.playingArea.clear();
            this.setupNextTurn();
        } else {
            otherHands.forEach((hand: Hand) => hand.disable());
            this.confirmMoveButton.setEnabled(false);
        }
    }

    private onConfirmMoveClick(): void {
        if (this.currentHand.getSelectedRank() !== this.playingArea.getRank()) {
            let cardsInPlayingArea = this.playingArea.cards;
            this.pickupPile.addCards(cardsInPlayingArea);
            this.playingArea.clear()
        }
        this.playSelectedCards();

        if (this.playingArea.isFull()) {
            this.playingArea.clear();
            this.setupNextTurn(true);
        } else {
            this.setupNextTurn();
        }
    }

    private playSelectedCards() {
        this.currentHand.cardsMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        });
    }

    private playCard(card: Card) {
        this.playingArea.addCard(card);
        this.currentHand.removeCardFromHand(card);
    }

    private clearAllCards() {
        this.playerHands.forEach(hand => {
            hand.clear();
        })

        this.playingArea.clear();
        this.pickupPile.clear();
    }
}