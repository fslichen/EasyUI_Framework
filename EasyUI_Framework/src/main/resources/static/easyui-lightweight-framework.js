function print(tableId, url, parameters, callBackFunction) {
	if (!parameters.rowIndex) {
		parameters['rowIndex'] = 0;
	}
	if (!parameters.pageSize) {
		parameters['pageSize'] = 10;
	}
	setUrl4Printing(tableId, url);
	setRequestDto4Printing(tableId, parameters);
	$.post(url, parameters, function(responseDto) {
		var rows = responseDto.rows;
		if (!rows) {
			alert('Did you forget to set rows on back end?');
			rows = [];
		}
		for (i in rows) {
			$('#' + tableId).datagrid('appendRow', rows[i]);
		}
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

function initializePagination(tableId) {
	$('#' + tableId + 'Pagination').pagination({
		pageNumber : 1,
		pageSize : 10,
		total : DEFAULT_ROW_COUNT,// TODO Send and Ajax request to get the row count.
		onSelectPage : function(pageNumber, pageSize) {
			var requestDto = getRequestDto4Printing(tableId);
			requestDto['rowIndex'] = (pageNumber - 1) * pageSize;
			requestDto['pageSize'] = pageSize;
			setRequestDto4Printing(tableId, requestDto);
			print(tableId, getUrl4Printing(tableId), requestDto);
        }
    });
}