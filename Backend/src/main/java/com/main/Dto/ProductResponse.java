package com.main.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductResponse {

    private long id;

    private String name;

    private String sku;

    private double price;

    private long quantity;

    private int categoryId;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;
}