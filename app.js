(function() {
	function $(id) {
		return document.getElementById(id);
	}
	//----------
	var ws = null;
	var host = 'ws://localhost:8081';
	var protocol = 'echo-protocol';

	//----------

	var percolation = null;
	var percolationGraph = null;

	var width = 600;
	var height = 600;
	var margin = 10;

	var SHAPES = {
		TRIANGLE: 0,
		HEX: 1,
		SQUARES: 2
	};
	
	var COLORS = {
		EMPTY: '#ffffff',
		BLOCKED: '#00ff00',
		SATURATED: '#ff0000'
	};

	var GUISHAPES = {
		'Kwadratowa': 'squares',
		'Trójkątna': 'triangles',
		'Sześciokątna': 'hexagons'
	};
	//------------------
	
	var GUI = {
		bRun: $('bRun'),
		sGrid: $('sGrid'),
		iHeight: $('iHeight'),
		iWidth: $('iWidth'),
		iSteps: $('iSteps'),
		cdInfo: $('cdInfo'),
		iInterval: $('iInterval')
	};

	var GUIInfos = {
		init: 'inicjowanie...',
		ready: 'gotowy...',
		sendToServer: 'wysłano dane na serwer',
		receivedMessage: 'otrzymano dane',
		closedWS: 'połączenie zamknięte',
		errorWS: 'błąd połączenia',
		errorCalc: 'błąd programu'
	};

	GUI.bRun.addEventListener('click', function(event) {
		var data = {
			'grid-type': GUISHAPES[GUI.sGrid.options[GUI.sGrid.selectedIndex].value],
			height: GUI.iHeight.value,
			width: GUI.iWidth.value,
			steps: GUI.iSteps.value
		};
		console.log('send message', data);
		ws.send(JSON.stringify(data));

		GUI.changeInfo(GUIInfos.sendToServer);

	}, false);

	GUI.changeInfo = function changeInfo(newInfo) {
		GUI.cdInfo.innerHTML = newInfo;
	};
	
	//------------------
	
	function Shape() {
		this.color = COLORS.EMPTY;
		this.vertices = [];
		
		this.draw = function draw() {};
	}
	
	function Triangle() {
		
	}
	
	Triangle.prototype = new Shape();
	Triangle.prototype.constructor = Triangle;
	
	function Hex() {
	}
	
	Hex.prototype = new Shape();
	Hex.prototype.constructor = Hex;
	
	function Square() {
	}
	
	Square.prototype = new Shape();
	Square.prototype.constructor = Square;
	
	
	//--------------------------------------
	
	function PercolationBoard(canvasId) {
		var canvas = $(canvasId);
		var ctx = canvas.getContext('2d');



		this.width = 600;
		this.height = 600;


		
		
		this.drawTriangles = function drawTriangles() {
		};
		
		this.drawHexes = function drawHexes() {
		};
		
		this.drawSquares = function drawSquares() {
		};
		
		this.draw = function draw() {
		};

		this.iterate = function iterate() {

		};
		
	}
	
	function PercolationGraph(canvasId) {
		var canvas = $(canvasId);
		var ctx = canvas.getContext('2d');
		var chart = new Chart(ctx);
		var lineChart = null;

		var options = {
			label: 'Percolation graph',
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)"
		};
		var prepared = null;

		this.width = 300;
		this.height = 400;

		this.prepareData = function prepareData(data) {
			//split to labels and data
			prepared = {};
			data = data.data;
			var labels = [];
			var values = [];

			for(var i = 0, is = data.length; i < is; ++i) {
				var item = data[i];
				labels.push(item.prob);
				values.push(item.value);
			}

			var dataset = JSON.parse(JSON.stringify(options));
			dataset.data = values;

			prepared.labels = labels;
			prepared.datasets = [dataset];

			console.log('ASD', labels, values, prepared);


			this.draw();

			return prepared;
		};

		this.draw = function draw(data) {
			chart.Line(prepared);
		};
	}
	
	function Percolation() {
		var board = new PercolationBoard();
		var graph = new PercolationGraph();
		
		this.drawTreshold = function drawTreshold(data) {

		};


	}
	
	//------------------------------------------
	
	(function init() {
		GUI.changeInfo(GUIInfos.init);

		//percolation = new Percolation();

		percolationGraph = new PercolationGraph('cTreshold');

		ws = new WebSocket(host, protocol);

		ws.onopen = function(event) {
			console.log('Opened websocket', host);
			GUI.changeInfo(GUIInfos.ready);
		};

		ws.onmessage = function(event) {
			console.log(event.data);
			var data = JSON.parse(event.data);
			var type = data.type;

			switch(type) {
				case 'treshold': console.log('treshold'); percolationGraph.prepareData(data);break;
				default: console.log('unknown type'); break;
			}
			GUI.changeInfo(GUIInfos.receivedMessage);
		};

		ws.onclose = function(event) {
			console.log('Closed websocket');
			GUI.changeInfo(GUIInfos.closedWS);
		};

		ws.onerror = function(event) {
			console.warn('Websocket error!');
			GUI.changeInfo(GUIInfos.errorWS);
		};

		//Chart.defaults.global.animation = false;
	})();
})();