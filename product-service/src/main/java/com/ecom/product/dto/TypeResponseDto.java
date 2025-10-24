package com.ecom.product.dto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TypeResponseDto {
    private Integer id;
    private String name;
}