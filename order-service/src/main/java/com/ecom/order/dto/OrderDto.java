package com.ecom.order.dto;
import com.ecom.order.entity.ShippingAddress;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto {
    private String basketId;
    private ShippingAddress shippingAddress;
    private Long subtotal;
    private Long deliveryCharge;
    private LocalDate orderDate;
}