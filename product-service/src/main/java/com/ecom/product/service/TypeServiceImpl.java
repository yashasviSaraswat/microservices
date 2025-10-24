package com.ecom.product.service;

import com.ecom.product.dto.TypeResponseDto;
import com.ecom.product.entity.Type;
import com.ecom.product.repository.TypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TypeServiceImpl implements TypeService {
    private final TypeRepository typeRepository;

    public TypeServiceImpl(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    @Override
    public List<TypeResponseDto> getAllTypes() {
        log.info("Fetching all types");
        return typeRepository.findAll().stream()
                .map(type -> TypeResponseDto.builder()
                        .id(type.getId())
                        .name(type.getName())
                        .build())
                .collect(Collectors.toList());
    }
}