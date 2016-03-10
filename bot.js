var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var insult = require('shakespeare-insult');
var giphy = require('giphy');
var youtube = require('youtube-node');
var craigslist = require('node-craigslist');
var Sync = require('sync');

var botID = process.env.BOT_ID;

var botRegex = /^\/(undead|us)/i,
    whereRegex = /^.*where (.*)/i,
    giphyRegex = /^.*giphy (.*)/i,
    videoRegex = /^.*video(.*)/i,
    craigslistRegex = /^.*(craigslist|cl) (.*)/i;

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
    } else if (videoRegex.test(request.text)) {
        getVideo(request);
    } else if (craigslistRegex.test(request.text)) {
        getCraigslist(request);
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
           gif = new giphy('dc6zaTOxFJmzC').search.sync(null, {q : searchText, limit : 25});
           if (gif.data.length>0) {
               idx = Math.floor(gif.data.length * Math.random());
               console.log("giphy idx: " + idx);
               postImage(gif.data[idx].images.original.url);
           }
       })
}

function getVideo(request) {
    var searchText = request.text.replace(videoRegex, "$1");
    console.log("searching for " + searchText);
    Sync(function() {
        try {
            yt = new youtube();
            yt.setKey('AIzaSyBmp-11QshRogyx4RZCwceRoTwLB4TBaf8');
            tubes = yt.search.sync(null, searchText, 10);
            idx = Math.floor(tubes.items.length * Math.random());
            console.log("youtube idx: " + idx);
            //console.log("tubes: " + JSON.stringify(tubes));
            postMessage("http://www.youtube.com/watch?v="+tubes.items[idx].id.videoId)
        }catch(e){
            console.error(e);
        }
    })
}

function getCraigslist(request) {
    var searchText = request.text.replace(craigslistRegex, "$2");
    cl = craigslist({city : 'portland'});
    console.log("searching for " + searchText);
    Sync(function() {
        ads = cl.search.sync(null, searchText);
        console.log("ads: " + JSON.stringify(ads[0]));
        resp = "";
        for(i=0 ; i <= ads.length && i < 10; i++){
            resp += ads[i].url + "\n" + ads[i].title + "\n";
        }
        postMessage(resp);
    })
}

exports.respond = respond;
