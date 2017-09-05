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
		User user = new User();
		user.setFirstName("Chen");
		user.setLastName("Li");
		user.setPhone("217-819-9008");
		user.setEmail("fslichen@126.com");
		for (int i = rowIndex; i < rowIndex + pageSize; i++) {
			users.add(user);
		}
		ResponseDto responseDto = new ResponseDto();
		responseDto.setRows(users);
		responseDto.setRowCount(2358);
		return responseDto;
	}
};