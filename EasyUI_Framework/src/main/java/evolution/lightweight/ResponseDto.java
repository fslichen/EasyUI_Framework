package evolution.lightweight;

import java.util.List;

public class ResponseDto {
	private List<User> rows;
	private Integer rowCount;
	public List<User> getRows() {
		return rows;
	}
	public void setRows(List<User> rows) {
		this.rows = rows;
	}
	public Integer getRowCount() {
		return rowCount;
	}
	public void setRowCount(Integer rowCount) {
		this.rowCount = rowCount;
	}
}
