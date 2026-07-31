import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Composer from "./components/Composer";
import Feed from "./components/Feed";
import "./App.css";

function App() {
  const [view, setView] = useState("compose");

  return (
    <div className="app">
      <Sidebar activeView={view} onChangeView={setView} />
      <main className="app__main">
        {view === "compose" ? <Composer /> : <Feed />}
      </main>
    </div>
  );
}

export default App;
