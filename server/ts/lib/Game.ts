import {User} from './User';

export class Game {
    hostUser: User
    player2: User;

    constructor(hostUser: User) {
        this.hostUser = hostUser;
    }

    public addUser(user: User) {

    }
}