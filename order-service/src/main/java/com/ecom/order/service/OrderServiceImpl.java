package com.ecom.order.service;

import com.ecom.order.client.BasketClient;
import com.ecom.order.dto.BasketItemResponseDto;
import com.ecom.order.dto.BasketResponseDto;
import com.ecom.order.dto.OrderDto;
import com.ecom.order.dto.OrderResponseDto;
import com.ecom.order.entity.Order;
import com.ecom.order.entity.OrderItem;
import com.ecom.order.entity.OrderStatus;
import com.ecom.order.entity.ProductItemOrdered;
import com.ecom.order.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final BasketClient basketClient;

    public OrderServiceImpl(OrderRepository orderRepository, BasketClient basketClient) {
        this.orderRepository = orderRepository;
        this.basketClient = basketClient;
    }

    @Override
    public OrderResponseDto getOrderById(Integer orderId) {
        log.info("Fetching order: {}", orderId);
        Optional<Order> order = orderRepository.findById(orderId);
        return order.map(this::convertToOrderResponse).orElse(null);
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponseDto> getAllOrders(Pageable pageable) {
        log.info("Fetching orders with pagination");
        return orderRepository.findAll(pageable)
                .map(this::convertToOrderResponse);
    }

    @Override
    @Transactional
    public Integer createOrder(OrderDto orderDto) {
        log.info("Creating order for basket: {}", orderDto.getBasketId());

        BasketResponseDto basketRes = basketClient.getBasketById(orderDto.getBasketId());
        if (basketRes == null) {
            log.error("Basket not found: {}", orderDto.getBasketId());
            return null;
        }

        List<OrderItem> orderItems = basketRes.getItemResponses().stream()
                .map(this::mapBasketItemToOrderItem)
                .collect(Collectors.toList());

        Double subTotal = basketRes.getItemResponses().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .basketId(orderDto.getBasketId())
                .shippingAddress(orderDto.getShippingAddress())
                .orderItems(orderItems)
                .subTotal(subTotal)
                .deliveryCharge(orderDto.getDeliveryCharge())
                .orderStatus(OrderStatus.Pending)
                .orderDate(java.time.LocalDateTime.now())
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        Order savedOrder = orderRepository.save(order);
        basketClient.deleteBasketById(orderDto.getBasketId());

        log.info("Order created with ID: {}", savedOrder.getOrderId());
        return savedOrder.getOrderId();
    }

    @Override
    public void deleteOrder(Integer orderId) {
        log.info("Deleting order: {}", orderId);
        orderRepository.deleteById(orderId);
    }

    private OrderItem mapBasketItemToOrderItem(BasketItemResponseDto basketItem) {
        return OrderItem.builder()
                .productItemOrdered(ProductItemOrdered.builder()
                        .productId(basketItem.getId())
                        .name(basketItem.getName())
                        .pictureUrl(basketItem.getPictureUrl())
                        .build())
                .quantity(basketItem.getQuantity())
                .price(basketItem.getPrice())
                .build();
    }

    private OrderResponseDto convertToOrderResponse(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getOrderId())
                .basketId(order.getBasketId())
                .shippingAddress(order.getShippingAddress())
                .subTotal(order.getSubTotal().longValue())
                .deliveryCharge(order.getDeliveryCharge())
                .total(order.getTotal())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .build();
    }
}