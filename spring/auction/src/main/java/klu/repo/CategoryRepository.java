package klu.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import klu.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
