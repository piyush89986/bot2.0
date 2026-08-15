import { useCallback, useRef, useState, useEffect } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { FiCamera, FiCheck, FiUser, FiMail, FiPhone, FiInfo, FiMapPin } from "react-icons/fi";
import { useNavigate, useOutletContext } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, uploadProfile, getProfile } from "../webservices/auth/api";
import { toast } from "react-toastify";

export default function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const outletContext = useOutletContext();
    const darkMode = outletContext?.darkMode ?? true;

    const { loggedUser } = useSelector((store) => store.user);
    const fileRef = useRef(null);

    const [name, setName] = useState(loggedUser?.user_name || "");
    const [bio, setBio] = useState(loggedUser?.bio || "");
    const [address, setAddress] = useState(loggedUser?.address || "");
    const [gender, setGender] = useState(loggedUser?.gender || "other");
    const [preview, setPreview] = useState(loggedUser?.avatar || "");
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (loggedUser) {
            setName(loggedUser.user_name || "");
            setBio(loggedUser.bio || "");
            setAddress(loggedUser.address || "");
            setGender(loggedUser.gender || "other");
            setPreview(loggedUser.avatar || "");
        }
    }, [loggedUser]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setUploadingAvatar(true);
        try {
            const res = await uploadProfile(formData);
            if (res.success && res.data) {
                setPreview(res.data.avatar);
                dispatch({ type: "userSlice/SET_USER", payload: res.data });
                toast.success("Profile picture updated!");
            } else {
                toast.error(res.message || "Failed to upload picture");
            }
        } catch (err) {
            toast.error(err.message || "Error uploading picture");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            toast.error("Full name cannot be empty");
            return;
        }

        setSaving(true);
        try {
            const res = await updateUser({
                user_name: name.trim(),
                email: loggedUser?.email,
                bio: bio.trim(),
                address: address.trim(),
                gender
            });

            if (res.success && res.data) {
                dispatch({ type: "userSlice/SET_USER", payload: res.data });
                toast.success("Profile details saved!");
            } else {
                toast.error(res.message || "Failed to save profile");
            }
        } catch (err) {
            toast.error(err.message || "Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`flex flex-col h-full ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
            {/* Header */}
            <div className={`flex items-center gap-3 px-4 py-3.5 border-b shadow-sm ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
                <button
                    onClick={() => navigate("/c")}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <IoReturnUpBack className="text-xl" />
                </button>
                <div>
                    <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">My Profile</h2>
                    <p className="text-[11px] text-slate-400">Manage your personal info and avatar</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-lg mx-auto space-y-6">
                    {/* Avatar Header Card */}
                    <div className={`p-6 rounded-3xl border shadow-sm flex flex-col items-center text-center relative overflow-hidden ${
                        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                    }`}>
                        <div className="relative group">
                            <img
                                src={preview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`}
                                alt="avatar"
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-xl transition group-hover:opacity-90"
                            />
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition"
                                title="Change Profile Picture"
                            >
                                <FiCamera className="text-sm" />
                            </button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        
                        <h3 className="text-lg font-bold mt-4 text-slate-900 dark:text-slate-100">{loggedUser?.user_name || "User"}</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{loggedUser?.email}</p>
                        {uploadingAvatar && <p className="text-xs text-indigo-500 font-semibold animate-pulse mt-2">Uploading avatar...</p>}
                    </div>

                    {/* Profile Edit Form */}
                    <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                    }`}>
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FiUser className="text-indigo-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>

                        {/* Email (Disabled) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FiMail className="text-indigo-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={loggedUser?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Phone (Disabled) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FiPhone className="text-indigo-500" /> Mobile Phone
                            </label>
                            <input
                                type="text"
                                value={loggedUser?.phone || "N/A"}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FiInfo className="text-indigo-500" /> Bio / Status
                            </label>
                            <textarea
                                rows="3"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <FiMapPin className="text-indigo-500" /> Address / Location
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="City, Country"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <FiCheck className="text-sm" /> {saving ? "Saving Changes..." : "Save Profile Details"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

