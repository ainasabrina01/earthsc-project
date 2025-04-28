import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './GameContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
  room: 'room1' | 'room2' | 'room3' | 'exit';
}

export function ProtectedRoute({ element, room }: ProtectedRouteProps) {
  const { canAccessRoom, redirectToAvailableRoom, roomsCompleted } = useGame();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Special case for exit page - require all rooms to be completed
    if (room === 'exit') {
      if (!roomsCompleted.room1 || !roomsCompleted.room2 || !roomsCompleted.room3) {
        console.log("Cannot access exit page - not all rooms completed");
        redirectToAvailableRoom();
        return;
      }
    } 
    // For room access, use the canAccessRoom function
    else if (!canAccessRoom(room)) {
      console.log(`Cannot access ${room} - redirecting`);
      redirectToAvailableRoom();
    }
  }, [room, canAccessRoom, redirectToAvailableRoom, roomsCompleted, navigate]);
  
  // Special case for exit - only render if all rooms are completed
  if (room === 'exit') {
    return (roomsCompleted.room1 && roomsCompleted.room2 && roomsCompleted.room3) 
      ? element 
      : null;
  }
  
  // For rooms, use the canAccessRoom function
  return canAccessRoom(room) ? element : null;
} 