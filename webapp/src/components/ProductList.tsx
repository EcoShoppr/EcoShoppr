import { ProductCard } from './ProductCard';
import './ProductList.css';

interface Product {
    id: string;
    core_product: string;
    location_source: string;
    normalized_name: string;
    raw_item?: {
        price?: number;
        category?: string;
        availability?: string;
    };
}

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
}

export function ProductList({ products, loading, error }: ProductListProps) {
    if (loading) {
        return (
            <div className="product-list-container state-message">
                <div className="loading-spinner"></div>
                <p>Searching local stores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-list-container state-message error">
                <p>⚠️ {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-list-container state-message empty">
                <p>No products found. Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <h2 className="results-title">Search Results</h2>
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
