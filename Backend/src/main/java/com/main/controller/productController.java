


package com.main.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Dto.ProductRequest;
import com.main.Dto.ProductResponse;
import com.main.ServiceImpl.productServiceImpl;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class productController {

    @Autowired
    private productServiceImpl productService;


    // =================================================
    // ADD
    // =================================================

    @PostMapping("/add")
    public ResponseEntity<ProductResponse> addProduct(
            @RequestBody ProductRequest request) {

        return new ResponseEntity<>(
                productService.addProduct(request),
                HttpStatus.CREATED
        );
    }


    // =================================================
    // GET ALL
    // =================================================

    @GetMapping("/list")
    public ResponseEntity<List<ProductResponse>>
    getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }


    // =================================================
    // GET BY ID
    // =================================================

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse>
    getProduct(
            @PathVariable long id) {

        return ResponseEntity.ok(
                productService.getProductbyId(id)
        );
    }


    // =================================================
    // UPDATE
    // =================================================

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse>
    updateProduct(
            @PathVariable long id,
            @RequestBody ProductRequest request) {

        return ResponseEntity.ok(
                productService.updateProductbyId(
                        id,
                        request
                )
        );
    }


    // =================================================
    // DELETE
    // =================================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String>
    deleteProduct(
            @PathVariable long id) {

        return ResponseEntity.ok(
                productService.deleteProduct(id)
        );
    }
}