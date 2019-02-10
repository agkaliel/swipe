class Game {
    private round: Round;
    public readonly newGameButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;

    public constructor() {
        this.newGameButton = <HTMLButtonElement> document.querySelector('.new-game-button');
        this.newGameButton.addEventListener('click', () => {
            this.onNewGameClick();
        });

        this.msg = <HTMLParagraphElement> document.querySelector('.msg');
    }

    private onNewGameClick() {
        this.clearMsg();
        this.round = new Round(document.querySelector('main')!);
        this.round.startRound();
        this.setMessage('Click on the card you wish to play');
    }

    public clearMsg(): void {
        this.msg.innerHTML = '';
    }

    public setMessage(str: String): void {
        this.msg.innerHTML += str + '<br>';
    }
}