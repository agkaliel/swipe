class Hand {
    private element: Element;
    // Change from a map to UICard belongs to Card
    private _cardsMap: Map<Card, UICard>;
    private onCardsSelectedCallback: () => void;

    public constructor (element: Element, onCardsSelectedCallback: () => void) {
        this.onCardsSelectedCallback = onCardsSelectedCallback;
        this.element = element;
        this._cardsMap = new Map();
    }

    public get cardsMap (): Map<Card, UICard> {
        return this._cardsMap;
    }

    public addCardToHand (card: Card): UICard {
        let u = new UICard(card);
        this._cardsMap.set(card, u);

        this.element.appendChild(u.element);
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
        this.cardsMap.forEach((c) => {
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
            this.onCardsSelectedCallback();
        }
    }

    public enableCards (): void {
        this.cardsMap.forEach((c) => {
            c.disabled = false;
        });
    }

    public disableCards (): void {
        this.cardsMap.forEach((c) => {
            c.disabled = true;
        });
    }

    disableUnselectedCards() {
        this.cardsMap.forEach((c) => {
            if (!c.selected) {
                c.disabled = true;
            }
        });
    }

    removeCardFromHand(card: Card) {
        let uiCard = this.cardsMap.get(card)
        if (!uiCard) {
            throw 'Card not in display';
        }
        this.element.removeChild(uiCard.element);
        this.cardsMap.delete(card);
    }

    public clearCards (): void {
        this._cardsMap = new Map();

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
}
