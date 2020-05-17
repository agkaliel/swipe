export class User {
    socketId: string;
    private _username: string;
    
    constructor(socketId) {
        this.socketId = socketId;
    }

    set username(username: string) {
        this._username = username;
    }

    get username() {
        return this._username;
    }
}