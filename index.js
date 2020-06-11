const ui = require("./ui.js");
const irc = require('irc');
const readline = require('readline');
const NodeRSA = require('node-rsa');

var myKey = null;
var theirKey = null;

var channels = [];
var currentChannel = "";

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var client = new irc.Client(process.argv[2], process.argv[3], {});

ui.clearScreen();
ui.displayChannels(channels, channels.indexOf(currentChannel));

ui.helpBar();
ui.bottomBar();

client.addListener('pm', function (from, message) {

  var actualMessage = "";

  if (message.startsWith("-----BEGIN PUBLIC KEY-----")) {

    theirKey = new NodeRSA().importKey(message.replace(/!/gm, "\n"), 'pkcs8');

  } else {

    if (myKey == null) {

      actualMessage = message;

    } else {

      actualMessage = userKey.decrypt(message, 'utf8');

    }

  }

  ui.clearScreen();
  ui.displayChannels(channels, channels.indexOf(currentChannel));
  ui.showNotification(0, `PM From ${from}`);
  ui.helpBar();
  ui.displayMessages(currentChannel);
  ui.bottomBar();

});

rl.on('line', function(line) {

  if (line.startsWith(":")) {

    switch (line.split(" ")[0]) {
      case ":pm":
        client.say(line.split(" ")[1], line.split(" ").slice(2, line.split(" ").length).join(" "));

        ui.clearScreen();
        ui.displayChannels(channels, channels.indexOf(currentChannel));
        ui.notice("private messaged: " + line.split(" ")[1], currentChannel);
        ui.displayMessages(currentChannel);
        ui.helpBar();
        ui.bottomBar();

        break;
      case ":pubkey":

        client.say(currentChannel, myKey.exportKey('pkcs8-public-pem').replace(/\n/g, "!"));

        ui.clearScreen();
        ui.displayChannels(channels, channels.indexOf(currentChannel));
        ui.notice("sent public key to channel", currentChannel);
        ui.displayMessages(currentChannel);
        ui.helpBar();
        ui.bottomBar();

        break;
      case ":genkey":

        myKey = new NodeRSA({b: 1024})

        ui.clearScreen();
        ui.displayChannels(channels, channels.indexOf(currentChannel));
        ui.displayMessages(currentChannel);
        ui.helpBar();
        ui.bottomBar();

        break;
      case ":open":

        currentChannel = line.split(" ").slice(1, line.split(" ").length).join(" ").toLowerCase();
        if (channels.indexOf(currentChannel) == -1) {

          channels.push(currentChannel);
          client.join(currentChannel);

        }

        client.addListener('message' + currentChannel, function (from, to, message) {

          var stringMessage = message.args[1];
          var actualMessage = "";

          if (stringMessage.startsWith("-----BEGIN PUBLIC KEY-----")) {

            theirKey = new NodeRSA().importKey(stringMessage.replace(/!/gm, "\n"), 'pkcs8-public-pem');

          } else {

            if (myKey == null) {

              actualMessage = stringMessage;

            } else {

              actualMessage = myKey.decrypt(stringMessage, 'utf8');

            }

          }

          ui.clearScreen();
          ui.displayChannels(channels, channels.indexOf(currentChannel));
          ui.showNotification(0, `Message From ${from}`);
          ui.helpBar();
          ui.message(from, actualMessage, currentChannel);
          ui.displayMessages(currentChannel);
          ui.bottomBar();

        });

        ui.clearScreen();
        ui.displayChannels(channels, channels.indexOf(currentChannel));
        ui.displayMessages(currentChannel);
        ui.helpBar();
        ui.bottomBar();

        break;
      default:
        ui.clearScreen();
        ui.displayChannels(channels, channels.indexOf(currentChannel));
        ui.notice("command not known", currentChannel);
        ui.displayMessages(currentChannel);
        ui.helpBar();
        ui.bottomBar();

    }

  } else {

    if (theirKey != null) {

      var encrypted = theirKey.encrypt(line, 'base64');
      client.say(currentChannel, encrypted);

    } else {

      client.say(currentChannel, line);

    }

    ui.clearScreen();
    ui.displayChannels(channels, channels.indexOf(currentChannel));
    ui.message("YOU", line, currentChannel);
    ui.displayMessages(currentChannel);
    ui.helpBar();
    ui.bottomBar();

  }

});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
