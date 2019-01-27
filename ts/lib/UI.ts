class UI {
    private parent: Element;
    // private cashDisplay: Element;
    // public readonly betInput: HTMLInputElement;
    // public readonly betButton: HTMLButtonElement;
    private cardsListElement: Element;
    public readonly playCardButton: HTMLButtonElement;
    public readonly newGameButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;
    private _cards: Map<Card, UICard>;

    public constructor (parent: Element) {
        this.parent = parent;
        // this.cashDisplay = <Element> parent.querySelector('.cash');
        // this.betInput = <HTMLInputElement> parent.querySelector('.bet-input');
        // this.betButton = <HTMLButtonElement> parent.querySelector('.bet-button');
        this.playCardButton = <HTMLButtonElement> parent.querySelector('.play-card-button');
        this.playCardButton.hidden = true;
        this.newGameButton = <HTMLButtonElement> parent.querySelector('.new-game-button');
        this.cardsListElement = <Element> parent.querySelector('.cards');
        this.msg = <HTMLParagraphElement> parent.querySelector('.msg');

        this._cards = new Map();
    }

    // public betMode (): void {
    //     this.betInput.disabled = false;
    //     this.betButton.disabled = false;
    //     this.playButton.disabled = true;
    //     this.resetButton.disabled = true;
    // }

    public playMode (): void {
        this.playCardButton.disabled = true;
        this.playCardButton.hidden = false;
    }

    // public gameOverMode (): void {
    //     this.betInput.disabled = true;
    //     this.betButton.disabled = true;
    //     this.playButton.disabled = true;
    //     this.resetButton.disabled = false;
    // }

    public enableCards (): void {
        this.cards.forEach((c) => {
            c.disabled = false;
        });
    }

    public disableCards (): void {
        this.cards.forEach((c) => {
            c.disabled = true;
        });
    }

    // public updateCash (cash: number): void {
    //     this.cashDisplay.textContent = '$' + cash;
    // }

    public get cards (): Map<Card, UICard> {
        return this._cards;
    }

    public addCards(cards: Card[]) {
        cards.forEach(card => {
            this.addCard(card);
        })
    }

    public addCard (card: Card): UICard {
        let u = new UICard(card);
        this._cards.set(card, u);

        this.cardsListElement.appendChild(u.element);

        return u;
    }

    public replaceCard (newCard: Card, oldCard: Card): UICard {
        let oldUICard = this._cards.get(oldCard);

        if (oldUICard === undefined)
            throw 'Card not in display';

        let u = new UICard(newCard);

        this.cardsListElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);

        return u;
    }

    public clearCards (): void {
        this._cards = new Map();

        while (this.cardsListElement.firstChild) {
            this.cardsListElement.removeChild(this.cardsListElement.firstChild);
        }
    }
}