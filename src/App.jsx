import { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Home from "./pages/Home";
import Favorite from "./pages/Favorite"

function App() {
  const scrollRef = useRef();

  return (
    <SidebarLayout scrollRef={scrollRef}>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorite scrollRef={scrollRef} />} />
      </Routes>
    </SidebarLayout>
  );
}

export default App;
