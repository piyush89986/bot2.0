import { useCallback, useState, useEffect } from 'react';
import { FiSearch, FiUsers, FiUserPlus, FiCheck } from 'react-icons/fi';
import { IoReturnUpBack } from 'react-icons/io5';
import { useNavigate, useOutletContext } from 'react-router';
import apiRequestHandler from '../webservices/getway';
import endpointUrls from '../webservices/endpointUrls';
import { toast } from 'react-toastify';
import { getChatAccess, createGroupChatApi } from '../webservices/chatApi/apis';

export default function NewChatPage() {
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const darkMode = outletContext?.darkMode ?? true;

    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Group Chat State
    const [groupName, setGroupName] = useState("");
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [creatingGroup, setCreatingGroup] = useState(false);

    const performSearch = useCallback(async (query) => {
        if (!query || query.trim() === "") {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            let response = await apiRequestHandler("GET", endpointUrls.SEARCH_USERS, {}, { q: query.trim() });
            if (response.success) {
                setSearchResults(response.data || []);
            } else {
                toast.error(response.message || "User search failed");
            }
        } catch (error) {
            toast.error(error.message || "Search error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    const getReciver = useCallback(async (id) => {
        try {
            let response = await getChatAccess(id);
            if (response.success && response.data) {
                const partner = response.data.reciver || response.data;
                let state = {
                    name: response.data.isGroupChat ? response.data.groupName : (partner.user_name || "User"),
                    icon: response.data.isGroupChat 
                        ? (response.data.groupIcon || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(response.data.groupName || 'group')}`)
                        : (partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partner.user_name || 'user')}`),
                };
                navigate(`/c/chat/${response.data._id}`, { state });
            } else {
                toast.error(response.message || "Could not open chat");
            }
        } catch (error) {
            toast.error(error.message || "Server error accessing chat");
        }
    }, [navigate]);

    const handleToggleMember = (userId) => {
        if (selectedMemberIds.includes(userId)) {
            setSelectedMemberIds(selectedMemberIds.filter((id) => id !== userId));
        } else {
            setSelectedMemberIds([...selectedMemberIds, userId]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        if (selectedMemberIds.length === 0) {
            toast.error("Please select at least 1 member for the group");
            return;
        }

        setCreatingGroup(true);
        try {
            let response = await createGroupChatApi({
                groupName: groupName.trim(),
                members: selectedMemberIds
            });

            if (response.success && response.data) {
                toast.success("Group created successfully!");
                setOpenGroupModal(false);
                setGroupName("");
                setSelectedMemberIds([]);

                let state = {
                    name: response.data.groupName,
                    icon: response.data.groupIcon || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(response.data.groupName)}`,
                };
                navigate(`/c/chat/${response.data._id}`, { state });
            } else {
                toast.error(response.message || "Failed to create group");
            }
        } catch (error) {
            toast.error(error.message || "Error creating group");
        } finally {
            setCreatingGroup(false);
        }
    };

    return (
        <div className={`flex flex-col h-full ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0 shadow-sm ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/c")}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        <IoReturnUpBack className="text-xl" />
                    </button>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">New Conversation</h2>
                        <p className="text-[11px] text-slate-400">Search users or create a group chat</p>
                    </div>
                </div>
                <button
                    onClick={() => setOpenGroupModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition"
                >
                    <FiUsers className="text-sm" /> Create Group
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
                {/* Search Bar */}
                <div className={`p-3 border rounded-2xl flex items-center shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                    <FiSearch className="text-lg text-slate-400 mr-3 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full outline-none bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    />
                    {loading && <span className="text-xs text-indigo-500 font-medium animate-pulse">Searching...</span>}
                </div>

                {/* User Results Grid */}
                {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {searchResults.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => getReciver(user._id)}
                                className={`flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01] shadow-sm ${
                                    darkMode 
                                        ? "bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80" 
                                        : "bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40"
                                }`}
                            >
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.user_name)}`}
                                    alt={user.user_name}
                                    className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-500/30 flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">{user.user_name}</h4>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email || user.phone}</p>
                                </div>
                                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                    <FiUserPlus className="text-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-2xl text-slate-400">
                            <FiSearch />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {searchQuery ? "No matching users found" : "Find anyone on ChatSphere"}
                            </h3>
                            <p className="text-xs text-slate-400 max-w-xs mt-1">
                                {searchQuery ? "Try searching with a different name or email" : "Type a name, email address, or mobile number above to start a direct message."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {openGroupModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-150">
                    <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
                        darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold flex items-center gap-2">
                                <FiUsers className="text-indigo-500" /> Create New Group
                            </h3>
                            <button onClick={() => setOpenGroupModal(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Project Innovators"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Select Members</label>
                                {searchResults.length === 0 ? (
                                    <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
                                        💡 Tip: Search users in the main page first, then open this modal to add them to your group!
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {searchResults.map((user) => {
                                            const isSelected = selectedMemberIds.includes(user._id);
                                            return (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleToggleMember(user._id)}
                                                    className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition ${
                                                        isSelected
                                                            ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500"
                                                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                        <span className="text-xs font-semibold truncate">{user.user_name}</span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs transition ${
                                                        isSelected ? "bg-indigo-600 text-white" : "border border-slate-300 dark:border-slate-600"
                                                    }`}>
                                                        {isSelected && <FiCheck />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setOpenGroupModal(false)}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                disabled={creatingGroup}
                                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
                            >
                                {creatingGroup ? "Creating..." : "Create Group"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

