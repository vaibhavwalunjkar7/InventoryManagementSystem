//package com.main.ServiceImpl;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.main.Dto.CategoryRequest;
//import com.main.Dto.CategoryResponse;
//import com.main.Repo.CategoryRepo;
//import com.main.model.Category;
//
//@Service
//public class CategoryServiceImpl {
//
//    @Autowired
//    private CategoryRepo categoryRepo;
//
//
//    // =========================================
//    // ADD CATEGORY
//    // =========================================
//
//    public CategoryResponse addCategory(CategoryRequest request) {
//
//        Category category = new Category();
//
//        category.setName(request.getName());
//        category.setCreated_at(LocalDateTime.now());
//
//        Category savedCategory =
//                categoryRepo.save(category);
//
//        return convertToResponse(savedCategory);
//    }
//
//
//    // =========================================
//    // GET ALL CATEGORIES
//    // =========================================
//
//    public List<CategoryResponse> getAllCategories() {
//
//        return categoryRepo.findAll()
//                .stream()
//                .map(this::convertToResponse)
//                .toList();
//    }
//
//
//    // =========================================
//    // GET CATEGORY BY ID
//    // =========================================
//
//    public CategoryResponse getCategoryById(int id) {
//
//        Category category =
//                categoryRepo.findById(id)
//                .orElseThrow(() ->
//                    new RuntimeException(
//                        "Category not found with id: " + id
//                    )
//                );
//
//        return convertToResponse(category);
//    }
//
//
//    // =========================================
//    // UPDATE CATEGORY
//    // =========================================
//
//    public CategoryResponse updateCategory(
//            int id,
//            CategoryRequest request) {
//
//        Category category =
//                categoryRepo.findById(id)
//                .orElseThrow(() ->
//                    new RuntimeException(
//                        "Category not found with id: " + id
//                    )
//                );
//
//
//        category.setName(request.getName());
//
//        Category updatedCategory =
//                categoryRepo.save(category);
//
//
//        return convertToResponse(updatedCategory);
//    }
//
//
//    // =========================================
//    // DELETE CATEGORY
//    // =========================================
//
//    public void deleteCategory(int id) {
//
//        Category category =
//                categoryRepo.findById(id)
//                .orElseThrow(() ->
//                    new RuntimeException(
//                        "Category not found with id: " + id
//                    )
//                );
//
//
//        categoryRepo.delete(category);
//    }
//
//
//    // =========================================
//    // ENTITY → RESPONSE
//    // =========================================
//
//    private CategoryResponse convertToResponse(
//            Category category) {
//
//        CategoryResponse response =
//                new CategoryResponse();
//
//        response.setId(category.getId());
//        response.setName(category.getName());
//        response.setCreated_at(
//                category.getCreated_at()
//        );
//
//        return response;
//    }
//}

package com.main.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.main.Dto.CategoryRequest;
import com.main.Dto.CategoryResponse;
import com.main.Repo.CategoryRepo;
import com.main.Repo.ProductRepo;
import com.main.Repo.UserRepo;
import com.main.model.Category;
import com.main.model.User;

@Service
public class CategoryServiceImpl {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;


    // =================================================
    // GET CURRENT LOGGED-IN USER
    // =================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }


    // =================================================
    // ADD CATEGORY
    // =================================================

    public CategoryResponse addCategory(
            CategoryRequest request) {

        User user = getCurrentUser();

        String categoryName =
                request.getName().trim();

        if (categoryName.isEmpty()) {
            throw new RuntimeException(
                    "Category name cannot be empty"
            );
        }


        // Prevent duplicate category for same user
        if (categoryRepo.existsByNameAndUserId(
                categoryName,
                user.getId())) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }


        Category category = new Category();

        category.setName(categoryName);
        category.setCreated_at(
                LocalDateTime.now()
        );

        category.setUser(user);


        Category savedCategory =
                categoryRepo.save(category);


        return convertToResponse(
                savedCategory
        );
    }


    // =================================================
    // GET ALL CATEGORIES
    // =================================================

    public List<CategoryResponse> getAllCategories() {

        User user = getCurrentUser();

        return categoryRepo
                .findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =================================================
    // GET CATEGORY BY ID
    // =================================================

    public CategoryResponse getCategoryById(
            int id) {

        User user = getCurrentUser();

        Category category =
                categoryRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );


        // Ownership check
        if (category.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to access this category"
            );
        }


        return convertToResponse(category);
    }


    // =================================================
    // UPDATE CATEGORY
    // =================================================

    public CategoryResponse updateCategory(
            int id,
            CategoryRequest request) {

        User user = getCurrentUser();

        Category category =
                categoryRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );


        // Ownership check
        if (category.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to update this category"
            );
        }


        String categoryName =
                request.getName().trim();


        if (categoryName.isEmpty()) {

            throw new RuntimeException(
                    "Category name cannot be empty"
            );
        }


        category.setName(categoryName);


        Category updatedCategory =
                categoryRepo.save(category);


        return convertToResponse(
                updatedCategory
        );
    }


    // =================================================
    // DELETE CATEGORY
    // =================================================

    public void deleteCategory(int id) {

        User user = getCurrentUser();

        Category category =
                categoryRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );


        // Ownership check
        if (category.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to delete this category"
            );
        }


        // Check whether user's products use category
        boolean hasProducts =
                productRepo.existsByCategoryIdAndUserId(
                        id,
                        user.getId()
                );


        if (hasProducts) {

            throw new RuntimeException(
                    "Cannot delete category because products are associated with it. "
                    + "Delete or move those products first."
            );
        }


        categoryRepo.delete(category);
    }


    // =================================================
    // ENTITY → RESPONSE
    // =================================================

    private CategoryResponse convertToResponse(
            Category category) {

        CategoryResponse response =
                new CategoryResponse();

        response.setId(category.getId());

        response.setName(
                category.getName()
        );

        response.setCreated_at(
                category.getCreated_at()
        );

        return response;
    }
}