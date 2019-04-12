import {User} from "./User";

export class Controller {
    userQueue: User[] = [];

    constructor() {
    }

    addUserToQueue(user: User) {
        this.userQueue.push(user);
        console.log('userQueue: ', this.userQueue);
    }
}