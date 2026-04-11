import { useState, useEffect } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useSoundEffectsWithSettings } from "../utils/useSoundEffects";

export default function UserSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    sounds: false,
  });
  const [privacy, setPrivacy] = useState({
    showStatus: true,
    readReceipts: true,
    lastSeen: "Everyone",
  });

  // Sound effects hook - sounds enable/disable hotengi notifications.sounds ke based par
  const { playMessageSend, playMessageReceive, playNotification } =
    useSoundEffectsWithSettings(notifications.sounds);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setTheme(parsed.theme || "light");
        setNotifications(
          parsed.notifications || {
            messages: true,
            mentions: true,
            sounds: false,
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

      applyTheme(localStorage.getItem("theme") || "light");
    } catch (error) {
      console.error("Error loading settings:", error);
      setErrorMessage("Failed to load your settings");
    } finally {
      setLoading(false);
    }
  }, []);

  // Play test sound jab sound toggle ho
  const handleSoundToggle = (e) => {
    const newSoundsState = e.target.checked;
    setNotifications({
      ...notifications,
      sounds: newSoundsState,
    });

    // Test sound play karo jab enable karo
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const settingsToSave = {
        theme,
        notifications,
        privacy,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem("userSettings", JSON.stringify(settingsToSave));
      localStorage.setItem("theme", theme);

      // Play success notification sound
      if (notifications.sounds) {
        playNotification();
      }

      setSuccessMessage("Settings saved successfully! ✓");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 sm:p-5 border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
        <button
          onClick={() => navigate("/c")}
          className="p-1.5 rounded-full hover:bg-gray-100 transition"
          title="Go back"
        >
          <IoReturnUpBack className="text-xl text-gray-600" />
        </button>
        <h2 className="font-semibold text-base sm:text-lg">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
        <div className="max-w-lg mx-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-7">
            {/* Notifications Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">
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
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">
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
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block">
                      Sound effects
                    </span>
                    <span className="text-xs text-gray-500">
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
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                {notifications.sounds && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-2">
                      Test Sounds
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={playMessageSend}
                        className="px-2 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        📤 Send
                      </button>
                      <button
                        onClick={playMessageReceive}
                        className="px-2 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        📥 Receive
                      </button>
                      <button
                        onClick={playNotification}
                        className="px-2 py-1.5 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                      >
                        🔔 Notify
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Privacy Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
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
                    <span className="text-sm text-gray-700">{label}</span>
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
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
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

            {/* Appearance Section */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Appearance
              </h3>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
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
              <h3 className="text-base font-semibold text-red-500 mb-3">
                Danger Zone
              </h3>
              {deleteConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-4">
                    Are you sure? This action cannot be undone. Your account and
                    all data will be permanently deleted.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {saving ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      onClick={cancelDelete}
                      disabled={saving}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Delete account
                    </p>
                    <p className="text-xs text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-3 py-1.5 cursor-pointer rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 transition"
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
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
