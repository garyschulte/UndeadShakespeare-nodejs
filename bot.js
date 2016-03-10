/*
"{\"attachments\":[],
\"avatar_url\":\"https://i.groupme.com/30757760d52f0130eea0526da9964391\",
\"created_at\":1457572369,
\"group_id\":\"20116625\",
\"id\":\"145757236932018952\",
\"name\":\"gary schulte\",
\"sender_id\":\"12403795\",
\"sender_type\":\"user\",
\"source_guid\":\"63c117a4677ffc743c52e6831cf6c7e1\",
\"system\":false,
\"text\":\"/undead\",
\"user_id\":\"12403795\"}"
*/
var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var insult = require('shakespeare-insult');

var botID = '20290776a96657c2adb3a17d46';//process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/(undead|us)/i;

  if (request.group_id == "20116625") {
    // test cutpaste group
    botId = '20290776a96657c2adb3a17d46';
  } else {
    botId = process.env.BOT_ID;
  }

  if (true) {
    //(request.name.substring(0,6) != "Undead" && botRegex.test(request.text)) || request.group_id='20116625'
    // && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(JSON.stringify(this.req.chunks[0]));
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(msg) {
  var botResponse, options, body, botReq;

  botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : msg
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
