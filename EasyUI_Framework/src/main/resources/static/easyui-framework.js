var data;// It has a map structure.

// Constructor
function getSelectedRows(tableId) {
	return $('#' + tableId).datagrid('getSelections');
}

function getColumns(tableId) {
	var columns = [];
	$('#' + tableId).find('th').each(function() {
		var column = {};
		column.fieldName = $(this).attr('field');
		column.classValue = $(this).attr('class');
		column.width = $(this).attr('width');
		column.sortable = $(this).attr('sortable');
		column.label = $(this).html();
		columns.push(column);
	});
}

function clearForm(id) {// ID is mostly dialog ID.
	if (data['clearForm'] == false) {
		return;
	}
	$('#' + id).find(getFormElements()).each(function () {
		var field = $(this);
		var fieldKey = getFieldKey(field);
		var fieldClass = field.attr('class');
		if (isEasyUiField(fieldClass)) {
			field.textbox('setText', '');
		} else if (fieldClass == "richTextEditor") {
			setRichText(fieldKey, '');
		} else {
			field.val('');
		}
	});
}

function confirm(englishInfo, chineseInfo, callBackFunction) {
	function proceed(confirmed) {
		if (confirmed) {
			callBackFunction.call();
		}
	}
	if (data['language'] == 'English') {
		$.messager.confirm('Confirm', englishInfo, function (confirmed) {
			proceed(confirmed);
		});
	} else if (data['language'] == 'Chinese') {
		$.messager.confirm('确认', chineseInfo, function (confirmed) {
			proceed(confirmed);
		});
	}
}

function mergeMaps(maps, overwrite) {
	var mergedMap = {};
	for (var i = 0; i < maps.length; i++) {
		var map = maps[i];
		if (map == null) {
			continue;
		}
		for (var j in map) {
			if (mergedMap[j] == null || overwrite == true) {
				mergedMap[j] = map[j];
			}
		}
	}
	return mergedMap;
}

function getFieldMap(fieldKeys, row, fieldMap, overwrite) {
	if (fieldMap == null) {
		fieldMap = {};
	}
	for (var i = 0; i < fieldKeys.length; i++) {
		var fieldKey = fieldKeys[i];
		if (fieldMap[fieldKey] == null || overwrite == true) {
			fieldMap[fieldKey] = row[fieldKey];
		}
	}
	return fieldMap;
}

// Merge the customized field map and the field map extracted from a row.
function mergeFieldMaps(fieldMap, row, fieldKeys) {
	var mergedFieldMap = null;
	if (row != null) {
		if (fieldKeys != null) {
			mergedFieldMap = getFieldMap(fieldKeys, row, fieldMap, false);
		} else {
			mergedFieldMap = mergeMaps([fieldMap, row], false);
		}
	} else {
		mergedFieldMap = fieldMap;
	}
	return mergedFieldMap;
}

function postFieldsInBatch(url, fieldMap, tableId, fieldKeys, callBackFunction) {
	var rows = getSelectedRows(tableId);
	for (var i = 0; i < rows.length; i++) {
		post(url, mergeFieldMaps(fieldMap, rows[i], fieldKeys));
	}
	if (callBackFunction != null) {
		callBackFunction.call();
	}
}

function postMap(url, map, requestData, fieldKeys, callBackFunction) {
	post(url, mergeFieldMaps(map, requestData, fieldKeys), callBackFunction);
}

function postMapAndPrint(url, map, requestData, fieldKeys, tableId, parentIdMap, callBackFunction) {
	postAndPrint(url, mergeFieldMaps(map, requestData, fieldKeys), tableId, parentIdMap, callBackFunction);
}

function postFields(url, fieldMap, tableId, fieldKeys, callBackFunction) {
	post(url, mergeFieldMaps(fieldMap, getSelectedRow(tableId), fieldKeys), callBackFunction);
}

function postFieldsAndPrint(url, sourceFieldMap, sourceTableId, sourceFieldKeys, targetTableId, targetParentIdMap, callBackFunction) {
	postAndPrint(url, mergeFieldMaps(sourceFieldMap, getSelectedRow(sourceTableId), sourceFieldKeys), targetTableId, targetParentIdMap, callBackFunction);
}

