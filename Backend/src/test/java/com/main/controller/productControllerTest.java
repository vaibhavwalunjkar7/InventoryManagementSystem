package com.main.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.main.Dto.ProductResponse;
import com.main.Security.JwtService;
import com.main.ServiceImpl.productServiceImpl;

@WebMvcTest(productController.class)
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc(addFilters = false)
class productControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private productServiceImpl productService;

    // IMPORTANT
    @MockitoBean
    private JwtService jwtService;


    @Test
    void getAllProductsTest() throws Exception {

        ProductResponse response = new ProductResponse();

        when(productService.getAllProducts())
                .thenReturn(List.of(response));

        mockMvc.perform(
                get("/api/products/list")
        )
        .andExpect(status().isAccepted());
    }


    @Test
    void getProductTest() throws Exception {

        ProductResponse response = new ProductResponse();

        when(productService.getProductbyId(1L))
                .thenReturn(response);

        mockMvc.perform(
                get("/api/products/1")
        )
        .andExpect(status().isOk());
    }


    @Test
    void addProductTest() throws Exception {

        ProductResponse response = new ProductResponse();

        when(productService.addProduct(any()))
                .thenReturn(response);

        String json = """
                {
                    "name": "Laptop",
                    "price": 50000,
                    "quantity": 10
                }
                """;

        mockMvc.perform(
                post("/api/products/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        )
        .andExpect(status().isCreated());
    }


    @Test
    void updateProductTest() throws Exception {

        ProductResponse response = new ProductResponse();

        when(productService.updateProductbyId(eq(1L), any()))
                .thenReturn(response);

        String json = """
                {
                    "name": "Updated Laptop",
                    "price": 60000,
                    "quantity": 20
                }
                """;

        mockMvc.perform(
                put("/api/products/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        )
        .andExpect(status().isOk());
    }


    @Test
    void deleteProductTest() throws Exception {

        when(productService.deleteProduct(1L))
                .thenReturn("Product deleted successfully");

        mockMvc.perform(
                delete("/api/products/delete/1")
        )
        .andExpect(status().isOk());
    }
}