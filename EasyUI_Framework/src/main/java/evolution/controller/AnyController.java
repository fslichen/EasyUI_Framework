package evolution.controller;

import java.text.ParseException;
import java.util.Arrays;
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
	public JsResponse<AnyPojo> find(@RequestBody AnyPojo anyPojo) throws ParseException {
		System.out.println(anyPojo);
		AnyPojo anyPojo0 = new AnyPojo();
		anyPojo0.setName("Chen");
		anyPojo0.setGender("M");
		anyPojo0.setBirthday(new Date());
		anyPojo0.setEmail("fslichen@126.com");
		anyPojo0.setAnniversary(new Date());
		AnyPojo anyPojo1 = new AnyPojo();
		anyPojo1.setName("Ling");
		anyPojo1.setGender("F");
		anyPojo1.setBirthday(new Date());
		anyPojo1.setEmail("fsling@163.com");
		anyPojo1.setAnniversary(new Date());
		List<AnyPojo> anyPojos = new LinkedList<>();
		for (int i = 0; i < 113; i++) {
			anyPojos.addAll(Arrays.asList(anyPojo0, anyPojo1));
		}
		JsResponse<AnyPojo> response = new JsResponse<>();
		if (anyPojo.getPageSize() != null) {
			List<AnyPojo> anotherPojos = new LinkedList<>();
			for (int i = 0; i < anyPojo.getPageSize(); i++) {
				anotherPojos.add(anyPojos.get(i));
			}
			response.setData(anotherPojos);
		} else {
			response.setData(anyPojos);
		}
		Map<String, Object> responseFields = new LinkedHashMap<>();
		responseFields.put("message", "Hello World");
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
