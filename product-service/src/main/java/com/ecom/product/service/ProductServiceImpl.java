package com.ecom.product.service;

import com.ecom.product.dto.ProductResponseDto;
import com.ecom.product.entity.Product;
import com.ecom.product.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponseDto getProductById(Integer productId) {
        log.info("Fetching product by Id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
        return convertToProductResponse(product);
    }

    @Override
    public Page<ProductResponseDto> getAllProducts(Pageable pageable, Integer brandId,
                                                   Integer typeId, String keyword) {
        log.info("Fetching all products");
        Specification<Product> specs = Specification.where(null);

        if (brandId != null) {
            specs = specs.and((root, query, cb) -> cb.equal(root.get("brand").get("id"), brandId));
        }
        if (typeId != null) {
            specs = specs.and((root, query, cb) -> cb.equal(root.get("type").get("id"), typeId));
        }
        if (keyword != null && !keyword.isEmpty()) {
            specs = specs.and((root, query, cb) -> cb.like(root.get("name"), "%" + keyword + "%"));
        }

        return productRepository.findAll(specs, pageable).map(this::convertToProductResponse);
    }

    private ProductResponseDto convertToProductResponse(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .pictureUrl(product.getPictureUrl())
                .productBrand(product.getBrand().getName())
                .productType(product.getType().getName())
                .build();
    }
}