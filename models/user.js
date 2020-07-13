class User {
    
    constructor( userName, city, subreddits, country, email, newsLetterStatus) {
            this.userName = userName;
            this.city = city;
            this.subreddits = subreddits;
            this.country = country;
            this.email = email;
            this.newsLetterStatus = newsLetterStatus;
    }

    getUserName() {
        return this.userName;
    }

    getCity() {
        return this.city;
    }

    setCity(city) {
        this.city = city;
    }

    getSubreddits() {
        return this.subreddits;
    }

    setSubreddits(subreddits) {
        this.subreddits = subreddits;
    }

    getCountry() {
        return this.country;
    }

    setCountry() {
         this.country = country;
    }

    getUserEmail() {
        return this.email;
    }

    setUserEmail(email) {
        this.email = email;
    }

    getNewsLetterStatus() {
        return this.newsLetterStatus;
    }

    setNewsLetterStatus(status) {
        this.newsLetterStatus = status;
    }
}

module.exports = User;