package com.main.ServiceImpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.main.Dto.LoginRequest;
import com.main.Dto.LoginResponse;
import com.main.Dto.RegisterRequest;
import com.main.Dto.UserDto;
import com.main.Repo.authRepo;
import com.main.Security.JwtService;
import com.main.Service.LoginService;
import com.main.Service.RegisterService;
import com.main.model.User;


@Service
public class authServiceImpl implements RegisterService , LoginService{

	@Autowired
	public authRepo registerRepo;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;
	
	@Override
	public UserDto register(RegisterRequest request) {
		  User user = new User();

		    user.setName(request.getName());
		    user.setEmail(request.getEmail());
		    user.setPassword(passwordEncoder.encode(request.getPassword()));
		    user.setRole("USER");
		    user.setCreated_at(LocalDateTime.now());

		    User savedUser = registerRepo.save(user);

		    UserDto savedDto = new UserDto();

		    savedDto.setId(savedUser.getId());
		    savedDto.setName(savedUser.getName());
		    savedDto.setEmail(savedUser.getEmail());
		    savedDto.setRole(savedUser.getRole());
		    savedDto.setCreated_at(savedUser.getCreated_at());

		    return savedDto;
	}


	  @Override
	    public LoginResponse login(LoginRequest loginEntity) {

	        // 1. Find user by email
	        User user = registerRepo
	                .findByEmail(loginEntity.getEmail())
	                .orElseThrow(() ->
	                        new RuntimeException("Invalid email or password"));

	        // 2. Check password
	        if (!passwordEncoder.matches(
	                loginEntity.getPassword(),
	                user.getPassword())) {

	            throw new RuntimeException("Invalid email or password");
	        }

	        // 3. Generate JWT
	        String token = jwtService.generateToken(
	                user.getEmail(),
	                user.getName(),
	                user.getRole()
	        );

	        // 4. Create response
	        LoginResponse response = new LoginResponse();

	        response.setToken(token);
	        response.setName(user.getName());
	        response.setEmail(user.getEmail());
	        response.setRole(user.getRole());

	        return response;
	    }


	

}
