package evolution.lightweight;

import java.util.List;

public class ResponseDto {
	private List<User> users;
	private Integer total;
	public List<User> getUsers() {
		return users;
	}
	public void setUsers(List<User> users) {
		this.users = users;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
}
