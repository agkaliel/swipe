export class User {
    static SHORT_ID_LENGTH = 5;

    userId: string;
    username: string;
    
    constructor(userId: string, username: string) {
        this.userId = userId;
        this.username = username;
    }

    getShortId(): string {
        return this.userId.substr(0, User.SHORT_ID_LENGTH);
    }

    toJSON() {
        return {
            shortId: this.getShortId(),
            username: this.username
        }
    }
}