package evolution.controller;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class AnyPojo {
	private String name;
	private String gender;
	@DateTimeFormat
	private Date birthday;
	private String email;
	private String message;
	private Date startDate;
	private Date endDate;
	public AnyPojo() {

	}
	public AnyPojo(String name, String gender, Date birthday, String email, String message) {
		super();
		this.name = name;
		this.gender = gender;
		this.birthday = birthday;
		this.email = email;
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
	@Override
	public String toString() {
		return "AnyPojo [name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", email=" + email
				+ ", message=" + message + ", startDate=" + startDate + ", endDate=" + endDate + "]";
	}
}
