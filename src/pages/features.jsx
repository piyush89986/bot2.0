import React from 'react'

export default function Features() {
    const features = [
        { icon: "💬", title: "Real-Time Messaging", desc: "Instantly send and receive messages with lightning-fast WebSocket technology. No refresh needed — ever." },
        { icon: "👥", title: "Group Chats", desc: "Create chat rooms and stay connected with your communities, friends, or work teams all in one place." },
        { icon: "🔒", title: "End-to-End Encryption", desc: "Your privacy matters. Messages are encrypted from sender to receiver for total security." },
        { icon: "📸", title: "Media Sharing", desc: "Send photos, videos, and documents seamlessly without compromising quality or speed." },
        { icon: "😊", title: "Custom Emojis & Reactions", desc: "Make conversations more expressive and fun with a library of custom emojis and reactions." },
        { icon: "🌓", title: "Dark & Light Themes", desc: "Switch between dark and light modes to match your style or mood anytime." },
        { icon: "🔔", title: "Smart Notifications", desc: "Get notified instantly about new messages and mentions — without being overwhelmed." },
        { icon: "🌐", title: "Cross-Platform Access", desc: "Use ChatSphere on mobile, desktop, or tablet — your chats sync instantly everywhere." },
        { icon: "⚡", title: "Optimized Performance", desc: "Built with modern tech for fast performance and smooth user experience even in large chat groups." },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="bg-indigo-50 py-14 sm:py-20 text-center px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4">Why Choose ChatSphere?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                    Designed to keep your conversations smooth, secure, and fun — ChatSphere brings people closer with every message.
                </p>
            </section>

            {/* Features Grid */}
            <section className="flex-grow py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
                            <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-indigo-600">{feature.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-indigo-600 text-white py-12 sm:py-16 text-center px-4">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Chatting?</h3>
                <p className="mb-6 text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
                    Join ChatSphere today and experience seamless, secure, and real-time messaging.
                </p>
                <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Get Started Now
                </button>
            </section>
        </>
    );
}
