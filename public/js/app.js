var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 0] = "Spades";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Diamonds"] = 3] = "Diamonds";
})(Suit || (Suit = {}));
;
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    get rankName() {
        return Card.rankNames[this.rank - 1];
    }
    get suitName() {
        return Suit[this.suit];
    }
    get name() {
        return this.rankName + ' of ' + this.suitName;
    }
    get imageName() {
        let s, r;
        if (this.rank === 1 || this.rank > 10) {
            r = this.rankName.charAt(0);
        }
        else {
            r = this.rank + '';
        }
        s = this.suitName.charAt(0);
        // TODO: Look into changing naming scheme to avoid adblock issues
        return r + s + '.svg';
    }
}
Card.rankNames = [
    'Ace',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'Jack',
    'Queen',
    'King',
];
class CardSlot {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('slot');
    }
    clear() {
        this._uiCard = undefined;
        if (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
    get card() {
        return this._uiCard ? this._uiCard.card : null;
    }
    setCard(card) {
        this._uiCard = new UICard(card);
        this.element.appendChild(this._uiCard.element);
    }
    hasCard() {
        return !!this._uiCard;
    }
}
class ConfirmMoveButton {
    constructor(parent, onClickCallback) {
        this.element = parent.querySelector('.confirm-move-button');
        this.element.hidden = true;
        this.element.disabled = true;
        this.element.addEventListener('click', () => {
            onClickCallback();
        });
    }
    hide() {
        this.element.hidden = true;
    }
    show() {
        this.element.hidden = false;
    }
    setEnabled(isEnabled) {
        this.element.disabled = !isEnabled;
    }
}
class Deck {
    constructor() {
        this.cards = [];
        let numberOfDecks = 5;
        for (let deckNumber = 0; deckNumber < numberOfDecks; deckNumber++) {
            for (let s = 0; s < 4; s++) {
                for (let r = 1; r <= 13; r++) {
                    this.cards.push(new Card(r, s));
                }
            }
        }
    }
    shuffle() {
        for (let i = this.cards.length; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }
    draw() {
        return this.cards.shift();
    }
}
class Game {
    constructor() {
        this.newGameButton = document.querySelector('.new-game-button');
        this.newGameButton.addEventListener('click', () => {
            this.onNewGameClick();
        });
        let confirmMoveButton = document.querySelector('.confirm-move-button');
        confirmMoveButton.hidden = true;
        this.msg = document.querySelector('.msg');
    }
    onNewGameClick() {
        this.clearMsg();
        this.round = new Round(document.querySelector('main'));
        this.round.startRound();
        // this.setMessage('Click on the card you wish to play');
    }
    clearMsg() {
        this.msg.innerHTML = '';
    }
    setMessage(str) {
        this.msg.innerHTML += str + '<br>';
    }
}
class Hand {
    constructor(element, setButtonEnabled, playingArea) {
        this.setButtonEnabled = setButtonEnabled;
        this.playingArea = playingArea;
        this.element = element;
        this._cardsMap = new Map();
    }
    get cardsMap() {
        return this._cardsMap;
    }
    addCards(cards) {
        let allCards = [...this.cards, ...cards];
        allCards.sort(Round.compareCards);
        this.clear();
        allCards.forEach(card => {
            this.addCardToHand(card);
        });
    }
    addCardToHand(card) {
        let u = new UICard(card);
        this._cardsMap.set(card, u);
        this.element.appendChild(u.element);
        this.subscribeToCardClicks(u);
        return u;
    }
    get cards() {
        let cards = [];
        this._cardsMap.forEach((uiCard, card) => {
            cards.push(card);
        });
        return cards;
    }
    subscribeToCardClicks(uiCard) {
        uiCard.element.addEventListener('click', () => {
            if (!uiCard.disabled) {
                uiCard.onCardClicked();
                this.onCardClicked();
            }
        });
    }
    hasAvailableMove() {
        let enabledCard = null;
        this.cardsMap.forEach((c) => {
            if (!c.disabled) {
                enabledCard = c;
            }
        });
        return !!enabledCard;
    }
    onCardClicked() {
        let socket = io();
        this.updateCardAvailability();
    }
    enable() {
        this.element.classList.add('isActive');
        this.updateCardAvailability();
    }
    disable() {
        this.element.classList.remove('isActive');
        this.disableCards();
    }
    updateCardAvailability() {
        this.enableCards();
        let selectedCards = [];
        this.cardsMap.forEach((c) => {
            if (c.selected) {
                selectedCards.push(c);
            }
        });
        if (selectedCards.length >= CONSTANTS.maxPlayable) {
            this.disableUnselectedCards();
        }
        else {
            this.disableIllegalCards(selectedCards);
            ;
        }
        this.setButtonEnabled(selectedCards.length >= 1);
    }
    disableIllegalCards(selectedCards) {
        if (selectedCards.length) {
            let selectedRank = selectedCards[0].card.rank;
            this.cardsMap.forEach((c) => {
                if (!c.selected) {
                    if (c.card.rank !== selectedRank || (this.playingArea.numberOfEmptySlots() <= selectedCards.length && selectedRank === this.playingArea.getRank())) {
                        c.disabled = true;
                    }
                }
            });
        }
        else {
            this.cardsMap.forEach((c) => {
                if (c.card.rank > this.playingArea.getRank()) {
                    c.disabled = true;
                }
                else {
                    c.disabled = false;
                }
            });
        }
    }
    getSelectedRank() {
        let firstSelectedCard;
        this._cardsMap.forEach((c, card) => {
            if (c.selected) {
                firstSelectedCard = card;
            }
        });
        if (!firstSelectedCard) {
            throw "No Cards Selected";
        }
        return firstSelectedCard.rank;
    }
    enableCards() {
        this.cardsMap.forEach((c) => {
            c.disabled = false;
        });
    }
    disableCards() {
        this.cardsMap.forEach((c) => {
            c.disabled = true;
        });
    }
    disableUnselectedCards() {
        this.cardsMap.forEach((c) => {
            if (!c.selected) {
                c.disabled = true;
            }
        });
    }
    removeCardFromHand(card) {
        let uiCard = this.cardsMap.get(card);
        if (!uiCard) {
            throw 'Card not in display';
        }
        this.element.removeChild(uiCard.element);
        this.cardsMap.delete(card);
    }
    clear() {
        this._cardsMap = new Map();
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
}
class PickupPile {
    constructor() {
        this.element = document.querySelector('.pickupPile');
    }
    clear() {
        this._cardsMap = new Map();
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
    get cards() {
        let cards = [];
        this._cardsMap.forEach((uiCard, card) => {
            cards.push(card);
        });
        return cards;
    }
    addCards(cards) {
        cards.forEach(card => {
            this.addCard(card);
        });
    }
    addCard(card) {
        let u = new UICard(card);
        this._cardsMap.set(card, u);
        this.element.appendChild(u.element);
        return u;
    }
}
class PlayingArea {
    constructor() {
        this.playingAreaElement = document.querySelector('.playingArea');
        while (this.playingAreaElement.firstChild) {
            this.playingAreaElement.firstChild.remove();
        }
        this._cardSlots = [];
        for (let i = 0; i < CONSTANTS.playingAreaSize; i++) {
            let cardSlot = new CardSlot();
            this.playingAreaElement.appendChild(cardSlot.element);
            this._cardSlots.push(cardSlot);
        }
    }
    get cards() {
        let cards = [];
        this._cardSlots.forEach(slot => {
            if (slot.card) {
                cards.push(slot.card);
            }
        });
        return cards;
    }
    clear() {
        this._cardSlots.forEach((slot) => {
            slot.clear();
        });
    }
    isFull() {
        let firstEmptySlot = this._cardSlots.find(slot => !slot.hasCard());
        return !firstEmptySlot;
    }
    numberOfEmptySlots() {
        let numberEmpty = 0;
        this._cardSlots.forEach(slot => {
            if (!slot.hasCard()) {
                numberEmpty++;
            }
        });
        return numberEmpty;
    }
    addCard(card) {
        let firstEmptySlot = this._cardSlots.find(slot => !slot.hasCard());
        if (firstEmptySlot) {
            firstEmptySlot.setCard(card);
        }
        else {
            throw "Out of room in playing area";
        }
    }
    getRank() {
        return (this._cardSlots[0] && this._cardSlots[0].card) ? this._cardSlots[0].card.rank : CONSTANTS.maxRank;
    }
}
class Round {
    constructor(parent) {
        this.playerHands = [];
        this.deck = new Deck();
        this.deck.shuffle();
        this.confirmMoveButton = new ConfirmMoveButton(parent, () => this.onConfirmMoveClick());
        this.confirmMoveButton.hide();
        this.playingArea = new PlayingArea();
        this.pickupPile = new PickupPile();
        this.playerHands.push(new Hand(parent.querySelector('.playerOne'), (isEnabled) => this.confirmMoveButton.setEnabled(isEnabled), this.playingArea));
        this.playerHands.push(new Hand(parent.querySelector('.playerTwo'), (isEnabled) => this.confirmMoveButton.setEnabled(isEnabled), this.playingArea));
        ;
    }
    startRound() {
        this.clearAllCards();
        this.draw();
        this.currentTurnIndex = 0;
        this.setupNextTurn();
        this.confirmMoveButton.show();
    }
    draw() {
        this.playerHands.forEach(hand => {
            let cards = [];
            for (let i = 0; i < CONSTANTS.handSize; i++) {
                cards.push(this.deck.draw());
            }
            hand.addCards(cards);
            cards.sort(Round.compareCards);
        });
    }
    static compareCards(a, b) {
        if (a.rank < b.rank)
            return -1;
        if (a.rank > b.rank)
            return 1;
        return 0;
    }
    setupNextTurn(repeatTurn = false) {
        if (!repeatTurn) {
            this.currentTurnIndex++;
            if (this.currentTurnIndex >= this.playerHands.length) {
                this.currentTurnIndex = 0;
            }
        }
        this.currentHand = this.playerHands[this.currentTurnIndex];
        let otherHands = [];
        this.playerHands.forEach((hand, index) => {
            if (index !== this.currentTurnIndex) {
                otherHands.push(hand);
            }
        });
        this.currentHand.enable();
        // If a player doesn't have an available move, they pickup the pickup pile and lose their turn
        if (!this.currentHand.hasAvailableMove()) {
            this.currentHand.addCards(this.pickupPile.cards);
            this.currentHand.addCards(this.playingArea.cards);
            this.pickupPile.clear();
            this.playingArea.clear();
            this.setupNextTurn();
        }
        else {
            otherHands.forEach((hand) => hand.disable());
            this.confirmMoveButton.setEnabled(false);
        }
    }
    onConfirmMoveClick() {
        console.log('move confirmed');
        let socket = io();
        socket.emit('chat message', 'move confirmed');
        if (this.currentHand.getSelectedRank() !== this.playingArea.getRank()) {
            let cardsInPlayingArea = this.playingArea.cards;
            this.pickupPile.addCards(cardsInPlayingArea);
            this.playingArea.clear();
        }
        this.playSelectedCards();
        if (this.playingArea.isFull()) {
            this.playingArea.clear();
            this.setupNextTurn(true);
        }
        else {
            this.setupNextTurn();
        }
    }
    playSelectedCards() {
        this.currentHand.cardsMap.forEach((uiCard, card) => {
            if (uiCard.selected) {
                this.playCard(card);
            }
        });
    }
    playCard(card) {
        this.playingArea.addCard(card);
        this.currentHand.removeCardFromHand(card);
    }
    clearAllCards() {
        this.playerHands.forEach(hand => {
            hand.clear();
        });
        this.playingArea.clear();
        this.pickupPile.clear();
    }
}
class UICard {
    constructor(card) {
        this.element = document.createElement('div');
        this.img = document.createElement('img');
        this._disabled = false;
        this._selected = false;
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this.element.classList.toggle('selected', this._selected);
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this.element.classList.toggle('disabled', this.disabled);
    }
    onCardClicked() {
        if (!this.disabled) {
            this.selected = !this.selected;
        }
    }
}
const CONSTANTS = {
    maxPlayable: 4,
    handSize: 8,
    maxRank: 100,
    playingAreaSize: 4
};
new Game();
//# sourceMappingURL=app.js.map