function setFormValidation(id, category, validationCriteria) {// ID is mostly dialog ID; Ascending
	if (category == 'orderValidation') {
		data.orderValidation[id] = validationCriteria;// Two Dimensional Array
	} else if (category == 'customizedValidation') {
		data.customizedValidation[id] = validationCriteria;// Function
	}
}

function info(englishMessage, chineseMessage) {
	if (data['language'] == 'English') {
		$.messager.alert({
			ok : 'OK',
			title:'Info',
			msg : englishMessage
		});
	} else if (data['language'] == 'Chinese') {
		$.messager.alert({
			ok : '确定',
			title : 'Info',
			msg : chineseMessage
		});
	}
}

function setCachedRequestData(url, requestData, tableId) {
	requestData = requestData == null ? {} : requestData;
	requestData['url'] = url;
	data.requestData[tableId] = requestData;
}

function getCachedRequestData(tableId) {
	return data.requestData[tableId];
}

function setCache(cacheId, cachedData) {
	data['cache'][cacheId] = cachedData;
}

function getCache(cacheId) {
	return data['cache'][cacheId];
}

function setCachedSelectedRow(tableId) {
	setCache('selectedRowTableId:' + tableId, getSelectedRow(tableId));
}

function getCachedSelectedRow(tableId) {
	return getCache('selectedRowTableId:' + tableId);
}

function setCachedForm(id, requestData) {// ID is mostly dialog ID
	if (data['cacheForm'] == false) {
		return;
	}
	if (requestData != null) {
		setCache('formDialogId:' + id, requestData);
	} else {
		setCache('formDialogId:' + id, getRequestData(id));
	}
}

function getCachedForm(id) {// ID is mostly dialog ID
	return getCache('formDialogId:' + id);
}

function setPageIndex(tableId, pageIndex) {
	$('#' + tableId + 'Pagination').pagination({
		pageNumber : pageIndex
	});
}

function getTimeZoneOffset() {
	return data['timeZoneMap'][data['timeZone']];
}

