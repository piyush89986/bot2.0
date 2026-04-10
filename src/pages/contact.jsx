import React from "react";

function Contact() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-300 to-white py-14 sm:py-20 text-center px-4 animate-fadeIn">
                <h2 className="text-3xl sm:text-4xl text-indigo-700 font-bold mb-4">Get in Touch with ChatSphere</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                    Have any questions or feedback? We'd love to hear from you!
                    Let's connect and make communication simpler together.
                </p>
            </section>

            {/* Contact Form + Image */}
            <section className="flex-grow py-12 sm:py-16 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md animate-slideUp">
                        <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-5">Send Us a Message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" placeholder="Enter your name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" placeholder="Enter your email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea rows="5" placeholder="Write your message..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"></textarea>
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-indigo-700 hover:scale-105 transform transition-all duration-300 text-sm sm:text-base">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="flex justify-center animate-slideLeft order-first md:order-last">
                        <img src="images/chat-image2.avif" alt="Contact illustration" className="rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="bg-indigo-50 py-12 sm:py-16 text-center px-4 animate-fadeInSlow">
                <h3 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-8 sm:mb-10">Reach Us Directly</h3>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8 text-gray-700">
                    {[
                        { icon: "📧", title: "Email Us", detail: "support@chatsphere.com" },
                        { icon: "📞", title: "Call Us", detail: "+91 98765 43210" },
                        { icon: "📍", title: "Visit Us", detail: "Pune, Maharashtra, India" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-5 sm:p-6 rounded-xl shadow-md w-full max-w-[240px] hover:shadow-lg hover:scale-105 transform transition duration-300">
                            <span className="text-3xl">{item.icon}</span>
                            <p className="mt-3 font-semibold text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInSlow { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                @keyframes slideUp { 0% { opacity: 0; transform: translateY(50px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes slideLeft { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
                .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
                .animate-fadeInSlow { animation: fadeInSlow 1.5s ease-out forwards; }
                .animate-slideUp { animation: slideUp 1s ease-out forwards; }
                .animate-slideLeft { animation: slideLeft 1s ease-out forwards; }
            `}</style>
        </>
    );
}

export default Contact;
