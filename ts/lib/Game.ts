class Game {
    private round: Round;
    public readonly newGameButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;

    public constructor() {
        this.round = new Round(document.querySelector('main')!);
        this.newGameButton = <HTMLButtonElement> document.querySelector('.new-game-button');
        this.newGameButton.addEventListener('click', () => {
            this.onNewGameClick();
        });
        this.round.confirmMoveButton.addEventListener('click', () => {
            this.round.playSelectedCards();
        });
        this.msg = <HTMLParagraphElement> document.querySelector('.msg');
    }

    private onNewGameClick() {
        this.reset();
        this.round = new Round(document.querySelector('main')!);
        this.round.draw();
        this.round.addCardsToHand(this.round.getCards());
        this.round.playMode();
        this.setMessage('Click on the card you wish to play');
    }

    private reset() {
        this.round.clearPlayingArea();
        this.round.clearCards();
        this.round.enableCards();
        this.clearMsg();
    }

    public clearMsg(): void {
        this.msg.innerHTML = '';
    }

    public setMessage(str: String): void {
        this.msg.innerHTML += str + '<br>';
    }
}