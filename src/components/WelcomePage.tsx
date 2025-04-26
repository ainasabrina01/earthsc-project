import "../App.css";
import { useNavigate } from "react-router-dom";

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1>Escape Room: Rocked Out</h1>
      <button className="basic-button" onClick={() => navigate("/profile")}>Start</button>
    </div>
  );
}