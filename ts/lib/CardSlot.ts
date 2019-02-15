class CardSlot {
    public readonly element: Element = document.createElement('div');
    private _uiCard: UICard | void;

    public constructor () {
        this.element.classList.add('slot');
    }

    public clear() {
        this._uiCard = undefined;
        if (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    get card(): Card | null {
        return this._uiCard ? this._uiCard.card : null; 
    }

    public setCard(card: Card) {
        this._uiCard = new UICard(card);
        this.element.appendChild(this._uiCard.element);
    }

    public hasCard(): boolean {
        return !!this._uiCard;
    }
}
