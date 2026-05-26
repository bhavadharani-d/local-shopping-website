# QR-Based Local Shopping System 🛍️

A complete full-stack solution for local shops to implement QR-based digital ordering. Customers can scan a QR code, browse products, place orders, and track status in real-time.

## 🚀 Project Overview
This project is designed to eliminate queues in local shops. 
- **Customer Side**: React-based PWA/Mobile-friendly web app.
- **Shopkeeper Side**: Strapi Admin Panel for inventory and order management.

## 📁 Folder Structure
```text
local-shopping-website/
├── project-bhava/         # React Frontend
│   ├── src/
│   │   ├── api/           # API communication logic
│   │   ├── components/    # Reusable UI components (ProductCard, Navbar)
│   │   └── pages/         # Core pages (Menu, Cart, Success, Track)
│   └── package.json
└── strapi-backend/        # Strapi Backend (Headless CMS)
    ├── src/
    │   └── api/
    │       ├── product/   # Product Schema & Controller
    │       └── order/     # Order Schema & Custom Lifecycles
    └── package.json
```

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide Icons, Axios.
- **Backend**: Strapi 5 (Headless CMS).
- **Database**: SQLite (Perfect for local storage and fast development).

## ⚙️ Backend Logic (Custom Features)
1. **Token Generation**: Implemented in `strapi-backend/src/api/order/content-types/order/lifecycles.ts`. It generates unique incremental tokens (e.g., #6134, #6135).
2. **Inventory Management**: Automatically reduces stock after every successful order.
3. **Low Stock Alerts**: UI highlights products with fewer than 5 items in stock.

## 🌐 API Examples

### Get All Products
`GET /api/products?populate=*`

### Create New Order
`POST /api/orders`
```json
{
  "data": {
    "totalAmount": 2045,
    "items": [
      { "id": 1, "name": "Classic Burger", "price": 120, "quantity": 2 }
    ]
  }
}
```

### Track Order
`GET /api/orders?filters[tokenNumber][$eq]=6134`

## 📲 How to Use
1. **Start Backend**: Go to `strapi-backend` and run `npm run develop`.
2. **Start Frontend**: Go to `project-bhava` and run `npm run dev`.
3. **Generate QR**: Use any QR Generator for the URL provided by Vite (usually `http://localhost:5173`).
4. **Admin Panel**: Access `http://localhost:1337/admin` to manage products and update order status (Received ➔ Preparing ➔ Ready).

---
*Created for Final Year College Project implementation.*
