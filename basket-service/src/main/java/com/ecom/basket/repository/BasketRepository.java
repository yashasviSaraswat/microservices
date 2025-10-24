package com.ecom.basket.repository;

import com.ecom.basket.entity.Basket;
import org.springframework.data.repository.CrudRepository;

public interface BasketRepository extends CrudRepository<Basket, String> {}