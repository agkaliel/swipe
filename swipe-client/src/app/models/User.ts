export class User {
    shortId: string;
    username: string;

    constructor(userData) {
        this.shortId = userData.shortId;
        this.username = userData.username;
    }
}
