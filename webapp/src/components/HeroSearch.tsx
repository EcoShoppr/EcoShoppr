import { useState } from 'react';
import './HeroSearch.css';

export function HeroSearch() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');

    return (
        <div className={`hero-search-wrapper ${isFocused ? 'focused' : ''}`}>
            <div className="search-glass-container">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search groceries, local cafes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <button className="smart-cart-btn">
                    <span className="btn-icon">⚡</span>
                    <span className="btn-text">Smart Cart</span>
                </button>
            </div>
        </div>
    );
}
