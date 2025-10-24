package com.ecom.order.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductItemOrdered {
    private Integer productId;
    private String name;
    private String pictureUrl;
}
