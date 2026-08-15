import { useState, useEffect } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate, useOutletContext } from "react-router";
import { useSoundEffectsWithSettings } from "../utils/useSoundEffects";
import { toast } from "react-toastify";

export default function UserSettings() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const darkMode = outletContext?.darkMode ?? true;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    sounds: true,
  });
  const [privacy, setPrivacy] = useState({
    showStatus: true,
    readReceipts: true,
    lastSeen: "Everyone",
  });

  // Sound effects hook
  const { playMessageSend, playMessageReceive, playNotification } =
    useSoundEffectsWithSettings(notifications.sounds);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setTheme(parsed.theme || "dark");
        setNotifications(
          parsed.notifications || {
            messages: true,
            mentions: true,
            sounds: true,
          },
        );
        setPrivacy(
          parsed.privacy || {
            showStatus: true,
            readReceipts: true,
            lastSeen: "Everyone",
          },
        );
      }

      applyTheme(localStorage.getItem("theme") || "dark");
    } catch (error) {
      console.error("Error loading settings:", error);
      setErrorMessage("Failed to load your settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSoundToggle = (e) => {
    const newSoundsState = e.target.checked;
    setNotifications({
      ...notifications,
      sounds: newSoundsState,
    });

    if (newSoundsState) {
      playNotification();
    }
  };

  const applyTheme = (themeName) => {
    const html = document.documentElement;
    if (themeName === "dark") {
      html.classList.add("dark");
    } else if (themeName === "light") {
      html.classList.remove("dark");
    } else if (themeName === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const settingsToSave = {
        theme,
        notifications,
        privacy,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem("userSettings", JSON.stringify(settingsToSave));
      localStorage.setItem("theme", theme);

      applyTheme(theme);

      if (notifications.sounds) {
        playNotification();
      }

      toast.success("Settings saved successfully! ✓");
      setSuccessMessage("Settings saved successfully! ✓");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
      setErrorMessage("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.clear();
      sessionStorage.clear();

      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account. Please try again.");
      setSaving(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Header */}
      <div className={`flex items-center gap-4 px-4 py-3.5 sm:p-5 border-b flex-shrink-0 shadow-md ${
        darkMode ? "bg-slate-900 border-slate-800/80" : "bg-white border-slate-200"
      }`}>
        <button
          onClick={() => navigate("/c")}
          className={`p-2 rounded-xl transition ${
            darkMode ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-600"
          }`}
          title="Go back"
        >
          <IoReturnUpBack className="text-xl" />
        </button>
        <div>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">Settings</h2>
          <p className="text-[11px] text-slate-400">Preferences, notifications and theme</p>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="max-w-lg mx-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold">
              {successMessage}
            </div>
          )}

          <div className={`rounded-2xl p-5 sm:p-6 shadow-xl space-y-7 border ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            {/* Notifications Section */}
            <section>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Message notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.messages}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          messages: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Mention notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.mentions}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          mentions: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex-1">
                    <span className="text-sm text-slate-700 dark:text-slate-300 block">
                      Sound effects
                    </span>
                    <span className="text-xs text-slate-400">
                      Play sound when sending/receiving messages
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      checked={notifications.sounds}
                      onChange={handleSoundToggle}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {notifications.sounds && (
                  <div className="mt-4 p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl">
                    <p className="text-xs text-indigo-300 font-semibold mb-2">
                      Test Sound Effects
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={playMessageSend}
                        className="px-2 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition font-medium"
                      >
                        📤 Send
                      </button>
                      <button
                        onClick={playMessageReceive}
                        className="px-2 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition font-medium"
                      >
                        📥 Receive
                      </button>
                      <button
                        onClick={playNotification}
                        className="px-2 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition font-medium"
                      >
                        🔔 Notify
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Privacy Section */}
            <section>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Privacy
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Show online status", key: "showStatus" },
                  { label: "Read receipts", key: "readReceipts" },
                ].map(({ label, key }) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy[key]}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            [key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                    Last seen visibility
                  </label>
                  <select
                    value={privacy.lastSeen}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        lastSeen: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">Everyone</option>
                    <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">My contacts</option>
                    <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">Nobody</option>
                  </select>
                </div>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Appearance Section */}
            <section>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Appearance
              </h3>
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="dark" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">Dark (Recommended)</option>
                  <option value="light" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">Light</option>
                  <option value="system" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">System</option>
                </select>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Danger Zone */}
            <section>
              <h3 className="text-base font-semibold text-rose-500 mb-3">
                Danger Zone
              </h3>
              {deleteConfirm ? (
                <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4">
                  <p className="text-xs text-rose-200 font-medium mb-4">
                    Are you sure? This action cannot be undone. Your account and
                    all data will be permanently deleted.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition disabled:opacity-50"
                    >
                      {saving ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      onClick={cancelDelete}
                      disabled={saving}
                      className="flex-1 px-3 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                      Delete account
                    </p>
                    <p className="text-xs text-slate-400">
                      This action cannot be undone
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-3 py-1.5 cursor-pointer rounded-xl border border-rose-800/80 text-rose-400 text-xs font-semibold hover:bg-rose-950/40 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </section>

            {/* Save Button */}
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