function initialize() {
	// Initialize Data
	data = {};
	data['cache'] = {};
	data['clickCount'] = {};// Table ID Related
	data['responseData'] = {};// Table ID Related
	data['requestData'] = {};// Table ID Related
	data['pagination'] = {};// Table ID Related
	data['formElements'] = 'input, select, textarea, button';
	data['orderValidation'] = {};// Mostly Dialog ID Related
	data['customizedValidation'] = {};// Mostly Dialog ID Related
	// Initial Configurations
	data['language'] = 'English';
	data['localPagination'] = true;
	data['clearForm'] = false;
	data['cacheForm'] = true;
	data['browserVersion'] = 'IE8';
	data['timeZone'] = 'BeiJing';
	data['timeZoneMap'] = {'BeiJing' : 8, 'London' : 0, 'Korea' : 9};
	// Initialize rich text editors.
	tinymce.init({
		selector : '.richTextEditor'// Rich text editor is created by setting class attribute as richTextEditor in text area.
	});
	// Initialize pagination for each one of the data grid.
	$('.easyui-datagrid').each(function() {
		var tableId = $(this).attr('id');
		$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
			onSelectPage : function(pageIndex, pageSize) {
				if (data.localPagination) {
					print(tableId, pageIndex, pageSize);// The page index and page size are required in local pagination because only a portion of data is retrieved and printed from the cache.
				} else {
					var requestData = getCachedRequestData(tableId);
					var oldPageSize = requestData['pageSize'];
					if (oldPageSize != null && oldPageSize != pageSize) {// When the page size changes, page index ought to equal 1.
						requestData['pageIndex'] = 0;// The page index in easy-ui starts from 1, while the page index on the server side starts from 0.
						setPageIndex(tableId, 1);
					} else {
						requestData['pageIndex'] = pageIndex - 1;// The remote server accepts the pagination info.
					}
					requestData['pageSize'] = pageSize;
					requestData['rowIndex'] = requestData['pageIndex'] * requestData['pageSize'];
					postAndPrint(requestData.url, requestData, tableId);// The page index and page size are not required in remote pagination because all the data retrieved from the server should be printed. 
				}
			}
		});
	});
	// Sortable
	$('div.datagrid-cell').each(function() {
		$(this).click(function() {
			var sortField = $(this).parent().attr('field');
			var tableId = parent($(this), 7).next('table').attr('id');
			var responseData = getResponseData(tableId);
			if (responseData == null) {// There is no need to sort a column when response data is unavailable.
				return false;
			}
			var firstIndex = data.pagination[tableId].firstIndex;
			var lastIndex = data.pagination[tableId].lastIndex;
			var clickCount = data.clickCount[tableId];
			var columnKeys = getColumnKeys(tableId);
			if (clickCount == null) {
				var initialClickCount = {};
				for (var i = 0; i < columnKeys.length; i++) {
					initialClickCount[columnKeys[i]] = 0;
				}
				data.clickCount[tableId] = initialClickCount;
			} else {
				for (var i = 0; i < columnKeys.length; i++) {
					var columnKey = columnKeys[i];
					if (columnKey != sortField) {
						data.clickCount[tableId][columnKey] = 0;
					}
				}
			}
			var sortFieldClickCount = data.clickCount[tableId][sortField]++;
			var responseDataExcerpt = [];
			for (var i = firstIndex; i < lastIndex; i++) {
				responseDataExcerpt.push(responseData[i]);
			}
			responseDataExcerpt = sort(responseDataExcerpt, sortField, sortFieldClickCount %2 == 0);
			deleteRows(tableId);
			var columnClassMap = getColumnClassMap(tableId);
			for (var i = 0; i < lastIndex - firstIndex; i++) {
				addRow(tableId, responseDataExcerpt[i], columnClassMap);
			}
		});
	});
}

function replaceAll(data, oldSubString, newSubString) {
	while (includes(data, oldSubString)) {
		data = data.replace(oldSubString, newSubString);
	}
	return data;
}

function replaceNormalCharactersByEscapeCharacters(data) {
	return replaceAll(data, '"', '&quot');
}

function replaceEscapeCharactersByNormalCharacters(data) {
	return replaceAll(data, '&quot', '"');
}

function parent($object, generation) {
	for (var i = 0; i < generation; i++) {
		$object = $object.parent();
	}
	return $object;
}

// Rich Text Editor
function getActiveRichText() {
	return tinymce.activeEditor.getContent();
}

function getRichText(name) {// Name is mostly text area name.
	return tinymce.get(name).getContent();
}

function setRichText(name, richText) {
	tinymce.get(name).setContent(richText);
}

function setActiveRichText(richText) {
	tinymce.activeEditor.setContent(richText);
}

// Form
function getFormElements() {
	return data['formElements'];
}

function isEasyUiDateField(fieldClass) {
	return isEasyUiField(fieldClass) && includes(fieldClass, 'datebox');
}

function keys(object) {
	var result = [];
	for (i in object) {
		result.push(i);
	}
	return result;
}

function values(object) {
	var result = [];
	for (i in object) {
		result.push(object[i]);
	}
	return result;
}

function getFieldValue(field) {
	var fieldClass = field.attr('class');
	if (isEasyUiField(fieldClass)) {
		return field.textbox('getText');
	} else if (fieldClass == 'richTextEditor') {
		return getActiveRichText();
	} else {
		return field.val();
	}
}

function setFieldUnderParent(id, fieldKey, fieldValue) {// ID is mostly tool box ID.
	$('#' + id).find(getFormElements()).each(function () {
		var field = $(this);
		if (fieldKey == getFieldKey(field)) {
			var fieldClass = field.attr('class');
			if (isEasyUiField(fieldClass)) {
				field.textbox('setText', fieldValue);
			} else if (fieldClass == 'richTextEditor') {
				tinymce.get(fieldKey).setContent(fieldValue);
			} else {
				field.val(fieldValue);
			}
		}
	});
}

