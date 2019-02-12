class Hand {
    playingArea: PlayingArea
    private element: Element;
    // Change from a map to UICard belongs to Card
    private _cardsMap: Map<Card, UICard>;
    private onCardsSelectedCallback: () => void;

    public constructor (element: Element, onCardsSelectedCallback: () => void, playingArea: PlayingArea) {
        this.onCardsSelectedCallback = onCardsSelectedCallback;
        this.playingArea = playingArea;
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
            if (!uiCard.disabled) {
                uiCard.onCardClicked();    
                this.onCardClicked(); 
            }
        });
    }

    onCardClicked() {
        let selectedCards: UICard[] = []
        this.cardsMap.forEach((c) => {
            if (c.selected) {
                selectedCards.push(c);
            }
        });

        if (selectedCards.length >= CONSTANTS.maxPlayable) {
            this.disableUnselectedCards();
        } else {
            this.setAllowedCards(selectedCards);;
        }

        if (selectedCards.length >= 1) {
            this.onCardsSelectedCallback();
        }
    }

    private setAllowedCards(selectedCards: UICard[]) {
        if (selectedCards.length) {
            let selectedRank: number = selectedCards[0].card.rank;
            this.cardsMap.forEach((c: UICard) => {
                if (c.card.rank !== selectedRank) {
                    c.disabled = true;
                }
            } )

        } else {
            this.cardsMap.forEach((c: UICard) => {
                if (c.card.rank > this.playingArea.getRank()) {
                    c.disabled = true;
                } else {
                    c.disabled = false;
                }
            });
        }
    }

    public getSelectedRank() {
        let firstSelectedCard;

        this._cardsMap.forEach((c: UICard, card: Card) => {
            if (c.selected) {
                firstSelectedCard = card;
            }
        });

        if (!firstSelectedCard) {
            throw "No Cards Selected";
        }

        return firstSelectedCard.rank;
    }

    public disableCards (): void {
        this.cardsMap.forEach((c: UICard) => {
            c.disabled = true;
        });
    }

    disableUnselectedCards() {
        this.cardsMap.forEach((c: UICard) => {
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
