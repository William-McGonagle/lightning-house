const fs = require('fs');

var users = {};
var randomColoring = [
  "\u001b[31m",
  "\u001b[34m",
  "\u001b[35m"
];

var channelMessages = {};

function showNotification(yIndex, notificationText) {

  setCursorPosition((yIndex * 3) + 2, process.stdout.columns - 27);
  process.stdout.write(`╔════════════════════════╗`);
  setCursorPosition((yIndex * 3) + 3, process.stdout.columns - 27);
  process.stdout.write(`║${new Array(Math.floor((26 - notificationText.length) / 2)).join(" ") + notificationText + new Array(Math.ceil((26 - notificationText.length) / 2)).join(" ")}║`);
  setCursorPosition((yIndex * 3) + 4, process.stdout.columns - 27);
  process.stdout.write(`╚════════════════════════╝`);

}

function setCursorPosition(l, c) {

  process.stdout.write(`\x1b[${l};${c}H`);

}

function clearScreen() {

  process.stdout.write(`\x1b[2J`);

}

function bottomBar() {

  // bar
  setCursorPosition(process.stdout.rows - 3, 0);
  process.stdout.write(new Array(process.stdout.columns).join("_"));

  setCursorPosition(process.stdout.rows - 2, 4);

}

function displayMessages(channel) {

  if (channelMessages[channel] == undefined) channelMessages[channel] = [];

  for (var i = 0; i < channelMessages[channel].length; i++) {

    if (channelMessages[channel][i].username == undefined) {

      setCursorPosition(3 + i, 2);
      process.stdout.write(channelMessages[channel][i].message.toUpperCase());

    } else {

      setCursorPosition(3 + i, 2);
      process.stdout.write(users[channelMessages[channel][i].username].coloring + channelMessages[channel][i].username + ":\u001b[0m " + channelMessages[channel][i].message);

    }

  }

}

function drawLogo() {

  setCursorPosition(0, 0);
  process.stdout.write(fs.readFileSync(__dirname + "/logo.utf8ans"));

}

function message(user, message, channel) {

  if (users[user] == undefined) {

    users[user] = {
      coloring: randomColoring
    };

  }

  if (channelMessages[channel] == undefined) channelMessages[channel] = [];

  channelMessages[channel].push({
    username: user,
    message: message
  });

}

function notice(notice, channel) {

  if (channelMessages[channel] == undefined) channelMessages[channel] = [];

  channelMessages[channel].push({
    message: notice
  });

}

function displayChannels(channels, activeChannel) {

  var currentDistance = 1;

  for (var i = 0; i < channels.length; i++) {

    channelButton(channels[i], currentDistance, activeChannel == i);
    currentDistance += 4 + channels[i].length;

  }

}

function helpBar() {

  helpBarButton(2, ":help");
  helpBarButton(10, ":quit");
  helpBarButton(18, ":pm");
  helpBarButton(24, ":open");
  helpBarButton(32, ":who");

}

function channelButton(channelName, offset, active) {

  setCursorPosition(1, offset);

  if (active) {

    process.stdout.write(`\x1b[30m\x1b[47m ${channelName} \x1b[0m`);

  } else {

    process.stdout.write(` ${channelName} \x1b[0m`);

  }

}

function helpBarButton(x, text) {

  setCursorPosition(process.stdout.rows - 0, x);
  process.stdout.write(`\x1b[30m\x1b[47m ${text} \x1b[0m`);

}

// exports
exports.drawLogo = drawLogo;
exports.displayChannels = displayChannels;
exports.displayMessages = displayMessages;
exports.message = message;
exports.notice = notice;
exports.helpBar = helpBar;
exports.clearScreen = clearScreen;
exports.showNotification = showNotification;
exports.setCursorPosition = setCursorPosition;
exports.bottomBar = bottomBar;
