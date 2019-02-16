class PickupPile {
    private element: Element = <Element> document.querySelector('.pickupPile');
    private _cardsMap: Map<Card, UICard>;

    public constructor () {}

    public clear(): void {
        this._cardsMap = new Map();

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    public get cards(): Card[] {
        let cards: Card[] = [];
        this._cardsMap.forEach((uiCard: UICard, card: Card) => {
            cards.push(card);
        });
        return cards;
    }

    public addCards(cards: Card[]) {
        cards.forEach(card => {
            this.addCard(card);
        });
    }

    public addCard(card: Card): UICard {
        let u = new UICard(card);
        this._cardsMap.set(card, u);

        this.element.appendChild(u.element);
        return u;
    }
}
