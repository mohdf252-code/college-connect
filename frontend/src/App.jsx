import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import Connections from "./pages/Connections";
import Chat from "./pages/Chat";import { useEffect } from "react";
import Chats from "./pages/Chats";
import Notes from "./pages/Notes";
import socket from "./socket";

function App() {
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("No user found in localStorage");
      return;
    }

    const user = JSON.parse(storedUser);

    console.log("Logged in user:", user);

    const userId = user._id || user.id;

    if (!userId) {
      console.log("❌ USER ID NOT FOUND");
      return;
    }

    console.log("✅ Joining socket with:", userId);

    socket.emit("join", userId);

  }, []);



  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route
  path="/chat/:id"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
        <Route
  path="/discover"
  element={
    <ProtectedRoute>
      <Discover />
    </ProtectedRoute>
  }
/>
<Route
  path="/connections"
  element={
    <ProtectedRoute>
      <Connections />
    </ProtectedRoute>
  }
/>
<Route
  path="/requests"
  element={
    <ProtectedRoute>
      <Requests />
    </ProtectedRoute>
  }
/>
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
  />
  <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
