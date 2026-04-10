import { useCallback, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { IoReturnUpBack } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { debounce } from '../utils/debounce';
import apiRequestHandler from '../webservices/getway';
import endpointUrls from '../webservices/endpointUrls';
import { toast } from 'react-toastify';
import { getChatAccess } from '../webservices/chatApi/apis';

export default function NewChatPage() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const searchUser = useCallback(async (query) => {
        if (!query) return setSearchResults([]);
        try {
            let response = await apiRequestHandler("get", endpointUrls.SEARCH_USERS, {}, { q: query });
            if (response.success) {
                setSearchResults(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    let debounceSearch = debounce(searchUser, 500);

    const getReciver = useCallback(async (id) => {
        try {
            let response = await getChatAccess(id);
            if (response.success) {
                let state = {
                    name: response.data.isGroupChat ? response.data.groupName : response.data.user_name,
                    icon: response.data.isGroupChat ? response.data.groupIcon : response.data.avatar,
                };
                navigate(`/c/chat/${response.data._id}`, { state });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message || "Server Error");
        }
    }, [navigate]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/c")} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                        <IoReturnUpBack className="text-xl text-gray-600" />
                    </button>
                    <h2 className="text-base sm:text-xl font-semibold">New Chats</h2>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    + Create Group
                </button>
            </div>

            <div className="flex-1 p-3 sm:p-4 bg-gray-50 overflow-y-auto">
                {/* Search bar */}
                <div className="mb-3 px-3 py-2.5 border border-gray-200 rounded-xl flex items-center bg-white shadow-sm">
                    <FiSearch className="text-lg mr-2 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full outline-none bg-transparent text-sm"
                        onChange={(e) => debounceSearch(e.target.value)}
                    />
                </div>

                {/* User List */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.map((item) => (
                        <li key={item._id}>
                            <div
                                onClick={() => getReciver(item._id)}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition shadow-sm"
                            >
                                <div className="w-9 h-9 bg-indigo-500 text-white rounded-full flex items-center justify-center capitalize font-medium flex-shrink-0">
                                    {(item.user_name)[0]}
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate">{item.user_name}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {searchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-16 text-gray-400 gap-2">
                        <FiSearch className="text-4xl" />
                        <p className="text-sm">Search for users to start a chat</p>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl">
                        <h3 className="text-lg font-semibold mb-4">Create Group</h3>
                        <input type="text" placeholder="Group Name" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                        <p className="text-sm text-gray-500 mb-3">Select Members</p>
                        <ul className="space-y-2 mb-5 max-h-48 overflow-y-auto">
                            {["Rahul Sharma", "Priya Verma", "Amit Patel"].map((name) => (
                                <li key={name}>
                                    <label className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                                        <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                                        {name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
