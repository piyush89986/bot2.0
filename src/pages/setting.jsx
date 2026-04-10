import { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function UserSettings() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");
    const [notifications, setNotifications] = useState({ messages: true, mentions: true, sounds: false });
    const [privacy, setPrivacy] = useState({ showStatus: true, readReceipts: true, lastSeen: "Everyone" });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-3 sm:p-5 border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
                <button onClick={() => navigate("/c")} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                    <IoReturnUpBack className="text-xl text-gray-600" />
                </button>
                <h2 className="font-semibold text-base sm:text-lg">Settings</h2>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
                <div className="max-w-lg mx-auto bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-7">

                    {/* Notifications */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Notifications</h3>
                        <div className="space-y-3">
                            {Object.keys(notifications).map((key) => (
                                <div key={key} className="flex justify-between items-center py-1">
                                    <span className="capitalize text-sm text-gray-700">{key}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications[key]}
                                            onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Privacy */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Privacy</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Show online status", key: "showStatus" },
                                { label: "Read receipts", key: "readReceipts" },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex justify-between items-center py-1">
                                    <span className="text-sm text-gray-700">{label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={privacy[key]}
                                            onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                                    </label>
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1.5">Last seen</label>
                                <select
                                    value={privacy.lastSeen}
                                    onChange={(e) => setPrivacy({ ...privacy, lastSeen: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                >
                                    <option>Everyone</option>
                                    <option>My contacts</option>
                                    <option>Nobody</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Appearance */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Appearance</h3>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1.5">Theme</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Danger Zone */}
                    <section>
                        <h3 className="text-base font-semibold text-red-500 mb-3">Danger Zone</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-700 font-medium">Delete account</p>
                                <p className="text-xs text-gray-400">This action cannot be undone</p>
                            </div>
                            <button className="px-3 py-1.5 cursor-pointer rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 transition">
                                Delete
                            </button>
                        </div>
                    </section>

                    <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
