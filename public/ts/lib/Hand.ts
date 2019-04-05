class Hand {
    playingArea: PlayingArea
    private element: Element;
    // Change from a map to UICard belongs to Card
    private _cardsMap: Map<Card, UICard>;
    private setButtonEnabled: (isEnabled: boolean) => void;

    public constructor (element: Element, setButtonEnabled: (isEnabled: boolean) => void, playingArea: PlayingArea) {
        this.setButtonEnabled = setButtonEnabled;
        this.playingArea = playingArea;
        this.element = element;
        this._cardsMap = new Map();
    }

    public get cardsMap (): Map<Card, UICard> {
        return this._cardsMap;
    }

    public addCards(cards: Card[]) {
        let allCards = [...this.cards, ...cards];
        allCards.sort(Game.compareCards);
        this.clear();

        allCards.forEach(card => {
            this.addCardToHand(card)
        });
    }

    private addCardToHand (card: Card): UICard {
        let u = new UICard(card);
        this._cardsMap.set(card, u);

        this.element.appendChild(u.element);
        this.subscribeToCardClicks(u);

        return u;
    }

    private get cards(): Card[] {
        let cards: Card[] = [];
        this._cardsMap.forEach((uiCard: UICard, card: Card) => {
            cards.push(card);
        });
        return cards;
    }



    subscribeToCardClicks(uiCard: UICard) {
        uiCard.element.addEventListener('click', () => {
            if (!uiCard.disabled) {
                uiCard.onCardClicked();    
                this.onCardClicked(); 
            }
        });
    }

    public hasAvailableMove(): boolean {
        let enabledCard: UICard | null = null;
        this.cardsMap.forEach((c: UICard) => {
            if (!c.disabled) {
                enabledCard = c;
            }
        });
        return !!enabledCard;
    }

    onCardClicked() {
        this.updateCardAvailability();
    }

    public enable() {
        this.element.classList.add('isActive');
        this.updateCardAvailability();
    }

    public disable() {
        this.element.classList.remove('isActive');
        this.disableCards()
    }

    updateCardAvailability() {
        this.enableCards();
        let selectedCards: UICard[] = []
        this.cardsMap.forEach((c) => {
            if (c.selected) {
                selectedCards.push(c);
            }
        });


        if (selectedCards.length >= CONSTANTS.maxPlayable) {
            this.disableUnselectedCards();
        } else {
            this.disableIllegalCards(selectedCards);;
        }

        this.setButtonEnabled(selectedCards.length >= 1);
    }

    private disableIllegalCards(selectedCards: UICard[]) {
        if (selectedCards.length) {
            let selectedRank: number = selectedCards[0].card.rank;
            this.cardsMap.forEach((c: UICard) => {
                if (!c.selected) {
                    if (c.card.rank !== selectedRank || (this.playingArea.numberOfEmptySlots() <= selectedCards.length && selectedRank === this.playingArea.getRank())) {
                        c.disabled = true;
                    }
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

    private enableCards(): void {
        this.cardsMap.forEach((c: UICard) => {
            c.disabled = false;
        }); 
    }

    private disableCards (): void {
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

    public clear (): void {
        this._cardsMap = new Map();

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
}
