import profilePic from "./assets/tracksaab.png"

function Card(){
    return (
        <div className="card">
            <img src = "{profilePic}" img alt="EcoShoppr Logo"></img>
            <h2>EcoShoppr</h2>
            <p>I am getting groceries for you</p>
        </div>
    );
}

export default Card