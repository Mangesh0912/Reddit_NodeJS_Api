let  subredditsByTopicUrl = 'https://www.reddit.com/r/?/top.json?limit=3'
const fetch = require("node-fetch");
const axios = require("axios");

//get the top three subreddits in last 24 hours
var fetch_user_subreddits =  async function fetchSubreddits(subreddits) {

    let text = "";
    if(!subreddits || (subreddits && subreddits.length === 0)) {
        return text;
    }

    var arr = [];
    
    subreddits.forEach(value => {
        value = value.replace(" ","+");
        var subredditTopicUrl = subredditsByTopicUrl.replace("?", value);       
        const p1 = axios.get(subredditTopicUrl);
        arr.push(p1);
    });

    text = await runPromise(arr, subreddits);
    return text;
}

async function runPromise(arr, subreddits) {
    var text = "";
    const textReturned = await Promise.all(arr).then(async response => {     
         var arr = response;   
         for(let i = 0 ; i < arr.length; i++) {
             const response = arr[i].data;
             text = text + subreddits[i] + ":" + "\r\n";
             if(response) {
                 var children = response.data.children;
                     for(let i = 0 ; i < children.length ; i++) {
                        text = text + "Title:" + children[i].data.title +" Upvotes:" + children[i].data.ups + "\r\n";
                     }
                     text = text + "\r\n" + "==========================================="+"\r\n";
             }
         }

     });
    return text;
 } 

module.exports = {
    fetch_user_subreddits: fetch_user_subreddits
};