import {User} from './User';

export class Game {
    public users: User[] = [];
    public hostId: string;
    public gameCode: string;

    constructor(gameCode: string, hostId: string) {
        this.gameCode = gameCode;
        this.hostId = hostId;
    }

    public addUser(userId: string, username: string): User {
        let user = new User(userId, username);
        this.users.push(user);
        return user;
    }

    public getGameState() {
        return {
            users: this.users.map(user => user.toJSON())
        };
    }


}