var data;// It has a map structure.

// Constructor
function initialize() {
	// Initialize Data
	data = {};
	data['clickCount'] = {};
	data['responseData'] = {};
	data['pagination'] = {};
	data['formElements'] = 'input, select, textarea, button';
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

// Form
function getActiveRichText() {
	return tinymce.activeEditor.getContent();
}

function getRichText(id) {// ID is mostly text area name.
	return tinymce.get(id).getContent();
}

function getFormElements() {
	return data['formElements'];
}

function getKey(element) {// Get either name or text box name.
	var key = element.attr('name');
	if (key == null) {
		key = element.attr('textboxname');
	}
	return key;
}

function setForm(tableId, id) {// Set form by selected row; ID is mostly dialog ID.
	var selectedRowExists = true;
	var selectedRow = getSelectedRow(tableId);
	if (selectedRow == null || getRowCount(tableId) == 0) {// No row is selected.
		selectedRowExists = false;
	}
	$('#' + id).find(getFormElements()).each(function() {
		var key = getKey($(this));
		if (key != null) {
			var value = null;
			if (selectedRowExists) {
				value = selectedRow[key];
			}
			setField($(this), value);
		} else {
			console.info('The key for form element ' + JSON.stringify($(this)) + ' should not be empty.');
		}
	});
}

function getRequestData(id) {// ID is mostly dialog ID.
	var requestData = {};
	$('#' + id).find(getFormElements()).each(function() {
		var key = getKey($(this));
		if (key != null) {
			var clazz = $(this).attr('class');
			if (clazz == 'richTextEditor') {
				requestData[key] = getActiveRichText();
			} else {
				requestData[key] = $(this).val();
			}
		} else {
			console.info('The key for form element ' + JSON.stringify($(this)) + ' should not be empty.');
		}
	});
	return requestData;
}

// Post
function post(url, request, callBack) {
	$.ajax({
		    url : url,
		    type : 'POST',
		    data : JSON.stringify(request),
		    contentType : 'application/json;charset=utf-8',
		    dataType : 'json',
		    async : true,
		    success : function(response) {
		    	var message = response.message;
		    	if (message != null) {
		    		alert(message);
		    	}
		    	if (callBack != null) {
		    		callBack.call(response);// Call passes the response argument to 'this' object in the call back function.
		    	}
	    }
	});
	// Clear Form Data
	tinymce.activeEditor.setContent('');
}

// Print
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
			alert("Failed to receive the response data. Make sure the field name for response data is 'responseData', 'data' or 'responseGrid'.");
		}
	});
}

function includes(string, substring) {
	return string.indexOf(substring) !== -1;
}

function setField(field, value) {
	var fieldClass = field.attr('class');
	if (fieldClass != null && (includes(fieldClass, 'easyui-textbox') || includes(fieldClass, 'easyui-datebox'))) {
		field.textbox('setText', value);
	} else {
		field.val(value);
	}
}

function postForm(url, id) {// ID is mostly dialog ID.
	post(url, getRequestData(id));
	closeDialog(id);
}

function postFormAndPrint(url, id, tableId) {// ID is mostly dialog ID.
	postAndPrint(url, getRequestData(id), tableId);
	closeDialog(id);
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

function addRow(tableId, row) {
	var rowExcerpt = {};
	var columnKeys = getColumnKeys(tableId);
	for (var i = 0; i < columnKeys.length; i++) {
		var columnKey = columnKeys[i];
		var columnValue = row[columnKey];
		if (columnValue != null) {
			rowExcerpt[columnKey] = columnValue;
		} else {
			rowExcerpt[columnKey] = null; 
		}
	}
	$('#' + tableId).datagrid('appendRow', rowExcerpt);
}

function sort(objects, sortField, order) {
	return objects.sort(function(a, b) {
		var x = a[sortField];
		var y = b[sortField];
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