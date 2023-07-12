import './App.css';
import useMondrian from "./hooks/useMondrian";
import { customRectString } from "./utils";

function App() {
   const { generate, rects } = useMondrian();

  return (
    <div className="flex flex-col gap-2 items-center">
    <h1 className="text-3xl font-bold underline">
      Embodiment
    </h1>
      <button className="btn btn-accent" onClick={() => generate(1000,1000, 1)}>Generate</button>
      <div className="card bg-primary text-primary-content">
         <div className="card-body">
          <h2 className="card-title">Result</h2>
          <div className="mockup-code">
            {
              rects.map(rect => 
                (<pre>
                  <code>{customRectString(rect)}</code>
                </pre>)
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
