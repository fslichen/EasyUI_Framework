package evolution.controller;

import java.util.Date;

public class AnyPojo {
	private String name;
	private String gender;
	private Date birthday;
	private String email;
	private String message;
	private Date startDate;
	private Date endDate;
	private Date endDateConverted;
	private Date anniversary;
	private String type;
	private String executionDate;
	private Integer pageIndex;
	private Integer pageSize;
	public AnyPojo() {

	}
	public AnyPojo(String name, String gender, Date birthday, String email, String message, Date startDate,
			Date endDate, Date endDateConverted, Date anniversary, String type, String executionDate) {
		this.name = name;
		this.gender = gender;
		this.birthday = birthday;
		this.email = email;
		this.message = message;
		this.startDate = startDate;
		this.endDate = endDate;
		this.endDateConverted = endDateConverted;
		this.anniversary = anniversary;
		this.type = type;
		this.executionDate = executionDate;
	}
	public Date getAnniversary() {
		return anniversary;
	}
	public Date getBirthday() {
		return birthday;
	}
	public String getEmail() {
		return email;
	}
	public Date getEndDate() {
		return endDate;
	}
	public Date getEndDateConverted() {
		return endDateConverted;
	}
	public String getExecutionDate() {
		return executionDate;
	}
	public String getGender() {
		return gender;
	}
	public String getMessage() {
		return message;
	}
	public String getName() {
		return name;
	}
	public Integer getPageIndex() {
		return pageIndex;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public Date getStartDate() {
		return startDate;
	}
	public String getType() {
		return type;
	}
	public void setAnniversary(Date anniversary) {
		this.anniversary = anniversary;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public void setEndDateConverted(Date endDateConverted) {
		this.endDateConverted = endDateConverted;
	}
	public void setExecutionDate(String executionDate) {
		this.executionDate = executionDate;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "AnyPojo [name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", email=" + email
				+ ", message=" + message + ", startDate=" + startDate + ", endDate=" + endDate + ", endDateConverted="
				+ endDateConverted + ", anniversary=" + anniversary + ", type=" + type + ", executionDate="
				+ executionDate + ", pageIndex=" + pageIndex + ", pageSize=" + pageSize + "]";
	}
}
