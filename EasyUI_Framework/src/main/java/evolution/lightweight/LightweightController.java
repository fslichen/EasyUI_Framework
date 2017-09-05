package evolution.lightweight;

import java.lang.reflect.InvocationTargetException;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LightweightController {
	@Autowired
	LightWeightService lightWeightService;
	
	@PostMapping("/edit")
	public void update(HttpServletRequest request) {
		System.out.println(lightWeightService.toMap(request));
	}
	
	@PostMapping("/get_users")
	public ResponseDto getUsers(HttpServletRequest request) throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		// Request Dto
		System.out.println(lightWeightService.toMap(request));
		AnyDto anyDto = lightWeightService.toT(request, AnyDto.class);
		int rowIndex = anyDto.getRowIndex();
		int pageSize = anyDto.getPageSize();
		System.out.println(anyDto);
		// Response Dtos
		List<User> users = new LinkedList<>();
		for (int i = rowIndex; i < rowIndex + pageSize; i++) {
			User user = new User();
			user.setId(i);
			if (Math.random() < .5) {
				user.setFirstName("Chen"); 
			} else {
				user.setFirstName("Ling");
			}
			user.setLastName("Li");
			user.setPhone("217-819-9008");
			user.setEmail("fslichen@126.com");
			user.setLanguage("java");
			users.add(user);
		}
		ResponseDto responseDto = new ResponseDto();
		responseDto.setRows(users);
		responseDto.setRowCount(2358);
		return responseDto;
	}
};