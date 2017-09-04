package evolution.lightweight;

import java.lang.reflect.InvocationTargetException;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LightweightController {
	@Autowired
	LightWeightService lightWeightService;
	
	@GetMapping("/get")
	public void post(HttpServletRequest request) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		AnyDto anyDto = lightWeightService.toT(request, AnyDto.class);
		System.out.println(anyDto);
	}
	
	@PostMapping("/get_users")
	public List<User> getUsers(HttpServletRequest request) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		// Request Dto
		System.out.println(lightWeightService.toMap(request));
		AnyDto anyDto = lightWeightService.toT(request, AnyDto.class);
		int pageIndex = anyDto.getPage() - 1;
		int pageSize = anyDto.getRows();
		System.out.println(anyDto);
		// Response Dtos
		List<User> users = new LinkedList<>();
		User user = new User();
		user.setFirstName("Chen");
		user.setLastName("Li");
		user.setPhone("217-819-9008");
		user.setEmail("fslichen@126.com");
		for (int i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
			users.add(user);
		}
		return users;
	}
};