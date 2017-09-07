package evolution.check;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;

public class CheckService {
	@Autowired
	private CheckDao checkDao;
	
	@Autowired
	private Gson gson;
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> findAll() {
		List<Map<String, Object>> result = new ArrayList<>();
		checkDao.findAll().forEach(x -> {
			Map<String, Object> map = gson.fromJson(x.getData(), Map.class);
			map.put("id", x.getId());
			result.add(map);
		});
		return result;
	}
	
	public <T extends Check> boolean sumbit(T t) {
		Operation operation = t.getOperation();
		if (operation == Operation.INSERT) {
			t.setCheckFlag(CheckFlag.INSERT_PENDING);
			t.setStatusFlag(false);
			t.setDeleteFlag(false);
			t.setCreateTime(new Date());
			if (t.getCreateOperator() == null) {
				return false;
			}
		} else if (operation == Operation.UPDATE) {
			if (t.getId() == null) {
				return false;
			}
			t.setCheckFlag(CheckFlag.UPDATE_PENDING);
			t.setStatusFlag(true);
			t.setDeleteFlag(false);
		} else if (operation == Operation.DELETE) {
			if (t.getId() == null) {
				return false;
			}
			t.setCheckFlag(CheckFlag.DELETE_PENDING);
			t.setStatusFlag(true);
			t.setDeleteFlag(true);
		}
		t.setUpdateTime(new Date());
		if (t.getUpdateOperator() == null) {
			return false;
		}
		checkDao.save(new CheckEntity(gson.toJson(t)));
		if (operation == Operation.INSERT) {
			// TODO Call service and send the entire DTO.
		} else {
			filterBusinessData(t);
			// TODO Call service and send only the status.
		}
		return true;
	}
	
	public <T extends Check> Check filterBusinessData(T t) {
		Check check = new Check();
		BeanUtils.copyProperties(t, check);
		return check;
	}
	
	public <T extends Check> boolean confirm(boolean pass, long id, Class<T> clazz) {
		CheckEntity checkEntity = checkDao.findById(id);
		T t = gson.fromJson(checkEntity.getData(), clazz);
		Operation operation = t.getOperation();
		if (pass) {
			if (operation == Operation.INSERT) {
				filterBusinessData(t);
				// TODO Call service and send only the status.
			} else {
				// TODO Call service and send the entire DTO.
			}
		} else {
			if (operation == Operation.INSERT) {
				t.setDeleteFlag(true);
				// TODO Call service and send only the status.
			} else {
				// TODO Call service and send the entire DTO.
			}
		}
		checkDao.deleteById(id);
		return true;
	}
}