import "../App.css";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './GameContext';

export function ExitPage() {
  const navigate = useNavigate();
  const { roomsCompleted, redirectToAvailableRoom } = useGame();

  // Check if all rooms are completed, if not redirect to the appropriate room
  useEffect(() => {
    // Make sure room1, room2, and room3 are all completed
    if (!roomsCompleted.room1 || !roomsCompleted.room2 || !roomsCompleted.room3) {
      console.log("Some rooms are not completed yet. Redirecting...");
      redirectToAvailableRoom();
    } else {
      console.log("All rooms completed. Showing exit page.");
    }
  }, [roomsCompleted, redirectToAvailableRoom]);

  const lines = [
    "You find yourself in the hallway and realize that you are out of the lab maze!",
    "You feel relieved and walk back home."
  ];

  const [displayedLines, setDisplayedLines] = useState(Array(lines.length).fill(""));
  const [typingComplete, setTypingComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const typeLine = (index: number) => {
      if (index >= lines.length) {
        setTypingComplete(true); // Set typing complete when all lines are done
        return;
      }
      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[index] = lines[index].slice(0, currentIndex + 1);
          return newLines;
        });
        currentIndex++;
        if (currentIndex === lines[index].length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          timeoutRef.current = setTimeout(() => {
            typeLine(index + 1); // Start typing the next line after a delay
          }, 500); // Adjust the delay time between lines here
        }
      }, 50); // Adjust the speed by changing the interval time
    };

    typeLine(0); // Start typing from the first line

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Function to show all text immediately and stop the typing effect
  const showAllText = () => {
    // Clear any active timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Show all text at once
    setDisplayedLines([...lines]);
    setTypingComplete(true);
  };

  return (
    <div className="-mt-12" style={{ height: '300px' }} onClick={showAllText}>
      {displayedLines.map((text, idx) => (
        <h3 key={idx} className="ml-60 text-2xl">{text}</h3>
      ))}
      {typingComplete && (
        <>
          <div className="flex justify-center mt-32">
            <div className="animated-dash-box">
              <h2 className="text-3xl font-bold">Thank you for playing :)</h2>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <button className="text-button" onClick={() => navigate("/reference")}>References</button>
          </div>
        </>
      )}
    </div>
  );
}