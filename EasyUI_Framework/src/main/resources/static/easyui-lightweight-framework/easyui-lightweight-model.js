var DEFAULT_ROW_COUNT = 1024;
var DEFAULT_ROW_INDEX = 0;
var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_PAGE_NUMBER = 1;
var url4Table = {};
var requestDto4Table = {};
function setUrl4Table(tableId, url) {
	url4Table[tableId] = url;
}
function getUrl4Table(tableId) {
	return url4Table[tableId];
}
function setRequestDto4Table(tableId, parameters) {
	requestDto4Table[tableId] = parameters;
}
function getRequestDto4Table(tableId) {
	return requestDto4Table[tableId];
}