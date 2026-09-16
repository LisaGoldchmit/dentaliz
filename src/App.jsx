import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import TopicPicker from "./pages/TopicPicker.jsx";
import Practice from "./pages/Practice.jsx";
import Simulation from "./pages/Simulation.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/math" element={<TopicPicker subject="math" />} />
        <Route path="/chemistry" element={<TopicPicker subject="chemistry" />} />
        <Route path="/practice/:subject/:topic" element={<Practice />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
