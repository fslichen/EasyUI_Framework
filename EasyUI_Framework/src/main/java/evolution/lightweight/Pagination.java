package evolution.lightweight;

public class Pagination {// Compatible with easy-ui pagination.
	private Integer rowIndex;
	private Integer pageSize;
	public Integer getRowIndex() {
		return rowIndex;
	}
	public void setRowIndex(Integer rowIndex) {
		this.rowIndex = rowIndex;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
}
