import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>EcoShoppr</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Grocery Amount is {count}
        </button>
        <p>
          Click the button pls
        </p>
      </div>
      <p className="read-the-docs">
        Our site is WIP, check back later :)
      </p>
    </>
  )
}

export default App
