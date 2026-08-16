package com.main.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.model.Product;

public interface ProductRepo extends JpaRepository<Product,Long>{

	List<Product> findByUserId(Long userId);

    boolean existsByCategoryIdAndUserId(
            Integer categoryId,
            Long userId
    );

    List<Product> findByCategoryIdAndUserId(
            Integer categoryId,
            Long userId
    );
}
