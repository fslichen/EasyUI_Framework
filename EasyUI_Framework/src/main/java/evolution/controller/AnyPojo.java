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
	private Long anniversary;
	private String type;
	private String executionDate;
	public AnyPojo() {

	}
	public String getExecutionDate() {
		return executionDate;
	}
	public void setExecutionDate(String executionDate) {
		this.executionDate = executionDate;
	}
	public Long getAnniversary() {
		return anniversary;
	}
	public void setAnniversary(Long anniversary) {
		this.anniversary = anniversary;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public AnyPojo(String name, String gender, Date birthday, String email, String message, Date startDate,
			Date endDate, Date endDateConverted, Long anniversary, String executionDate) {
		super();
		this.name = name;
		this.gender = gender;
		this.birthday = birthday;
		this.email = email;
		this.message = message;
		this.startDate = startDate;
		this.endDate = endDate;
		this.endDateConverted = endDateConverted;
		this.anniversary = anniversary;
		this.executionDate = executionDate;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
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
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public Date getEndDateConverted() {
		return endDateConverted;
	}
	public void setEndDateConverted(Date endDateConverted) {
		this.endDateConverted = endDateConverted;
	}
	@Override
	public String toString() {
		return "AnyPojo [name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", email=" + email
				+ ", message=" + message + ", startDate=" + startDate + ", endDate=" + endDate + ", endDateConverted="
				+ endDateConverted + ", anniversary=" + anniversary + ", type=" + type + ", executionDate="
				+ executionDate + "]";
	}
}
