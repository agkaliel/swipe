class Hand {
    private playerHandElement: Element;
    // Change from a map to UICard belongs to Card
    private _cardsInHandMap: Map<Card, UICard>;

    public constructor (parent) {
        this.playerHandElement = <Element> parent.querySelector('.playerHand');
        this._cardsInHandMap = new Map();
    }

    public get cardsInHandMap (): Map<Card, UICard> {
        return this._cardsInHandMap;
    }

    public addCardToHand (card: Card): UICard {
        let u = new UICard(card);
        this._cardsInHandMap.set(card, u);

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
        this.cardsInHandMap.forEach((c) => {
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
            // Pass in button object?
            // this.confirmMoveButton.disabled = false;
        }
    }

    public enableCards (): void {
        this.cardsInHandMap.forEach((c) => {
            c.disabled = false;
        });
    }

    public disableCards (): void {
        this.cardsInHandMap.forEach((c) => {
            c.disabled = true;
        });
    }

    disableUnselectedCards() {
        this.cardsInHandMap.forEach((c) => {
            if (!c.selected) {
                c.disabled = true;
            }
        });
    }

    removeCardFromHand(card: Card) {
        let uiCard = this.cardsInHandMap.get(card)
        if (!uiCard) {
            throw 'Card not in display';
        }
        this.playerHandElement.removeChild(uiCard.element);
        this.cardsInHandMap.delete(card);
    }

    public clearCards (): void {
        this._cardsInHandMap = new Map();

        while (this.playerHandElement.firstChild) {
            this.playerHandElement.removeChild(this.playerHandElement.firstChild);
        }
    }
}
