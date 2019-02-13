class PlayingArea {
    private playingAreaElement: Element;

    private _cardSlots: CardSlot[];
    public constructor (parent) {
        this.playingAreaElement = <Element> parent.querySelector('.playingArea');
        this._cardSlots = [];
        this._cardSlots.push(new CardSlot(<Element> this.playingAreaElement.querySelector('.slotOne')));
        this._cardSlots.push(new CardSlot(<Element> this.playingAreaElement.querySelector('.slotTwo')));
        this._cardSlots.push(new CardSlot(<Element> this.playingAreaElement.querySelector('.slotThree')));
        this._cardSlots.push(new CardSlot(<Element> this.playingAreaElement.querySelector('.slotFour')));

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
