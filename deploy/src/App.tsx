import { Routes, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { Team } from "./pages/team"
import { Home } from "./pages/home"
import { Store } from "./pages/store"
import { About } from "./pages/about"
import { Navbar } from "./components/Navbar"
import { TeamMember } from "./components/TeamMember"; // Import the individual team member page
import { ShoppingCartProvider } from "./context/ShoppingCartContext.tsx"
import "./assets/global.css"

function App() {
  return (
    <ShoppingCartProvider>
    <Navbar />
    <Container className="mb-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:name" element={<TeamMember />} /> {/* Dynamic route */}
      </Routes>
    </Container>
    </ShoppingCartProvider>
  )
}

export default App

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>EcoShoppr</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           Grocery Amount is {count}
//         </button>
//         <p>
//           Click the button pls
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Our site is WIP, check back later :)
//       </p>
//     </>
//   )
// }
