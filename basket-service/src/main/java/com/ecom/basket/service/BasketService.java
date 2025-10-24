package com.ecom.basket.service;

import com.ecom.basket.dto.BasketResponseDto;
import java.util.List;

public interface BasketService {
    List<BasketResponseDto> getAllBaskets();
    BasketResponseDto getBasketById(String basketId);
    void deleteBasketById(String basketId);
    BasketResponseDto createBasket(BasketResponseDto dto);
}
