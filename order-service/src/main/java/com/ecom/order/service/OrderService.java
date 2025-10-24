package com.ecom.order.service;

import com.ecom.order.dto.OrderDto;
import com.ecom.order.dto.OrderResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderService {
    OrderResponseDto getOrderById(Integer orderId);
    List<OrderResponseDto> getAllOrders();
    Page<OrderResponseDto> getAllOrders(Pageable pageable);
    Integer createOrder(OrderDto orderDto);
    void deleteOrder(Integer orderId);
}