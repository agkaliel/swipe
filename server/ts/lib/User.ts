export class User {
    socket: any;
    username: string;
    
    constructor(socket, username) {
        this.socket = socket;
        this.username = username;
    }
}