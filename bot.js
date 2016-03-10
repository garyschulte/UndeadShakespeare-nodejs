var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var insult = require('shakespeare-insult');
var giphy = require('giphy');
var Sync = require('sync');

var botID = process.env.BOT_ID;

var botRegex = /^\/(undead|us)/i,
    whereRegex = /^.*where (.*)/i,
    giphyRegex = /^.*giphy (.*)/i;

botRegex = /^\/(undead|us)/i;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);

  if (request.group_id == "20116625") {
    // test cutpaste group
    botID = '20290776a96657c2adb3a17d46';
  }

  if (request.name.substring(0,6) != "Undead" && botRegex.test(request.text)) {
    this.res.writeHead(200);
    if (whereRegex.test(request.text)) {
        getWhere(request);
    } else if (giphyRegex.test(request.text)) {
        getGiphy(request);
    } else {
        postMessage("You talkin' to me?");
    }
    this.res.end();

  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(msg){
    post({
        "bot_id" : botID,
        "text" : msg
    });
}

function postImage(img){
  post({
      "bot_id" : botID,
      "attachments" : [{"type" : "image", "url" : img}]
  });
}

function post(body) {
  var botResponse, options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  console.log('sending ' + body + ' to ' + botID);

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

function getWhere(request){

}

function getGiphy(request){
    var searchText = request.text.replace(giphyRegex, "$1");
    console.log("searching for " + searchText);
       Sync(function() {
           gif = new giphy('dc6zaTOxFJmzC').search.sync(null, {q : searchText, limit : 1});
           console.log(gif)
           //console.log(gif.data[0]);
           postImage(gif.data[0].images.original.url);
       })
}

exports.respond = respond;
