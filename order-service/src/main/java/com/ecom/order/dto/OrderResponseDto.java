package com.ecom.order.dto;
import com.ecom.order.entity.OrderStatus;
import com.ecom.order.entity.ShippingAddress;
import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDto {
    private Integer orderId;
    private String basketId;
    private ShippingAddress shippingAddress;
    private Long subTotal;
    private Long deliveryCharge;
    private Double total;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
}