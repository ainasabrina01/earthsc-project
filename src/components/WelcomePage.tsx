import "../App.css";
import { useNavigate } from "react-router-dom";

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Escape Room: Rocked Out</h1>
      <button className="start-button" onClick={() => navigate("/id")}>Start</button>
    </div>
  );
}