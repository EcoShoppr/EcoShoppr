
import './index.css';

function App() {
  return (
    <div className="hero-container">
      <div className="logo-container">
        <div className="logo-glow"></div>
        <h1 className="logo-text">EcoShoppr</h1>
      </div>

      <p className="subtitle">
        The localized grocery price aggregator. Find the cheapest items across Santa Cruz supermarkets, cafes, and restaurants instantly.
      </p>

      <div className="card-grid">
        <div className="glass-card">
          <div className="card-icon">🥬</div>
          <h2 className="card-title">Automated Scraping</h2>
          <p className="card-text">
            Gather real-time data from local storefronts automatically via robust AI-assisted crawler pipelines.
          </p>
        </div>

        <div className="glass-card">
          <div className="card-icon">💸</div>
          <h2 className="card-title">Cost Optimization</h2>
          <p className="card-text">
            Compare normalized prices for everyday goods, ensuring you're saving on your grocery budget.
          </p>
        </div>

        <div className="glass-card">
          <div className="card-icon">📍</div>
          <h2 className="card-title">Local Focus</h2>
          <p className="card-text">
            Starting native to Santa Cruz, supporting local businesses and finding hidden deals in the community.
          </p>
        </div>
      </div>

      <button className="cta-button" onClick={() => alert("Scraping backend integration pending...")}>
        Explore the Market
      </button>
    </div>
  );
}

export default App;
