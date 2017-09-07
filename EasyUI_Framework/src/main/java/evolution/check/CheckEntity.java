package evolution.check;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "check")
public class CheckEntity {
	@Id
	@GeneratedValue
	private Long id;
	private String data;// JSON Format
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public CheckEntity() {

	}
	public CheckEntity(String data) {
		this.data = data;
	}
}
