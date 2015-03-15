
(function() {
	'use strict';
	var S_BUTTON = 83;
	var R_BUTTON = 82;
	var L_BUTTON = 76;
	var lastMouseTarget;
	function Stopwatch(queryNode) {
		this.createStopwatch(queryNode);
		this.node = queryNode;
		this.startStopButtonNode = this.node.querySelector('.start-btn');
		this.currentTimeNode = this.node.querySelector('.stopwatch-current');
		this.startStopButtonNode.addEventListener('click', this.startStopwatch.bind(this), false);
		document.documentElement.addEventListener('keyup', this._globalKeyup , false);
		this.node.addEventListener('mouseenter', this._globalMouseEvent.bind(this) , false);
		this.lapButtonNode = this.node.querySelector('.btn-info');
		this.lapButtonNode.addEventListener('click', this.addLap.bind(this), false);
		this.lapsHolder = this.node.querySelector('.stopwatch-laps');
		this.resetButtonNode = this.node.querySelector('.btn-sm');
		this.resetButtonNode.addEventListener('click', this.resetStopwatch.bind(this), false);
		this.node.addEventListener('click', function(event) {
			if (event.target.classList.contains('label-danger')) {
				event.target.parentNode.style.display = 'none';
			}
		}, false);
		this.elapsedTime = 0;
		this.intervalId = null;
	}

	Stopwatch.prototype.createStopwatch = function(node) {
		node.innerHTML = '<div class="container"><div class = "row"><div class = "col-xs-4"><h2 class = "stopwatch-current"> 00:00:00:000 </h2><div class = "stopwatch-laps"></div></div><div class = "col-xs-4 stopwatch-controls"><div class = "btn-group btn-group-lg"><button class = "btn btn-primary start-btn"> Start </button> <button class = "btn btn-info"> Lap </button></div><button class = "btn btn-danger btn-sm"> Reset </button></div></div></div>';
	};
	Stopwatch.prototype.stop = function() {
		clearInterval(this.intervalId);
		this.intervalId = null;
		this.startStopButtonNode.innerText = ' Start ';
	};
	Stopwatch.prototype.startStopwatch = function() {
		if (this.intervalId) {
			this.stop();
			return;
		}
		this.startStopButtonNode.innerText = ' Stop ';
		var _this = this;
		var lastUpdateTime = (new Date()).getTime();
		this.intervalId = setInterval(function() {
			var nextTicTime = (new Date()).getTime();
			_this.elapsedTime += (nextTicTime - lastUpdateTime);
			lastUpdateTime = nextTicTime;
			console.log(_this.drawTime());
		}, 16);
	};

	Stopwatch.prototype.resetStopwatch = function() {
		this.stop();
		this.elapsedTime = 0;
		this.currentTimeNode.innerText = '00:00:00:000';
		this.lapsHolder.innerHTML = '';
	};
	Stopwatch.prototype.addLap = function() {
		this.lapTime = this.currentTimeNode.innerText;
		var lapNode = document.createElement('div');
		lapNode.classList.add('alert');
		lapNode.classList.add('alert-info');
		lapNode.innerHTML = '' + this.lapTime + '<span class="label label-danger">×</span>';
		this.lapsHolder.insertBefore(lapNode, this.lapsHolder.firstChild);
	};
	Stopwatch.prototype.removeLap = function() {

	};
	Stopwatch.prototype.drawTime = function() {
		this.currentTimeNode.innerText = this.formatTime(this.elapsedTime);
	};
	Stopwatch.prototype.formatTime = function(elapsedTime) {
		var timer = elapsedTime / 1000;
		var hour = 0;
		var minute = 0;
		var second = 0;
		var msecond = 0;
		var formattedTime = '';
		hour = Math.floor(timer / 3600);
		minute = Math.floor((timer - hour * 3600) / 60);
		second = Math.floor(timer - hour * 3600 - minute * 60);
		msecond = Math.floor((timer - hour * 3600 - minute * 60 - second) * 1000);
		if (hour < 10) hour = '0' + hour;
		if (minute < 10) minute = '0' + minute;
		if (second < 10) second = '0' + second;
		if (msecond < 100) msecond = '0' + msecond;
		formattedTime = hour + ':' + minute + ':' + second + ':' + msecond;
		return formattedTime;
	};
	Stopwatch.prototype._globalKeyup = function(event) {
		if (lastMouseTarget) {
			if (event.keyCode === S_BUTTON) {
				lastMouseTarget.startStopwatch();
			}
			if (event.keyCode === R_BUTTON) {
				lastMouseTarget.resetStopwatch();
			}
			if (event.keyCode === L_BUTTON) {
				lastMouseTarget.addLap();
			}
		}
	};
	Stopwatch.prototype._globalMouseEvent = function(event) {
		lastMouseTarget = this;
	};
	window.Stopwatch = Stopwatch;
}());