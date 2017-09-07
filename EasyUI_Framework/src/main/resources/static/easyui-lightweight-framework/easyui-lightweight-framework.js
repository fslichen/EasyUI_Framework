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

function createTable(tableId, columnMap) {
	definePagination(tableId);
	var columns = [];
	for (key in columnMap) {
		var column = {};
		column['field'] = key;
		column['title'] = columnMap[key];
		column['width'] = 50;
		column['sortable'] = true;
		columns.push(column);
	}
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
		message('Did you forget to set rows on back end?', '你忘了填返回数据吧?');
		return;
	}
	$('#' + tableId).datagrid('loadData', []);// Remove existing rows.
	var tableColumnAttributes = getTableColumnAttribute(tableId);
	var columnFields = $('#' + tableId).datagrid('getColumnFields');
	for (i in rows) {
		var row = rows[i];
		if (tableColumnAttributes) {
			for (var j in columnFields) {
				var columnField = columnFields[j];
				var attribute = tableColumnAttributes[columnField];
				if (attribute) {
					if (columnField.indexOf('Alias') != -1) {
						row[columnField] = attribute[row[columnField.substring(0, columnField.indexOf('Alias'))]];
					} else if (attribute.indexOf('date') != -1) {
						if (attribute == 'date') {
							row[columnField] = getDate(row[columnField]);
						} else if (attribute == 'dateTime') {
							row[columnField] = getDateTime(row[columnField]);
						}
					} 
				} 
			}
		}
		$('#' + tableId).datagrid('appendRow', row);
	}
	// Update row count.
	var rowCount = responseDto.rowCount;
	if (!rowCount) {
		rowCount = DEFAULT_ROW_COUNT;
		message('Did you forget to set row count on back end?', '你忘了填记录总数吧?');
	}
	$('#' + tableId + 'Pagination').pagination({
		total : rowCount
    });
}

function sendDto(url, requestDto, callBackFunction) {
	$.post(url, requestDto, function(responseDto) {
		if (callBackFunction) {
			callBackFunction.call(responseDto);
		}
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
		message('Please select a row.', '请选择一行数据');
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
		formData[getElementKey($(this))] = getElementValue($(this));
	});
	return formData;
}

function getElementKey(element) {
	return element.attr('textboxname');// TODO Also consider the tiny MCE and HTML element case. 
}

function getElementLabel(element) {
	return element.attr('label');
}

function getElementValue(element) {
	var value = null;
	var clazz = element.attr('class');
	if (clazz.indexOf('easyui') != -1) {// Easy UI Attributes
		if (clazz.indexOf('combobox') != -1) {
			value = element.combobox('getValue');
		} else {// TODO Add support for Tiny MCE and HTML elements.
			value = element.textbox('getText');
		}
	}
	return value;
}

function validateForm(formId, formData) {
	// General Validation
	var valid = true;
	var elementLabel = null;
	$('#' + formId).find('input,select,textarea').each(function() {
		var required = $(this).attr('required');
		if ((required == true || required == 'required') && getElementValue($(this)) == '') {
			valid = false;
			elementLabel = getElementLabel($(this));
			return false;
		}
	});
	if (!valid) {
		message(elementLabel + ' should not be null.', elementLabel + '不可为空');
		return false;
	}
	// Customized Validation
	var formValidationFunction = getFormValidationFunction(formId);
	if (formValidationFunction) {
		return validationFunction.call(formData);
	}
	return true;
}

function sendFormAndPrint(url, formId, tableId) {
	var formData = getFormData(formId);
	if (validateForm(formId, formData)) {
		sendDtoAndPrint(url, formData, tableId);
		return true;
	}
	return false;
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

function message(englishMessage, chineseMessage, language) {
	if (language == 'English') {
		$.messager.alert({
			ok : 'OK',
			title : 'Message',
			msg : englishMessage
		});
	} else if (language == null || language == 'Chinese') {
		$.messager.alert({
			ok : '确定',
			title : '消息',
			msg : chineseMessage
		});
	}
}

function sendRowAndPrint(url, tableId4Row, tableId) {
	$('#' + tableId4Row).datagrid({
		onClickRow : function(index, row) {
			sendDtoAndPrint(url, row, tableId);
		}
	});
}

function sendForm(url, formId) {
	var formData = getFormData(formId);
	if (validateForm(formId, formData)) {
		sendDto(url, formData);
		return true;
	}
	return false;
}

function closeDialog(dialogId) {
	$('#' + dialogId).dialog('close');
}