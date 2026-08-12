import { useCallback, useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiPaperclip, FiSend, FiSearch, FiSmile, FiX, FiCheck, FiCheckCircle, FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiImage, FiFileText, FiDownload, FiPlay, FiPause, FiUserCheck, FiUserX, FiMaximize2 } from "react-icons/fi";
import { IoReturnUpBack } from "react-icons/io5";
import { MdCall, MdVideocam } from "react-icons/md";
import { useLocation, useNavigate, useParams, useOutletContext } from "react-router";
import { getMyChatMessages, sendMessageApi, acceptChatRequestApi, declineChatRequestApi } from "../webservices/chatApi/apis";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { socket } from "../webservices/webSocket/socket";

const EMOJIS = ["😊", "❤️", "👍", "😂", "🔥", "🎉", "🚀", "🙏", "💡", "🥳", "✨", "😍", "🙌", "😎", "💯", "👋"];

export default function Chatsection() {
    const { chatId } = useParams();
    const { loggedUser } = useSelector(store => store.user);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const darkMode = outletContext?.darkMode || true;
    const refreshChats = outletContext?.refreshChats;

    const { state } = useLocation();
    const chatTitle = state?.name || "Chat";
    const chatIcon = state?.icon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(chatTitle)}`;
    const isOnline = state?.online || false;
    const initialStatus = state?.chatStatus || "accepted";
    const requestedBy = state?.requestedBy || null;

    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [chatSearchQuery, setChatSearchQuery] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [chatStatus, setChatStatus] = useState(initialStatus);

    // Call Modal State
    const [activeCall, setActiveCall] = useState(null); // 'audio' | 'video' | null
    const [callTimer, setCallTimer] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Lightbox State
    const [lightboxImage, setLightboxImage] = useState(null);
    const [playingAudioId, setPlayingAudioId] = useState(null);
    const typingTimeoutRef = useRef(null);

    const isPendingForMe = chatStatus === "pending" && requestedBy && requestedBy !== loggedUser?._id;

    // Call timer interval
    useEffect(() => {
        let interval;
        if (activeCall) {
            interval = setInterval(() => {
                setCallTimer((prev) => prev + 1);
            }, 1000);
        } else {
            setCallTimer(0);
        }
        return () => clearInterval(interval);
    }, [activeCall]);

    // Voice Recording Timer
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchChatMessages = useCallback(async () => {
        try {
            let response = await getMyChatMessages(chatId);
            if (response.success) {
                setMessages(response.data || []);
            } else {
                setMessages([]);
            }
        } catch (error) {
            toast.error(error.message || "Server error fetching messages");
        }
    }, [chatId]);

    // Handle sending message (text, image, pdf, voice note)
    const handleSend = useCallback(async (customPayload = null) => {
        if (isPendingForMe) {
            toast.warning("Please accept the message request first to send messages.");
            return;
        }

        let contentToSend = newMsg.trim();
        let attachmentObj = null;

        if (customPayload) {
            contentToSend = customPayload.message || "";
            attachmentObj = customPayload.attachment || null;
        } else if (attachment) {
            attachmentObj = {
                url: attachment.preview || attachment.url || "",
                file_type: attachment.type || (attachment.isPdf ? "pdf" : "image"),
                file_size: attachment.size || 1024,
                message: attachment.name || "Attachment"
            };
            if (!contentToSend) {
                contentToSend = attachment.isPdf ? `📄 [Document: ${attachment.name}]` : `📷 [Image Attached]`;
            }
        }

        if (!contentToSend && !attachmentObj) return;

        let data = {
            message: contentToSend,
            chatId,
            attachment: attachmentObj
        };

        try {
            let response = await sendMessageApi(data);
            if (response.success) {
                setNewMsg("");
                setAttachment(null);
                setShowEmojiPicker(false);
                socket.emit("stopTyping", { chatId, userId: loggedUser._id });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Server Error");
        }
    }, [chatId, newMsg, attachment, loggedUser._id, isPendingForMe]);

    // Handle Accepting Instagram Style Request
    const handleAcceptRequest = async () => {
        try {
            const res = await acceptChatRequestApi(chatId);
            if (res.success) {
                setChatStatus("accepted");
                toast.success("Message request accepted! You can now reply.");
                if (refreshChats) refreshChats();
            } else {
                toast.error(res.message || "Failed to accept request");
            }
        } catch (err) {
            toast.error(err.message || "Error accepting request");
        }
    };

    // Handle Declining Request
    const handleDeclineRequest = async () => {
        try {
            const res = await declineChatRequestApi(chatId);
            if (res.success) {
                toast.info("Message request declined");
                if (refreshChats) refreshChats();
                navigate("/c");
            } else {
                toast.error(res.message || "Failed to decline request");
            }
        } catch (err) {
            toast.error(err.message || "Error declining request");
        }
    };

    // Handle Voice Recording
    const startVoiceRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                handleSend({
                    message: "🎙️ Voice Message (" + formatTime(recordingTime) + ")",
                    attachment: {
                        url: audioUrl,
                        file_type: "audio",
                        file_size: audioBlob.size,
                        message: "Voice Note"
                    }
                });
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            toast.error("Microphone access is required to record voice notes.");
        }
    };

    const stopVoiceRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Input change with typing emitter
    const handleInputChange = (e) => {
        setNewMsg(e.target.value);
        if (socket && chatId) {
            socket.emit("typing", { chatId, userId: loggedUser._id, userName: loggedUser.user_name });

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", { chatId, userId: loggedUser._id });
            }, 1500);
        }
    };

    const insertEmoji = (emoji) => {
        setNewMsg((prev) => prev + emoji);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                setAttachment({
                    file,
                    preview: dataUrl,
                    url: dataUrl,
                    name: file.name,
                    isPdf,
                    size: file.size,
                    type: isPdf ? "pdf" : "image"
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const getStatusIcon = ({ seen, delivered }) => {
        if (seen && seen.length > 0) {
            return <FiCheckCircle className="text-sky-300 inline text-xs ml-1" title="Seen" />;
        } else if (delivered) {
            return <FiCheck className="text-white/80 inline text-xs ml-1 font-bold" title="Delivered" />;
        } else {
            return <FiCheck className="text-white/60 inline text-xs ml-1" title="Sent" />;
        }
    };

    // Auto scroll when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        fetchChatMessages();
    }, [fetchChatMessages]);

    useEffect(() => {
        socket.emit("chatroom", chatId);
    }, [chatId]);

    // Socket realtime listeners
    useEffect(() => {
        const onNewMessage = (incomingMessage) => {
            if (incomingMessage.chatId === chatId || incomingMessage.chatId?._id === chatId) {
                setMessages((prev) => [...prev, incomingMessage]);
            }
        };

        const onTyping = ({ userId, userName }) => {
            if (userId !== loggedUser._id) {
                setIsTyping(true);
                setTypingUser(userName || "Someone");
            }
        };

        const onStopTyping = ({ userId }) => {
            if (userId !== loggedUser._id) {
                setIsTyping(false);
            }
        };

        socket.on("newMessage", onNewMessage);
        socket.on("typing", onTyping);
        socket.on("stopTyping", onStopTyping);

        return () => {
            socket.off("newMessage", onNewMessage);
            socket.off("typing", onTyping);
            socket.off("stopTyping", onStopTyping);
        };
    }, [chatId, loggedUser._id]);

    const displayedMessages = chatSearchQuery.trim()
        ? messages.filter((m) => m.message.toLowerCase().includes(chatSearchQuery.toLowerCase()))
        : messages;

    // Helper: Render Rich Media Bubble Content
    const renderMediaBubble = (msg, isMe) => {
        const hasAttachment = msg.attechment && msg.attechment.length > 0;
        const firstAttach = hasAttachment ? msg.attechment[0] : null;

        const isImage = (firstAttach && (firstAttach.file_type === 'image' || firstAttach.url?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i))) ||
                        msg.message?.includes("[Image Attached]") || msg.message?.startsWith("data:image/");

        const isPdf = (firstAttach && (firstAttach.file_type === 'pdf' || firstAttach.url?.endsWith(".pdf"))) ||
                      msg.message?.includes("[Document:") || msg.message?.includes(".pdf");

        const isAudio = (firstAttach && firstAttach.file_type === 'audio') || msg.message?.includes("🎙️ Voice Message");

        // 1. Render Image Bubble
        if (isImage) {
            const imageUrl = firstAttach?.url || 
                             (msg.message?.startsWith("data:image/") ? msg.message : null) ||
                             msg.message?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)|data:image\/[a-zA-Z0-9+/=;]+)/i)?.[0] ||
                             attachment?.preview ||
                             null;

            if (imageUrl) {
                return (
                    <div className="space-y-1.5">
                        <div className="relative group overflow-hidden rounded-xl cursor-pointer max-w-xs shadow-md border border-white/10" onClick={() => setLightboxImage(imageUrl)}>
                            <img src={imageUrl} alt="Uploaded Attachment" className="w-full max-h-60 object-cover rounded-xl transition duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-1 text-xs font-semibold">
                                <FiMaximize2 /> Expand Photo
                            </div>
                        </div>
                        {msg.message && !msg.message.startsWith("data:image/") && !msg.message.includes("[Image Attached]") && (
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        )}
                    </div>
                );
            }
        }

        // 2. Render PDF / Document Card Bubble
        if (isPdf) {
            const docName = firstAttach?.message || msg.message?.replace("📄 [Document: ", "").replace("]", "") || "Document.pdf";
            const docUrl = firstAttach?.url || "#";
            return (
                <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? "bg-white/10 border-white/20 text-white" : darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-slate-100 border-slate-200 text-slate-800"}`}>
                        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl text-xl flex-shrink-0">
                            <FiFileText />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">{docName}</p>
                            <span className="text-[10px] opacity-75">PDF Document • Click to download</span>
                        </div>
                        {docUrl !== "#" && (
                            <a href={docUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 transition">
                                <FiDownload className="text-sm" />
                            </a>
                        )}
                    </div>
                </div>
            );
        }

        // 3. Render Voice Note Waveform Player Bubble
        if (isAudio) {
            const isPlaying = playingAudioId === msg._id;
            const audioUrl = firstAttach?.url;
            return (
                <div className="flex items-center gap-3 py-1 px-1">
                    <button
                        onClick={() => {
                            if (audioUrl) {
                                const audio = new Audio(audioUrl);
                                audio.play();
                                setPlayingAudioId(msg._id);
                                audio.onended = () => setPlayingAudioId(null);
                            } else {
                                setPlayingAudioId(isPlaying ? null : msg._id);
                            }
                        }}
                        className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:scale-105 transition flex-shrink-0"
                    >
                        {isPlaying ? <FiPause className="text-sm" /> : <FiPlay className="text-sm ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-0.5 h-6">
                            {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 75, 55, 85].map((h, i) => (
                                <span
                                    key={i}
                                    className={`w-1 rounded-full transition-all ${isPlaying ? "bg-amber-300 animate-pulse" : "bg-white/40"}`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] opacity-80">{msg.message || "🎙️ Voice Message"}</p>
                    </div>
                </div>
            );
        }

        // Standard Text Message
        return <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>;
    };

    return (
        <div className={`flex flex-col h-full relative ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b shadow-sm z-20 transition-colors ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => navigate("/c")}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition md:hidden"
                    >
                        <IoReturnUpBack className="text-xl" />
                    </button>

                    <div className="relative flex-shrink-0">
                        <img
                            src={chatIcon}
                            alt={chatTitle}
                            className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                            darkMode ? "border-slate-900" : "border-white"
                        } ${isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{chatTitle}</h2>
                        <p className={`text-[11px] font-medium ${isOnline ? "text-emerald-500" : "text-slate-400"}`}>
                            {isOnline ? "● Active now" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className={`p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${searchOpen ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60" : ""}`}
                        title="Search messages"
                    >
                        <FiSearch className="text-lg" />
                    </button>
                    <button
                        onClick={() => setActiveCall('audio')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition"
                        title="Start voice call"
                    >
                        <MdCall className="text-xl" />
                    </button>
                    <button
                        onClick={() => setActiveCall('video')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 transition"
                        title="Start video call"
                    >
                        <MdVideocam className="text-xl" />
                    </button>
                </div>
            </div>

            {/* In-Chat Search Bar Drawer */}
            {searchOpen && (
                <div className={`p-2.5 border-b flex items-center gap-2 animate-in slide-in-from-top duration-200 ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-indigo-50/50 border-indigo-100"
                }`}>
                    <FiSearch className="text-slate-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Search inside conversation..."
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-xs outline-none"
                    />
                    {chatSearchQuery && (
                        <button onClick={() => setChatSearchQuery("")} className="p-1 text-slate-400 hover:text-slate-600">
                            <FiX />
                        </button>
                    )}
                </div>
            )}

            {/* Messages Scroll Area */}
            <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${
                darkMode ? "bg-slate-950" : "bg-gradient-to-b from-slate-50 to-indigo-50/20"
            }`}>
                {displayedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-2">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 text-2xl">
                            💬
                        </div>
                        <p className="text-xs font-semibold">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    displayedMessages.map((msg, index) => {
                        const isMe = msg?.sender?._id === loggedUser._id || msg?.sender === loggedUser._id;
                        const msgTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

                        return (
                            <div
                                key={msg._id || index}
                                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                {!isMe && (
                                    <img
                                        src={msg?.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg?.sender?.user_name || 'sender'}`}
                                        alt="Sender"
                                        className="w-7 h-7 rounded-full object-cover mb-1 border border-slate-200 dark:border-slate-800"
                                    />
                                )}
                                <div
                                    className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl shadow-sm relative group transition-all ${
                                        isMe
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                                            : darkMode
                                            ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                                            : "bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-slate-200/50"
                                    }`}
                                >
                                    {!isMe && msg?.sender?.user_name && (
                                        <p className="text-[10px] font-bold text-indigo-400 mb-1">{msg.sender.user_name}</p>
                                    )}

                                    {renderMediaBubble(msg, isMe)}

                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className={`text-[10px] ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                                            {msgTime}
                                        </span>
                                        {isMe && getStatusIcon({ seen: msg.seen, delivered: msg.delivered })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Real-time Typing Bubble Indicator */}
                {isTyping && (
                    <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-bl-none text-xs flex items-center gap-1.5 font-medium">
                            <span>{typingUser} is typing</span>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Instagram-Style Message Request Bottom Overlay Banner */}
            {isPendingForMe && (
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left z-30 shadow-2xl animate-in slide-in-from-bottom duration-200">
                    <div>
                        <h4 className="text-xs font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-1.5">
                            📩 Message Request from {chatTitle}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Do you want to let {chatTitle} message you? They won't know you've seen it until you accept.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleDeclineRequest}
                            className="flex-1 sm:flex-initial px-4 py-2 border border-slate-700 hover:bg-slate-800 text-rose-400 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                            <FiUserX /> Delete
                        </button>
                        <button
                            onClick={handleAcceptRequest}
                            className="flex-1 sm:flex-initial px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-1.5"
                        >
                            <FiUserCheck /> Accept Request
                        </button>
                    </div>
                </div>
            )}

            {/* Attachment Preview Modal */}
            {attachment && (
                <div className={`px-4 py-2 border-t flex items-center justify-between ${darkMode ? "bg-slate-900 border-slate-800" : "bg-indigo-50 border-indigo-100"}`}>
                    <div className="flex items-center gap-3">
                        {attachment.isPdf ? (
                            <FiFileText className="text-2xl text-rose-500" />
                        ) : attachment.preview ? (
                            <img src={attachment.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover border" />
                        ) : (
                            <FiImage className="text-2xl text-indigo-600" />
                        )}
                        <div>
                            <span className="text-xs font-semibold truncate max-w-[200px] block">{attachment.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{attachment.isPdf ? 'PDF File' : 'Image'}</span>
                        </div>
                    </div>
                    <button onClick={() => setAttachment(null)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <FiX />
                    </button>
                </div>
            )}

            {/* Voice Recording Active Bar */}
            {isRecording && (
                <div className="px-4 py-2.5 bg-rose-950/80 border-t border-rose-900/60 flex items-center justify-between text-rose-200 animate-pulse">
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                        Recording Voice Note: {formatTime(recordingTime)}
                    </div>
                    <button onClick={stopVoiceRecording} className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-semibold hover:bg-rose-700">
                        Send Voice Note
                    </button>
                </div>
            )}

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
                <div className={`absolute bottom-16 left-4 p-3 rounded-2xl shadow-2xl border z-30 grid grid-cols-8 gap-2 animate-in zoom-in-95 duration-150 ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                    {EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => insertEmoji(emoji)}
                            className="text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className={`p-3 border-t flex items-center gap-2 z-20 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <button
                    type="button"
                    disabled={isPendingForMe}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40"
                    title="Insert Emoji"
                >
                    <FiSmile className="text-xl" />
                </button>

                <label className={`p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${isPendingForMe ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                    <FiPaperclip className="text-xl" />
                    <input type="file" disabled={isPendingForMe} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc" />
                </label>

                {/* Voice Note Button */}
                <button
                    type="button"
                    disabled={isPendingForMe}
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`p-2.5 rounded-xl transition ${isRecording ? "text-rose-500 bg-rose-500/20" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"} disabled:opacity-40`}
                    title="Record Voice Note"
                >
                    <FiMic className="text-xl" />
                </button>

                <input
                    type="text"
                    disabled={isPendingForMe}
                    placeholder={isPendingForMe ? "Accept message request to reply..." : "Type a message..."}
                    value={newMsg}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl outline-none text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
                />

                <button
                    onClick={() => handleSend()}
                    disabled={isPendingForMe || (!newMsg.trim() && !attachment)}
                    className={`p-3 rounded-2xl text-white shadow-lg transition-all duration-200 ${
                        !isPendingForMe && (newMsg.trim() || attachment)
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/25 hover:scale-105 active:scale-95"
                            : "bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500"
                    }`}
                >
                    <FiSend className="text-base" />
                </button>
            </div>

            {/* Lightbox Image Preview Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-4 right-4 text-white text-2xl p-2 rounded-full bg-white/10 hover:bg-white/20">
                        <FiX />
                    </button>
                    <img src={lightboxImage} alt="Expanded Lightbox" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" />
                </div>
            )}

            {/* Audio / Video Call Simulation Modal */}
            {activeCall && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-between p-8 animate-in fade-in duration-300">
                    <div className="text-center text-white mt-8">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400">
                            {activeCall === 'video' ? 'Video Call' : 'Voice Call'} In Progress
                        </span>
                        <h3 className="text-2xl font-bold mt-4">{chatTitle}</h3>
                        <p className="text-xs text-slate-400 mt-1">{formatTime(callTimer)}</p>
                    </div>

                    <div className="relative my-auto flex flex-col items-center">
                        <div className="w-36 h-36 rounded-full border-4 border-indigo-500/50 p-1 relative animate-pulse">
                            <img
                                src={chatIcon}
                                alt={chatTitle}
                                className="w-full h-full rounded-full object-cover shadow-2xl"
                            />
                        </div>
                        {activeCall === 'video' && !isVideoOff && (
                            <div className="mt-4 w-48 h-32 bg-slate-800 rounded-2xl border border-white/20 flex items-center justify-center text-xs text-slate-400 shadow-xl">
                                📹 Camera Feed Connected
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-4 rounded-full text-xl transition ${
                                isMuted ? "bg-rose-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <FiMicOff /> : <FiMic />}
                        </button>

                        {activeCall === 'video' && (
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`p-4 rounded-full text-xl transition ${
                                    isVideoOff ? "bg-rose-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                            >
                                {isVideoOff ? <FiVideoOff /> : <FiVideo />}
                            </button>
                        )}

                        <button
                            onClick={() => setActiveCall(null)}
                            className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-2xl shadow-xl shadow-rose-600/40 transition hover:scale-110 active:scale-95"
                            title="End Call"
                        >
                            <FiPhoneOff />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


