interface WarehouseCategory {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    recar_category_id: number;
    parent: number;
}

interface City {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    uid: string | null;
    country: number;
}

interface Warehouse {
    id: number;
    name: string;
    categories: WarehouseCategory[];
    city: City;
    min_stock_level: number;
}

interface Picture {
    id: number;
    image: string;
    product: number;
}

interface ProductDetail {
    id: number;
    height: number;
    width: number;
    length: number;
    weight: number;
}

interface Category {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    recar_category_id: number;
    parent: number;
}

interface Product {
    id: number;
    price: number | undefined;
    color: string | null;
    category: Category;
    code: any[];
    modification: string | null;
    detail: ProductDetail;
    status: string;
    pictures: Picture[];
    warehouse: any | null;
    created_at: string;
    updated_at: string;
    name: string;
    market_price: number;
    properties: any | null;
    defect: any | null;
    comment: any | null;
    mileage: any | null;
    mileageType: any | null;
}

interface Good {
    id: number;
    product: Product;
    quantity: number;
}

export default interface Order {
    id: number;
    uuid: string;
    goods: Good[];
    total: string;
    delivery_type: string;
    payment_type: string;
    payment_status: string;
    status: string;
    warehouse: Warehouse;
    created_at: string;
    updated_at: string;
    comment: string;
    discount: number;
    client: string;
    first_name: string;
    last_name: string | null;
    phone_number: string;
    email: string;
    address: string | null;
}
