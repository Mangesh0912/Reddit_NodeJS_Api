API For Reddit:

How to run :
Run NPM Install to install the nodemodules and then navigate to server folder and reddit-api.js file and start the server
from cmd using node reddit-api.js command. Node version used is v14.4.0

Create A User:
url: http://localhost:3000/createUser
method: POST
Request Params:{
    "userName": "Mangesh",
    "city": "Seattle",
    "country": "USA",
    "email": "mangesh091287@gmail.com"
}
Response : 201 for Sucess and error codes in case request fails.
=================================================================================================================================

Modify a User:
url: http://localhost:3000/modifyUser
method:PUT
Request Params: {
    "userName": "Mangesh",
    "email": "mangesh.kalsulkar@gmail.com"
}
Response: 202 for Success and 404 if not found and 500 for errors.

=================================================================================================================================
Add subreddits:
url: http://localhost:3000/addsubreddits
method: POST,
Request Params: {
  "userName": "Mangesh",
  "subreddits": ["world politics", "funny", "technologies"]
}
Response: 200 for Success and 404 if not found and 500 for errors.

=================================================================================================================================
Modify subreddits:
url: http://localhost:3000/modifySubreddits
method: POST
Request Params: {
    "userName": "Mangesh",
	"action": "deleteSubreddits",
	"subreddits": ["funny"]
}
Response: 200 for Success and 404 if not found and 500 for errors.

=================================================================================================================================
Turn on and off reddits:
url: http://localhost:3000/turnonandoffnewsletter
method: POST
Request Params: {
    "userName": "Mangesh",
	"newsLetterActivationFlag": true
}
Response: 200 for Success and 404 if not found and 500 for errors.

=================================================================================================================================

Process:
Run a scheduler everyday and during every run pick the user and schedule the emails according to their timezone and use following
sendmail api to schedule the emails:
send_at is the unix timestamp for the future date ( 8 AM schedule emails depending on user's timezone)

url: https://api.sendgrid.com/v3/mail/send
method: POST
Request Params: 
    {
  "personalizations": [
    {
      "to": [
        {
          "email": "mangesh091287@gmail.com"
        }
      ],
      "subject": "Hello, World!"
    }
  ],
  "from": {
    "email": "sckusa2012@gmail.com"
  },
  "content": [
    {
      "type": "text/plain",
      "value": "Hello, World!"
    }
  ],
  "send_at": 1594370727

}
=================================================================================================================================
