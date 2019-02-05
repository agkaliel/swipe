class Game {
    private ui: UI;

    public constructor() {
        this.ui = new UI(document.querySelector('main')!);
        this.ui.newGameButton.addEventListener('click', () => {
            this.onNewGameClick();
        })
        this.ui.confirmMoveButton.addEventListener('click', () => {
            this.ui.playSelectedCards();
        });
    }

    private onNewGameClick() {
        this.reset();
        let round = new Round();
        round.draw();
        this.ui.addCards(round.getCards());
        this.ui.playMode();
        this.msg('Click on the card you wish to play');
    }

    private reset() {
        // ui.betMode();
        this.ui.clearPlayingArea();
        this.ui.clearCards();
        this.ui.enableCards();
        this.clearMsg();
    }

    public clearMsg(): void {
        // TODO: Move to UI classs
        this.ui.msg.innerHTML = '';
    }

    public msg(str: String): void {
        // TODO: Move to ui class
        this.ui.msg.innerHTML += str + '<br>';
    }


}