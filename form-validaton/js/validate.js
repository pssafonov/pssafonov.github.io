window.usedEmails = ['obama@gmail.com', 'barak@gmail.com', 'usa@gmail.com'];

(function() {
	'use strict';
	var ERROR_CLASS = 'has-error';
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

	function topWalker(node, testFunc, lastParent) {
		while (node && node !== lastParent) {
			if (testFunc(node)) {
				return node;
			}
			node = node.parentNode;
		}
	}

	function showError(formElement, errorMessage) {
		if (formElement.classList.contains(ERROR_CLASS)) {
			return;
		}
		formElement.classList.add(ERROR_CLASS);
		var errorContainer = document.createElement('div');
		errorContainer.className = 'alert alert-danger';
		errorContainer.innerHTML = errorMessage;
		formElement.appendChild(errorContainer);
	}


	function hideError(formElement) {
		if (!formElement.classList.contains(ERROR_CLASS)) {
			return;
		}
		formElement.classList.remove(ERROR_CLASS);
		var errorContainer = formElement.querySelector('.alert.alert-danger');
		errorContainer.parentNode.removeChild(errorContainer);
	}

	function getGroupContainer(node) {
		return topWalker(node, function (oneOfParents) {
			return oneOfParents.classList.contains('form-group');
		});
	}

	var validationStatus = [];
	var allValidators = [];
	var submitButton = document.querySelector('button[type="submit"]');

	function updateSubmitButtonStatus() {
		var everythingIsValid = validationStatus.every(function (validStatus) {return validStatus;});
		if (everythingIsValid) {
			submitButton.disabled = false;
		} else {
			submitButton.disabled = true;
		}
	}

	function createValidator(id, rules) {
		var chekingTimeout;
		var node = document.getElementById(id);
		var nodeWrapper = getGroupContainer(node);
		var validationStatusIndex = validationStatus.push(true) - 1;
		function validate() {
			clearTimeout(chekingTimeout);
			var nodeValue = node.value.trim();
			
			chekingTimeout = setTimeout(function() {
				var isValid = rules.every(function (rule) {
						if (rule.validator(nodeValue, node)) {
							showError(nodeWrapper, rule.message);
							return false;
						} else {
							hideError(nodeWrapper);
							return true;
						}
				});

				validationStatus[validationStatusIndex] = isValid;
				updateSubmitButtonStatus();
			}, 1000);
		}
		addEvent(node, 'keyup', validate);
		addEvent(node, 'blur', validate);
		addEvent(node, 'change', validate);
		return validate;
	}

	addEvent(document.querySelector('form'), 'submit', function () {
		var everythingIsValid = allValidators.reduce(function (totallyValid, validator) {
			var inputIsValid = validator();
			if (!totallyValid) {
				return false;
			} else {
				return inputIsValid;
			}
		}, true);
		submitButton.disabled = !everythingIsValid;
		if (!everythingIsValid) {
			event.preventDefault();
		}
	});

	var validators = {
		email: [{
			validator: function (value) {return !value;},
			message: "Введите свой емейл. Это поле обязательно к заполнению"
		}, {
			validator: function (value) {return !/[^@]+@[^@\.]+\.[^@]+/.test(value);},
			message: "Проверьте написание. В адресе не должно быть ошибок."
		}, {
			validator: function (value) {return window.usedEmails.indexOf(value) !== -1;},
			message: "Укажите другой email. Этот уже используется"
		}],
		password: [{
			validator: function (value) {return !value;},
			message: "Введите пароль. Это поле обязательно к заполнению"
		}, {
			validator: function (value) {return /^[a-z]+$/i.test(value) || /^\d+$/i.test(value);},
			message: "Введите пароль посложнее. Пароль должен состоять из чисел и букв"
		}],
		phone: [{
			validator: function (value) {return !/\+380\d{9}$/.test(value);},
			message: "Неверный формат. Пример: +380671234567"
		}],
		rules: [{
			validator: function (value, node) {return !node.checked;},
			message: "Надо согласиться"
		}]
	};

	for (var inputId in validators) {
		allValidators.push(createValidator(inputId, validators[inputId]));
	}
}());