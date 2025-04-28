import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";

export function Room2() {
    const [fullText, setFullText] = useState("You walk through the door and enter the room. You immediately see a door across the room and a table in the corner of the room.");
    const [displayedText, setDisplayedText] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [lastClickedAction, setLastClickedAction] = useState<string | null>(null);
    const [actions, setActions] = useState([
      { label: "Look around the room", key: "look-around-room" },
      { label: "Walk to the door", key: "walk-to-door" },
      { label: "Check the table", key: "check-table" },
    ]);
    const [passwordScreen, setPasswordScreen] = useState(false);
    const [doorPassword, setDoorPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const loadingTimeout = useRef<number | null>(null);
    const typingTimer = useRef<number | null>(null);
    const pendingText = useRef<string>("");
    const navigate = useNavigate();
    const { completeRoom } = useGame();
    const [quizActive, setQuizActive] = useState(false);
    const [quizSelected, setQuizSelected] = useState<string>("");
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizFeedback, setQuizFeedback] = useState("");
    const [quizCorrectlyAnswered, setQuizCorrectlyAnswered] = useState(false);
    
    // Debug log
    console.log("Room2 rendered, quiz active:", quizActive);
    
    // Enhanced navigation method with proper debugging
    const handleGoToNextRoom = () => {
      console.log("Room2: handleGoToNextRoom called");
      // Mark room as completed
      completeRoom("room2");
      console.log("Room2 marked as completed");
      
      // Force a small delay before navigation to ensure state updates
      setTimeout(() => {
        console.log("Navigating to Room3...");
        navigate("/room3");
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
  
    const handleAction = (key: string) => {
      setQuizSubmitted(false);
      setQuizFeedback("");
      // Set the current action as the last clicked
      setLastClickedAction(key);
      console.log("Room2: Action clicked:", key);
      
      // Set appropriate loading text based on action
      if (key === "check-table") {
        setLoadingText("Checking the table...");
        showText("You approach the table and see a detailed model on it, along with some papers.");
        setActions((prev) => [
          ...prev.filter((a) => a.key !== "check-table"),
          { label: "Inspect forest model", key: "inspect-model" },
          { label: "Pop quiz for hints", key: "pop-quiz" },
        ]);
        setPasswordScreen(false);
        setQuizActive(false);
      } else if (key === "look-around-room") {
        setLoadingText("Looking around the room...");
        showText(
          "You look around the room. There's a bunch of pipes running along the ceiling, and every so often, one of them lets out a sharp hiss and a burst of vapor. You make a mental note to be careful and not walk right under them."
        );
        setPasswordScreen(false);
        setQuizActive(false);
      } else if (key === "walk-to-door") {
        setLoadingText("Walking to the door...");
        showText("You approach the door and notice there's a screen prompting for a password.");
        setPasswordScreen(true);
        setQuizActive(false);
      } else if (key === "inspect-model") {
        setLoadingText("Inspecting the forest model...");
        showText("The forest model is a detailed diorama of a national park. You can see miniature figures of gray wolves, elk, beaver, and bison. There's a small card next to it that reads 'One of the national parks in the western United States.'");
        setQuizActive(false);
      } else if (key === "pop-quiz") {
        if (quizCorrectlyAnswered) {
          // If the quiz was already correctly answered, show the hint immediately
          showText("Your Hint:\n\nYou realized that the pipes overhead remind you of geysers. You start to think about which national park is famous for its geysers.");
          setQuizActive(false);
        } else {
          // Otherwise, show the quiz
          setLoadingText("Loading a question for you...");
          setQuizActive(false);
          setQuizSelected("");
          setTimeout(() => {
            setLoadingText("");
            setQuizActive(true);
          }, 2000);
          showText("");
        }
      } else if (key === "go-next-room") {
        console.log("Room2: go-next-room action triggered");
        setLoadingText("Going to the next room...");
        showText("You proceed to the next room...");
        setQuizActive(false);
        
        // Add a more reliable navigation approach
        console.log("Room2: Setting up navigation timeout");
        setTimeout(() => {
          console.log("Room2: Navigation timeout triggered");
          handleGoToNextRoom();
        }, 3000);
      } else {
        setLoadingText("Unknown action...");
        showText("Unknown action.");
        setPasswordScreen(false);
        setQuizActive(false);
      }
    };
  
    // New function to handle password input change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDoorPassword(e.target.value);
      setPasswordError("");
    };
  
    // New function to check the door password
    const checkDoorPassword = () => {
      setLoadingText("Checking password...");
      if (doorPassword.toLowerCase() === "yellowstone") {
        showText("You hear some wiring sounds indicating it's unlocking the door. The door slides open with a soft mechanical hum.");
        setActions([
          { label: "Go to next room", key: "go-next-room" }
        ]);
        setPasswordScreen(false);
        setLastClickedAction(null);
      } else {
        setPasswordError("Incorrect password. Try again.");
        setLoadingText("");
      }
    };
  
    // Render lines with line breaks
    const renderLines = (text: string) =>
      text.split("\n").map((line, idx) => (
        <p className="text-2xl text-left" key={idx}>{line}</p>
      ));
  
    // Quiz answer handler
    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuizSelected(e.target.value);
      setQuizSubmitted(false);
      setQuizFeedback("");
    };
    const handleQuizSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setQuizSubmitted(true);
      let feedback = "";
      if (quizSelected === "B") {
        feedback = "Correct! The answer is Nitrogen.";
        setQuizCorrectlyAnswered(true);
        setQuizActive(false);
        showText("Your Hint:\n\nYou realized that the pipes overhead remind you of geysers. You start to think about which national park is famous for its geysers.");
      } else {
        feedback = "Incorrect. Try again.";
      }
      setQuizFeedback(feedback);
    };
  
    return (
      <div className="h-screen flex flex-col justify-start items-center">
        <h3 className="text-center mt-16">Room 2</h3>
        
        {/* Fixed size text display box */}
        <div className="mt-8 w-[800px] h-[300px] border-2 border-dashed border-gray-400 bg-white bg-opacity-10 rounded p-8 flex flex-col justify-start relative overflow-y-auto">
          <div className="flex-1 flex-col items-start justify-start">
            {loadingText ? (
              <p className="text-2xl italic text-left">{loadingText}</p>
            ) : quizActive ? (
              <form onSubmit={handleQuizSubmit} className="flex flex-col gap-2 h-full relative">
                <p className="text-2xl text-left font-bold">What is the most abundant gas in the atmosphere?</p>
                <div className="flex flex-col gap-1 ml-2">
                  <label className="text-xl">
                    <input type="radio" name="quiz" value="A" checked={quizSelected === "A"} onChange={handleQuizChange} className="text-2xl mr-4" />
                    Oxygen
                  </label>
                  <label className="text-xl">
                    <input type="radio" name="quiz" value="B" checked={quizSelected === "B"} onChange={handleQuizChange} className="text-2xl mr-4" />
                    Nitrogen
                  </label>
                  <label className="text-xl">
                    <input type="radio" name="quiz" value="C" checked={quizSelected === "C"} onChange={handleQuizChange} className="text-2xl mr-4" />
                    Carbon Dioxide
                  </label>
                  <label className="text-xl">
                    <input type="radio" name="quiz" value="D" checked={quizSelected === "D"} onChange={handleQuizChange} className="text-2xl mr-4" />
                    Argon
                  </label>
                </div>
                {quizSubmitted && (
                  <div className="mt-1">
                    <p className={quizFeedback.startsWith("Correct") ? "text-green-500 text-base" : "text-red-500 text-base"}>
                      {quizFeedback.split("\n")[0]}
                    </p>
                    {quizFeedback.split("\n")[1] && quizFeedback.startsWith("Correct") && (
                      <p className="text-base text-gray-200 mt-1">{quizFeedback.split("\n")[1]}</p>
                    )}
                  </div>
                )}
                <button type="submit" className="basic-button absolute bottom-2 right-2 px-6 py-3 text-lg" style={{fontSize: '20px', padding: '12px 32px', minWidth: '120px'}} disabled={!quizSelected}>Submit</button>
              </form>
            ) : (
              <div className="w-full text-left">
                {renderLines(displayedText)}
              </div>
            )}
          </div>
  
          {/* Skip button positioned at bottom right */}
          {!isTypingComplete && !loadingText && !quizActive && (
            <div className="absolute bottom-2 right-2">
              <button 
                onClick={skipTyping}
                className="text-button"
              >
                Skip
              </button>
            </div>
          )}
  
          {/* Door password input */}
          {passwordScreen && isTypingComplete && !loadingText && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <input
                type="text"
                className="border rounded p-2 text-black text-xl w-60 text-center"
                value={doorPassword}
                onChange={handlePasswordChange}
                placeholder="Enter password"
              />
              <button
                className="basic-button"
                onClick={checkDoorPassword}
              >
                Submit
              </button>
              {passwordError && <p className="text-red-500 text-lg">{passwordError}</p>}
            </div>
          )}
        </div>
        
        {/* Action buttons in a separate container below */}
        {isTypingComplete && !loadingText && !quizActive && (
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