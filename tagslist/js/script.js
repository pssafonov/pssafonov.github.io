(function() {
	'use strict';
	var ENTER_KEYCODE = 13;
	//Кроссбраузерный обработчик событий
	function addEvent(obj, eventName, handler) {
			var handlerWrapper = function(event) {
				event = event || window.event;
				if (!event.target && event.srcElement) {
					event.target = event.srcElement;
				}
				return handler.call(obj, event);
			};

			if (obj.addEventListener) {
				obj.addEventListener(eventName, handlerWrapper, false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handlerWrapper);
			}
			return handlerWrapper;
		}
		//Создаем класс
	function TagList(node, arr) {
			this.tagListArray = [];
			this.node = node;
			this.buildTagList(this.node);
			this.showHide();
			var _thisNode = this.node;
			var _this = this;
			_this.hideWarningTimout = 0;
			//Добавление тегов из начального массива, если он есть
			if (arr) {
				for (var i = 0; i < arr.length; i += 1) {
					this.addTagsFromList(arr[i]);
				}
			}
			//Обаботчик добавления тега
			$('input[type="submit"]', _thisNode).on('click', function() {
				_this.addTag();
				$('input[type="text"]', _thisNode).focus();
			});
			//Обработчик полной очистки
			$('.clear-list', _thisNode).on('click', function() {
				$('.tag-list', _thisNode).html('');
				_this.tagListArray = [];
			});
			//По нажатию на Enter
			$('input[type="text"]', _thisNode).keyup(function(event) {
				if (event.keyCode === ENTER_KEYCODE) {
					_this.addTag();
				}
			});
			//Удаление отдельного тега
			addEvent(document, 'click', function() {
				if (event.target.className === 'remove-tag') {
					_this.removeTag(event.target);
				}
			});
		}
		//Создание DOM для tag-list
	TagList.prototype.buildTagList = function(node) {
		node.html('<div class = "clear-list">Очистить</div><div class="toggle"><span>Завершить редактирование</span></div><div class="tag-list"></div><div class="wrap"><div class="warning-message"></div><input type="text"><input type="submit" value="Добавить"></div>');
	};
	//Метод Скрыть/Показать режим редактирования
	TagList.prototype.showHide = function() {
		var _thisNode = this.node;
		$('.toggle span', _thisNode).on('click', function() {
			$('.wrap', _thisNode).toggleClass('hide');
			var textToggle = $('.toggle span', _thisNode).get(0).innerText;
			if (textToggle === 'Просмотр') {
				$('.toggle span', _thisNode).get(0).innerText = 'Завершить редактирование';
				$('.remove-tag', _thisNode).css('display', 'inline-block');
				$('.clear-list', _thisNode).css('display', 'block');
			} else {
				$('.toggle span', _thisNode).get(0).innerText = 'Просмотр';
				$('.remove-tag', _thisNode).css('display', 'none');
				$('.clear-list', _thisNode).css('display', 'none');
			}
		});
	};
	//Метод добавления из начльного массива
	TagList.prototype.addTagsFromList = function(tagTextFromList) {
		this.tagTextFromListTrimmed = tagTextFromList.trim();
		this.addingTagFromListIndex = this.tagListArray.indexOf(this.tagTextFromListTrimmed);
		if (this.addingTagFromListIndex === -1 && this.tagTextFromListTrimmed !== '') {
			this.tagListArray.push(this.tagTextFromListTrimmed);
			this.buildTag(this.tagTextFromListTrimmed);
		} else {
			console.log('already exist or empty');
		}
	};
	//Метод добавления одного тега
	TagList.prototype.addTag = function() {
		var _this = this;
		var _thisNode = this.node;
		clearTimeout(_this.hideWarningTimout);
		$('.warning-message', _thisNode).css('display', 'none');
		this.tagText = $('input[type="text"]', _thisNode).get(0).value;
		this.tagTextTrimmed = this.tagText.trim();
		this.addingTagIndex = this.tagListArray.indexOf(this.tagTextTrimmed);
		if (this.addingTagIndex === -1 && this.tagTextTrimmed !== '') {
			$('input[type="text"]', _thisNode).get(0).value = '';
			this.tagListArray.push(this.tagTextTrimmed);
			this.buildTag(this.tagTextTrimmed);
		} else if (this.tagTextTrimmed === '') {
			//Вывод предупреждения о занятом имени
			$('.warning-message', _thisNode).get(0).innerText = 'введите текст';
			$('.warning-message', _thisNode).css('display', 'block');
			_this.hideWarningTimout = setTimeout(function() {
				$('.warning-message', _thisNode).css('display', 'none');
			}, 2000);
		} else {
			//Вывод предупреждения о пустом поле
			$('.warning-message', _thisNode).get(0).innerText = 'имя тега занято';
			$('.warning-message', _thisNode).css('display', 'block');
			_this.hideWarningTimout = setTimeout(function() {
				$('.warning-message', _thisNode).css('display', 'none');
			}, 2000);
		}
	};
	//Метод создания DOM для тега
	TagList.prototype.buildTag = function(tagText) {
		var _thisNode = this.node;
		$('.tag-list', _thisNode).append('<div class="tag"><span class="tag-text">' + tagText + '</span><span class="remove-tag">| ✕</span></div>');
	};
	//Метод удаления отдельного тега
	TagList.prototype.removeTag = function(removingNode) {
		this.removingTagText = removingNode.previousSibling.innerText;
		this.removingTagIndex = this.tagListArray.indexOf(this.removingTagText);
		this.tagListArray.splice(this.removingTagIndex, 1);
		$(removingNode.parentNode).remove();
	};

	window.TagList = TagList;
}());