import {User} from './User';
import { SocketState } from './SocketState';

export class Game {
    public users: User[];
    public hostId: string;
    public gameCode: string;

    constructor(gameCode) {
        this.gameCode = gameCode;
    }

    public addUser(user: User) {

    }


}