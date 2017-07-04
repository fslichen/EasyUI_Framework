package evolution.controller;

import java.util.LinkedList;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnyController {
	@PostMapping("/post")
	public AnyPojo post(@RequestBody AnyPojo anyPojo) {
		System.out.println(anyPojo);
		return anyPojo;
	}
	
	@PostMapping("/get")
	public List<User> get() {
		List<User> users = new LinkedList<>();
		for (int i = 0; i < 20; i++) {
			users.add(new User("Chen", "Li", "217-819-9008", "fslichen@126.com"));
		}
		return users;
	}
}
