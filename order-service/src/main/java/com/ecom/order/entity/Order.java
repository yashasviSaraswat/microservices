package com.ecom.order.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "`order`")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    private String basketId;

    @Embedded
    private ShippingAddress shippingAddress;

    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> orderItems;

    private Double subTotal;
    private Long deliveryCharge;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.Pending;

    public Double getTotal() {
        return getSubTotal() + getDeliveryCharge();
    }
}