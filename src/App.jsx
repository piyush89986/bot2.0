import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home";
import PublicRoute from "./routes/public";
import Features from "./pages/features";
import About from "./pages/about";
import Contact from "./pages/contact";
import Auth from "./pages/auth";
import ProtectedRoute from "./routes/protected";
import ChatPage from "./pages/chatpage";
import Chatsection from "./components/chatsection";
import UserProfile from "./pages/profilepage";
import UserSettingsWithSounds from "./components/UserSettingsWithSounds"; // ✅ ADD YE
import NewChatPage from "./pages/newChatPage";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.addEventListener("offline", () => {
      toast.error("Your Net Connection Is Lost");
    });

    window.addEventListener("online", () => {
      toast.success("Connected to Net");
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="c" element={<ChatPage />}>
            <Route path="new-chat" element={<NewChatPage />} />
            <Route path="chat/:chatId" element={<Chatsection />} />
            <Route path="profile" element={<UserProfile />} />
            {/* ✅ CHANGE YE LINE */}
            <Route path="setting" element={<UserSettingsWithSounds />} />
          </Route>
        </Route>

        <Route path="login" element={<Auth />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;