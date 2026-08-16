package com.main.Dto;

import lombok.Data;

@Data
public class LoginResponse {

	private String token;
	
	private String name;
	
	private String email;
	
	private String role;
}
