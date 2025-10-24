package com.ecom.product.service;

import com.ecom.product.dto.TypeResponseDto;
import java.util.List;

public interface TypeService {
    List<TypeResponseDto> getAllTypes();
}