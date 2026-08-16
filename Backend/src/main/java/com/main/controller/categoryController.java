


package com.main.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Dto.CategoryRequest;
import com.main.Dto.CategoryResponse;
import com.main.ServiceImpl.CategoryServiceImpl;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class categoryController {

    @Autowired
    private CategoryServiceImpl categoryService;


    @PostMapping("/add")
    public ResponseEntity<CategoryResponse> addCategory(
            @RequestBody CategoryRequest request) {

        return new ResponseEntity<>(
                categoryService.addCategory(request),
                HttpStatus.CREATED
        );
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<CategoryResponse>>
    getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse>
    getCategoryById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryResponse>
    updateCategory(
            @PathVariable Integer id,
            @RequestBody CategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(
                        id,
                        request
                )
        );
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String>
    deleteCategory(
            @PathVariable Integer id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                "Category deleted successfully"
        );
    }
}