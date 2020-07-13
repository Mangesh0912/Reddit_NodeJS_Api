const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const fetch = require("node-fetch");
const fetch_user_subreddits_api = require("./subreddit-api")
const schedule_email_api = require("./email-scheduler-api");

const users = [];
const userMap = new Map();
const app = express();
const port = 3000;
const dayInMilliseconds = 1000 * 60 * 60 * 24


// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//create a user in system
app.post("/createUser", (req, res) => {   

 try {
    const userInfo = req.body;
    const {userName, city, country, email} = userInfo;
    if(userMap.has(userName)) {
        res.status(409).send({message: "User already exists!"});
    }
    const user = new User(userName, city, [], country, email, true);
    userMap.set(userName, user);
    res.status(201).send({message: "User added successfully!"});
 }
 catch(err) {
       res.status(500).send(err);
 }


});

//update the user in system
app.put("/modifyUser", (req, res) => {
     try{
         const userInfo = req.body;
         const {userName, city, country, email} = userInfo;
         console.log("user name is:", userName)
         if(!userMap.has(userName)) {
             res.status(404).send({message: "User not found!"})
         }

         const user = userMap.get(userName)
         if(city) {
             user.setCity(city);
         }
         if(country) {
             user.setCountry(country);
         }
         if(email) {
             user.setUserEmail(email);
         }
         res.status(200).send({message: "User data updated successfully!"});
     }
     catch(err) {
        res.status(500).send(err);
     }

})

//adding user subreddits
app.post("/addsubreddits", (req, res) => {
     try{
        const userSubRedditInfo = req.body;
        console.log('userSubRedditInfo is:', userSubRedditInfo);
        const userName = userSubRedditInfo.userName;
        const userSubRedditChannels = userSubRedditInfo.subreddits;
        if(!userMap.has(userName)) {
            res.status(404).send({message: "User not found!"})
        }
        let user = userMap.get(userName);
        let subreddits = user.getSubreddits();
        subreddits = subreddits.concat(userSubRedditChannels);
        user.setSubreddits(subreddits);
        res.status(200).send({message: "Subreddits added successfuly !"});
     }
     catch(err) {
        res.status(500).send(err);
     }
})

//modify - delete user user subreddits
app.post("/modifysubreddits", (req, res) => {
    try{
        const userSubRedditInfo = req.body;
        const userName = userSubRedditInfo.userName;
        const userSubRedditChannels = userSubRedditInfo.subreddits;
        const action = userSubRedditInfo.action;
        const userSubredditsTobeModified = userSubRedditInfo.subreddits;
        if(!userMap.has(userName)) {
            res.status(404).send({message: "User not found!"})
        }
        let user = userMap.get(userName);
        let subreddits = user.getSubreddits();
        let modifedSubreddits = [];

        if(action === "deleteSubreddits") {
           for(let i = 0 ; i < subreddits.length; i++) {
             if(userSubredditsTobeModified.indexOf(subreddits[i]) < 0) {
                 modifedSubreddits.push(subreddits[i]);
              }
           }
           user.setSubreddits(modifedSubreddits);
        }
        res.status(200).send({message: "Subreddits updated successfully!"});
    }
    catch(err) {
        res.status(500).send(err);
    }

})

//activate on or off flag for the subreddit
app.post("/turnonandoffnewsletter", (req, res) => {
    try {
       const userInfo = req.body;
       const userName = userInfo.userName;
       const turnOnOffFlag = userInfo.newsLetterActivationFlag;
       if(!userMap.has(userName)) {
          res.status(404).send({message: "User not found!"})
       }
       let user = userMap.get(userName);
       user.setNewsLetterStatus(turnOnOffFlag);
       res.status(200).send({message: "User newsletter updated successfully!"});
    }
    catch(err) {
        res.status(500).send(err);
    }
})


//schedule the timer to send the emails every 24 hours to email
let itr =  setInterval(function() {

       let map = userMap;
       map.forEach( (value, key , map) => {
            var subredditsArr =  value.subreddits;
            var newsLetterStatus = value.newsLetterStatus;
            if(newsLetterStatus) {
              var text = fetch_user_subreddits_api.fetch_user_subreddits(subredditsArr);
               text.then( v => {
                     schedule_email_api.schedule_email_api(value, v);
                  }
                 )
                .catch( err => console.log("Error is:", err)) 
             }           
         })
        
},dayInMilliseconds)

app.listen(port, () => console.log(`Reditt api app listening on port ${port}!`));
