package evolution.controller;

public class AnyPojo {
	private String name;

	public String getName() {
		return name;
	}

	@Override
	public String toString() {
		return "RequestPojo [name=" + name + "]";
	}

	public void setName(String name) {
		this.name = name;
	}
}
