class Menu {
    private round: Game;
    public readonly newGameButton: HTMLButtonElement;
    public readonly userRegistrationElement: HTMLElement;
    public readonly usernameConfirmButton: HTMLButtonElement;
    public readonly usernameInput: HTMLInputElement;

    public readonly msg: HTMLParagraphElement;

    public constructor() {
        this.userRegistrationElement = <HTMLElement> document.querySelector('.user-registration');
        this.usernameInput = <HTMLInputElement> document.querySelector('.user-name');
        this.usernameConfirmButton = <HTMLButtonElement> document.querySelector('.confirm-username-button');
        this.usernameConfirmButton.addEventListener('click', () => {
            this.onConfirmUsernameClick();
        });

        this.newGameButton = <HTMLButtonElement> document.querySelector('.new-game-button');
        this.newGameButton.hidden = true;
        this.newGameButton.addEventListener('click', () => {
            this.onNewGameClick();
        });

        let confirmMoveButton = <HTMLButtonElement> document.querySelector('.confirm-move-button');
        confirmMoveButton.hidden = true;

        this.msg = <HTMLParagraphElement> document.querySelector('.msg');
    }

    private onNewGameClick() {
        this.clearMsg();
        this.round = new Game(document.querySelector('main')!);
        this.round.startRound();
        // this.setMessage('Click on the card you wish to play');
    }

    private onConfirmUsernameClick() {
        if (this.usernameInput.value.length) {
            let socket = io();
            socket.emit('user registration', this.usernameInput.value);
            this.userRegistrationElement.hidden = true;
            this.newGameButton.hidden = false;
        }
    }

    public clearMsg(): void {
        this.msg.innerHTML = '';
    }

    public setMessage(str: String): void {
        this.msg.innerHTML += str + '<br>';
    }
}