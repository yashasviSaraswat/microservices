package com.ecom.order.client;

import com.ecom.order.dto.BasketResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "BASKET-SERVICE")
public interface BasketClient {

    @GetMapping("/basket/{basketId}")
    BasketResponseDto getBasketById(@PathVariable String basketId);

    @DeleteMapping("/basket/{basketId}")
    void deleteBasketById(@PathVariable String basketId);
}