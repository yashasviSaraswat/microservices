package com.ecom.product.controller;

import com.ecom.product.dto.BrandResponseDto;
import com.ecom.product.dto.ProductResponseDto;
import com.ecom.product.dto.TypeResponseDto;
import com.ecom.product.service.BrandService;
import com.ecom.product.service.ProductService;
import com.ecom.product.service.TypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final BrandService brandService;
    private final TypeService typeService;

    public ProductController(ProductService productService, BrandService brandService, TypeService typeService) {
        this.productService = productService;
        this.brandService = brandService;
        this.typeService = typeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "asc") String order) {

        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));

        return ResponseEntity.ok(productService.getAllProducts(pageable, brandId, typeId, keyword));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponseDto>> getBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @GetMapping("/types")
    public ResponseEntity<List<TypeResponseDto>> getTypes() {
        return ResponseEntity.ok(typeService.getAllTypes());
    }
}