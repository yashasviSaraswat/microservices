package com.ecom.basket.service;

import com.ecom.basket.dto.BasketItemResponseDto;
import com.ecom.basket.dto.BasketResponseDto;
import com.ecom.basket.entity.Basket;
import com.ecom.basket.entity.BasketItem;
import com.ecom.basket.repository.BasketRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BasketServiceImpl implements BasketService {

    private final BasketRepository basketRepository;

    public BasketServiceImpl(BasketRepository basketRepository) {
        this.basketRepository = basketRepository;
    }

    @Override
    public List<BasketResponseDto> getAllBaskets() {
        log.info("Loading all baskets");
        return ((List<Basket>) basketRepository.findAll()).stream()
                .map(this::convertToBasketResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BasketResponseDto getBasketById(String basketId) {
        log.info("Loading basket: {}", basketId);
        Optional<Basket> basket = basketRepository.findById(basketId);
        return basket.map(this::convertToBasketResponse).orElse(null);
    }

    @Override
    public void deleteBasketById(String basketId) {
        log.info("Deleting basket: {}", basketId);
        basketRepository.deleteById(basketId);
    }

    @Override
    public BasketResponseDto createBasket(BasketResponseDto dto) {
        log.info("Creating basket: {}", dto.getId());
        Basket basket = new Basket(dto.getId());
        basket.setItems(dto.getItemResponses().stream()
                .map(item -> {
                    BasketItem basketItem = new BasketItem();
                    basketItem.setId(item.getId());
                    basketItem.setName(item.getName());
                    basketItem.setDescription(item.getDescription());
                    basketItem.setPrice(item.getPrice());
                    basketItem.setPictureUrl(item.getPictureUrl());
                    basketItem.setProductBrand(item.getProductBrand());
                    basketItem.setProductType(item.getProductType());
                    basketItem.setQuantity(item.getQuantity());
                    return basketItem;
                })
                .collect(Collectors.toList()));

        Basket saved = basketRepository.save(basket);
        return convertToBasketResponse(saved);
    }

    private BasketResponseDto convertToBasketResponse(Basket basket) {
        if (basket == null) return null;

        List<BasketItemResponseDto> items = basket.getItems().stream()
                .map(item -> BasketItemResponseDto.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .description(item.getDescription())
                        .pictureUrl(item.getPictureUrl())
                        .price(item.getPrice())
                        .productBrand(item.getProductBrand())
                        .productType(item.getProductType())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return BasketResponseDto.builder()
                .id(basket.getId())
                .itemResponses(items)
                .build();
    }
}