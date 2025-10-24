package com.ecom.product.service;

import com.ecom.product.dto.ProductResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductResponseDto getProductById(Integer productId);
    Page<ProductResponseDto> getAllProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword);
}
