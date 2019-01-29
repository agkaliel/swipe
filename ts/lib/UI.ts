class UI {
    private parent: Element;
    private playerHandElement: Element;
    private playingAreaElement: Element;
    public readonly confirmMoveButton: HTMLButtonElement;
    public readonly newGameButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;
    private _cards: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.parent = parent;
        this.confirmMoveButton = <HTMLButtonElement> parent.querySelector('.confirm-move-button');
        this.confirmMoveButton.hidden = true;
        this.newGameButton = <HTMLButtonElement> parent.querySelector('.new-game-button');
        this.playerHandElement = <Element> parent.querySelector('.playerHand');
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this.msg = <HTMLParagraphElement> parent.querySelector('.msg');

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
            this.addCard(card);
        })
    }

    public addCard (card: Card): UICard {
        let u = new UICard(card);
        this._cards.set(card, u);

        this.playerHandElement.appendChild(u.element);

        u.element.addEventListener('click', () => {
            u.onCardClicked();

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

        return u;
    }

    playSelectedCards() {
        this.cards.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.addCardToPlayingArea(card);
                uiCard.selected = false;
            }
        })

        this.setNewTurn();
    }

    // removeCardFromHand(card: Card): void {
    //     this._cards.delete(card);
    // }

    addCardToPlayingArea(card: Card): UICard {
        let u = new UICard(card);
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