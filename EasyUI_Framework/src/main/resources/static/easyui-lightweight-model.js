var DEFAULT_ROW_COUNT = 1024;
var url4Printing = {};
var requestDto4Printing = {};
function setUrl4Printing(tableId, url) {
	url4Printing[tableId] = url;
}
function getUrl4Printing(tableId) {
	return url4Printing[tableId];
}
function setRequestDto4Printing(tableId, parameters) {
	requestDto4Printing[tableId] = parameters;
}
function getRequestDto4Printing(tableId) {
	return requestDto4Printing[tableId];
}