const cityTimeZones = require('city-timezones');
const moment = require('moment-timezone');
const axios = require("axios");

var schedule_email_by_time_zone = function scheduleEmailsForUsersByTimeZone(userInfo, emailText) {
    
    var senderEmailAddress = "sckusa2012@gmail.com";
    var recieverEmailAddress = userInfo.email;
    var value = emailText;
    var subject = "Reddits";
    var city = userInfo.city;
    var cityLookUp = cityTimeZones.lookupViaCity(city);
    var timeZone = cityLookUp[0].timezone;
    var currentTimeAtUserLocation = new Date().toLocaleString("en-US", {timeZone: timeZone});
    var dateParts = currentTimeAtUserLocation.split(",");
    var standardEmailSendingTime = dateParts[0] + " 8:00";
    //Check if 8 AM has passed at the user's location if it's not passed then schedule email for same date else for next day.
    var result = Date.parse(currentTimeAtUserLocation) < Date.parse(standardEmailSendingTime);
    var incrementedDate = "";
    var nonIncrementedDate = "";
    if(result === false) {
        var tmpDate = new Date(dateParts[0]);
        tmpDate.setDate(tmpDate.getDate() + 1);
        var modifiedMonth = tmpDate.getMonth() + 1;
        var modifiedDate = tmpDate.getDate();
        var modifiedMonthLength = modifiedMonth.toString().length;
        var modifiedDateLength = modifiedDate.toString().length;
    
        if(modifiedMonth < 10 && modifiedMonthLength < 2) {
           modifiedMonth = "0" + modifiedMonth;
        }
        if(modifiedDate < 10 && modifiedDateLength < 2) {
            modifiedMonth = "0" + modifiedMonth;
        }
        incrementedDate = [tmpDate.getFullYear(), modifiedMonth , modifiedDate].join("-");
    }
    else if(result === true) {
        var currentDate = dateParts[0].split("/");
        var month = currentDate[0];
        var day = currentDate[1];
        var year = currentDate[2];

        var monthLength = month.toString().length;
        var dayLength = day.toString().length;

        if(month < 10 && monthLength < 2) {
            month = "0" + month;
        }

        if(day < 10 && dayLength < 2) {
            day = "0" + day;
        }
        nonIncrementedDate = [year, month, day].join("-");
    }
    var prefixDate = (result) ? nonIncrementedDate : incrementedDate;
    console.log("Prefix date is :", prefixDate)
    const date = moment.tz(prefixDate + "T08:00:00", timeZone);
    const unixTimeStamp = date.unix();
    sendEmailToUser(emailText, subject, senderEmailAddress, recieverEmailAddress, unixTimeStamp);
    

}

//schedule email for the User depending on their timezoen
async function sendEmailToUser(emailText, subject, senderEmailAddress, recieverEmailAddress, unixTimeStamp) {

    console.log("Sender email is:", senderEmailAddress, " Reciever email address is:", recieverEmailAddress);
     
    const params = {
        personalizations: [
            {
                to: [
                    {
                       email: recieverEmailAddress 
                    }
                ],
                subject: "Top Subreddits"
            }
        ],
        from: {email: senderEmailAddress},
        content: [
           {
               type: "text/plain",
               value: emailText
           }
        ],
        send_at: unixTimeStamp
    }

    console.log(JSON.stringify(params));
    const data = params;

    const config = {
        method: 'post',
        url: 'https://api.sendgrid.com/v3/mail/send'
    }
    const options = {
        headers: {'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'}
    }

    try{
        let res = await axios.post(config.url, data, options);
        console.log("Email scheduled successfully!!")
       
    }catch(err) {
        console.log("Error happened when sending an email:", err);
    }

}


module.exports = {
    schedule_email_api: schedule_email_by_time_zone
};