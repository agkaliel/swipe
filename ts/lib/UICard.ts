class UICard {
    public readonly card: Card;
    public readonly element: Element = document.createElement('div');
    public readonly img: HTMLImageElement = document.createElement('img');
    private _disabled: boolean = false;
    private _selected: boolean = false;

    public constructor (card: Card) {
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;
    }

    public get selected (): boolean {
        return this._selected;
    }


    public set selected (value: boolean) {
        this._selected = value;
        this.element.classList.toggle('selected', this._selected);
    }

    public get disabled (): boolean {
        return this._disabled;
    }

    public set disabled (value: boolean) {
        this._disabled = value;
        this.element.classList.toggle('disabled', this.disabled);
    }

    public onCardClicked() {
        if (!this.disabled) {
            this.selected = !this.selected;
        }
    }

}