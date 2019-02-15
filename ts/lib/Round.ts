class Round {
    private deck: Deck;
    private playerHands: Hand[] = [];
    private currentHand: Hand;
    private currentTurnIndex: number;
    private playingArea: PlayingArea;
    private confirmMoveButton: ConfirmMoveButton;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
        this.confirmMoveButton.hide();
        this.playingArea = new PlayingArea(parent);

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
        this.nextTurn();
        this.confirmMoveButton.show();
    }

    private draw (): void {
        this.playerHands.forEach(hand => {
            let cards: Card[] = [];
            for (let i = 0; i < CONSTANTS.handSize; i++) {
                cards.push(this.deck.draw());
            }
            cards.sort(this.compareCards);
            cards.forEach(card => hand.addCardToHand(card));
        })
    }

    private compareCards(a: Card, b: Card) {
        if (a.rank < b.rank)
            return -1;
        if (a.rank > b.rank)
            return 1;
        return 0;
    }

    private nextTurn(samePlayer: boolean = false): void {
        if (!samePlayer) {
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

        this.currentHand.onCardClicked();
        otherHands.forEach((hand: Hand) => hand.disableCards());
        this.confirmMoveButton.setEnabled(false);
    }

    private onConfirmMoveClick(): void {
        if (this.currentHand.getSelectedRank() !== this.playingArea.getRank()) {
            this.playingArea.clear()
        }
        this.playSelectedCards();

        if (this.playingArea.isFull()) {
            this.playingArea.clear();
            this.nextTurn(true);
        } else {
            this.nextTurn();
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
            hand.clearCards();
        })
        this.playingArea.clear();
    }
}