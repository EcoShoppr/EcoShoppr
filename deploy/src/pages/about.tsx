import { Container } from "react-bootstrap";

export function About() {
    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">About EcoShoppr</h1>
            <section className="mb-5">
                <h2>Our Mission</h2>
                <p>
                    At EcoShoppr, we aim to make grocery shopping smarter, more efficient, 
                    and sustainable by helping you save money and reduce waste.
                </p>
            </section>
            <section className="mb-5">
                <h2>What We Solve</h2>
                <p>
                    Grocery shopping can be overwhelming and expensive. EcoShoppr 
                    simplifies the process with tools to track your expenses, manage lists, 
                    and find the best deals.
                </p>
            </section>
            <section className="mb-5">
                <h2>Features</h2>
                <ul>
                    <li><strong>Cheapest Prices:</strong> Find the best deals on groceries.</li>
                    <li><strong>Expense Tracking:</strong> Stay on budget effortlessly.</li>
                    <li><strong>Reminders:</strong> Never forget essential grocery items.</li>
                    <li><strong>Sustainability Goals:</strong> Minimize food waste.</li>
                </ul>
            </section>
            <section className="mb-5">
                <h2>Our Vision</h2>
                <p>
                    We want to empower shoppers worldwide to save money and live more 
                    sustainably. EcoShoppr is continuously evolving to provide even better 
                    tools for you.
                </p>
            </section>
            <footer className="text-center">
                <p>
                    Ready to simplify your shopping? <a href="/">Start Now</a> with EcoShoppr!
                </p>
            </footer>
        </Container>
    );
}
