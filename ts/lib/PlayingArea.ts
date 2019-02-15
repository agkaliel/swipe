class PlayingArea {
    private playingAreaElement: Element;

    private _cardSlots: CardSlot[];
    public constructor (parent) {
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this._cardSlots = [];
        for (let i = 0; i < CONSTANTS.playingAreaSize; i++) {
            let cardSlot = new CardSlot();
            this.playingAreaElement.appendChild(cardSlot.element);
            this._cardSlots.push(cardSlot);
        }
    }

    public clear() {
        this._cardSlots.forEach((slot: CardSlot) => {
            slot.clear();
        });
    }

    public isFull(): boolean {
        let firstEmptySlot = this._cardSlots.find(slot => !slot.hasCard());
        return !firstEmptySlot;
    }

    public numberOfEmptySlots(): number {
        let numberEmpty = 0;
        this._cardSlots.forEach(slot => {
            if (!slot.hasCard()) {
                numberEmpty++;
            }
        });
        return numberEmpty;
    }

    public addCard(card: Card) {
        let firstEmptySlot = this._cardSlots.find(slot => !slot.hasCard());
        if (firstEmptySlot) {
            firstEmptySlot.setCard(card);
        } else {
            throw "Out of room in playing area";
        }
    }
    
    getRank(): number {
        return (this._cardSlots[0] && this._cardSlots[0].card) ?  this._cardSlots[0].card.rank : CONSTANTS.maxRank;
    }
}
