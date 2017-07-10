package evolution.controller;

import java.text.ParseException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnyController {
	@PostMapping("/find")
	public JsResponse<AnyPojo> find(@RequestBody AnyPojo anyPojo) throws ParseException {
		AnyPojo anyPojo0 = new AnyPojo("Chen", "M", "2017/07/30", "fslichen@126.com", "<h1>Hello World</h1>");
		AnyPojo anyPojo1 = new AnyPojo("Ling", "F", "2017/06/29", "fslingling@126.com", "<h1>Goodbye Past</h1>");
		List<AnyPojo> anyPojos = new LinkedList<>();
		for (int i = 0; i < 50; i++) {
			anyPojos.addAll(Arrays.asList(anyPojo0, anyPojo1));
		}
		JsResponse<AnyPojo> response = new JsResponse<>();
		response.setData(anyPojos);
		return response;
	}
	
	@PostMapping("/create")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> create() {
		return new JsResponse("Success");
	}
	
	@PostMapping("/update")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> update() {
		return new JsResponse("Success");
	}
	
	@PostMapping("/delete")
	@SuppressWarnings("rawtypes")
	public JsResponse<?> delete() {
		return new JsResponse("Success");
	}
}
