class Round {
    private deck: Deck;
    private playerHands: Hand[] = [];
    private currentHand: Hand;
    private currentTurnIndex: number;
    private playingArea: PlayingArea;
    private confirmMoveButton: ConfirmMoveButton;

    public constructor (parent: Element) {
        console.log('building round');
        this.deck = new Deck();
        this.deck.shuffle();
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
        this.confirmMoveButton.hide();

        this.playerHands.push(new Hand(parent.querySelector('.playerOne')!, () => this.confirmMoveButton.enable()));
        this.playerHands.push(new Hand(parent.querySelector('.playerTwo')!, () => this.confirmMoveButton.enable()));

        this.playingArea = new PlayingArea(parent);

    }

    public startRound() {
        this.clearAllCards();
        this.draw();
        this.currentTurnIndex = 0;
        this.nextTurn();
        console.log('showing button');
        this.confirmMoveButton.show();
    }

    private draw (): void {
        this.playerHands.forEach(hand => {
            for (let i = 0; i < CONSTANTS.handSize; i++) {
                hand.addCardToHand(this.deck.draw());
            }
        })
    }

    private nextTurn(): void {
        this.currentTurnIndex++;
        if (this.currentTurnIndex >= this.playerHands.length) {
            this.currentTurnIndex = 0;
        }

        this.currentHand = this.playerHands[this.currentTurnIndex];
        let otherHands: Hand[] = [];

        this.playerHands.forEach((hand: Hand, index: number) => {
            if (index !== this.currentTurnIndex) {
                otherHands.push(hand);
            }
        });

        this.currentHand.enableCards();
        otherHands.forEach((hand: Hand) => hand.disableCards());
        this.confirmMoveButton.disable();
    }

    private onConfirmMoveClick(): void {
        this.playingArea.clear();
        this.playSelectedCards();
        this.nextTurn();
    }

    private playSelectedCards() {
        this.currentHand.cardsMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        })
    }

    private playCard(card: Card) {
        this.playingArea.addCard(card);
        this.currentHand.removeCardFromHand(card);
    }

    private clearAllCards() {
        this.playerHands.forEach(hand => {
            hand.clearCards();
        })
        this.playingArea.clear();
    }
}