function getColumnValueFromTable(tableId, columnName) {
	var row = getSelectedRow(tableId);
	if (row != null) {
		return row[columnName];
	}
	return null;
}

function validateForm(id) {// ID is mostly dialog ID.
	var fieldMap = {};
	var labelMap = {};
	var isValidForm = true;
	$('#'+id).find(getFormElements()).each(function() {
		// Field Info
		var fieldKey = getFieldKey($(this));
		var fieldClass = $(this).attr('class');
		var fieldSubClass = $(this).attr('subClass');
		var fieldValue = getFieldValue($(this));
		var fieldLabel = getFieldLabel($(this));
		// Not Null Validation
		var required = $(this).attr('required');
		if (required != null && (required == 'required' || required == 'true')) {
			if (fieldValue == null || fieldValue == '') {
				info(fieldLabel + ' should not be empty.', fieldLabel + '不可为空');
				isValidForm = false;
				return false;// Break Loop
			}
		}
		// Number Format Validation 
		if (fieldSubClass == 'number') {
			if (!isNumber(fieldValue)) {
				info(fieldLabel + ' is not a number.', fieldLabel + '不是数字');
				isValidForm = false;
				return false;// Break Loop
			}
		}
		// Personal ID Validation
		if (fieldSubClass == 'chineseCitizenshipId') {
			if (fieldValue != null && fieldValue != '' && fieldValue.toString().length != 18) {
				info(fieldLabel + ' is not a valid Chinese citizenship ID.', fieldLabel + '不是合法的身份证号');
				isValidForm = false;
				return false;
			}
		}
		// Date Format Validation
		if (isEasyUiDateField(fieldClass)) {
			if (fieldValue != null && fieldValue != '') {
				var date = Date.parse(fieldValue);
				if (isNaN(date)) {
					info(fieldLabel + ' is an invalid date.', fieldLabel + '日期不合法');
					isValidForm = false;
					return false;// Break Loop
				}
			}
		}
		// Obtain the Field Map
		fieldMap[fieldKey] = fieldValue;
		if (labelMap[fieldKey] == null && fieldLabel != null) {
			labelMap[fieldKey] = fieldLabel;
		}
	});
	if (!isValidForm) {
		return false;
	}
	// Validate Field Order
	var fieldOrders = data.orderValidation[id];
	if (fieldOrders != null) {
		for (var j = 0; j < fieldOrders.length; j++) {
			var fieldOrder = fieldOrders[j];
			var previousValue = -Number.MAX_VALUE;
			for (var i = 0; i < fieldOrder.length; i++) {
				var value = fieldMap[fieldOrder[i]];
				var numericValue = null;
				if (count(value, '/') == 2) {// Date
					numericValue = Date.parse(value);
				} else {
					numericValue = Number(value);
				}
				if (!isNaN(numericValue)) {
					if (numericValue >= previousValue) {
						previousValue = numericValue;
					} else {
						info(labelMap[fieldOrder[i - 1]] + ' should be less than ' + labelMap[fieldOrder[i]] + '.', labelMap[fieldOrder[i - 1]] + '需小于' + labelMap[fieldOrder[i]]);
						return false;
					}
				}
			}
		}
	}
	// Customized Validation
	var customizedValidationFunction = data.customizedValidation[id];
	if (customizedValidationFunction != null) {
		var validationMap = {'fieldMap' : fieldMap, 'labelMap' : labelMap};
		if (!customizedValidationFunction.call(validationMap)) {// 'This' refers to validationMap.
			return false;
		} 
	}
	return true;
}

function count(string, char) {
	var charCount = 0;
	for (var i = 0; i < string.length; i++) {
		if (string[i] == char) {
			charCount++;
		}
	}
	return charCount;
}

function getFieldKey(element) {// Get either name or easy-ui text box name.
	var key = element.attr('name');
	if (key == null) {
		key = element.attr('textboxname');
	}
	return key;
}

