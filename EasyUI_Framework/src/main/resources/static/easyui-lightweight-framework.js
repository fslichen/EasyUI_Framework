function print(tableId, responseDto) {
	// Print rows.
	var rows = responseDto.rows;
	if (!rows) {
		alert('Did you forget to set rows on back end?');
		return;
	}
	$('#' + tableId).datagrid('loadData', []);// Remove existing rows.
	for (i in rows) {
		$('#' + tableId).datagrid('appendRow', rows[i]);
	}
	// Update row count.
	var rowCount = responseDto.rowCount;
	if (!rowCount) {
		rowCount = DEFAULT_ROW_COUNT;
		alert('Did you forget to set row count on back end?');
	}
	$('#' + tableId + 'Pagination').pagination({
		total : rowCount
    });
}

function sendDto(url, requestDto, callBackFunction) {
	$.post(url, requestDto, function(responseDto) {
		callBackFunction.call(responseDto);
	});
}

function sendDtoAndPrint(url, requestDto, tableId) {
	// Set default pagination info if necessary.
	if (!requestDto.rowIndex) {
		requestDto['rowIndex'] = DEFAULT_ROW_INDEX;
	}
	if (!requestDto.pageSize) {
		requestDto['pageSize'] = DEFAULT_PAGE_SIZE;
	}
	sendDto(url, requestDto, function() {
		// Store the request data so that pagination can retrieve them later on.
		setUrl4Table(tableId, url);
		setRequestDto4Table(tableId, requestDto);
		// Print rows.
		print(tableId, this);
	});
}

function openDialog(dialogId) {
	$('#' + dialogId).dialog('open').dialog('center');
}

function setFormData(tableId, formId) {
	var row = $('#' + tableId).datagrid('getSelected');
	if (!row) {
		alert('Please select a row.');
		return;
	}
	$('#' + formId).find('input,select,textarea').each(function() {
		var clazz = $(this).attr('class');
		if (clazz.indexOf('easyui') != -1) {// Easy UI Attributes
			$(this).textbox('setText', row[$(this).attr('textboxname')]);
		}// TODO Add support for Tiny MCE and HTML elements.
	});
}

function getFormData(formId) {
	var formData = {};
	$('#' + formId).find('input,select,textarea').each(function() {
		var clazz = $(this).attr('class');
		if (clazz.indexOf('easyui') != -1) {// Easy UI Attributes
			formData[$(this).attr('textboxname')] = $(this).textbox('getText');
		}// TODO Add support for Tiny MCE and HTML elements.
	});
	return formData;
}

function sendFormAndPrint(url, formId, tableId) {
	sendDtoAndPrint(url, getFormData(formId), tableId);
}

function definePagination(tableId) {
	$('#' + tableId + 'Pagination').pagination({
		pageNumber : DEFAULT_PAGE_NUMBER,
		pageSize : DEFAULT_PAGE_SIZE,
		total : DEFAULT_ROW_COUNT,
		onSelectPage : function(pageNumber, pageSize) {
			var requestDto = getRequestDto4Table(tableId);
			requestDto['rowIndex'] = (pageNumber - 1) * pageSize;
			requestDto['pageSize'] = pageSize;
			setRequestDto4Table(tableId, requestDto);
			sendDtoAndPrint(getUrl4Table(tableId), requestDto, tableId);
        }
    });
}