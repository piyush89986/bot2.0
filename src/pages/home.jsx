import React from 'react'

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="flex-grow flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 gap-10">
                <div className="max-w-xl text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
                        Connect, Chat, and Share <br className="hidden sm:block" />
                        with <span className="text-indigo-600">ChatSphere</span>
                    </h2>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                        Real-time conversations, seamless communication, and a modern chat experience — built for you and your friends.
                    </p>
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                        Start Chatting
                    </button>
                </div>
                <div className="w-full md:w-auto flex justify-center">
                    <img
                        src="images/chat-image1.avif"
                        alt="Chat Illustration"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow-lg"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-indigo-600">App Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { title: "Real-Time Messaging", desc: "Experience instant chat updates powered by WebSockets.", icon: "💬" },
                            { title: "Private & Group Chats", desc: "Create private conversations or join community groups easily.", icon: "👥" },
                            { title: "Secure & Encrypted", desc: "Your messages are protected with end-to-end encryption.", icon: "🔒" },
                            { title: "Custom Emojis", desc: "Express yourself with a wide range of fun emojis and GIFs.", icon: "😊" },
                            { title: "Media Sharing", desc: "Share photos, videos, and files directly within chats.", icon: "📸" },
                            { title: "Cross-Platform", desc: "Access ChatSphere from mobile, tablet, or desktop anytime.", icon: "🌐" },
                        ].map((feature, i) => (
                            <div key={i} className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition text-left">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h4 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h4>
                                <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
