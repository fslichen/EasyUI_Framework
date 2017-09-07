package evolution.check;

import org.springframework.data.repository.CrudRepository;

public interface CheckDao extends CrudRepository<CheckEntity, Long> {
	public void deleteById(long id);
	
	public CheckEntity findById(long id);
}
