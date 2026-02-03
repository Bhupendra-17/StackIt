import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import HomePage from "./components/home/HomePage";
import SignupPage from "./components/authentication/Signup";
import LoginPage from "./components/authentication/Login";
import AskQue from "./components/QnA/AskQue";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQue />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
