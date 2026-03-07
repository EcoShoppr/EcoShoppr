import './ProductCard.css';

interface ProductCardProps {
    product: {
        id: string;
        core_product: string;
        location_source: string;
        normalized_name: string;
        raw_item?: {
            price?: number;
            category?: string;
            availability?: string;
        };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    // Basic formatting for price if it exists
    const priceDisplay = product.raw_item?.price
        ? `$${(product.raw_item.price / 100).toFixed(2)}`
        : 'Price unavailable';

    return (
        <div className="product-card">
            <div className="product-header">
                <h4 className="product-title">{product.core_product}</h4>
                <span className="product-price">{priceDisplay}</span>
            </div>
            <div className="product-details">
                <span className="product-store">📍 {product.location_source}</span>
                {product.raw_item?.category && (
                    <span className="product-category">🏷️ {product.raw_item.category}</span>
                )}
            </div>
        </div>
    );
}
