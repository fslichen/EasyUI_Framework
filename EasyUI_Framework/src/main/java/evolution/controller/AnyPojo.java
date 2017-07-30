package evolution.controller;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AnyPojo {
	private String name;
	private String gender;
	@JsonFormat(pattern = "MM/dd/yyyy")
	private Date birthday;
	private String email;
	private String message;
	@JsonFormat(pattern = "MM/dd/yyyy")
	private Date startDate;
	@JsonFormat(pattern = "MM/dd/yyyy")
	private Date endDate;
	private Date endDateConverted;
	private Date anniversary;
	private String type;
	private String executionDate;
	private Integer pageIndex;
	private Integer pageSize;
	public AnyPojo() {

	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public Date getEndDateConverted() {
		return endDateConverted;
	}
	public void setEndDateConverted(Date endDateConverted) {
		this.endDateConverted = endDateConverted;
	}
	public Date getAnniversary() {
		return anniversary;
	}
	public void setAnniversary(Date anniversary) {
		this.anniversary = anniversary;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getExecutionDate() {
		return executionDate;
	}
	public void setExecutionDate(String executionDate) {
		this.executionDate = executionDate;
	}
	public Integer getPageIndex() {
		return pageIndex;
	}
	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	@Override
	public String toString() {
		return "AnyPojo [name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", email=" + email
				+ ", message=" + message + ", startDate=" + startDate + ", endDate=" + endDate + ", endDateConverted="
				+ endDateConverted + ", anniversary=" + anniversary + ", type=" + type + ", executionDate="
				+ executionDate + ", pageIndex=" + pageIndex + ", pageSize=" + pageSize + "]";
	}
}
