import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";

export function Room1() {
  const [fullText, setFullText] = useState("As soon as you enter the room, you see another door and a computer.");
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [lastClickedAction, setLastClickedAction] = useState<string | null>(null);
  const [actions, setActions] = useState([
    { label: "Inspect the computer", key: "inspect-computer" },
    { label: "Try the door", key: "try-door" },
    { label: "Look around the room", key: "look-around" },
  ]);
  const [hasKey, setHasKey] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const loadingTimeout = useRef<number | null>(null);
  const typingTimer = useRef<number | null>(null);
  const pendingText = useRef<string>("");
  const navigate = useNavigate();
  const { completeRoom } = useGame();
  
  // Enhanced navigation method with proper debugging
  const handleGoToNextRoom = () => {
    console.log("handleGoToNextRoom called");
    // Mark room as completed
    completeRoom("room1");
    console.log("Room1 marked as completed");
    
    // Force a small delay before navigation to ensure state updates
    setTimeout(() => {
      console.log("Navigating to Room2...");
      navigate("/room2");
    }, 100);
  };

  // Handle loading state
  useEffect(() => {
    if (loadingText && pendingText.current) {
      // Clear any existing timeout
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      
      // Set a timeout to start the typewriter effect after 3 seconds
      loadingTimeout.current = setTimeout(() => {
        setLoadingText("");
        // Trigger the typewriter effect with the pending text
        setFullText(pendingText.current);
      }, 3000); // 3 seconds loading time
    }
    
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, [loadingText]);

  // Skip typing animation and show full text immediately
  const skipTyping = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only skip if we're actively typing
    if (!isTypingComplete && !loadingText && fullText) {
      // Clear the typing timer if it exists
      if (typingTimer.current) {
        clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
      
      // Show the full text immediately
      setDisplayedText(fullText);
      setIsTypingComplete(true);
    }
  };

  // Simple typewriter effect
  useEffect(() => {
    // Skip if we're in loading state
    if (loadingText) return;
    
    // Reset displayed text and typing state
    setDisplayedText("");
    setIsTypingComplete(false);
    
    // Guard against empty text
    if (!fullText || fullText.length === 0) {
      setIsTypingComplete(true);
      return;
    }
    
    // Start animation
    let index = 0;
    typingTimer.current = setInterval(() => {
      setDisplayedText(fullText.substring(0, index + 1));
      index += 1;
      
      if (index >= fullText.length) {
        if (typingTimer.current) {
          clearInterval(typingTimer.current);
          typingTimer.current = null;
        }
        setIsTypingComplete(true);
      }
    }, 50);
    
    // Cleanup
    return () => {
      if (typingTimer.current) {
        clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
    };
  }, [fullText, loadingText]);

  const showText = (text: string) => {
    // Store the text to be displayed after loading
    pendingText.current = text;
    
    // If we're not in loading state, directly set the text
    if (!loadingText) {
      setFullText(text);
    }
  };

  // Add this new function to handle passcode input validation
  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      // Limit to 2 digits
      if (value.length <= 2) {
        setPasscode(value);
      }
    }
  };

  const handleAction = (key: string) => {
    setPasscodeError("");
    
    // Set the current action as the last clicked
    setLastClickedAction(key);
    console.log("Action clicked:", key);
    
    // Set appropriate loading text based on action
    if (key === "look-around") {
      setLoadingText("Looking around the room...");
      showText("You go around the room. You find a locker and a drawer full of stuff.");
      setActions((prev) => [
        ...prev.filter((a) => a.key !== "look-around"),
        { label: "Check the drawer", key: "check-drawer" },
        { label: "Check the locker", key: "check-locker" },
      ]);
      setShowPasscode(false);
    } else if (key === "inspect-computer") {
      setLoadingText("Inspecting the computer...");
      showText(
        "On the computer screen, there was a browsing history of the following:\n- 3 type of rocks\n- 63 national parks in the US\n- 50 US states"
      );
      setShowPasscode(false);
    } else if (key === "try-door") {
      setLoadingText("Trying the door...");
      if (hasKey) {
        showText("You use the key and the door unlocks..");
        setActions([
          { label: "Go to next room", key: "go-next-room" }
        ]);
      } else {
        showText("The door is locked. There should be a key somewhere in this room.");
      }
      setShowPasscode(false);
    } else if (key === "check-locker") {
      setLoadingText("Checking the locker...");
      setShowPasscode(true);
      setPasscode("");
      showText("The locker is locked. It requires a passcode.");
    } else if (key === "check-drawer") {
      setLoadingText("Checking the drawer...");
      showText("You pull the drawer and find different national park brochures. You wonder if the person is collecting them.");
      setShowPasscode(false);
    } else if (key === "go-next-room") {
      console.log("go-next-room action triggered");
      setLoadingText("Going to the next room...");
      showText("You proceed to the next room...");
      
      // Add a more reliable navigation approach
      console.log("Setting up navigation timeout");
      setTimeout(() => {
        console.log("Navigation timeout triggered");
        handleGoToNextRoom();
      }, 3000);
    } else {
      setLoadingText("Unknown action...");
      showText("Unknown action.");
      setShowPasscode(false);
    }
  };

  const handleUnlock = () => {
    setLoadingText("Trying to unlock...");
    if (passcode === "63") {
      showText("You find a key inside the locker!");
      setHasKey(true);
      setActions((prev) => prev.filter((a) => a.key !== "check-locker"));
      setShowPasscode(false);
      // Reset last clicked action when unlocking is successful
      setLastClickedAction(null);
    } else {
      setPasscodeError("Incorrect passcode. Try again.");
      setLoadingText("");
    }
  };

  // Render lines with line breaks
  const renderLines = (text: string) =>
    text.split("\n").map((line, idx) => (
      <p className="text-2xl text-left" key={idx}>{line}</p>
    ));

  return (
    <div className="h-screen flex flex-col justify-start items-center">
      <h3 className="text-center mt-16">Room 1</h3>
      
      {/* Fixed size text display box */}
      <div className="mt-8 w-[800px] h-[300px] border-2 border-dashed border-gray-400 bg-white bg-opacity-10 rounded p-8 flex flex-col justify-start relative overflow-y-auto">
        <div className="flex-1 flex-col items-start justify-start">
          {loadingText ? (
            <p className="text-2xl italic text-left">{loadingText}</p>
          ) : (
            <div className="w-full text-left">
              {renderLines(displayedText)}
            </div>
          )}
        </div>

        {/* Skip button positioned at bottom right */}
        {!isTypingComplete && !loadingText && (
          <div className="absolute bottom-2 right-2">
            <button 
              onClick={skipTyping}
              className="text-button"
            >
              Skip
            </button>
          </div>
        )}

        {/* Passcode input appears at the bottom */}
        {showPasscode && isTypingComplete && !loadingText && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              className="border rounded p-2 text-black text-xl w-40 text-center"
              value={passcode}
              onChange={handlePasscodeChange}
              placeholder="Enter 2-digit code"
            />
            <button
              className="basic-button w-auto py-1"
              onClick={handleUnlock}
              disabled={passcode.length !== 2}
            >
              Unlock
            </button>
            {passcodeError && <p className="text-red-500 text-lg">{passcodeError}</p>}
          </div>
        )}
      </div>
      
      {/* Action buttons in a separate container below */}
      {isTypingComplete && !loadingText && (
        <div className="mt-12 w-[800px] flex flex-col items-center">
          <h4 className="mb-4">Action</h4>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            {actions
              .filter(action => action.key !== lastClickedAction)
              .map((action) => (
                <button
                  key={action.key}
                  className="basic-button w-auto py-1 flex justify-center"
                  onClick={() => handleAction(action.key)}
                >
                  {action.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}