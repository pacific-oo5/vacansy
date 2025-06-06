import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main"; // Убедись, что файл называется Main.jsx (с заглавной)
import Responded from "./pages/responded";
import Profile from "./pages/profile"
import Login from "./pages/login"
import Register from "./pages/register"
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
         <Route path="/responded" element={<Responded />} />
          <Route path="/Profile" element={<Profile />} />
           <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