function getFieldLabel(element) {
	var label = element.attr('label');
	if (label == null) {
		label = element.prev().html();
	}
	return label != null ? label.replace(/:/g, '') : '';
}

function getIndex(string) {
	return Number(string.charAt(string.length - 1));// TOOD Up To 10 Indexes
}

function removeIndex(string) {
	return string.substring(0, string.length - 1);// TOOD Up To 10 Indexes
}

// ID is mostly dialog ID.
function setFormByMap(id, map) {
	$('#' + id).find(getFormElements()).each(function() {
		var fieldKey = getFieldKey($(this));
		if (fieldKey != null) {
			var fieldValue = null;
			if (!isNaN(getIndex(fieldKey))) {// Index Exists; Mostly Tiny MCE Case
				fieldValue = map[removeIndex(fieldKey)];
			} else {
				fieldValue = map[fieldKey];
			}
			if (fieldValue != null) {// Prevent setting null value into the field if the selected row does not contain the field.
				setField($(this), fieldValue);
			}
		}
	});
}

// ID is mostly dialog ID.
function setFormByRow(tableId, id) {
	var selectedRow = getSelectedRow(tableId);
	if (selectedRow == null || getRowCount(tableId) == 0) {// No row is selected.
		closeDialog(id);
		info('Please select a row.', '请选择一行数据');
		return;
	}
	setFormByMap(id, selectedRow);
}

function getRequestData(id) {// ID is mostly dialog ID.
	var requestData = {};
	$('#' + id).find(getFormElements()).each(function() {
		var key = getFieldKey($(this));
		if (key != null) {
			var keyIndex = getIndex(key);
			if (!isNaN(keyIndex)) {// Index Exists; Mostly Tiny MCE Case
				requestData[removeIndex(key)] = getFieldValue($(this));
			} else if (includes(key, 'Converted')) {
				requestData[key.substring(0, key.indexOf('Converted'))] = getFieldValue($(this));
			} else {
				requestData[key] = getFieldValue($(this));
			}
		}
	});
	return requestData;
}

// Post
function post(url, requestData, callBack) {
	if (requestData == null) {
		requestData = {};
	} else {
		for (i in requestData) {
			requestData[i] = replaceNormalCharactersByEscapeCharacters(requestData[i]);
		}
	}
	$.ajax({
		    url : url,
		    type : 'POST',
		    data : JSON.stringify(requestData),
		    contentType : 'application/json;charset=utf-8',
		    dataType : 'json',
		    async : true,
		    success : function(response) {
		    	var message = response.message;
		    	if (message != null) {
		    		info(message, message);
		    	}
		    	if (callBack != null) {
		    		callBack.call(response);// Call passes the response argument to 'this' object in the call back function.
		    	}
	    }
	});
}

// Print
function refresh(url, tableId) {
	postAndPrint(url, null, tableId);
}

function getTotalCount(tableId) {
	var pagination = data.pagination[tableId];
	if (pagination != null) {
		var totalCount = pagination.totalCount;
		if (totalCount != null) {
			return totalCount;
		}
	}
	return 500;
}

function setTotalCount(tableId, totalCount) {
	if (data.pagination[tableId] == null) {
		data.pagination[tableId] = {}
	}
	data.pagination[tableId].totalCount = totalCount;
}

function print(tableId, pageIndex, pageSize) {
	var firstIndex = null;
	var lastIndex = null;
	var responseData = getResponseData(tableId);// The response data is already available prior to calling this method.
	deleteRows(tableId);
	if (data.localPagination) {// The page index and page size are required in local pagination because all the data are stored in JS, thereby it is unlikely to print all the data all at once.
		pageIndex = pageIndex == null ? 1 : pageIndex;
		pageSize = pageSize == null ? getPageSize(tableId) : pageSize;
		firstIndex = (pageIndex - 1) * pageSize;
		lastIndex = Math.min(pageIndex * pageSize, responseData.length);
		$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
			total : responseData.length,
			pageSize : pageSize
		});
	} else {// The page index and page size are not required in remote pagination because only a part of the data are retrieved from remote server, therefore it is okay to print out all the retrieved data.
		firstIndex = 0;
		lastIndex = responseData.length;
		var pageSize = 50;
		if (lastIndex <= 10) {
			pageSize = 10;
		} else if (lastIndex <= 20) {
			pageSize = 20;
		} else if (lastIndex <= 30) {
			pageSize = 30;
		}
		$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
			total : getTotalCount(tableId),// The exact total number of records is given by the query count SQL statement.
			pageSize : pageSize
		});
	}
	data.pagination[tableId] = {'firstIndex' : firstIndex, 'lastIndex' : lastIndex};
	var columnClassMap = getColumnClassMap(tableId);
	for (var i = firstIndex; i < lastIndex; i++) {
		addRow(tableId, responseData[i], columnClassMap);
	}
}

