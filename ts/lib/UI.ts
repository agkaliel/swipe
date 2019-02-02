class UI {
    private parent: Element;
    private playerHandElement: Element;
    private playingAreaElement: Element;
    public readonly confirmMoveButton: HTMLButtonElement;
    public readonly newGameButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;
    private _cards: Map<Card, UICard>;
    private _cardsInPlayingAreaMap: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.parent = parent;
        this.confirmMoveButton = <HTMLButtonElement> parent.querySelector('.confirm-move-button');
        this.confirmMoveButton.hidden = true;
        this.newGameButton = <HTMLButtonElement> parent.querySelector('.new-game-button');
        this.playerHandElement = <Element> parent.querySelector('.playerHand');
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this.msg = <HTMLParagraphElement> parent.querySelector('.msg');

        this._cardsInPlayingAreaMap = new Map();
        this._cards = new Map();
    }

    public playMode (): void {
        this.confirmMoveButton.disabled = true;
        this.confirmMoveButton.hidden = false;
    }

    public setNewTurn(): void {
        this.enableCards();
    }

    public enableCards (): void {
        this.cards.forEach((c) => {
            c.disabled = false;
        });
    }

    public get cards (): Map<Card, UICard> {
        return this._cards;
    }

    public addCards(cards: Card[]) {
        cards.forEach(card => {
            this.addCardToHand(card);
        })
    }

    public addCardToHand (card: Card): UICard {
        let u = new UICard(card);
        this._cards.set(card, u);

        this.playerHandElement.appendChild(u.element);
        this.subscribeToCardClicks(u);

        return u;
    }

    subscribeToCardClicks(uiCard: UICard) {
        uiCard.element.addEventListener('click', () => {
            uiCard.onCardClicked();

            let numberOfSelectedCards = 0
            this.cards.forEach((c) => {
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
        });
    }

    playSelectedCards() {
        this.clearPlayingArea();
        this.cards.forEach((uiCard, card) => {
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
        this.cards.forEach((c) => {
            if (!c.selected) {
                c.disabled = true;
            }
        });
    }

    public disableCards (): void {
        this.cards.forEach((c) => {
            c.disabled = true;
        });
    }

    removeCardFromHand(card: Card) {
        let uiCard = this._cards.get(card)
        if (!uiCard) {
            throw 'Card not in display';
        }
        this.playerHandElement.removeChild(uiCard.element);
        this._cards.delete(card);
    }

    public replaceCard (newCard: Card, oldCard: Card): UICard {
        let oldUICard = this._cards.get(oldCard);

        if (oldUICard === undefined)
            throw 'Card not in display';

        let u = new UICard(newCard);

        this.playerHandElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);

        return u;
    }

    public clearCards (): void {
        this._cards = new Map();

        while (this.playerHandElement.firstChild) {
            this.playerHandElement.removeChild(this.playerHandElement.firstChild);
        }
    }
}