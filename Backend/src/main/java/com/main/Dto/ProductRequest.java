package com.main.Dto;

import lombok.Data;

@Data
public class ProductRequest {

    private String name;

    private String sku;

    private double price;

    private long quantity;

    private int categoryId;
}
