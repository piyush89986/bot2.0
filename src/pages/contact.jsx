import React from "react";

function Contact() {
    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    📞 Contact Us
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">Get in Touch with ChatSphere</h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                    Have questions, feedback, or support requests? Drop us a message below!
                </p>
            </div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Send Us a Message</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Your Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Message</label>
                        <textarea rows="4" placeholder="How can we help you?" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/20 resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-xs hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-500/25">
                        Send Message
                    </button>
                </form>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                    { icon: "📧", title: "Email Us", detail: "piyushsinghtomar777@gmail.com" },
                    { icon: "📞", title: "Call Us", detail: "+91 78048-*****" },
                    { icon: "📍", title: "Location", detail: "India" },
                ].map((item, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                        <span className="text-3xl block">{item.icon}</span>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-slate-400 text-xs">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Contact;
