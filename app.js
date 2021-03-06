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
	var percolationBoard = null;

	var width = 600;
	var height = 600;
	var margin = 10;

	var SHAPES = {
		TRIANGLE: 0,
		HEX: 1,
		SQUARES: 2
	};

	var COLORS = {
		1: 'rgba(0, 0, 0, 256)',
		0: 'rgba(0, 256, 0, 256)',
		2: 'rgba(0, 0, 256, 256)'
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
		iInterval: $('iInterval'),
		bBoard: $('bBoard'),
		cCanvas: $('cCanvas'),
		cTreshold: $('cTreshold'),
		iProb: $('iProb')
	};

	var GUIInfos = {
		init: 'inicjowanie...',
		ready: 'gotowy...',
		sendToServer: 'wysłano dane na serwer',
		receivedMessage: 'otrzymano dane',
		closedWS: 'połączenie zamknięte',
		errorWS: 'błąd połączenia',
		errorCalc: 'błąd programu',
		drawing: 'animacja...',
		endDrawing: 'zakończono animację',
		preparingDraw: 'przygotowywanie animacji'
	};

	GUI.bRun.addEventListener('click', function(event) {
		var data = {
			'grid-type': GUISHAPES[GUI.sGrid.options[GUI.sGrid.selectedIndex].value],
			height: GUI.iHeight.value,
			width: GUI.iWidth.value,
			steps: GUI.iSteps.value,
			type: 'treshold'
		};
		console.log('send message', data);
		ws.send(JSON.stringify(data));

		GUI.changeInfo(GUIInfos.sendToServer);

	}, false);

	GUI.bBoard.addEventListener('click', function(event) {
		var data = {
			'grid-type': GUISHAPES[GUI.sGrid.options[GUI.sGrid.selectedIndex].value],
			height: GUI.iHeight.value,
			width: GUI.iWidth.value,
			steps: GUI.iSteps.value,
			probability: GUI.iProb.value,
			type: 'graph'
		};

		console.log('send message', data);
		ws.send(JSON.stringify(data));

		GUI.changeInfo(GUIInfos.sendToServer);
	}, false);


	GUI.changeInfo = function changeInfo(newInfo) {
		GUI.cdInfo.innerHTML = newInfo;
		console.log('changed', newInfo);
	};

	//------------------

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	function Square(vertices, color) {
		this.color = color;
		this.vertices = vertices;

		this.draw = function draw(ctx) {
			var vertices = this.vertices;
			var width = Math.abs(vertices[0].x - vertices[1].x) > 0 ? Math.abs(vertices[0].x - vertices[1].x) : Math.abs(vertices[1].x - vertices[2].x);
			var height = Math.abs(vertices[0].y - vertices[1].y) > 0 ? Math.abs(vertices[0].y - vertices[1].y) : Math.abs(vertices[1].y - vertices[2].y);

			ctx.fillStyle = COLORS[this.color];
			ctx.fillRect(vertices[0].x, vertices[0].y, width, height);
		};


	}

	function Triangle(vertices, color) {
		this.color = color;
		this.vertices = vertices;

		this.draw = function draw(ctx) {
			var vertices = this.vertices;

			ctx.beginPath();
			ctx.fillStyle = COLORS[this.color];
			ctx.moveTo(vertices[0].x, vertices[0].y);
			ctx.lineTo(vertices[1].x, vertices[1].y);
			ctx.lineTo(vertices[2].x, vertices[2].y);
			ctx.lineTo(vertices[0].x, vertices[0].y); //not necessary
			ctx.fill();

		}
	}


	function Hex(vertices, color) {
		this.color = color;
		this.vertices = vertices;

		this.draw = function draw(ctx) {
			var vertices = this.vertices;

			ctx.beginPath();
			ctx.fillStyle = COLORS[this.color];
			ctx.moveTo(vertices[0].x, vertices[0].y);
			ctx.lineTo(vertices[1].x, vertices[1].y);
			ctx.lineTo(vertices[2].x, vertices[2].y);
			ctx.lineTo(vertices[3].x, vertices[3].y);
			ctx.lineTo(vertices[4].x, vertices[4].y);
			ctx.lineTo(vertices[5].x, vertices[5].y);
			ctx.lineTo(vertices[0].x, vertices[0].y); //not necessary
			ctx.fill();
		}
	}

	//--------------------------------------

	function PercolationBoard(canvasId, wNumber, hNumber, type) {
		var that = this;
		var canvas = $(canvasId);
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgba(256, 256, 256, 256)';


		this.width = 600;
		this.height = 600;
		this.margin = 5;

		var steps = [];
		var iteration = 0;

		this.wNumber = wNumber;
		this.hNumber = hNumber;

		ctx.fillRect(0, 0, this.width, this.height);


		this.drawTriangles = function drawTriangles() {
			interval = window.setInterval(drawS, parseInt(GUI.iInterval.value));
		};

		this.drawHexes = function drawHexes() {
			interval = window.setInterval(drawS, parseInt(GUI.iInterval.value));
		};

		var step = 0;
		var interval = null;

		function drawS() {
			var ss = steps[step];

			for(var i = 0, is = ss.length; i < is; ++i) {
				var s = ss[i];
				for(var j = 0, js = s.length; j < js; ++j) {
					s[j].draw(ctx);
				}
			}

			++step;
			if(step == steps.length) {
				window.clearInterval(interval);
				GUI.changeInfo(GUIInfos.endDrawing);
			}
		}

		this.drawSquares = function drawSquares() {
			interval = window.setInterval(drawS, parseInt(GUI.iInterval.value));
		};

		this.draw = function draw() {
		};


		function prepareSquares(data) {
			GUI.changeInfo(GUIInfos.preparingDraw);
			var width = that.width;
			var height = that.height;
			var margin = that.margin;

			var side = (width - 2 * margin) / wNumber;
			var vertices = [];

			for(var i = 0, is = data.length; i < is; ++i) {
				var xs = margin;
				var ys = margin;
				var currStep = [];
				var s = data[i];
				for(var j = 0, js = s.length; j < js; ++j) {
					var row = s[j];
					var squares = [];

					xs = margin;


					for(var k = 0, ks = row.length; k < ks; ++k) {

						var vertices = [new Point(xs, ys), new Point(xs + side, ys), new Point(xs, ys + side), new Point(xs + side, ys + side)];
						squares.push(new Square(vertices, row[k]));
						xs += side;
					}

					ys += side;
					currStep.push(squares);

				}

				steps.push(currStep);
			}

			GUI.changeInfo(GUIInfos.drawing);

			that.drawSquares();
		}

		function prepareTriangles(data) {
			GUI.changeInfo(GUIInfos.preparingDraw);
			var width = that.width;
			var height = that.height;
			var margin = that.margin;

			var side = Math.min((width - 2 * margin) / (wNumber / 2 + 1), (height - 2 * margin) / (hNumber + 1));
			var halfSide = side / 2;
			var trHeight = (side * Math.sqrt(3)) / 2;

			for(var i = 0, is = data.length; i < is; ++i) {
				var s = data[i];

				var firstDown = true;

				var xs = firstDown ? margin : margin + halfSide;
				var ys = margin;

				var currStep = [];

				for(var j = 0, js = s.length; j < js; ++j) {
					var row = s[j];
					var rowLen = row.length;
					var triangles = [];

					xs = firstDown ? margin : margin;
					var odd = true;

					if(firstDown) { //down
						for(var k = 0; k < rowLen; ++k) {
							var color = row[k];
							if(odd) { //down
								var vertices = [new Point(xs, ys), new Point(xs + side, ys), new Point(xs + halfSide, ys + trHeight)];
								triangles.push(new Triangle(vertices, color));
							} else { //up
								var vertices = [new Point(xs + halfSide, ys), new Point(xs, ys + trHeight), new Point(xs + side, ys + trHeight)];
								triangles.push(new Triangle(vertices, color));
							}

							xs += halfSide;
							odd = !odd;
						}
					} else { //up
						for(var k = 0; k < rowLen; ++k) {
							var color = row[k];
							if(odd) { //down
								var vertices = [new Point(xs + halfSide, ys), new Point(xs, ys + trHeight), new Point(xs + side, ys + trHeight)];
								triangles.push(new Triangle(vertices, color));
							} else { //up
								var vertices = [new Point(xs, ys), new Point(xs + side, ys), new Point(xs + halfSide, ys + trHeight)];
								triangles.push(new Triangle(vertices, color));
							}

							xs += halfSide;
							odd = !odd;
						}
					}


					ys += trHeight;
					firstDown = !firstDown;
					currStep.push(triangles);
				}

				steps.push(currStep);

			}


			GUI.changeInfo(GUIInfos.drawing);

			that.drawTriangles();
		}

		function prepareHex(data) {
			GUI.changeInfo(GUIInfos.preparingDraw);
			var width = that.width;
			var height = that.height;
			var margin = that.margin;

			var mSide = (width - 3 * margin) / (Math.max(wNumber, hNumber) + 2);
			var halfSide = mSide / 2;
			var side = mSide / Math.sqrt(3);
			var miniHeight = side / 2;
			//correcting
			mSide = wNumber < hNumber ? mSide * (Math.sqrt(3) / 2) : mSide;
			halfSide = mSide / 2;
			side = mSide / Math.sqrt(3);
			miniHeight = side / 2;

			for(var i = 0, is = data.length; i < is; ++i) {
				var oddR = true;

				var xs = oddR ? margin : margin + halfSide;
				var ys = margin + miniHeight;
				var currStep = [];
				var s = data[i];

				for(var j = 0, js = s.length; j < js; ++j) {
					var row = s[j];
					var hexes = [];

					xs = oddR ? margin : margin + halfSide;

					for(var k = 0, ks = row.length; k < ks; ++k) {
						var vertices = [new Point(xs, ys), new Point(xs + halfSide, ys - miniHeight), new Point(xs + mSide, ys), new Point(xs + mSide, ys + side), new Point(xs + halfSide, ys + side + miniHeight), new Point(xs, ys + side)];

						hexes.push(new Hex(vertices, row[k]));
						xs += mSide;
					}

					ys += side + miniHeight;
					currStep.push(hexes);
					oddR = !oddR;
				}


				steps.push(currStep);
			}

			GUI.changeInfo(GUIInfos.drawing);
			that.drawHexes();

		}

		this.prepareData = function prepareData(data) {
			steps = [];
			iteration = 0;

			switch(type) {
				case GUISHAPES.Kwadratowa:
					prepareSquares(data);
					break;
				case GUISHAPES.Sześciokątna:
					prepareHex(data);
					break;
				case GUISHAPES.Trójkątna:
					prepareTriangles(data);
					break;
			}

		};

	}

	function PercolationGraph(canvasId) {
		var canvas = $(canvasId);
		var ctx = canvas.getContext('2d');
		var chart = new Chart(ctx);
		var lineChart = null;

		var datasetOptions = {
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

			var dataset = JSON.parse(JSON.stringify(datasetOptions));
			dataset.data = values;

			prepared.labels = labels;
			prepared.datasets = [dataset];


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

			GUI.changeInfo(GUIInfos.receivedMessage);

			switch(type) {
				case 'treshold':
					console.log('treshold');
					GUI.cCanvas.style.display = 'none';
					GUI.cTreshold.style.display = 'block';
					percolationGraph.prepareData(data);
					break;
				case 'graph':
					console.log('graph');
					GUI.changeInfo(GUIInfos.preparingDraw);
					percolationBoard = new PercolationBoard('cCanvas', parseInt(GUI.iWidth.value), parseInt(GUI.iHeight.value), GUISHAPES[GUI.sGrid.options[GUI.sGrid.selectedIndex].value]);
					GUI.cTreshold.style.display = 'none';
					GUI.cCanvas.style.display = 'block';
					percolationBoard.prepareData(data.data);
					break;
				default:
					console.log('unknown type');
					break;
			}

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
		Chart.defaults.global.showTooltips = false;
		Chart.defaults.global.scaleOverride = true;
		Chart.defaults.global.scaleSteps = 10;
		Chart.defaults.global.scaleStartValue = 0;
		Chart.defaults.global.scaleStepWidth = 0.1;
	})();
})();