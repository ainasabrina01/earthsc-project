import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './GameContext';

export function Room3() {
    const [fullText, setFullText] = useState("You are starting to feel tired. You hope that you will find an exit soon. The room is dark so you find the light switch and turn it on.");
    const [displayedText, setDisplayedText] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [lastClickedAction, setLastClickedAction] = useState<string | null>(null);
    const [actions, setActions] = useState([
      { label: "Play a puzzle", key: "play-puzzle" },
      { label: "Go to the door", key: "go-to-door" },
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
    const [puzzleActive, setPuzzleActive] = useState(false);
    const [puzzleInput, setPuzzleInput] = useState("");
    const [puzzleSubmitted, setPuzzleSubmitted] = useState(false);
    const [puzzleFeedback, setPuzzleFeedback] = useState("");
    const [hasReadNote, setHasReadNote] = useState(false);
    // Add a state to track if the safe is revealed
    const [showSafePasscode, setShowSafePasscode] = useState(false);
    const [safePasscode, setSafePasscode] = useState("");
    const [safePasscodeError, setSafePasscodeError] = useState("");
    // Add new quiz state variables
    const [roomQuizActive, setRoomQuizActive] = useState(false);
    const [roomQuizSelected, setRoomQuizSelected] = useState<string>("");
    const [roomQuizSubmitted, setRoomQuizSubmitted] = useState(false);
    const [roomQuizFeedback, setRoomQuizFeedback] = useState("");
    // Add a new state to track if the quiz has been answered correctly
    const [quizAnsweredCorrectly, setQuizAnsweredCorrectly] = useState(false);
  
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
      setSafePasscodeError("");
      setShowPasscode(false);
      setShowSafePasscode(false);
      setLastClickedAction(key);
      
      // Hide puzzles unless their specific key is clicked
      if (key !== "play-puzzle") {
        setPuzzleActive(false);
      }
      if (key !== "room-quiz") {
        setRoomQuizActive(false);
      }
      
      // Handle different action keys
      if (key === "play-puzzle") {
        setLoadingText("Loading puzzle...");
        setPuzzleActive(false);
        setPuzzleInput("");
        setPuzzleSubmitted(false);
        setPuzzleFeedback("");
        // Do NOT remove the puzzle button here
        setTimeout(() => {
          setLoadingText("");
          setPuzzleActive(true);
        }, 1000);
        showText("");
        return;
      } else if (key === "room-quiz") {
        // Check if quiz was already answered correctly
        if (quizAnsweredCorrectly) {
          // Show hint immediately
          setLoadingText("Recalling the hint...");
          setTimeout(() => {
            setLoadingText("");
            showText("HINT: Convert the numbers to letters to get the passcode for the safe.");
          }, 1000);
        } else {
          // Room quiz logic for first time
          setLoadingText("Loading quiz question...");
          setRoomQuizActive(false);
          setRoomQuizSelected("");
          setRoomQuizSubmitted(false);
          setRoomQuizFeedback("");
          
          setTimeout(() => {
            setLoadingText("");
            setRoomQuizActive(true);
          }, 1000);
          showText("");
        }
        return;
      } else if (key === "look-around") {
        setLoadingText("Looking around the room...");
        showText("There are two paintings hanging on the wall.");
        setActions((prev) => {
          // Remove 'look-around' and add 'Check the painting' if not present
          const filtered = prev.filter((a) => a.key !== "look-around");
          const hasCheckPainting = filtered.some((a) => a.key === "check-painting");
          return hasCheckPainting
            ? filtered
            : [...filtered, { label: "Check the painting", key: "check-painting" }];
        });
      } else if (key === "check-painting") {
        setLoadingText("Inspecting the painting...");
        if (!hasReadNote) {
          showText("You look at the paintings and see a beautiful landscape of Yosemite National Park.");
          // Only keep 'Check the painting' if it is already present
          setActions((prev) => prev.some(a => a.key === "check-painting") ? prev : prev);
        } else {
          showText("You check behind the paintings and find a safe box that requires a four-letter passcode.");
          setShowSafePasscode(true);
          setSafePasscode("");
          // Only keep 'Check the painting' if it is already present
          setActions((prev) => prev.some(a => a.key === "check-painting") ? prev : prev);
        }
      } else if (key === "read-note") {
        setLoadingText("Reading the note...");
        showText("The note reads: \n\n'25 19 13 20 \nCheck behind the paintings'");
        setHasReadNote(true);
        
        // After reading the note, add the "Pop quiz for hints" button
        setActions((prev) => {
          // Keep existing actions
          const updated = [...prev];
          
          // Add "Pop quiz for hints" if not already present
          if (!updated.some(a => a.key === "room-quiz")) {
            updated.push({ label: "Pop quiz for hints", key: "room-quiz" });
          }
          
          // Add "Check the painting" if not already present
          if (!updated.some(a => a.key === "check-painting")) {
            updated.push({ label: "Check the painting", key: "check-painting" });
          }
          
          return updated;
        });
      } else if (key === "go-to-door") {
        setLoadingText("Checking the door...");
        if (hasKey) {
          showText("You use the key and the door unlocked.");
          setActions([
            { label: "Exit game", key: "exit-game" }
          ]);
        } else {
          showText("The door is locked. There should be a key somewhere in this room.");
        }
      } else if (key === "check-drawer") {
        setLoadingText("Checking the drawer...");
        showText("You pulled the drawer and found different national park brochures. You wonder if the person is collecting them.");
      } else if (key === "exit-game") {
        console.log("Room3: exit-game action triggered");
        setLoadingText("Exiting game...");
        showText("Thank you for playing! You have escaped the maze.");
        
        // Add a more reliable navigation approach
        console.log("Room3: Setting up exit timeout");
        setTimeout(() => {
          console.log("Room3: Exit timeout triggered");
          handleExitGame();
        }, 2000);
      } else {
        setLoadingText("Unknown action...");
        showText("Unknown action.");
      }
      
      // Add debug log
      console.log("Room3: Action clicked:", key);
    };
  
    const handleUnlock = () => {
      setLoadingText("Trying to unlock...");
      if (passcode === "63") {
        showText("You found a key inside the safe!");
        setHasKey(true);
        setActions((prev) => prev.filter((a) => a.key !== "check-safe"));
        setShowPasscode(false);
        // Reset last clicked action when unlocking is successful
        setLastClickedAction(null);
      } else {
        setPasscodeError("Incorrect passcode. Try again.");
        setLoadingText("");
      }
    };
  
    // Add a handler for the safe passcode
    const handleSafePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^a-zA-Z]/g, "");
      setSafePasscode(value.toUpperCase());
    };
    const handleSafeUnlock = () => {
      setLoadingText("Safebox is unlocking...");
      if (safePasscode === "YSMT") {
        showText("You open the safe box and find a key inside.");
        setHasKey(true);
        setShowSafePasscode(false);
        setActions((prev) => {
          const hasGoToDoor = prev.some(a => a.key === "go-to-door");
          return hasGoToDoor ? prev : [...prev, { label: "Go to the door", key: "go-to-door" }];
        });
      } else {
        setSafePasscodeError("Incorrect passcode. Try again.");
        setLoadingText("");
      }
    };
  
    // Enhanced navigation method with proper debugging
    const handleExitGame = () => {
      console.log("Room3: handleExitGame called");
      // Mark room as completed
      completeRoom("room3");
      console.log("Room3 marked as completed");
      
      // Force a small delay before navigation to ensure state updates
      setTimeout(() => {
        console.log("Navigating to Exit page...");
        navigate("/exit");
      }, 100);
    };
  
    // Render lines with line breaks
    const renderLines = (text: string) =>
      text.split("\n").map((line, idx) => (
        <p className="text-2xl text-left" key={idx}>{line}</p>
      ));
  
    // Handle room quiz submit
    const handleRoomQuizSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setRoomQuizSubmitted(true);
      
      if (roomQuizSelected === "C") {
        setRoomQuizFeedback("Correct!");
        setQuizAnsweredCorrectly(true); // Mark the quiz as correctly answered
        
        // After a short delay, hide the quiz and show the hint
        setTimeout(() => {
          setRoomQuizActive(false);
          showText("HINT: Convert the numbers to letters to get the passcode for the safe.");
          
          // Keep the quiz button so users can review the hint
          // But update its label to indicate it shows a hint
          setActions(prev => {
            const updated = [...prev];
            const quizIndex = updated.findIndex(a => a.key === "room-quiz");
            
            if (quizIndex >= 0) {
              updated[quizIndex] = { 
                label: "Show hint again", 
                key: "room-quiz" 
              };
            }
            
            return updated;
          });
        }, 2000);
      } else {
        setRoomQuizFeedback("Incorrect. Try again.");
      }
    };
  
    return (
      <div className="h-screen flex flex-col justify-start items-center">
        <h3 className="text-center mt-16">Room 3</h3>
        
        {/* Fixed size text display box */}
        <div className="mt-8 w-[800px] h-[300px] border-2 border-dashed border-gray-400 bg-white bg-opacity-10 rounded p-8 flex flex-col justify-start relative overflow-y-auto">
          <div className="flex-1 flex-col items-start justify-start">
            {loadingText ? (
              <p className="text-2xl italic text-left">{loadingText}</p>
            ) : roomQuizActive ? (
              // Room Quiz UI
              <form onSubmit={handleRoomQuizSubmit} className="flex flex-col gap-2 h-full relative">
                <p className="text-2xl text-left font-bold">Yosemite Valley was carved primarily by:</p>
                <div className="flex flex-col gap-1 ml-2">
                  <label className="text-xl">
                    <input 
                      type="radio" 
                      name="roomQuiz" 
                      value="A" 
                      checked={roomQuizSelected === "A"} 
                      onChange={e => setRoomQuizSelected(e.target.value)} 
                      className="text-2xl mr-4" 
                    />
                    Rivers
                  </label>
                  <label className="text-xl">
                    <input 
                      type="radio" 
                      name="roomQuiz" 
                      value="B" 
                      checked={roomQuizSelected === "B"} 
                      onChange={e => setRoomQuizSelected(e.target.value)} 
                      className="text-2xl mr-4" 
                    />
                    Wind
                  </label>
                  <label className="text-xl">
                    <input 
                      type="radio" 
                      name="roomQuiz" 
                      value="C" 
                      checked={roomQuizSelected === "C"} 
                      onChange={e => setRoomQuizSelected(e.target.value)} 
                      className="text-2xl mr-4" 
                    />
                    Glaciers
                  </label>
                  <label className="text-xl">
                    <input 
                      type="radio" 
                      name="roomQuiz" 
                      value="D" 
                      checked={roomQuizSelected === "D"} 
                      onChange={e => setRoomQuizSelected(e.target.value)} 
                      className="text-2xl mr-4" 
                    />
                    Volcanoes
                  </label>
                </div>
                
                {roomQuizSubmitted && (
                  <div className="mt-1">
                    <p className={roomQuizFeedback.startsWith("Correct") ? "text-green-500 text-base" : "text-red-500 text-base"}>
                      {roomQuizFeedback}
                    </p>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="basic-button absolute bottom-2 right-2 px-6 py-3 text-lg" 
                  style={{fontSize: '20px', padding: '12px 32px', minWidth: '120px'}} 
                  disabled={!roomQuizSelected}
                >
                  Submit
                </button>
              </form>
            ) : puzzleActive ? (
              <form onSubmit={e => {
                e.preventDefault();
                setPuzzleSubmitted(true);
                const answer = puzzleInput.trim().toLowerCase();
                if (answer === "greenhouse gas" || answer === "greenhouse gases") {
                  setPuzzleFeedback("Correct! The answer is greenhouse gas(es).");
                  setPuzzleActive(false);
                  showText("You solved the riddle! \nYou feel proud of your knowledge. \n\nLater, you found a note on the floor.");
                  // Remove the puzzle button after it is solved
                  setActions((prev) => prev.filter((a) => a.key !== "play-puzzle"));
                  // Always add 'Read the note' if not already present
                  setActions((prev) => {
                    const alreadyHasNote = prev.some(a => a.key === "read-note");
                    if (alreadyHasNote) return prev;
                    return [
                      ...prev,
                      { label: "Read the note", key: "read-note" },
                    ];
                  });
                } else {
                  setPuzzleFeedback("Incorrect. Try again.");
                }
              }} className="flex flex-col gap-2 h-full relative">
                <p className="text-2xl text-left font-bold">I am invisible but trap the heat from the sun. Without me, you'd freeze. Too much of me, and you'll bake. What am I?</p>
                <p className="text-lg text-left italic">(Hint: Think atmosphere)</p>
                <input
                  type="text"
                  className="border rounded p-2 text-black text-xl w-96 text-center"
                  value={puzzleInput}
                  onChange={e => { setPuzzleInput(e.target.value); setPuzzleSubmitted(false); setPuzzleFeedback(""); }}
                  placeholder="Your answer here"
                />
                {puzzleSubmitted && (
                  <div className="mt-1">
                    <p className={puzzleFeedback.startsWith("Correct") ? "text-green-500 text-base" : "text-red-500 text-base"}>
                      {puzzleFeedback}
                    </p>
                  </div>
                )}
                <button type="submit" className="basic-button absolute bottom-2 right-2 px-6 py-3 text-lg" style={{fontSize: '20px', padding: '12px 32px', minWidth: '120px'}} disabled={!puzzleInput}>Submit</button>
              </form>
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
  
          {/* Passcode input for safe box appears at the bottom */}
          {showSafePasscode && isTypingComplete && !loadingText && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div
                className="flex gap-2 cursor-pointer"
                onClick={() => document.getElementById('safe-passcode-input')?.focus()}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="text-3xl font-mono border-b-2 border-gray-400 w-8 h-12 flex items-center justify-center select-none"
                    style={{ border: 'none', borderBottom: '2px solid #aaa', background: 'transparent' }}
                  >
                    {safePasscode[i] ? safePasscode[i] : '_'}
                  </span>
                ))}
                <input
                  id="safe-passcode-input"
                  type="text"
                  maxLength={4}
                  value={safePasscode}
                  onChange={handleSafePasscodeChange}
                  pattern="[A-Za-z]{4}"
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '1px',
                    height: '1px',
                  }}
                  tabIndex={-1}
                />
              </div>
              <button
                className="basic-button w-auto py-1"
                onClick={handleSafeUnlock}
                disabled={safePasscode.length !== 4}
              >
                Unlock
              </button>
              {safePasscodeError && <p className="text-red-500 text-lg">{safePasscodeError}</p>}
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