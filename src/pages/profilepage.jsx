import React, { useEffect, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateUser, uploadProfile } from "../webservices/auth/api";
import { toast } from "react-toastify";

// UserProfile.jsx
// Single-file React component styled with Tailwind CSS.
// Features:
// - Update profile fields (name, username, bio, phone, location)
// - Upload and preview display picture (DP)
// - Change password section with validation
// - Responsive layout ready to drop into your chat app
// - Placeholder save handlers where you can call your API

export default function UserProfile() {

    const { loggedUser } = useSelector(store => store.user);
    const dispatch = useDispatch()

    const navigate = useNavigate();

    const [form, setForm] = useState({
        user_name: "",
        gender: "",
        email: "",
        bio: "",
        address: "",
    });

    useEffect(() => {
        if (!loggedUser) return;

        setForm({
            user_name: loggedUser.user_name,
            gender: loggedUser.gender,
            email: loggedUser.email,
            bio: loggedUser.bio,
            address: loggedUser.address,
        });

        return () => {
            setForm({
                user_name: "",
                gender: "",
                email: "",
                bio: "",
                address: "",
            });
        }
    }, [loggedUser])

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Password change
    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
    const [pwdError, setPwdError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    async function handleAvatarChange(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        // Basic client-side validation
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please upload an image file." });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", text: "Image too large. Max 5MB." });
            return;
        }

        const payload = new FormData();
        payload.append("avatar", file);

        try {
            let response = await uploadProfile(payload);
            if (response.success) {
                dispatch({ type: "userSlice/SET_USER", payload: response.data })
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error.message || "Server Error")
        }
    }

    function removeAvatar() {

    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            let response = await updateUser(form);
            if (response.success) {
                dispatch({ type: "userSlice/SET_USER", payload: response.data })
                toast.success(response.message)
                setMessage({ type: "success", text: "Profile saved successfully." });
            } else {
                setMessage({ type: "error", text: "Failed to save profile. Try again." });
                toast.error(response.message)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    function validatePassword() {
        setPwdError("");
        if (!pwd.current || !pwd.new || !pwd.confirm) {
            setPwdError("Fill all password fields.");
            return false;
        }
        if (pwd.new.length < 8) {
            setPwdError("New password must be at least 8 characters.");
            return false;
        }
        if (pwd.new !== pwd.confirm) {
            setPwdError("New password and confirmation do not match.");
            return false;
        }
        return true;
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        if (!validatePassword()) return;
        try {
            // TODO: call your change-password API
            await new Promise((r) => setTimeout(r, 600));
            setMessage({ type: "success", text: "Password updated." });
            setPwd({ current: "", new: "", confirm: "" });
            setShowPwd(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Password change failed." });
        }
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-400 bg-white">
                <div className="flex items-center gap-5">
                    <IoReturnUpBack className="text-2xl cursor-pointer" onClick={() => navigate("/c")} />
                    <div>
                        <h2 className="font-semibold">Profile</h2>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 h-screen overflow-y-auto">
                <div className="bg-white rounded-2xl p-6">
                    {message && (
                        <div
                            className={`mb-4 flex justify-between items-center p-3 rounded-md text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                                }`}
                            role="status"
                        >
                            {message.text}
                            <span className="cursor-pointer" onClick={() => setMessage(null)}>
                                <RxCross2 />
                            </span>
                        </div>
                    )}

                    {loggedUser && <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {loggedUser && loggedUser.avatar ? (
                                        <img src={loggedUser.avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">No photo</span>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <label className="cursor-pointer inline-flex items-center px-3 py-1 border rounded-md text-sm select-none">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden cursor-pointer"
                                        />
                                        Change
                                    </label>
                                    <button type="button" onClick={removeAvatar} className="cursor-pointer text-sm underline text-blue-600">
                                        Remove
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">PNG/JPG up to 5MB. Recommended 1:1 ratio.</p>
                            </div>

                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full name</label>
                                        <input
                                            name="user_name"
                                            defaultValue={form.user_name}
                                            onChange={handleChange}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                        >
                                            <option value="">-Select-</option>
                                            <option value="male">male</option>
                                            <option value="female">female</option>
                                            <option value="other">other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            name="email"
                                            defaultValue={form.email}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            name="phone"
                                            defaultValue={loggedUser.phone}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                            readOnly
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                                        <textarea
                                            name="bio"
                                            defaultValue={form.bio}
                                            onChange={handleChange}
                                            rows={3}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                            placeholder="Write something about yourself"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            name="address"
                                            defaultValue={form.address}
                                            onChange={handleChange}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-400 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Security</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((s) => !s)}
                                    className="text-sm underline cursor-pointer text-blue-500"
                                >
                                    {showPwd ? "Hide" : "Change password"}
                                </button>
                            </div>

                            {showPwd && (
                                <form onSubmit={handleChangePassword} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current password</label>
                                        <input
                                            type="password"
                                            value={pwd.current}
                                            onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">New password</label>
                                        <input
                                            type="password"
                                            value={pwd.new}
                                            onChange={(e) => setPwd((p) => ({ ...p, new: e.target.value }))}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirm new</label>
                                        <input
                                            type="password"
                                            value={pwd.confirm}
                                            onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                                            className="mt-1 px-2 py-2 block w-full rounded border border-gray-200 focus:outline-blue-500"
                                        />
                                    </div>

                                    {pwdError && <p className="text-sm text-red-600 mt-2 md:col-span-3">{pwdError}</p>}

                                    <div className="md:col-span-3 flex gap-3 mt-2">
                                        <button type="submit" className="px-4 py-2 rounded-lg cursor-pointer bg-indigo-600 text-white text-sm">
                                            Update password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPwd(false);
                                                setPwd({ current: "", new: "", confirm: "" });
                                                setPwdError("");
                                            }}
                                            className="px-4 py-2 rounded-lg border text-sm cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    // reset to initial user data
                                    setForm({
                                        user_name: loggedUser.fullName || "",
                                        gender: loggedUser.gender || "",
                                        email: loggedUser.email || "",
                                        bio: loggedUser.bio || "",
                                        address: loggedUser.address || "",
                                    });
                                    setMessage(null);
                                }}
                                className="px-4 py-2 rounded-lg border text-sm cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>}
                </div>
            </div>
        </>
    );
}
