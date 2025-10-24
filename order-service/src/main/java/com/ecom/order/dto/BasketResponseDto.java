package com.ecom.order.dto;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasketResponseDto {
    private String id;
    private List<BasketItemResponseDto> itemResponses = new ArrayList<>();
}