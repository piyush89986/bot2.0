import { useCallback, useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { getMyChats } from "../webservices/chatApi/apis";
import { toast } from "react-toastify";

export default function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef(null);

  const { chats } = useSelector((store) => store.chatState);
  const { loggedUser } = useSelector((store) => store.user);

  // On mobile, hide sidebar when a chat is open
  const isOnChat = pathname.startsWith("/c/chat") || pathname.startsWith("/c/new-chat") || pathname.startsWith("/c/profile") || pathname.startsWith("/c/setting");

  const logOut = useCallback(() => {
    window.localStorage.clear();
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      let res = await getMyChats();
      if (res.success) {
        dispatch({ type: "chatsSlice/SET_MY_CHATS", payload: res.data });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Server Error");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — hidden on mobile when a chat is open */}
      <div
        className={`
          ${isOnChat ? "hidden md:flex" : "flex"}
          w-full md:w-1/4 border-r border-gray-200 bg-white flex-col
          min-w-0 md:min-w-[260px]
        `}
      >
        <div className="p-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">ChatSphere</h1>
          <div ref={menuRef} className="relative inline-block text-left">
            <button
              onClick={() => setOpen(!open)}
              className="p-3 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <FiMoreVertical className="cursor-pointer" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-xl bg-white border border-gray-100 z-50">
                <div className="py-2 text-sm text-gray-700">
                  <Link to="/c/new-chat" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">New Chat</Link>
                  <Link to="/c/profile" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">Profile</Link>
                  <Link to="/c/setting" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">Setting</Link>
                  <button onClick={logOut} className="w-full text-left block px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="mx-3 mb-2 px-3 py-2 border border-gray-200 rounded-xl flex items-center bg-gray-50">
          <FiSearch className="text-lg mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const user = chat.members.find((item) => item._id !== loggedUser._id);
            const chatTitle = chat.isGroupChat ? chat.groupName : user?.user_name || "Unknown";
            const chatIcon = chat.isGroupChat ? chat.groupIcon : user?.avatar;
            const lastMessageText = chat?.lastMessage?.message || "Start chatting...";
            const unreadCount = chat?.unreadCounts?.length || 0;

            return (
              <NavLink
                to={`/c/chat/${chat._id}`}
                key={chat._id}
                state={{ name: chatTitle, icon: chatIcon }}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isActive ? "bg-indigo-50 border-r-2 border-indigo-500" : ""}`
                }
              >
                <div className="relative flex-shrink-0">
                  <img src={chatIcon} alt="dp" className="w-11 h-11 border-2 border-indigo-200 rounded-full object-cover" />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user?.online ? "bg-green-400" : "bg-gray-300"}`} />
                </div>
                <div className="flex flex-col ml-3 flex-1 min-w-0">
                  <span className="font-semibold text-sm text-gray-800 truncate">{chatTitle}</span>
                  <span className="text-xs text-gray-400 truncate">{lastMessageText}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-w-0 ${isOnChat ? "flex" : "hidden md:flex"}`}>
        <Outlet />
      </div>

      {/* Empty state — only shown on desktop when no chat selected */}
      {pathname === "/c" && (
        <div className="hidden md:flex flex-1 h-screen justify-center items-center bg-gray-50 flex-col gap-3">
          <div className="text-5xl">💬</div>
          <p className="text-gray-500 font-medium">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}
