package com.main.Service;

import org.springframework.stereotype.Service;

import com.main.Dto.LoginRequest;
import com.main.Dto.LoginResponse;

@Service
public interface LoginService {
  public LoginResponse login(LoginRequest loginEntity);
}
