
package com.main.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.main.Dto.ProductRequest;
import com.main.Dto.ProductResponse;
import com.main.Repo.CategoryRepo;
import com.main.Repo.ProductRepo;
import com.main.Repo.UserRepo;
import com.main.model.Category;
import com.main.model.Product;
import com.main.model.User;

@Service
public class productServiceImpl {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private UserRepo userRepo;


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




    public ProductResponse addProduct(
            ProductRequest request) {

        User user = getCurrentUser();


        Category category =
                categoryRepo.findById(
                        request.getCategoryId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );



        if (category.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to use this category"
            );
        }


        Product product = new Product();

        product.setName(
                request.getName()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setQuantity(
                request.getQuantity()
        );

        product.setSku(
                request.getSku()
        );

        product.setCreated_at(
                LocalDateTime.now()
        );

        product.setUpdated_at(
                LocalDateTime.now()
        );

        product.setCategory(category);

        product.setUser(user);


        Product savedProduct =
                productRepo.save(product);


        return convertToResponse(
                savedProduct
        );
    }



    public List<ProductResponse> getAllProducts() {

        User user = getCurrentUser();

        return productRepo
                .findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


  

    public ProductResponse getProductbyId(
            long id) {

        User user = getCurrentUser();

        Product product =
                productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );



        if (product.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to access this product"
            );
        }


        return convertToResponse(product);
    }



    public ProductResponse updateProductbyId(
            long id,
            ProductRequest request) {

        User user = getCurrentUser();


        Product product =
                productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );


      

        if (product.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to update this product"
            );
        }


      

        Category category =
                categoryRepo.findById(
                        request.getCategoryId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );


      
        if (category.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to use this category"
            );
        }


        product.setName(
                request.getName()
        );

        product.setSku(
                request.getSku()
        );

        product.setPrice(
                request.getPrice()
        );

        product.setQuantity(
                request.getQuantity()
        );

        product.setCategory(category);

        product.setUpdated_at(
                LocalDateTime.now()
        );


        Product savedProduct =
                productRepo.save(product);


        return convertToResponse(
                savedProduct
        );
    }




    public String deleteProduct(long id) {

        User user = getCurrentUser();


        Product product =
                productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );


      

        if (product.getUser().getId()
                != user.getId()) {

            throw new RuntimeException(
                    "You are not authorized to delete this product"
            );
        }


        productRepo.delete(product);


        return "Product deleted successfully";
    }


  
    private ProductResponse convertToResponse(
            Product product) {

        ProductResponse response =
                new ProductResponse();

        response.setId(
                product.getId()
        );

        response.setName(
                product.getName()
        );

        response.setSku(
                product.getSku()
        );

        response.setPrice(
                product.getPrice()
        );

        response.setQuantity(
                product.getQuantity()
        );

        response.setCategoryId(
                product.getCategory().getId()
        );

        response.setCreated_at(
                product.getCreated_at()
        );

        response.setUpdated_at(
                product.getUpdated_at()
        );


        return response;
    }
}
