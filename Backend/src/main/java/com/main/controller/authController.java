package com.main.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.main.Dto.LoginRequest;
import com.main.Dto.LoginResponse;
import com.main.Dto.RegisterRequest;
import com.main.Dto.UserDto;
import com.main.ServiceImpl.authServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class authController {

	@Autowired
	private authServiceImpl registrationService;
	
	@PostMapping("/register")
	public ResponseEntity<UserDto> registerUser(@RequestBody RegisterRequest  registerRequest) {
		  UserDto dto = registrationService.register(registerRequest);
		return new ResponseEntity<UserDto>(dto,HttpStatus.CREATED);
	}
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginEntity) {
		LoginResponse response = registrationService.login(loginEntity);
		return new ResponseEntity<LoginResponse>(response,HttpStatus.OK);
	}
	
	
	
}
