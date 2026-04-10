import { useCallback, useRef, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";

export default function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loggedUser } = useSelector((store) => store.user);
    const fileRef = useRef(null);

    const [name, setName] = useState(loggedUser?.user_name || "");
    const [bio, setBio] = useState(loggedUser?.bio || "");
    const [preview, setPreview] = useState(loggedUser?.avatar || "");

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-3 sm:p-5 border-b border-gray-200 bg-white flex-shrink-0">
                <button onClick={() => navigate("/c")} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                    <IoReturnUpBack className="text-xl text-gray-600" />
                </button>
                <h2 className="font-semibold text-base sm:text-lg">Profile</h2>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
                <div className="max-w-lg mx-auto">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <div className="relative">
                            <img
                                src={preview || "https://cdn-icons-png.flaticon.com/512/219/219983.png"}
                                alt="avatar"
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-indigo-200 object-cover"
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow hover:bg-indigo-700 transition text-xs"
                            >
                                ✏️
                            </button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <p className="mt-3 text-sm text-gray-500">Tap to change photo</p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={loggedUser?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                rows="3"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
                            />
                        </div>
                        <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
