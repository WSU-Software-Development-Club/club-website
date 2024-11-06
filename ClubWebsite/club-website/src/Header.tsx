import { useState } from 'react'

function Header() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>
          Hello World
      </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/Header.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default Header
