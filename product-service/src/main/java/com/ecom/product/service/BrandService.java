package com.ecom.product.service;

import com.ecom.product.dto.BrandResponseDto;
import java.util.List;

public interface BrandService {
    List<BrandResponseDto> getAllBrands();
}
