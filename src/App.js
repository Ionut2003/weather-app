import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {Weather} from "./Weather"; // Import Weather component
import Forecast from "./Forecast"; // Import Weather component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Weather />} />
                <Route path="/forecast/:city" element={<Forecast />} />
            </Routes>
        </Router>
    );
}

export default App; // Export the App component
