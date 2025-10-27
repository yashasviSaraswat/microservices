import axios, { AxiosError, AxiosResponse } from "axios";
import {router} from "../routers/Routes.tsx";
import { toast } from "react-toastify";
import basketService from "./BasketService.ts";
import {Product} from "../model/Product.ts";
import {Dispatch} from "@reduxjs/toolkit";
import {Basket} from "../model/Basket.ts";

// Set base URL
axios.defaults.baseURL = 'http://localhost:8085/api/';

const sleep = () => new Promise(resolve => setTimeout(resolve, 100));
const responseBody = (response: AxiosResponse) => response.data;

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
});

// Add response interceptor
axios.interceptors.response.use(async response => {
    await sleep();
    console.log('Response:', response);
    return response;
}, (error: AxiosError) => {
    console.error('API Error:', error);
    const {status} = error.response as AxiosResponse ?? {};

    switch(status){
        case 404:
            toast.error("Resource not found");
            router.navigate('/not-found');
            break;
        case 500:
            toast.error("Internal server error occurred");
            router.navigate('/server-error');
            break;
        case 401:
            toast.error("Unauthorized - Please login");
            break;
        default:
            toast.error(error.message || "An error occurred");
            break;
    }
    return Promise.reject(error);
});

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Store = {
    apiUrl: 'http://localhost:8085/api/products',
    list: (page: number, size: number, brandId?: number, typeId?: number, url?: string) => {
        let requestUrl = url || `products?page=${page-1}&size=${size}`;
        if(brandId !== undefined && brandId !== 0){
            requestUrl += `&brandId=${brandId}`;
        }
        if(typeId !== undefined && typeId !== 0){
            requestUrl += `&typeId=${typeId}`;
        }
        console.log('Fetching products from:', requestUrl);
        return requests.get(requestUrl);
    },
    details: (id: number) => requests.get(`products/${id}`),
    types: () => requests.get(`products/types`).then(types => [{id: 0, name:'All'}, ...types]),
    brands: () => requests.get(`products/brands`).then(brands => [{id: 0, name:'All'}, ...brands]),
    search: (keyword: string) => requests.get(`products?keyword=${keyword}`)
}

const Bassket = {
    get: async() => {
        try{
            return await basketService.getBasket();
        }catch(error){
            console.error("Failed to get Basket: ", error);
            throw error;
        }
    },
    addItem: async(product: Product, dispatch: Dispatch) => {
        try{
            const result = await basketService.addItemToBasket(product, 1, dispatch);
            console.log('Item added to basket:', result);
            return result;
        }catch(error){
            console.error("Failed to add item to basket:", error);
            throw error;
        }
    },
    removeItem: async (itemId: number, dispatch: Dispatch) => {
        try{
            await basketService.remove(itemId, dispatch);
        }catch(error){
            console.error("Failed to remove item from basket:", error);
            throw error;
        }
    },
    incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await basketService.incrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Failed to increment item quantity:", error);
            throw error;
        }
    },
    decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await basketService.decrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Failed to decrement item quantity:", error);
            throw error;
        }
    },
    setBasket: async (basket: Basket, dispatch: Dispatch) => {
        try {
            await basketService.setBasket(basket, dispatch);
        } catch (error) {
            console.error("Failed to set basket:", error);
            throw error;
        }
    },
    deleteBasket: async(basketId: string) => {
        try{
            await basketService.deleteBasket(basketId);
        } catch(error){
            console.error("Failed to delete basket:", error);
            throw error;
        }
    }
}

const Account = {
    login: (values: any) => requests.post('auth/login', values),
    register: (values: any) => requests.post('auth/register', values)
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const agent = {
    Store,
    Bassket,
    Account,
    Orders
}

export default agent;