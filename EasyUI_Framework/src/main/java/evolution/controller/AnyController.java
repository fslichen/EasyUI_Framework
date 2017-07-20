package evolution.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnyController {
	@PostMapping("/find")
	public JsResponse<AnyPojo> find(@RequestBody AnyPojo anyPojo) throws ParseException {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM/dd/yyyy");
		System.out.println(anyPojo);
		AnyPojo anyPojo0 = new AnyPojo("Chen", "M", simpleDateFormat.parse("07/30/2017"), "fslichen@126.com", "<h1>Hello World</h1>", new Date(), new Date(), new Date(), new Date().getTime(), "2017/07/04 19:00:00");
		AnyPojo anyPojo1 = new AnyPojo("Ling", "F", simpleDateFormat.parse("06/30/2017"), "fslingling@126.com", "<h1>Goodbye Past</h1>", new Date(), new Date(), new Date(), new Date().getTime(), "2017/07/04 19:00:00");
		List<AnyPojo> anyPojos = new LinkedList<>();
		for (int i = 0; i < 113; i++) {
			anyPojos.addAll(Arrays.asList(anyPojo0, anyPojo1));
		}
		JsResponse<AnyPojo> response = new JsResponse<>();
		response.setData(anyPojos);
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
