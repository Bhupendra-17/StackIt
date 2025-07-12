import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/Homepage";
import SignupPage from "./components/authentication/Signup";
import LoginPage from "./components/authentication/Login";
import AskQue from "./components/QnA/AskQue";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ask" element={<AskQue />} />
      </Routes>
    </Router>
  );
}

export default App;
