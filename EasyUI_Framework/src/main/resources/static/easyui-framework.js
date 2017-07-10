var formElements = 'input, select, textarea';// TODO Add more elements.

function initialize() {
	tinymce.init({
		selector : '.richTextEditor'
	});
}

function getRichText() {
	return tinymce.activeEditor.getContent();
}

function fillInForm(tableId, id) {// id is mostly dialog ID.
	var row = getRow(tableId);
	var columnIds = getColumnIds(tableId);
	$('#' + id).find(formElements).each(function() {
		var value = row[$(this).attr('name')];
		if (value != null) {
			$(this).val(value);
		}
	});
}

function getForm(id) {// id is mostly dialog ID.
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
	return data;
}

function postForm(url, id, callBack) {// id is mostly dialog ID.
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

function postAndPrint(url, request, tableId) {
	post(url, request, function() {
		var data = this.data;
		deleteRows(tableId);
		for (var i = 0; i < data.length; i++) {
			addRow(tableId, data[i]);
		}
	});
}

function postFormAndPrint(url, id, tableId) {// id is mostly dialog ID.
	postAndPrint(url, getForm(id), tableId);
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

function getRow(tableId) {
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