var DEFAULT_ROW_COUNT = 1024;
var DEFAULT_ROW_INDEX = 0;
var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_PAGE_NUMBER = 1;
var url4Table = {};// With the URL, we can call the API on back end, receive the data and print them to the table. Example : {'anyTableId' : 'http://localhost:8080/find'}
var requestDto4Table = {};// With the request DTO, we can call the API on back end, receive the data and print them to the table. Example : {'anyTableId' : {'name' : 'Chen', 'gender' : 'M'}}
var tableColumnAttributes = {};// Example : {'anyTableId' : {'birthday' : 'date', 'statusFlagAlias' : {'0' : 'Fail', '1' : 'Pass'}}}
var formValidationFunctions = {};// Example : {anyFormId : function() {if (this.beginTime < this.endTime) return true; else return false;}}
function setFormValidationFunction(formId, validationFunction) {
	formValidationFunctions[formId] = validationFunction;
}
function getFormValidationFunction(formId) {
	return formValidationFunctions[formId];
}
function setTableColumnAttribute(tableId, attributes) {
	tableColumnAttributes[tableId] = attributes;
}
function getTableColumnAttribute(tableId) {
	return tableColumnAttributes[tableId];
}
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