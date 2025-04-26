import "../App.css";
import React, { useState, useEffect, useRef } from 'react';

export function IntroStoryPage() {
  const lines = [
    "In the lab, you are doing experiments and writing up a lab report.",
    "Once you're done, you pack up your things and try to leave - but the door won't open.",
    "You jiggle the handle, push harder, but it's completely stuck.",
    "With no phone signal, you're left with no choice but to find another way out.",
    "You decide to check the room connected to the lab."
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
        <div className="flex justify-end mr-60 mt-12">
          <button className="basic-button">Go</button>
        </div>
      )}
    </div>
  );
}