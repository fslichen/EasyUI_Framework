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
		setUrl4Printing(tableId, url);
		setRequestDto4Printing(tableId, requestDto);
		// Print rows.
		print(tableId, this);
	});
}

function definePagination(tableId) {
	$('#' + tableId + 'Pagination').pagination({
		pageNumber : DEFAULT_PAGE_NUMBER,
		pageSize : DEFAULT_PAGE_SIZE,
		total : DEFAULT_ROW_COUNT,
		onSelectPage : function(pageNumber, pageSize) {
			var requestDto = getRequestDto4Printing(tableId);
			requestDto['rowIndex'] = (pageNumber - 1) * pageSize;
			requestDto['pageSize'] = pageSize;
			setRequestDto4Printing(tableId, requestDto);
			sendDtoAndPrint(getUrl4Printing(tableId), requestDto, tableId);
        }
    });
}