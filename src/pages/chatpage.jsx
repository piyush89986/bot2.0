import { useCallback, useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiSearch, FiPlus, FiUser, FiSettings, FiLogOut, FiMessageSquare, FiMoon, FiSun, FiInbox, FiClock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { getMyChats } from "../webservices/chatApi/apis";
import { toast } from "react-toastify";
import { socket } from "../webservices/webSocket/socket";

export default function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // Default to Dark Theme
  const [activeTab, setActiveTab] = useState("primary"); // 'primary' | 'requests'
  const menuRef = useRef(null);

  const { chats } = useSelector((store) => store.chatState);
  const { loggedUser } = useSelector((store) => store.user);

  // Check if currently inside a specific conversation/page view
  const isOnChat = pathname.startsWith("/c/chat") || pathname.startsWith("/c/new-chat") || pathname.startsWith("/c/profile") || pathname.startsWith("/c/setting");

  const logOut = useCallback(() => {
    window.localStorage.clear();
    socket.disconnect();
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Socket online users tracker
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUserIds(users);
    };

    socket.on("getOnlineUsers", handleOnlineUsers);
    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      let res = await getMyChats();
      if (res.success) {
        dispatch({ type: "chatsSlice/SET_MY_CHATS", payload: res.data });
      } else {
        toast.error(res.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.message || "Server error");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Separate Primary vs Request chats (Instagram style)
  const pendingRequestChats = (chats || []).filter((chat) => {
    const isPending = chat.status === "pending";
    const requestedById = chat.requestedBy?._id || chat.requestedBy;
    return !chat.isGroupChat && isPending && requestedById && requestedById !== loggedUser?._id;
  });

  const primaryChats = (chats || []).filter((chat) => {
    const isPending = chat.status === "pending";
    const requestedById = chat.requestedBy?._id || chat.requestedBy;
    const isIncomingPending = !chat.isGroupChat && isPending && requestedById && requestedById !== loggedUser?._id;
    return !isIncomingPending;
  });

  const activeTabChats = activeTab === "requests" ? pendingRequestChats : primaryChats;

  // Filter chats by search query
  const filteredChats = activeTabChats.filter((chat) => {
    const partner = chat.members?.find((item) => item._id !== loggedUser?._id);
    const chatTitle = chat.isGroupChat ? chat.groupName : partner?.user_name || "Chat";
    return chatTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`flex h-screen h-[100dvh] max-h-[100dvh] overflow-hidden ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Sidebar — hidden on mobile when viewing a chat */}
      <div
        className={`
          ${isOnChat ? "hidden md:flex" : "flex"}
          w-full md:w-80 lg:w-96 border-r border-slate-200/80 dark:border-slate-800 ${darkMode ? "bg-slate-900" : "bg-white"} flex-col
          min-w-0 min-h-0 flex-shrink-0 shadow-sm z-10 transition-colors duration-200 h-full max-h-full
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={loggedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${loggedUser?.user_name || 'user'}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug truncate max-w-[140px]">
                {loggedUser?.user_name || "ChatSphere"}
              </h1>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                ● Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {darkMode ? <FiSun className="text-lg text-amber-400" /> : <FiMoon className="text-lg" />}
            </button>

            <Link
              to="/c/new-chat"
              className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
              title="New Chat"
            >
              <FiPlus className="text-lg" />
            </Link>

            <div ref={menuRef} className="relative inline-block">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FiMoreVertical className="text-lg" />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    to="/c/new-chat"
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <FiPlus className="text-indigo-500 text-sm" /> New Chat / Group
                  </Link>
                  <Link
                    to="/c/profile"
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <FiUser className="text-indigo-500 text-sm" /> My Profile
                  </Link>
                  <Link
                    to="/c/setting"
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <FiSettings className="text-indigo-500 text-sm" /> Settings & Audio
                  </Link>
                  <hr className="my-1 border-slate-100 dark:border-slate-700" />
                  <button
                    onClick={logOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                  >
                    <FiLogOut className="text-sm" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher: Primary vs Requests */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 px-2 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("primary")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === "primary"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FiInbox /> Primary
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 relative ${
              activeTab === "requests"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FiClock /> Requests
            {pendingRequestChats.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                {pendingRequestChats.length}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3">
          <div className="px-3.5 py-2 border border-slate-200/70 dark:border-slate-700/60 rounded-xl flex items-center bg-slate-50 dark:bg-slate-800/60 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
            <FiSearch className="text-base text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <FiMessageSquare className="text-3xl mb-2 stroke-1 opacity-50" />
              <p className="text-xs font-medium">
                {activeTab === "requests" ? "No pending message requests" : "No conversations found"}
              </p>
              {activeTab === "primary" && (
                <Link to="/c/new-chat" className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">
                  Start a new chat
                </Link>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => {
              const partner = chat.members?.find((item) => item._id !== loggedUser?._id);
              const isOnline = partner && onlineUserIds.includes(partner._id);
              const chatTitle = chat.isGroupChat ? chat.groupName : partner?.user_name || "Unknown User";
              const chatIcon = chat.isGroupChat
                ? chat.groupIcon || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(chatTitle)}`
                : partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(chatTitle)}`;
              
              const lastMessageText = chat?.lastMessage?.message || (chat.status === "pending" ? "Wants to send a message..." : "Click to start chatting");
              const unreadCount = chat?.unreadCounts?.length || 0;

              return (
                <NavLink
                  to={`/c/chat/${chat._id}`}
                  key={chat._id}
                  state={{ name: chatTitle, icon: chatIcon, online: isOnline, partnerId: partner?._id, chatStatus: chat.status, requestedBy: chat.requestedBy }}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <img
                          src={chatIcon}
                          alt={chatTitle}
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-200/50 dark:border-slate-700"
                        />
                        {!chat.isGroupChat && (
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                              isActive ? "border-indigo-600" : "border-white dark:border-slate-900"
                            } ${isOnline ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`}
                          />
                        )}
                      </div>

                      <div className="flex flex-col ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs truncate ${isActive ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                            {chatTitle}
                          </span>
                          {chat.lastMessage?.createdAt && (
                            <span className={`text-[10px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                              {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] truncate mt-0.5 ${isActive ? "text-indigo-100/90" : "text-slate-400"}`}>
                          {lastMessageText}
                        </span>
                      </div>

                      {unreadCount > 0 && (
                        <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                        }`}>
                          {unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat / Outlet Area */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-0 h-full max-h-full overflow-hidden ${isOnChat ? "flex" : "hidden md:flex"}`}>
        <Outlet context={{ darkMode, refreshChats: fetchChats }} />
      </div>

      {/* Empty State when no chat is selected */}
      {pathname === "/c" && (
        <div className="hidden md:flex flex-1 h-screen justify-center items-center bg-slate-50 dark:bg-slate-950 flex-col gap-4 p-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-4xl shadow-inner">
            <FiMessageSquare className="animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Welcome to ChatSphere</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Select a conversation from the sidebar or start a new chat to connect with your friends.
            </p>
          </div>
          <Link
            to="/c/new-chat"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition"
          >
            + Start New Conversation
          </Link>
        </div>
      )}
    </div>
  );
}


