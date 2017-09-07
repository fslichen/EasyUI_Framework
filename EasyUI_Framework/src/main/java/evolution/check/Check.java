package evolution.check;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Check {
	@JsonIgnore
	private Long id;// Same as the primary key
	private CheckFlag checkFlag;
	private Boolean statusFlag;
	private Boolean deleteFlag;
	private Date createTime;
	private Date updateTime;
	private String createOperator;
	private String updateOperator;
	private Operation operation;
	private String operator;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCreateOperator() {
		return createOperator;
	}
	public void setCreateOperator(String createOperator) {
		this.createOperator = createOperator;
	}
	public String getUpdateOperator() {
		return updateOperator;
	}
	public void setUpdateOperator(String updateOperator) {
		this.updateOperator = updateOperator;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public Operation getOperation() {
		return operation;
	}
	public void setOperation(Operation operation) {
		this.operation = operation;
	}
	public Boolean getDeleteFlag() {
		return deleteFlag;
	}
	public void setDeleteFlag(Boolean deleteFlag) {
		this.deleteFlag = deleteFlag;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public CheckFlag getCheckFlag() {
		return checkFlag;
	}
	public void setCheckFlag(CheckFlag checkFlag) {
		this.checkFlag = checkFlag;
	}
	public Boolean getStatusFlag() {
		return statusFlag;
	}
	public void setStatusFlag(Boolean statusFlag) {
		this.statusFlag = statusFlag;
	}
}
