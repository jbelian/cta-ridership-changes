import { useState } from "react";
import "./App.css";

//import { fetchData } from "./components/fetch.tsx";
//fetchData();

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>CTA Trends!</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Coming soon</p>
    </>
  );
}

export default App;
