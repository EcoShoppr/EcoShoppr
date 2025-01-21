import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css";

export function Home() {
    const navigate = useNavigate(); // Initialize navigate function

    const handleStartNow = () => {
        navigate("/store"); // Navigate to the store route
    };

    return (
        <Container className="home">
            {/* Banner Section */}
            <header className="banner">
                <div className="banner-content">
                    <h1>EcoShoppr</h1>
                    <p>Simplifying Shopping, Saving You Money</p>
                    <button className="cta-button" onClick={handleStartNow}>Start Now</button>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>What We Bring to You</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Cheapest Prices</h3>
                        <p>Find the best values around for your groceries.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Expense Tracking</h3>
                        <p>Monitor and stay within your budget.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Grocery Staples</h3>
                        <p>Track the items that really matter.</p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} EcoShoppr. All rights reserved.</p>
            </footer>
        </Container>
    );
}
