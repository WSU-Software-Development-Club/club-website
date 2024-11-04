import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="fixed top-0 left-0">
        Hello World
      </h1>
      <div className="card">
        <button
          className="fixed top-6 border-b-2 border-blue-500 bg-blue-200 rounded-lg p-2 text-black"
          onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
