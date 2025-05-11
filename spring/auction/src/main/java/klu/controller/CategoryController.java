package klu.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import klu.model.Category;
import klu.model.CategoryManager;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryManager CM;

    @PostMapping("/add")
    public String addCategory(@RequestBody Category C) {
        return CM.addCategory(C);
    }

    @PutMapping("/update")
    public String updateCategory(@RequestBody Category C) {
        return CM.updateCategory(C);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable("id") int id) {
        return CM.deleteCategory(id);
    }

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return CM.getAllCategories();
    }
}
