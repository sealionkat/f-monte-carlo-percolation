(function() {
	function $(id) {
		return document.getElementById(id);
	}
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
	//------------------
	
	var GUI = {};
	
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