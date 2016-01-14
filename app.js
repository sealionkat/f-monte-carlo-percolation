(function() {
	function $(id) {
		return document.getElementById(id);
	}
	//----------
	var host = 'ws://localhost:8081';
	var protocol = 'echo-protocol';
	var ws = new WebSocket(host, protocol);

	ws.onopen = function(event) {
		console.log('Opened websocket', host);
	};

	ws.onmessage = function(event) {

	};

	ws.onclose = function(event) {
		console.log('Closed websocket');
	};

	ws.onerror = function(event) {
		console.warn('Websocket error!');
	};

	//----------

	var SHAPES = {
		TRIANGLE: 0,
		HEX: 1,
		SQUARES: 2
	};
	
	var COLORS = {
		EMPTY: '#ffffff',
		NORMAL: '#00ff00',
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
		iSteps: $('iSteps')
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
	}, false);
	
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
	
	function PercolationBoard() {
		var canvas = $('cCanvas');
		var ctx = this.canvas.getContext('2d');
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
		
	}
	
	function PercolationGraph() {
		this.canvas = null;
	}
	
	function Percolation() {
		var board = new PercolationBoard();
		var graph = new PercolationGraph();
		
		
	}
	
	//------------------------------------------
	
	(function init() {
		
	})();
})();