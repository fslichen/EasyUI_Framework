package evolution.controller;

public class AnyPojo {
	private String name;
	private String gender;
	private String birthday;
	private String email;
	private String message;
	public AnyPojo() {

	}
	public AnyPojo(String name, String gender, String birthday, String email, String message) {
		this.name = name;
		this.gender = gender;
		this.birthday = birthday;
		this.email = email;
		this.message = message;
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
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	@Override
	public String toString() {
		return "AnyPojo [name=" + name + ", gender=" + gender + ", birthday=" + birthday + ", email=" + email
				+ ", message=" + message + "]";
	}
}
