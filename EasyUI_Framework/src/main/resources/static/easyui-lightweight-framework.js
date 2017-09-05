function print(tableId, url, requestDto, callBackFunction) {
	// Set default pagination info if necessary.
	if (!requestDto.rowIndex) {
		requestDto['rowIndex'] = DEFAULT_ROW_INDEX;
	}
	if (!requestDto.pageSize) {
		requestDto['pageSize'] = DEFAULT_PAGE_SIZE;
	}
	// Store the request data so that pagination can retrieve them later on.
	setUrl4Printing(tableId, url);
	setRequestDto4Printing(tableId, requestDto);
	// Send the post request and print.
	$.post(url, requestDto, function(responseDto) {
		// Print rows.
		var rows = responseDto.rows;
		if (!rows) {
			alert('Did you forget to set rows on back end?');
			rows = [];
		}
		$('#' + tableId).datagrid('loadData', []);// Romove existing rows.
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
	});
	if (callBackFunction) {
		callBackFunction.call();
	}
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
			print(tableId, getUrl4Printing(tableId), requestDto);
        }
    });
}