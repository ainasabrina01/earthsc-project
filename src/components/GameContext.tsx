import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define our types
type RoomType = 'room1' | 'room2' | 'room3';

interface RoomState {
  room1: boolean;
  room2: boolean;
  room3: boolean;
}

// Context type
interface GameContextType {
  roomsCompleted: RoomState;
  completeRoom: (room: RoomType) => void;
  canAccessRoom: (room: RoomType) => boolean;
  redirectToAvailableRoom: () => void;
}

// Default empty state
const defaultState: RoomState = {
  room1: false,
  room2: false,
  room3: false
};

// Create the context
const GameContext = createContext<GameContextType | null>(null);

// Hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Get state from localStorage
function getStoredState(): RoomState {
  try {
    const stored = localStorage.getItem('roomProgress');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  return defaultState;
}

// Game Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [roomsCompleted, setRoomsCompleted] = useState<RoomState>(getStoredState);
  const navigate = useNavigate();

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('roomProgress', JSON.stringify(roomsCompleted));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [roomsCompleted]);

  // Mark a room as completed
  function completeRoom(room: RoomType) {
    setRoomsCompleted(prev => ({
      ...prev,
      [room]: true
    }));
  }

  // Check if a room can be accessed
  function canAccessRoom(room: RoomType) {
    switch (room) {
      case 'room1':
        return true;
      case 'room2':
        return roomsCompleted.room1;
      case 'room3':
        return roomsCompleted.room1 && roomsCompleted.room2;
      default:
        return false;
    }
  }

  // Redirect to the next available room
  function redirectToAvailableRoom() {
    if (!roomsCompleted.room1) {
      navigate('/room1');
    } else if (!roomsCompleted.room2) {
      navigate('/room2');
    } else if (!roomsCompleted.room3) {
      navigate('/room3');
    } else {
      navigate('/exit');
    }
  }

  // Create context value
  const value = {
    roomsCompleted,
    completeRoom,
    canAccessRoom,
    redirectToAvailableRoom
  };

  // Provide context to children
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
} 