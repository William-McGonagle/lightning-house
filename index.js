var ui = require("./ui.js");
var irc = require('irc');
var readline = require('readline');

var channels = [];
var currentChannel = "#Node.js";

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var client = new irc.Client('irc.uk.mibbit.net', 'mamamama', {});

ui.clearScreen();
ui.drawLogo();
ui.displayChannels(channels, channels.indexOf(currentChannel));

ui.helpBar();
ui.bottomBar();

client.addListener('pm', function (from, message) {

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
      case ":open":

        currentChannel = line.split(" ").slice(1, line.split(" ").length).join(" ").toLowerCase();
        if (channels.indexOf(currentChannel) == -1) {

          channels.push(currentChannel);
          client.join(currentChannel);

        }

        client.addListener('message#' + currentChannel, function (from, to, message) {

          ui.clearScreen();
          ui.displayChannels(channels, channels.indexOf(currentChannel));
          ui.showNotification(0, `Message From ${from}`);
          ui.helpBar();
          ui.message(from, message, currentChannel);
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

    client.say(currentChannel, line);

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
