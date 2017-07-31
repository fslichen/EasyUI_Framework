package evolution.controller;

import java.util.List;
import java.util.Map;

public class JsResponse<T> {
	private String message;
	private List<T> data;
	private Map<String, Object> responseFields;
	public Map<String, Object> getResponseFields() {
		return responseFields;
	}
	public void setResponseFields(Map<String, Object> responseFields) {
		this.responseFields = responseFields;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
	@Override
	public String toString() {
		return "JsResponse [message=" + message + ", data=" + data + "]";
	}
	public JsResponse() {

	}
	public JsResponse(String message) {
		this.message = message;
	}
}
