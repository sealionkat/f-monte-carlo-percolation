var WebSocketServer = require('websocket').server;
var http = require('http');

var exec = require('child_process').execFile;


var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

server.listen(8081, function() {
	console.log((new Date()) + ' Server is listening on port 8081');
});

wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

var connection = null;

function originIsAllowed(origin) {
	return true;
}

wsServer.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	connection = request.accept('echo-protocol', request.origin);
	console.log((new Date()) + ' Connection accepted.');
	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			console.log('Received Message: ' + message.utf8Data);
			runPercolation(message.utf8Data);
			//connection.sendUTF(message.utf8Data);
		}
	});
	connection.on('close', function(reasonCode, description) {
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
});


//--------------------------------------

function sendData(data, type) {
	connection.sendUTF(JSON.stringify({data: data, type: type}));
}

function processGUIArgs(args) {
	var processedArgs = [];

	for(var arg in args) {
		if(arg !== 'steps' && args.hasOwnProperty(arg)) {
			processedArgs.push('--' + arg);
			processedArgs.push(args[arg]);
		}
	}

	return processedArgs;
}

function runProcess(args, currStep, stepInt, results) {
	var probability = currStep * stepInt;
	if(probability > 1) {
		console.log('end procc', probability);
		sendData(results, 'treshold');
		return 'max';
	}
	console.log('Current probability', probability);
	exec('Percolation(2).exe', args.concat(['--probability', probability, '--steps', 1000]), {}, function(err, stdout, stderr) {
		console.log('Error', err);
		console.log('Stdout', stdout);
		console.log('Stderr', stderr.toString());

		results.push({prob: probability.toFixed(2) , value: parseFloat((JSON.parse(stdout)).data)});

		runProcess(args, ++currStep, stepInt, results);

	});

}


function runPercolation(params) {
	var args;
	var calcs = [];
	var grids = [];

	var results = [];

	params = JSON.parse(params);
	console.log('Percolation run');
	args = processGUIArgs(params);

	var steps = parseFloat(params.steps);
	var error = null;


	runProcess(args, 0, 1 / steps, results);

	console.log('Percolation stopped');

}

