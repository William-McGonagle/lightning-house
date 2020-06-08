var net = require('net');

var client = new net.Socket();
client.connect(6667, 'irc.uk.mibbit.net', function() {

  console.log('Connected');

  client.write('NICK amy');
  client.write('USER amy * * :Amy Pond');

});

client.on('data', function(data) {

	console.log(data.toString());
  client.write('JOIN #Node.js');
	// client.destroy();

});

client.on('close', function() {

	console.log('Connection closed');

});
