'use strict';
(function() {
	function Slider(node, arr) {
			var _this = this;
			this.node = node;
			this.startAutoPlayingTimout = 0; // обнуление таймаута автопрокрутки
			this.sliding = 0;
			this.numberOfButton = 0;
			this.arrOfImages = arr.slice();
			this.buildSlider(arr);
			this.buildTriangle();
			this.autoplay();
			$('.navigation > div', this.node).click(function() {
				_this.goToSLide(this);
			});
		}
		//Строим слайдер
	Slider.prototype.buildSlider = function(arr) {
		this.sliderInner = '<div class="navigation"><div></div><div></div><div></div><div></div></div><div class="images"><div><img src=' + arr[0] + ' alt=""><img src=' + arr[1] + ' alt=""><img src=' + arr[2] + ' alt=""><img src=' + arr[3] + ' alt=""></div></div>';
		this.node.innerHTML = this.sliderInner;
	};
	//Создание треугольника кнопки
	Slider.prototype.buildTriangle = function(arr) {
		this.sliderButtons = $('.navigation div', this.node);
		this.sliderButtons.append('<div class="triangle"></div>');
	};
	//Автопрокрутка
	Slider.prototype.autoplay = function() {
		var _this = this;
		this.slideWidth = $('.images img', this.node).outerWidth();
		this.slideHolder = $('.images > div', this.node);
		this.sliderButtons = $('.navigation > div', this.node);
		this.sliderButtonTriangle = $('.triangle', this.node);
		//Подсвечивание начальной кнопки и треугольника
		_this.sliderButtons.eq(_this.numberOfButton).css('background', '#F06028');
		_this.sliderButtonTriangle.eq(_this.numberOfButton).css('display', 'block');
		//Установка автопрокрутки	
		this.autoplayingInterval = setInterval(function() {
			_this.sliding += _this.slideWidth;
			//Удаления подсветки предыдущей кнопки и треугольника
			_this.sliderButtons.eq(_this.numberOfButton).css('background', 'none');
			_this.sliderButtonTriangle.eq(_this.numberOfButton).css('display', 'none');
			_this.numberOfButton += 1;
			//Подсвечивание следующей кнопки и треугольника
			_this.sliderButtons.eq(_this.numberOfButton).css('background', '#F06028');
			_this.sliderButtonTriangle.eq(_this.numberOfButton).css('display', 'block');
			//Условие перехода на первый слайд
			if (_this.sliding >= 2372) {
				_this.numberOfButton = 0;
				_this.sliderButtons.eq(_this.numberOfButton).css('background', '#F06028');
				_this.sliderButtonTriangle.eq(_this.numberOfButton).css('display', 'block');
				_this.sliding = 0;
				_this.slideHolder.animate({
					marginLeft: 0
				}, 1000);
			}
			//Анимация слайдера
			_this.slideHolder.animate({
				marginLeft: -_this.sliding
			}, 1000);
		}, 2000);
	};
	//Переход к нужному слайду
	Slider.prototype.goToSLide = function(currentNode) {
		$('.images > div', this.node).stop();
		for (var i = 0; i < this.sliderButtons.length; i += 1) {
			if (currentNode === this.sliderButtons.get(i)) {
				this.numberOfButton = i;
			}
		}
		//Условия координат изображений
		switch (this.numberOfButton) {
			case 0:
				this.sliding = 0;
				break;
			case 1:
				this.sliding = 593;
				break;
			case 2:
				this.sliding = 1186;
				break;
			case 3:
				this.sliding = 1779;
				break;
		}
		this.slideHolder.animate({
			marginLeft: -this.sliding
		}, 1000);
		//Очистка таймаута начала автопрокрутки
		clearTimeout(this.startAutoPlayingTimout);
		var _this = this;
		//Очистка интервала автопрокрутки
		clearInterval(this.autoplayingInterval);
		this.startAutoPlayingTimout = setTimeout(function() {
			_this.autoplay();
		}, 5000);
		this.sliderButtons.css('background', 'none');
		this.sliderButtonTriangle.css('display', 'none');
		currentNode.style.background = '#F06028';
		currentNode.children[0].style.display = 'block';
	};
	window.Slider = Slider;
}());