import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function IdPage() {
  const [name, setName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);
  const navigate = useNavigate();
  const handleSubmitName = () => {
    if (name.trim()) {
      setIsNameEntered(true);
    }
  };

  const promptName = () => {
    return (
      <form onSubmit={handleSubmitName} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Type your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border rounded text-black text-center"
        />
        <button
          type="submit"
          className="basic-button text-black"
          disabled={!name.trim()}
        >
          Submit
        </button>
      </form>
    );
  };

  const displayStudentID = () => {
    return (
      <div className="flex flex-col justify-start items-center min-h-screen mt-48 relative">
        <p className="text-white text-xl font-semibold mb-4">Hey there, this is your student card:</p>
        <div className="w-[384px] h-[192px] bg-transparent border-2 border-white rounded-lg shadow-md flex flex-col relative">
          <div className="flex justify-end pr-4 pt-2">
            <p className="text-white text-2xl font-semibold">Student ID</p>
          </div>
          <div className="flex items-center justify-start flex-1">
            <div className="ml-4 flex flex-col items-center">
              <div className="w-24 h-24 border-2 border-white bg-transparent flex items-center justify-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 w-12 h-6 bg-gray-300 rounded-t-full"></div>
                </div>
              </div>
            </div>
            <div className="ml-6 text-white text-left">
              <p className="text-2xl font-semibold mb-1">{name}</p>
              <p className="text-2xl font-semibold mb-1">11055011</p>
              <p className="text-2xl font-semibold">Earth Sciences</p>
            </div>
          </div>
        </div>
        <button className="absolute right-4 top-1/2 text-button" onClick={() => navigate("/intro")}>
          Head to the lab &gt; &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="p-4">
      {!isNameEntered && promptName()}
      {isNameEntered && displayStudentID()}
    </div>
  );
}
