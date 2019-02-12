class PlayingArea {
    private playingAreaElement: Element;
    // Change from a map to UICard belongs to Card
    private _cardsMap: Map<Card, UICard>;

    public constructor (parent) {
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this._cardsMap = new Map();
    }

    public clear() {
        this._cardsMap = new Map();

        while (this.playingAreaElement.firstChild) {
            this.playingAreaElement.removeChild(this.playingAreaElement.firstChild);
        }
    }

    public addCard(card: Card): UICard {
        let u = new UICard(card);
        this._cardsMap.set(card, u);
        this.playingAreaElement.appendChild(u.element);
        return u;
    }
    
    getRank(): number {
        let firstCard: Card = this._cardsMap.keys().next().value;
        return firstCard ? firstCard.rank : CONSTANTS.maxRank;;
    }
}
