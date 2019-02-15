class PickupPile {
    private element: Element = <Element> document.querySelector('.pickupPile');
    private _cardsMap: Map<Card, UICard>;

    public constructor () {}

    public clearCards(): void {
        this._cardsMap = new Map();

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
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
