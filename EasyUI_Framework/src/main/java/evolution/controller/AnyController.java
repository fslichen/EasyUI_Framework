package evolution.controller;

import java.text.ParseException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnyController {
	@PostMapping("/find")
	public JsResponse<AnyPojo> find(@RequestBody AnyPojo requestPojo) throws ParseException {
		System.out.println(requestPojo);
		List<AnyPojo> responsePojos = new LinkedList<>();
		int totalCount = 998;
		for (int i = 0; i < totalCount; i++) {
			AnyPojo responsePojo = new AnyPojo();
			responsePojo.setName(i + "");
			responsePojo.setGender("M");
			responsePojo.setBirthday(new Date());
			responsePojo.setEmail("fslichen@126.com");
			responsePojo.setAnniversary(new Date());
			responsePojo.setMessage("<h1>Hello World</h1>");
			responsePojos.add(responsePojo);
		}
		JsResponse<AnyPojo> response = new JsResponse<>();
		if (requestPojo.getPageSize() != null) {
			List<AnyPojo> responsePojosWithPagination = new LinkedList<>();
			int pageIndex = requestPojo.getPageIndex();
			int pageSize = requestPojo.getPageSize();
			for (int i = pageIndex * pageSize; i < Math.min((pageIndex + 1) * pageSize, totalCount); i++) {
				responsePojosWithPagination.add(responsePojos.get(i));
			}
			response.setData(responsePojosWithPagination);
		} else {
			response.setData(responsePojos);
		}
		Map<String, Object> responseFields = new LinkedHashMap<>();
		responseFields.put("message", "Hello World");
		responseFields.put("totalCount", totalCount);
		response.setResponseFields(responseFields);
		return response;
	}
	
	@PostMapping("/create")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> create(@RequestBody AnyPojo anyPojo) {
		System.out.println(anyPojo);
		return new JsResponse("Success");
	}
	
	@PostMapping("/update")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> update(@RequestBody AnyPojo anyPojo) {
		System.out.println(anyPojo);
		return new JsResponse("Success");
	}
	
	@PostMapping("/delete")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> delete(@RequestBody AnyPojo anyPojo) {
		System.out.println(anyPojo);
		return new JsResponse("Success");
	}
}
