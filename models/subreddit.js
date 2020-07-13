
class Subreddit {

    constructor(subredditId, userName, subredditName, status) {
         this.subredditId = subredditId;
         this.userName = userName;
         this.subredditName = subredditName;
         this.status = status;
    }

    getUserName() {
        return this.userName;
    }

    getSubRedditId() {
        return this.subredditId;
    }

    getSubRedditName() {
        return this.subredditName;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = Subreddit;