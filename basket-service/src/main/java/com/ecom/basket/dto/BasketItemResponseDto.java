package com.ecom.basket.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasketItemResponseDto {
    private Integer id;
    private String name;
    private String description;
    private String pictureUrl;
    private Long price;
    private String productBrand;
    private String productType;
    private Integer quantity;
}