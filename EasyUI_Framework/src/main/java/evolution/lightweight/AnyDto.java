package evolution.lightweight;

import java.util.Date;

public class AnyDto extends Pagination {
	private String name;
	private int age;
	private Date birthday;
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	@Override
	public String toString() {
		return "AnyDto [name=" + name + ", age=" + age + ", birthday=" + birthday + ", rowIndex=" + this.getRowIndex() + ", pageSize=" + this.getPageSize() + "]";
	}
}
