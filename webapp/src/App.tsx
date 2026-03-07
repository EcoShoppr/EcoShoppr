import { StoreIcon, SmartCartIcon, SavingsIcon } from './components/Icons';
import { HeroSearch } from './components/HeroSearch';
import './App.css';
import './index.css';

function App() {
  return (
    <div className="app-container animate-fade-in">
      <div className="content-wrapper">

        <header className="header-section">
          <div className="badge">
            <img src="/logo.png" alt="EcoShoppr Logo" className="logo-img" />
            <span>EcoShoppr</span>
          </div>

          <h1 className="title">
            Local Groceries.<br />
            Optimized Deals.
          </h1>

          <p className="subtitle">
            Find the cheapest items across Santa Cruz supermarkets and cafes instantly. Our <strong>Smart Cart</strong> builds the perfect shopping trip to save you money and time.
          </p>
        </header>

        <section className="search-section">
          <HeroSearch />
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <span className="feature-icon"><StoreIcon /></span>
            <h3 className="feature-title">10+ Stores</h3>
            <span className="feature-desc">Real-time local pricing</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><SmartCartIcon /></span>
            <h3 className="feature-title">Smart Cart</h3>
            <span className="feature-desc">Algorithm optimized trips</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><SavingsIcon /></span>
            <h3 className="feature-title">Save ~15%</h3>
            <span className="feature-desc">On your grocery budget</span>
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;
