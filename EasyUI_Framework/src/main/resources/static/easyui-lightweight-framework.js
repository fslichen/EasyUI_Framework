function createComboBox(formId, comboBoxName, optionMap) {
	var options = [];
	for (key in optionMap) {
		var option = {};
		option['label'] = optionMap[key];
		option['value'] = key;
		options.push(option);
	}
	var comboBox = findElement(formId, comboBoxName);
	comboBox.combobox({
		panelHeight : 'auto',
		textField: 'label',
		valueField: 'value',
		data : options
	});
}

function createTable(tableId, columns) {
	$('#' + tableId).datagrid({
		remoteSort : false,
	    columns : [columns]
	});
}

function findElement(formId, name) {
	var element = null;
	$('#' + formId).find('input,select,textarea').each(function() {
		if ($(this).attr('textboxname') == name) {// TODO Add support for Tiny MCE and HTML elements.
			element = $(this);
			return false;
		}
	});
	return element;
}

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
			var value = row[$(this).attr('textboxname')];
			if (clazz.indexOf('combobox') != -1) {
				$(this).combobox('setValue', value);
			} else {// TODO Add support for Tiny MCE and HTML elements.
				$(this).textbox('setText', value);
			}
		}
	});
}

function getFormData(formId) {
	var formData = {};
	$('#' + formId).find('input,select,textarea').each(function() {
		var clazz = $(this).attr('class');
		if (clazz.indexOf('easyui') != -1) {// Easy UI Attributes
			var value;
			if (clazz.indexOf('combobox') != -1) {
				value = $(this).combobox('getValue');
			} else {// TODO Add support for Tiny MCE and HTML elements.
				value = $(this).textbox('getText');
			}
			formData[$(this).attr('textboxname')] = value;
		}
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