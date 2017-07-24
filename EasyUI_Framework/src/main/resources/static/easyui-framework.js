var data;// It has a map structure.

// Constructor
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

function initialize() {
	// Initialize Data
	data = {};
	data['clickCount'] = {};// Table ID Related
	data['responseData'] = {};// Table ID Related
	data['pagination'] = {};// Table ID Related
	data['formElements'] = 'input, select, textarea, button';
	data['orderValidation'] = {};// Mostly Dialog ID Related
	data['customizedValidation'] = {};// Mostly Dialog ID Related
	data['language'] = 'English';
	// Initialize rich text editors.
	tinymce.init({
		selector : '.richTextEditor'// Rich text editor is created by setting class attribute as richTextEditor in text area.
	});
	// Initialize pagination for each one of the data grid.
	$('.easyui-datagrid').each(function() {
		var tableId = $(this).attr('id');
		$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
			onSelectPage : function(pageIndex, pageSize) {
				print(tableId, pageIndex, pageSize);
			}
		});
	});
	// Sortable
	$('div.datagrid-cell').each(function() {
		$(this).click(function() {
			var sortField = $(this).parent().attr('field');
			var tableId = parent($(this), 7).next('table').attr('id');
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
			var responseData = getResponseData(tableId);
			var responseDataExcerpt = [];
			for (var i = firstIndex; i < lastIndex; i++) {
				responseDataExcerpt.push(responseData[i]);
			}
			responseDataExcerpt = sort(responseDataExcerpt, sortField, sortFieldClickCount %2 == 0);
			deleteRows(tableId);
			for (var i = 0; i < lastIndex - firstIndex; i++) {
				addRow(tableId, responseDataExcerpt[i]);
			}
		});
	});
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

function validateForm(id) {// ID is mostly dialog ID.
	var fieldMap = {};
	var labelMap = {};
	var isValidForm = true;
	$('#'+id).find(getFormElements()).each(function() {
		// Field Info
		var fieldKey = getFieldKey($(this));
		var fieldClass = $(this).attr('class');
		var fieldValue = getFieldValue($(this));
		var fieldLabel = getFieldLabel($(this));
		// Not Null Validation
		var required = $(this).attr('required');
		if (required != null && required == 'required') {
			if (fieldValue == null || fieldValue == '') {
				info(fieldLabel + ' should not be empty.', fieldLabel + '不可为空');
				isValidForm = false;
				return false;// Break Loop
			}
		}
		// Date Format Validation
		if (isEasyUiDateField(fieldClass)) {
			if (fieldValue != null && fieldValue != '') {
				var date = Date.parse(fieldValue);
				if (isNaN(date)) {
					isValidForm = false;
					info(fieldLabel + ' is an invalid date.', fieldLabel + '日期不合法');
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
	// Validate Field Order
	if (isValidForm) {
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
							isValidForm = false;
							break;
						}
					}
				}
			}
		}
	}
	// Customized Validation
	if (isValidForm) {
		var customizedValidationFunction = data.customizedValidation[id];
		if (customizedValidationFunction != null) {
			var validationMap = {'fieldMap' : fieldMap, 'labelMap' : labelMap};
			isValidForm = customizedValidationFunction.call(validationMap);// 'This' refers to fieldMap. 
		}
	}
	return isValidForm;
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

function setForm(tableId, id) {// Set form by selected row; ID is mostly dialog ID.
	var selectedRow = getSelectedRow(tableId);
	if (selectedRow == null || getRowCount(tableId) == 0) {// No row is selected.
		return;
	}
	$('#' + id).find(getFormElements()).each(function() {
		var key = getFieldKey($(this));
		if (key != null) {
			var keyIndex = getIndex(key);
			var fieldValue = null;
			if (!isNaN(keyIndex)) {// Index Exists; Mostly Tiny MCE Case
				fieldValue = selectedRow[removeIndex(key)];
			} else {
				fieldValue = selectedRow[key];
			}
			if (fieldValue != null) {// Prevent setting null value into the field if the selected row does not contain the field.
				setField($(this), fieldValue);
			}
		}
	});
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
	// Clear Form Data
	try {
		tinymce.activeEditor.setContent('');
	} catch (e) {}
}

// Print
function refresh(url, tableId) {
	postAndPrint(url, null, tableId);
}

function print(tableId, pageIndex, pageSize) {
	// Get Response Data
	var responseData = getResponseData(tableId);
	// Set Pagination
	if (pageIndex == null) {
		pageIndex = 1;
	}
	if (pageSize == null) {
		pageSize = 10;
	}
	var firstIndex = (pageIndex - 1) * pageSize;
	var lastIndex = Math.min(pageIndex * pageSize, responseData.length);
	data.pagination[tableId] = {'firstIndex' : firstIndex, 'lastIndex' : lastIndex};
	$('#' + tableId + 'Pagination').pagination({// Pagination ID = Table ID + Pagination Label
	    total : responseData.length,
	    pageSize : pageSize
	});
	// Print Response Data
	deleteRows(tableId);
	for (var i = firstIndex; i < lastIndex; i++) {
		addRow(tableId, responseData[i]);
	}
}

function postAndPrint(url, request, tableId) {
	post(url, request, function() {
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
		} else {
			info("Failed to receive the response data. Make sure the field name for response data is 'responseData', 'data' or 'responseGrid'.", '未能成功获取返回数据');
		}
	});
}

