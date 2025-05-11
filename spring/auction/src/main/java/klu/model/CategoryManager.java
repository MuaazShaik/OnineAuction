package klu.model;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import klu.repo.CategoryRepository;

@Service
public class CategoryManager {

    @Autowired
    private CategoryRepository CR;

    public String addCategory(Category C) {
        CR.save(C);
        return "200::Category Added";
    }

    public String updateCategory(Category C) {
        if (!CR.existsById(C.getId())) return "404::Category Not Found";
        CR.save(C);
        return "200::Category Updated";
    }

    public String deleteCategory(int id) {
        if (!CR.existsById(id)) return "404::Category Not Found";
        CR.deleteById(id);
        return "200::Category Deleted";
    }

    public List<Category> getAllCategories() {
        return CR.findAll();
    }
}
