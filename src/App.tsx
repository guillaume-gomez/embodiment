import './App.css';
import use3DMondrian from "./hooks/use3DMondrian";
import { customRectString } from "./utils";

function App() {
   const { generate, mondrians } = use3DMondrian();

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold underline">
        Embodiment
      </h1>
      <button className="btn btn-accent" onClick={() => generate(1000,1000, 1)}>Generate</button>
      {
        mondrians.map(mondrian =>
          (
            <div className="card bg-primary text-primary-content">
               <div className="card-body">
                <h2 className="card-title">Result</h2>
                <div className="mockup-code">
                  {
                    mondrian.rects.map(rect =>
                      (<pre>
                        <code>{customRectString(rect)}</code>
                      </pre>)
                    )
                  }
                </div>
              </div>
            </div>
          )
        )
      }
    </div>
  )
}

export default App;