function includes(string, substring) {
	return string != null && substring != null && string.indexOf(substring) !== -1;
}

function isEasyUiField(fieldClass) {
	return includes(fieldClass, 'easyui-textbox') || includes(fieldClass, 'easyui-datebox');
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
	post(url, getRequestData(id), callBackFunction);
	closeDialog(id);
	return true;
}

function postFormAndPrint(url, id, tableId) {// ID is mostly dialog ID.
	if (!validateForm(id)) {
		return false;
	}
	postAndPrint(url, getRequestData(id), tableId);
	closeDialog(id);
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

function addRow(tableId, row) {
	var rowExcerpt = {};
	var columnKeys = getColumnKeys(tableId);
	var fieldClassMap = {};
	$('#' + tableId).find('th').each(function() {
		var fieldClass = $(this).attr('class');
		if (fieldClass != null) {
			fieldClassMap[$(this).attr('field')] = fieldClass;// The class is mostly date or dateTime which requires conversion.
		}
	});
	for (var i = 0; i < columnKeys.length; i++) {
		var columnKey = columnKeys[i];
		var columnValue = null;
		if (includes(columnKey, 'Alias')) {
			columnValue = row[columnKey.substring(0, columnKey.indexOf('Alias'))];
		} else {
			columnValue = row[columnKey];
		}
		if (columnValue != null) {
			var fieldClass = fieldClassMap[columnKey];
			if (fieldClass == 'date') {
				fieldClass = isNumber(columnValue) ? 'javaDate' : 'stringDate';
			}
			if (fieldClass == 'javaDate') {// TODO Also consider the date time format.
				rowExcerpt[columnKey] = convertJavaDate2MonthDayAndYear(columnValue);
			} else if (fieldClass == 'stringDate') {
				rowExcerpt[columnKey] = convertStringDate2MonthDayAndYear(columnValue);
			} else if (includes(fieldClass, 'alias')) {
				var conversionMap = JSON.parse(fieldClass.substring(fieldClass.indexOf(':') + 1).replace(/'/g, '"'));
				rowExcerpt[columnKey] = conversionMap[columnValue];
			} else {
				rowExcerpt[columnKey] = columnValue;
			}
		} else {
			rowExcerpt[columnKey] = null; 
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

function convertJavaDate2MonthDayAndYear(object) {// Object can either be number or string.
	var date = JSON.stringify(new Date(Number(object)));
	date = date.substring(1, date.length - 1);
	date = date.substring(0, date.indexOf('T'));
	var yearMonthAndYear = date.split('-');
	var month = yearMonthAndYear[1];
	var day = yearMonthAndYear[2];
	var year = yearMonthAndYear[0];
	return month + '/' + day + '/' + year;
}

function sort(objects, sortField, order) {
	return objects.sort(function(a, b) {
		var x = a[sortField];
		var y = b[sortField];
		if (x == null && y == null) {
			x = 0;
			y = 1;
		} else if (x == null) {
			if (typeof y == 'string') {
				x = '0';
			} else if (typeof y == 'number') {
				x = 0;
			}
		} else if (y == null) {
			if (typeof x == 'string') {
				y = '0';
			} else if (typeof x == 'number') {
				y = 0;
			}
		}
		var result;
		if (typeof x === 'string' && typeof y === 'string') {
			result = x.localeCompare(y);
		} else if (typeof x === 'number' && typeof y === 'number') {
			result = x - y;
		}
		return (order == null || order == true) ? result : result * -1;
	});
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
		setForm(tableId, dialogId);// Plug the data in the selected row into the form.
	}
}

function closeDialog(dialogId) {
	$('#' + dialogId).dialog('close');
}