package com.main.Dto;


import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CategoryResponse {

    private int id;
    private String name;
    private LocalDateTime created_at;
}