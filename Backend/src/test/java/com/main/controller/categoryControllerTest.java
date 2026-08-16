package com.main.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.main.Dto.CategoryResponse;
import com.main.Repo.CategoryRepo;
import com.main.Security.JwtService;
import com.main.ServiceImpl.CategoryServiceImpl;
import com.main.model.Category;

@WebMvcTest(categoryController.class)
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc(addFilters = false)
class categoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryServiceImpl categoryService;

    @MockitoBean
    private CategoryRepo categoryRepo;

    @MockitoBean
    private JwtService jwtService;


    @Test
    void addCategoryTest() throws Exception {

        CategoryResponse response = new CategoryResponse();

        when(categoryService.addCategory(org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);

        String json = """
                {
                    "name": "Electronics"
                }
                """;

        mockMvc.perform(
                post("/api/categories/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        )
        .andExpect(status().isCreated());
    }


    @Test
    void getAllCategoriesTest() throws Exception {

        Category category = new Category();

        when(categoryRepo.findAll())
                .thenReturn(List.of(category));

        mockMvc.perform(
                get("/api/categories/getAll")
        )
        .andExpect(status().isOk());
    }
}