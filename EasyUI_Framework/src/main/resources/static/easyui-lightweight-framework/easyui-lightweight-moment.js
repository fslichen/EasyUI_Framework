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
