class ConfirmMoveButton {
    private element: HTMLButtonElement;

    public constructor(parent: Element, onClickCallback: () => void) {
        this.element = <HTMLButtonElement> parent.querySelector('.confirm-move-button');
        this.element.hidden = true;
        this.element.disabled = true;
        this.element.addEventListener('click', () => {
            onClickCallback();
        })
    }

    public hide() {
        this.element.hidden = true;
    }

    public show() {
        this.element.hidden = false;
    }

    public setEnabled(isEnabled: boolean) {
        this.element.disabled = !isEnabled;
    }
}