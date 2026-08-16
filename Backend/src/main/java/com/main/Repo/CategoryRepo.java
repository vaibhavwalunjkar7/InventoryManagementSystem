package com.main.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Integer> {

	 List<Category> findByUserId(Long userId);

	    boolean existsByNameAndUserId(String name, Long userId);
	
}
