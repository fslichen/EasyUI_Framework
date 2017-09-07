// TODO Add support for IE8
function getDate(object) {
	var date = new Date(object);
	return prepend0(date.getMonth()) + '/' + prepend0(date.getDate()) + '/' + prepend0(date.getFullYear());
}

function getDateTime(object) {
	var date = new Date(object);
	return getDate(object) + ' ' 
	+ prepend0(date.getHours()) + ':' + prepend0(date.getMinutes()) + ':' + prepend0(date.getSeconds());
}

function prepend0(object) {
	return (object + '').length == 1 ? '0' + object : object;
}

function isDate(object) {
	if (new Date(object) == 'Invalid Date') {
		return false;
	} else {
		if (object.indexOf(' ') != -1) {
			return false;
		}
		return true;
	}
}

function isDateTime(object) {
	if (new Date(object) == 'Invalid Date') {
		return false;
	} else {
		if (object.indexOf(' ') != -1 && object.indexOf(':') != -1) {
			return true;
		}
		return false;
	}
}
