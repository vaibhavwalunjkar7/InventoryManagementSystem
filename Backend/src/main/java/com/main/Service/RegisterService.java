package com.main.Service;

import com.main.Dto.RegisterRequest;
import com.main.Dto.UserDto;

public interface RegisterService {
	 UserDto register(RegisterRequest request);
}
