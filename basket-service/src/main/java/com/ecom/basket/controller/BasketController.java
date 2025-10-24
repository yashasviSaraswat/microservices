package com.ecom.basket.controller;

import com.ecom.basket.dto.BasketResponseDto;
import com.ecom.basket.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/basket")
@CrossOrigin(origins = "http://localhost:3000")
public class BasketController {

    private final BasketService basketService;

    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    @GetMapping
    public ResponseEntity<List<BasketResponseDto>> getAllBaskets() {
        return ResponseEntity.ok(basketService.getAllBaskets());
    }

    @GetMapping("/{basketId}")
    public ResponseEntity<BasketResponseDto> getBasketById(@PathVariable String basketId) {
        BasketResponseDto basket = basketService.getBasketById(basketId);
        return basket != null ? ResponseEntity.ok(basket) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<BasketResponseDto> createBasket(@RequestBody BasketResponseDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(basketService.createBasket(dto));
    }

    @DeleteMapping("/{basketId}")
    public ResponseEntity<Void> deleteBasketById(@PathVariable String basketId) {
        basketService.deleteBasketById(basketId);
        return ResponseEntity.noContent().build();
    }
}