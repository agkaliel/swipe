import {User} from "./User";

export class Controller {
    userQueue: User[] = [];

    constructor() {
    }

    addUserToQueue(user: User) {
        this.userQueue.push(user);
        console.log('userQueue: ');
        this.userQueue.forEach(user => console.log('name: ', user.username));
    }

    removeUserFromQueue(socket) {
        console.log('removing, id: ', socket.id);


    }
}