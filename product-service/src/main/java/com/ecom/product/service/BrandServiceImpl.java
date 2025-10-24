package com.ecom.product.service;

import com.ecom.product.dto.BrandResponseDto;
import com.ecom.product.entity.Brand;
import com.ecom.product.repository.BrandRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public List<BrandResponseDto> getAllBrands() {
        log.info("Fetching all brands");
        return brandRepository.findAll().stream()
                .map(brand -> BrandResponseDto.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .build())
                .collect(Collectors.toList());
    }
}