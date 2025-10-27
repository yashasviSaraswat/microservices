import axios from "axios";
import {Basket, BasketItem, BasketTotals} from "../model/Basket.ts";
import {Product} from "../model/Product.ts";
import {Dispatch} from "@reduxjs/toolkit";
import { setBasket } from "../../features/basket/BasketSlice.ts";
import { createId } from '@paralleldrive/cuid2'

class BasketService {
    apiUrl = "http://localhost:8085/api/basket";

    async getBasket(){
        try{
            const basket = localStorage.getItem('basket');
            if(basket){
                return JSON.parse(basket) as Basket;
            }else {
                console.log("Basket not found in local storage");
                return null;
            }
        } catch(error){
            console.error("Failed to retrieve the basket:", error);
            throw error;
        }
    }

    async addItemToBasket(item: Product, quantity = 1, dispatch: Dispatch){
        try{
            let basket = this.getCurrentBasket();
            if(!basket){
                basket = await this.createBasket();
            }
            const itemToAdd = this.mapProductToBasket(item);
            basket.items = this.upsertItems(basket.items, itemToAdd, quantity);
            await this.setBasket(basket, dispatch);

            const totals = this.calculateTotals(basket);
            return {basket, totals};
        }catch(error){
            console.error("Failed to add item to Basket:", error);
            throw error;
        }
    }

    async remove(itemId: number, dispatch: Dispatch){
        try {
            const basket = this.getCurrentBasket();
            if(basket){
                const itemIndex = basket.items.findIndex((p)=>p.id === itemId);
                if(itemIndex !== -1){
                    basket.items.splice(itemIndex, 1);
                    await this.setBasket(basket, dispatch);
                }

                if(basket.items.length === 0){
                    localStorage.removeItem('basket_id');
                    localStorage.removeItem('basket');
                    dispatch(setBasket(null));
                }
            }
        } catch(error) {
            console.error("Failed to remove item:", error);
            throw error;
        }
    }

    async incrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch){
        try {
            const basket = this.getCurrentBasket();
            if(basket){
                const item = basket.items.find((p)=>p.id === itemId);
                if(item){
                    item.quantity += quantity;
                    if(item.quantity < 1){
                        item.quantity = 1;
                    }
                    await this.setBasket(basket, dispatch);
                }
            }
        } catch(error) {
            console.error("Failed to increment quantity:", error);
            throw error;
        }
    }

    async decrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch){
        try {
            const basket = this.getCurrentBasket();
            if(basket){
                const item = basket.items.find((p)=>p.id === itemId);
                if(item && item.quantity > 1){
                    item.quantity -= quantity;
                    await this.setBasket(basket, dispatch);
                }
            }
        } catch(error) {
            console.error("Failed to decrement quantity:", error);
            throw error;
        }
    }

    async deleteBasket(basketId: string): Promise<void>{
        try{
            await axios.delete(`${this.apiUrl}/${basketId}`);
            localStorage.removeItem('basket_id');
            localStorage.removeItem('basket');
        }catch(error){
            console.error("Failed to delete the basket:", error);
            throw error;
        }
    }

    async setBasket(basket: Basket, dispatch: Dispatch){
        try{
            await axios.post<Basket>(this.apiUrl, basket);
            localStorage.setItem('basket', JSON.stringify(basket));
            dispatch(setBasket(basket));
        }catch(error){
            console.error("Failed to update basket:", error);
            throw error;
        }
    }

    private getCurrentBasket(): Basket | null {
        const basket = localStorage.getItem('basket');
        return basket ? JSON.parse(basket) as Basket : null;
    }

    private async createBasket(): Promise<Basket>{
        try{
            const newBasket: Basket = {
                id: createId(),
                items: []
            }
            localStorage.setItem('basket_id', newBasket.id);
            return newBasket;
        }catch(error){
            console.error("Failed to create Basket:", error);
            throw error;
        }
    }

    private mapProductToBasket(item: Product): BasketItem {
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: 0,
            pictureUrl: item.pictureUrl,
            productBrand: item.productBrand,
            productType: item.productType
        };
    }

    private upsertItems(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[]{
        const existingItem = items.find(x => x.id === itemToAdd.id);
        if(existingItem){
            existingItem.quantity += quantity;
        }else{
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
        }
        return items;
    }

    private calculateTotals(basket: Basket): BasketTotals{
        const shipping = 0;
        const subtotals = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totals = shipping + subtotals;
        return { shipping, subtotals, totals };
    }
}

export default new BasketService();