var data;

// Constructor
function initialize() {
	data = {};
	data['responseData'] = {};
	data['formElements'] = 'input, select, textarea';// TODO Add more elements.
	tinymce.init({
		selector : '.richTextEditor'
	});
}

// Pagination
function setPagination(tableId, paginationId) {
	$('#' + paginationId).pagination({
		onSelectPage : function(pageIndex, pageSize) {
			print(tableId, pageIndex, pageSize);
		}
	});
}

// Rich Text Editor
function getRichText() {
	return tinymce.activeEditor.getContent();
}

// Form
function getFormElements() {
	return data['formElements'];
}

function getKey(element) {
	var key = element.attr('name');
	if (key == null) {
		key = element.attr('textboxname');
	}
	return key;
}

function setForm(tableId, id) {// id is mostly dialog ID.
	var row = getRow(tableId);
	var columnIds = getColumnIds(tableId);
	$('#' + id).find(getFormElements()).each(function() {
		var key = getKey($(this));
		if (key != null) {
			var value = row[key];
			if (value != null) {
				$(this).val(value);
			}
		}
	});
}

function getRequestData(id) {// id is mostly dialog ID.
	var requestData = {};
	$('#' + id).find(getFormElements()).each(function() {
		var key = getKey($(this));
		if (key != null) {
			var clazz = $(this).attr('class');
			if (clazz == 'richTextEditor') {
				requestData[key] = getRichText();
			} else {
				requestData[key] = $(this).val();
			}
		}
	});
	return requestData;
}

function postForm(url, id, callBack) {// id is mostly dialog ID.
	post(url, getRequestData(id), callBack);
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
	    			callBack.call(response);// Call passes the argument to this object in the call back function.
	    		}
	    }
	});
}

// Print
function print(tableId, pageIndex, pageSize) {
	deleteRows(tableId);
	var responseData = getResponseData(tableId);// Specify the ID.
	if (pageIndex == null) {
		pageIndex = 1;
	}
	if (pageSize == null) {
		pageSize = 10;
	}
	for (var i = (pageIndex - 1) * pageSize; i < Math.min(pageIndex * pageSize, responseData.length); i++) {
		addRow(tableId, responseData[i]);
	}
}

function postAndPrint(url, request, tableId) {
	post(url, request, function() {
		var responseData = this.responseData;
		if (responseData == null) {
			responseData = this.data;
			if (responseData == null) {
				responseData = this.responseGrid;
			}
		}
		if (responseData != null) {
			setResponseData(tableId, responseData);
			print(tableId);
		} else {
			alert("Failed to receive the response data. Make sure the field name for response data is responseData, data or responseGrid.");
		}
	});
}

function postFormAndPrint(url, id, tableId) {// id is mostly dialog ID.
	postAndPrint(url, getRequestData(id), tableId);
}

// Output
function getColumnIds(tableId) {
	var ths = $('#' + tableId + 'th');
	var columns = [];
	$('th').each(function() {
		columns.push($(this).attr('field'));
	});
	return columns;
}

function addRow(tableId, row) {
	$('#' + tableId).datagrid('appendRow', row);
}

function getRow(tableId) {
	return $('#' + tableId).datagrid('getSelected');
}

function deleteRows(tableId) {
	$('#' + tableId).datagrid('loadData', []);
}

function setResponseData(tableId, responseData) {
	data.responseData[tableId] = responseData;
}

function getResponseData(tableId) {
	return data.responseData[tableId];
}

// Dialog
function openDialog(dialogId, title, tableId) {
	$('#' + dialogId).dialog('open').dialog('setTitle', title);
	if (tableId != null) {
		setForm(tableId, dialogId);
	}
}

function closeDialog(dialogId) {
	$('#' + dialogId).dialog('close');
}