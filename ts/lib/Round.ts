class Round {
    public readonly deck: Deck;
    public readonly hand: Hand;
    private parent: Element;
    
    private playerHandElement: Element;
    private playingAreaElement: Element;
    public readonly confirmMoveButton: HTMLButtonElement;
    private _cardsInHand: Map<Card, UICard>;
    private _cardsInPlayingAreaMap: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
        this.confirmMoveButton = <HTMLButtonElement> parent.querySelector('.confirm-move-button');
        this.confirmMoveButton.hidden = true;
        this.playerHandElement = <Element> parent.querySelector('.playerHand');
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this._cardsInPlayingAreaMap = new Map();
        this._cardsInHand = new Map();
    }

    public draw (): void {
        for (let i = 0; i < 12; i++) {
            this.hand.cards.push(this.deck.draw());
        }
    }

    public getCards(): Card[] {
        return this.hand.cards;
    }

    public playMode (): void {
        this.confirmMoveButton.disabled = true;
        this.confirmMoveButton.hidden = false;
    }

    // Round
    public setNewTurn(): void {
        this.enableCards();
    }

    // Round
    public enableCards (): void {
        this.cardsInHand.forEach((c) => {
            c.disabled = false;
        });
    }

    public get cardsInHand (): Map<Card, UICard> {
        return this._cardsInHand;
    }

    public addCardsToHand(cards: Card[]) {
        cards.forEach(card => {
            this.addCardToHand(card);
        })
    }

    public addCardToHand (card: Card): UICard {
        let u = new UICard(card);
        this._cardsInHand.set(card, u);

        this.playerHandElement.appendChild(u.element);
        this.subscribeToCardClicks(u);

        return u;
    }

    subscribeToCardClicks(uiCard: UICard) {
        uiCard.element.addEventListener('click', () => {
            uiCard.onCardClicked();    
            this.onCardClicked();       
        });
    }

    onCardClicked() {
        let numberOfSelectedCards = 0
        this.cardsInHand.forEach((c) => {
            if (c.selected) {
                numberOfSelectedCards++;
            }
        });

        if (numberOfSelectedCards >= CONSTANTS.maxPlayable) {
            this.disableUnselectedCards();
        } else {
            this.enableCards();
        }

        if (numberOfSelectedCards >= 1) {
            this.confirmMoveButton.disabled = false;
        }
    }

    playSelectedCards() {
        this.clearPlayingArea();
        this.cardsInHand.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        })

        this.setNewTurn();
    }

    clearPlayingArea() {
        this._cardsInPlayingAreaMap = new Map();

        while (this.playingAreaElement.firstChild) {
            this.playingAreaElement.removeChild(this.playingAreaElement.firstChild);
        }
    }

    playCard(card: Card) {
        this.addCardToPlayingArea(card);
        this.removeCardFromHand(card);
    }

    addCardToPlayingArea(card: Card): UICard {
        let u = new UICard(card);
        this._cardsInPlayingAreaMap.set(card, u);
        this.playingAreaElement.appendChild(u.element);
        return u;
    }

    disableUnselectedCards() {
        this.cardsInHand.forEach((c) => {
            if (!c.selected) {
                c.disabled = true;
            }
        });
    }

    public disableCards (): void {
        this.cardsInHand.forEach((c) => {
            c.disabled = true;
        });
    }

    removeCardFromHand(card: Card) {
        let uiCard = this.cardsInHand.get(card)
        if (!uiCard) {
            throw 'Card not in display';
        }
        this.playerHandElement.removeChild(uiCard.element);
        this.cardsInHand.delete(card);
    }

    public replaceCard (newCard: Card, oldCard: Card): UICard {
        let oldUICard = this.cardsInHand.get(oldCard);

        if (oldUICard === undefined)
            throw 'Card not in display';

        let u = new UICard(newCard);

        this.playerHandElement.replaceChild(u.element, oldUICard.element);
        this.cardsInHand.delete(oldCard);
        this.cardsInHand.set(newCard, u);

        return u;
    }

    public clearCards (): void {
        this._cardsInHand = new Map();

        while (this.playerHandElement.firstChild) {
            this.playerHandElement.removeChild(this.playerHandElement.firstChild);
        }
    }
}