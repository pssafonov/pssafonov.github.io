'use strict';
(function() {
	var ESC_KEYCODE = 27;

	function topWalker(node, testFunc, lastParent) {
		while (node && node !== lastParent) {
			if (testFunc(node)) {
				return node;
			}
			node = node.parentNode;
		}
	}

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
	var SUBMENU_CLASS = 'context-menu-subMenu';
	//Класс меню
	function ContextMenu(queryNode, menuStucture) {
			this.root = queryNode;
			this.createdMenu = this.createMenu(menuStucture);
			this.showSubMenu();
			document.body.appendChild(this.createdMenu);
			addEvent(this.root, 'contextmenu', this.showMenu.bind(this));
			//Скрытие меню
			addEvent(document.documentElement, 'click', this._globalClick.bind(this));
			addEvent(document.documentElement, 'keyup', this._globalKeyup.bind(this));
		}
		//Метод создания структуры меню
	ContextMenu.prototype.createMenu = function(menuStucture) {
		var root = document.createElement('ul');
		root.className = 'context-menu';
		var menuItemContainer;
		for (var i = 0; i < menuStucture.length; i += 1) {
			menuItemContainer = document.createElement('li');
			menuItemContainer.innerText = menuStucture[i].title;
			if (menuStucture[i].submenu) {
				menuItemContainer.className = SUBMENU_CLASS;
				menuItemContainer.innerText = menuStucture[i].title + ' ►';
				menuItemContainer.appendChild(this.createMenu(menuStucture[i].submenu));
			} else {
				addEvent(menuItemContainer, 'click', menuStucture[i].action);
			}
			root.appendChild(menuItemContainer);
		}
		return root;
	};
	ContextMenu.prototype.showSubMenu = function() {
		var submenuKeepers = this.createdMenu.querySelectorAll('.' + SUBMENU_CLASS);
		Array.prototype.forEach.call(submenuKeepers, function(submenuKeeper) {
			var submenuNode = submenuKeeper.querySelector('ul');
			addEvent(submenuKeeper, 'mouseenter', function() {
				submenuNode.style.display = 'block';
			});
			addEvent(submenuKeeper, 'mouseleave', function() {
				submenuNode.style.display = 'none';
			});
		});
	};
	ContextMenu.prototype._globalClick = function(event) {
		var menu = this.createdMenu;
		if (!topWalker(event.target, function(node) {
				return menu === node;
			})) {
			this.hideMenu();
		}
	};
	ContextMenu.prototype._globalKeyup = function(event) {
		if (event.keyCode === ESC_KEYCODE) {
			this.hideMenu();
		}
	};
	//Отображения меню
	ContextMenu.prototype.showMenu = function(event) {
		event.preventDefault();
		this.createdMenu.style.display = 'block';
		//Позиционирование
		this.createdMenu.style.left = event.pageX + 'px';
		this.createdMenu.style.top = event.pageY + 'px';
	};
	ContextMenu.prototype.hideMenu = function() {
		this.createdMenu.style.display = 'none';
	};
	window.ContextMenu = ContextMenu;
}());