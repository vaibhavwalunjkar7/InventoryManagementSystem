package com.main.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.main.Dto.RegisterRequest;
import com.main.model.User;

@Repository
public interface authRepo extends JpaRepository<User,Long>{
	Optional<User> findByEmail(String email);
}
