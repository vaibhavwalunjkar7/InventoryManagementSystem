package com.main.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserDto {
	public long id;
	public	String name;
	public	String email;
	public	String role;
	public LocalDateTime created_at;
}