function getPageSize(tableId) {
	return $('#' + tableId + 'Pagination').pagination('options').pageSize;
}

function postAndPrint(url, requestData, tableId, parentIdMap, callBackFunction) {
	requestData = requestData == null ? {} : requestData;
	setCachedRequestData(url, requestData, tableId);// Set the URL and request data associated with a table ID. 
	if (!data['localPagination']) {
		var pageIndex = requestData['pageIndex'];
		var pageSize = requestData['pageSize'];
		if (pageIndex == null) {
			pageIndex = 0;// This page index is for server side rather than easy-ui.
		}
		if (pageSize == null) {
			pageSize = getPageSize(tableId);
		}
		requestData['pageIndex'] = pageIndex;
		requestData['pageSize'] = pageSize;
		requestData['rowIndex'] = requestData['pageIndex'] * requestData['pageSize'];
	}
	post(url, requestData, function() {
		// Response Fields
		var responseFields = this.responseFields;
		if (responseFields != null) {
			if (parentIdMap != null) {// Example : {'name' : 'anyPanel'}, which means the name field is located under the parent anyPanel.
				for (var i in responseFields) {
					setFieldUnderParent(parentIdMap[i], i, responseFields[i]);
				}	
			}
			var totalCount = responseFields['totalCount'];
			if (totalCount == null) {
				totalCount = responseFields['rowCount'];
			}
			if (totalCount != null) {
				setTotalCount(tableId, totalCount);
			}
		}
		// Response Grid
		var responseData = this.responseData;// The field name for response data is 'responseData'.
		if (responseData == null) {
			responseData = this.data;// The secondary field name for response data is 'data'.
			if (responseData == null) {
				responseData = this.responseGrid;// The last field name for response data is 'responseGrid'.
			}
		}
		if (responseData != null) {
			setResponseData(tableId, responseData);// Set the response data for a given data grid.
			print(tableId);
		}
		// Call Back Function
		if (callBackFunction != null) {
			callBackFunction.call();
		}
	});
}

function includes(string, substring) {
	if (string != null && substring != null) {
		string = string + '';// Turn number into string.
		return string.indexOf(substring) !== -1;
	}
	return false;
}

function isEasyUiField(fieldClass) {
	return includes(fieldClass, 'easyui-');
}

function setField(field, value) {
	var fieldClass = field.attr('class');
	if (isEasyUiField(fieldClass)) {
		field.textbox('setText', value);
	} else if (fieldClass == 'richTextEditor') {
		setRichText(field.attr('name'), value);
	} else {
		field.val(value);
	}
}

function postForm(url, id, callBackFunction) {// ID is mostly dialog ID.
	if (!validateForm(id)) {
		return false;
	}
	var requestData = getRequestData(id);
	post(url, requestData, callBackFunction);
	closeDialog(id);
	setCachedForm(id, requestData);
	clearForm(id);
	return true;
}

function setPageIndexAndPageSize(tableId, pageIndex, pageSize) {
	if (pageIndex == null) {
		pageIndex = 1;
	}
	if (pageSize == null) {
		pageSize = 10;
	}
	$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
		pageNumber : pageIndex,
		pageSize : pageSize
	});
}

