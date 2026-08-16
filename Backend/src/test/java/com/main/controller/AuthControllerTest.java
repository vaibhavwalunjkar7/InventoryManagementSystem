package com.main.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.Dto.LoginRequest;
import com.main.Dto.LoginResponse;
import com.main.Dto.RegisterRequest;
import com.main.Dto.UserDto;
import com.main.Security.JwtService;
import com.main.ServiceImpl.authServiceImpl;

@WebMvcTest(authController.class)

public class AuthControllerTest  {
	 @Autowired
	    private MockMvc mockMvc;

	 private ObjectMapper objectMapper = new ObjectMapper();

	    @MockitoBean
	    private authServiceImpl registrationService;
	    
	    @MockitoBean
	    private JwtService jwtService;


	    @Test
	    void registerUserTest() throws Exception {

	        RegisterRequest request = new RegisterRequest();

	        request.setName("Vaibhav");
	        request.setEmail("vaibhav@gmail.com");
	        request.setPassword("123456");


	        UserDto response = new UserDto();
	        
	        response.setName("Vaibhav");
	        response.setEmail("vaibhav@gmail.com");


	        when(registrationService.register(any(RegisterRequest.class)))
	                .thenReturn(response);


	        mockMvc.perform(
	                post("/api/auth/register")
	                    .contentType(MediaType.APPLICATION_JSON)
	                    .content(objectMapper.writeValueAsString(request))
	            )
	            .andExpect(status().isCreated())
	            .andExpect(jsonPath("$.name").value("Vaibhav"))
	            .andExpect(jsonPath("$.email").value("vaibhav@gmail.com"));
}
	 
	    @Test
	    void loginUserTest() throws Exception {

	        LoginRequest request = new LoginRequest();

	     
	        request.setEmail("vaibhav@gmail.com");
	        request.setPassword("123456");


	        LoginResponse response = new LoginResponse();

	    
	        response.setToken("dummy-jwt-token");


	        when(registrationService.login(any(LoginRequest.class)))
	                .thenReturn(response);


	        mockMvc.perform(
	                post("/api/auth/login")
	                    .contentType(MediaType.APPLICATION_JSON)
	                    .content(objectMapper.writeValueAsString(request))
	            )
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$.token").value("dummy-jwt-token"));
	    }
}
