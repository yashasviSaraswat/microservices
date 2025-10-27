# 🛒 MibCommerce - Microservices E-Commerce Platform

A modern, scalable e-commerce application built with Spring Boot microservices architecture and React frontend.

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
└────────┬────────┘
         │
    ┌────▼──────────┐
    │  API Gateway  │ (Port 8085)
    └───────┬───────┘
            │
    ┌───────▼────────────────────────┐
    │    Service Discovery (Eureka)  │ (Port 8761)
    └───────┬────────────────────────┘
            │
    ┌───────┴─────────────────────────────────┐
    │                                         │
┌───▼────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  Product   │  │   Auth    │  │  Basket   │  │   Order   │
│  Service   │  │ Service   │  │ Service   │  │  Service  │
│ (Port 8082)│  │(Port 8081)│  │(Port 8083)│  │(Port 8084)│
└─────┬──────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │               │              │              │
      ▼               ▼              ▼              ▼
   [MySQL]         [MySQL]       [Redis]         [MySQL]
```

## ⚡ Tech Stack

### Backend
- **Framework:** Spring Boot 3.x, Spring Cloud
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Security:** JWT Authentication
- **Database:** MySQL 8.0
- **Cache:** Redis
- **Communication:** REST API, OpenFeign

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Yup
- **HTTP Client:** Axios

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0
- Redis 6.0+
- Maven 3.8+

### Setup

**1. Database Setup**
```sql
CREATE DATABASE product_db;
CREATE DATABASE auth_db;
CREATE DATABASE order_db;
CREATE USER 'ecomuser'@'localhost' IDENTIFIED BY 'ecomPassword@123';
GRANT ALL PRIVILEGES ON *.* TO 'ecomuser'@'localhost';
```

**2. Start Redis**
```bash
redis-server
```

**3. Start Services** (in order)
```bash
# 1. Eureka Server
cd eureka-server && mvn spring-boot:run

# 2. Microservices (in separate terminals)
cd product-service && mvn spring-boot:run
cd auth-service && mvn spring-boot:run
cd basket-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run

# 3. API Gateway
cd api-gateway && mvn spring-boot:run
```

**4. Start Frontend**
```bash
cd frontendClient
npm install
npm run dev
```

**5. Access Application**
- Frontend: http://localhost:3000
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8085

## 📁 Project Structure

```
mibcommerce/
├── eureka-server/              # Service discovery
├── api-gateway/                # API Gateway & routing
├── product-service/            # Product catalog management
├── auth-service/              # User authentication & JWT
├── basket-service/            # Shopping cart (Redis)
├── order-service/             # Order processing
└── frontendClient/            # React application
    ├── src/
    │   ├── app/
    │   │   ├── api/          # API services
    │   │   ├── layout/       # Layout components
    │   │   ├── model/        # TypeScript interfaces
    │   │   └── store/        # Redux store
    │   └── features/
    │       ├── catalog/      # Product listing
    │       ├── basket/       # Shopping cart
    │       ├── account/      # Auth & profile
    │       └── checkout/     # Order checkout
```

## 🔑 Key Features

### User Features
✅ Browse products with pagination & filters  
✅ Search products by name  
✅ Add to cart with quantity management  
✅ User registration & JWT authentication  
✅ Secure checkout process  
✅ Order history tracking

### Technical Features
✅ Microservices architecture  
✅ Service discovery & load balancing  
✅ Centralized API Gateway  
✅ JWT-based authentication  
✅ Redis caching for cart  
✅ CORS handling  
✅ Responsive UI design

## 🔗 API Endpoints

| Service | Endpoint | Description |
|---------|----------|-------------|
| **Product** | `GET /api/products` | Get all products |
| | `GET /api/products/{id}` | Get product details |
| | `GET /api/products/brands` | Get all brands |
| | `GET /api/products/types` | Get all types |
| **Auth** | `POST /api/auth/register` | Register user |
| | `POST /api/auth/login` | Login user |
| **Basket** | `GET /api/basket/{id}` | Get basket |
| | `POST /api/basket` | Create/Update basket |
| | `DELETE /api/basket/{id}` | Delete basket |
| **Order** | `GET /api/orders` | Get all orders |
| | `POST /api/orders` | Create order |

## 🛠️ Configuration

### Service Ports
| Service | Port |
|---------|------|
| Frontend | 3000 |
| Eureka | 8761 |
| Auth Service | 8081 |
| Product Service | 8082 |
| Basket Service | 8083 |
| Order Service | 8084 |
| API Gateway | 8085 |

### Environment Variables
Update `application.yml` files for custom configurations:
- Database credentials
- JWT secret key
- Redis connection
- Eureka server URL

## 🧪 Testing

```bash
# Test backend services
curl http://localhost:8085/api/products
curl http://localhost:8085/api/products/brands
curl http://localhost:8085/api/products/types

# Check service health
curl http://localhost:8085/actuator/health
```

## 📝 Sample Data

Run the SQL script to populate sample products:
```bash
mysql -u ecomuser -p product_db < sample-data.sql
```

## 🐛 Troubleshooting

**Products not loading?**
- Verify all services are UP in Eureka Dashboard
- Check API Gateway logs for routing errors
- Ensure MySQL has sample data

**Cart not working?**
- Verify Redis is running: `redis-cli ping`
- Clear browser localStorage
- Check basket service logs

**CORS errors?**
- Remove individual service CORS configs
- Keep only Gateway CORS configuration
- Restart all services


⭐ Star this repo if you find it helpful!