function postFormAndPrint(url, id, tableId, parentIdMap, callBackFunction) {// ID is mostly dialog ID.
	if (!validateForm(id)) {
		return false;
	}
	setPageIndexAndPageSize(tableId, 1, getPageSize(tableId));
	var requestData = getRequestData(id);
	postAndPrint(url, requestData, tableId, parentIdMap, callBackFunction);
	closeDialog(id);
	setCachedForm(id, requestData);
	clearForm(id);
	return true;
}

// Output
function getColumnKeys(tableId) {
	var ths = $('#' + tableId + 'th');
	var columns = [];
	$('th').each(function() {
		columns.push($(this).attr('field'));
	});
	return columns;
}

function getRowCount(tableId) {
	return $('#' + tableId).datagrid('getData').total;
}

function isNumber(object) {
	return !isNaN(Number(object));
}

function getColumnClassMap(tableId) {
	var columnClassMap = {};
	$('#' + tableId).find('th').each(function() {
		var fieldClass = $(this).attr('class');
		if (fieldClass != null) {
			columnClassMap[$(this).attr('field')] = fieldClass;// The class is mostly date or dateTime which requires conversion.
		}
	});
	return columnClassMap;
}

function addRow(tableId, row, columnClassMap) {
	var rowExcerpt = {};
	var columnKeys = getColumnKeys(tableId);
	for (var i = 0; i < columnKeys.length; i++) {
		var columnKey = columnKeys[i];
		var columnValue = null;
		var fieldClass = columnClassMap[columnKey];
		if (includes(columnKey, 'Alias')) {
			columnValue = row[columnKey.substring(0, columnKey.indexOf('Alias'))];
		} else if (includes(fieldClass, 'copy')) {
			columnValue = row[fieldClass.substring(fieldClass.indexOf(':') + 1)];
		} else {
			columnValue = row[columnKey];
		}
		if (columnValue != null) {
			if (fieldClass == 'date') {
				fieldClass = isNumber(columnValue) ? 'javaDate' : 'stringDate';
			} else if (fieldClass == 'dateTime') {
				fieldClass = isNumber(columnValue) ? 'javaDateTime' : 'stringDateTime';
			}
			if (fieldClass == 'javaDate') {// TODO Also consider the date time format.
				rowExcerpt[columnKey] = convertJavaDate2MonthDayAndYear(columnValue);
			} else if (fieldClass == 'stringDate') {
				rowExcerpt[columnKey] = convertStringDate2MonthDayAndYear(columnValue);
			} else if (fieldClass == 'javaDateTime') {
				rowExcerpt[columnKey] = convertJavaDate2MonthDayYearHourMinuteAndSecond(columnValue);
			} else if (fieldClass == 'stringDateTime') {
				rowExcerpt[columnKey] = convertStringDate2MonthDayYearHourMinuteAndSecond(columnValue);
			} else {
				rowExcerpt[columnKey] = replaceEscapeCharactersByNormalCharacters(columnValue);
			}
		} else {
			rowExcerpt[columnKey] = null; 
		}
		if (includes(fieldClass, 'alias')) {
			var conversionMap = JSON.parse(fieldClass.substring(fieldClass.indexOf(':') + 1).replace(/'/g, '"'));
			if (columnValue != null) {
				var columnAliasValue = conversionMap[columnValue];
				if (columnAliasValue != null) {
					rowExcerpt[columnKey] = columnAliasValue;
				} else {
					rowExcerpt[columnKey] = conversionMap['default'];
				}
			} else {
				rowExcerpt[columnKey] = conversionMap['default'];
			}
		}
	}
	$('#' + tableId).datagrid('appendRow', rowExcerpt);
}

function convertStringDate2MonthDayAndYear(string) {// Example : 2017/07/04 19:00:00
	var blankIndex = string.indexOf(' ');
	if (blankIndex != -1) {
		string = string.substring(0, blankIndex);
	}
	if (includes(string, '-')) {
		var date = string.split('-');
	} else if (includes(string, '/')) {
		var date = string.split('/');
	}
	var month = null;
	var day = null;
	var year = null;
	for (var i = 0; i < date.length; i++) {
		if (date[i].length == 4) {
			year = date[i];
		} else if (month == null) {
			month = date[i];
		} else if (day == null) {
			day = date[i];
		}
	}
	return month + '/' + day + '/' + year;
}

function convertStringDate2MonthDayYearHourMinuteAndSecond(string) {// Example : 2017/07/04 19:00:00
	return convertStringDate2MonthDayAndYear(string) + ' ' + string.substring(string.indexOf(' ') + 1);
}

function convertJavaDate2MonthDayYearHourMinuteAndSecond(object) {// Object can either be number or string.
	var numericDate = Number(object);
	if (data['browserVersion'] == 'IE8') {
		numericDate += getTimeZoneOffset() * 3600 * 1000;// IE8 uses UTC time zone by default rather than the local time zone.
	}
	var date = JSON.stringify(new Date(numericDate));
	date = date.substring(1, date.length - 1);// Remove double quotes.
	var monthDayAndYear = date.substring(0, date.indexOf('T')).split('-');
	var month = monthDayAndYear[1];
	var day = monthDayAndYear[2];
	var year = monthDayAndYear[0];
	var hourMinuteAndSecond = null;
	if (data['browserVersion'] == 'IE8') {
		hourMinuteAndSecond = date.substring(date.indexOf('T') + 1, date.indexOf('Z')).split(':');
	} else {// Assume that the user is using modern browser.
		hourMinuteAndSecond = date.substring(date.indexOf('T') + 1, date.indexOf('.')).split(':');
	}
	var hour = hourMinuteAndSecond[0];
	var minute = hourMinuteAndSecond[1];
	var second = hourMinuteAndSecond[2];
	return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
}

function convertJavaDate2MonthDayAndYear(object) {// Object can either be number or string.
	var monthDayYearHourMinuteAndSecond = convertJavaDate2MonthDayYearHourMinuteAndSecond(object);
	return monthDayYearHourMinuteAndSecond.substring(0, monthDayYearHourMinuteAndSecond.indexOf(' '));
}

function sort(objects, sortField, order) {
	return objects.sort(function(a, b) {
		var x = a[sortField];
		var y = b[sortField];
		var result = 1;
		if (x == null) {
			x = y;
		} else if (y == null) {
			y = x;
		}
		if (isNumber(x) && typeof isNumber(y)) {
			result = x - y;
		} else if (typeof x === 'string' && typeof y === 'string') {
			result = x.localeCompare(y);
		} 
		return (order == null || order == true) ? result : result * -1;
	});
}

function getSelectedRows(tableId) {
	return $('#' + tableId).datagrid('getSelections');
}

function getSelectedRow(tableId) {
	return $('#' + tableId).datagrid('getSelected');
}

function deleteRows(tableIds) {
	function deleteRowsByTableId(tableId) {
		$('#' + tableId).datagrid('loadData', []);
	}
	if (tableIds instanceof Array) {
		for (var i = 0; i < tableIds.length; i++) {
			deleteRowsByTableId(tableIds[i]);
		}
	} else {
		deleteRowsByTableId(tableIds);
	}
}

function alterTable(tableId, columnMap) {
	deleteRows(tableId);
	var fieldArray = [];
	for (i in columnMap) {
		var columnEntry = {field : i, title : columnMap[i], width : 50, sortable : true};
		fieldArray.push(columnEntry);
	}
	$('#' + tableId).datagrid({
	    columns : [fieldArray]
	});
}

function setResponseData(tableId, responseData) {
	data.responseData[tableId] = responseData;// Each data grid has its own response data.
}

function getResponseData(tableId) {
	return data.responseData[tableId];// Each data grid has its own response data.
}

// Dialog
function openDialog(dialogId, title, tableId) {
	$('#' + dialogId).dialog('open').dialog('setTitle', title);
	if (tableId != null) {
		setFormByRow(tableId, dialogId);// Plug the data in the selected row into the form.
	}
}

function closeDialog(dialogId) {
	$('#' + dialogId).dialog('close');
}