var formElements = 'input, select, textarea';// TODO Add more elements.

function initialize() {
	tinymce.init({
		selector : '.richTextEditor'
	});
}

function getRichText() {
	return tinymce.activeEditor.getContent();
}

function fillInForm(tableId, id) {
	var row = getRow(tableId);
	var columnIds = getColumnIds(tableId);
	$('#' + id).find(formElements).each(function() {
		var value = row[$(this).attr('name')];
		if (value != null) {
			$(this).val(value);
		}
	});
}

function getForm(id) {
	var data = {};
	$('#' + id).find(formElements).each(function() {
		var key = $(this).attr('name');
		var clazz = $(this).attr('class');
		if (clazz == 'richTextEditor') {
			data[key] = getRichText();
		} else {
			data[key] = $(this).val();
		}
	});
	alert(JSON.stringify(data));
	return data;
}

function postForm(url, id, callBack) {
	post(url, getForm(id), callBack);
}

function post(url, request, callBack) {
	$.ajax({
	    url : url,
	    type : 'POST',
	    data : JSON.stringify(request),
	    contentType : 'application/json;charset=utf-8',
	    dataType : 'json',
	    async : true,
	    success : function(response) {
	    		if (callBack != null) {
	    			callBack.call(response);// Call passes the argument to this object in the call back function.
	    		}
	    }
	});
}

function postAndPrint(url, request, tableId) {
	post(url, request, function() {
		for (var i = 0; i < this.length; i++) {
			addRow(tableId, this[i]);
		}
	});
}

function postFormAndPrint(url, id, tableId) {
	sendAndPrint(url, getForm(id), tableId);
}

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

function openDialog(dialogId, title, tableId) {
	$('#' + dialogId).dialog('open').dialog('setTitle', title);
	if (tableId != null) {
		fillInForm(tableId, dialogId);
	}
}

function closeDialog(dialogId) {
	$('#' + dialogId).dialog('close');
}

function clearForm(formId) {
	$('#' + formId).form('clear');
}

function getRow(tableId, callBack) {
	return $('#' + tableId).datagrid('getSelected');
}

function display(object) {
	for (i in object) {
		alert(object[i]);
	}
}

function deleteRows(tableId) {
	$('#' + tableId).datagrid('loadData', []);
}