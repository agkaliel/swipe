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
        console.log('clearing: ');
        this._cardSlots.forEach((slot: CardSlot) => {
            console.log('clearing slot');
            slot.clear();
        });
    }

    public addCard(card: Card) {
        this._cardSlots.forEach(cardSlot => {
            if (!cardSlot.hasCard()) {
                cardSlot.setCard(card);
                // TODO: This aint workin
                return;
            }
        });

        throw "Out of room in playing area";
    }
    
    getRank(): number {
        return (this._cardSlots[0] && this._cardSlots[0].card) ?  this._cardSlots[0].card.rank : CONSTANTS.maxRank;
    }
}
