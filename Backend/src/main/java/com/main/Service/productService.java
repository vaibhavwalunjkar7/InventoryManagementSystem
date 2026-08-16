package com.main.Service;

import java.util.List;

import com.main.Dto.ProductRequest;
import com.main.Dto.ProductResponse;

public interface productService {

	public ProductResponse addProduct(ProductRequest productRequest) ;
	public List<ProductResponse> getAllProducts();
	public ProductResponse getProductbyId(long id);
	public String deleteProduct(long id);
}
