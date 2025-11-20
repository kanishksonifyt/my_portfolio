import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [status, setStatus] = useState("IDLE"); // IDLE, LOADING, SUCCESS, ERROR
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("LOADING");

    try {
      const res = await axios.post(
        "https://about-me-update-1.onrender.com/send-email",
        formData
      );
      
      if (res.data && (res.data === "Email sent successfully" || res.status === 200)) {
        setStatus("SUCCESS");
        setResponseMsg("MESSAGE TRANSMITTED SECURELY.");
        setFormData({ name: "", email: "", mobile: "", message: "" });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      setStatus("ERROR");
      setResponseMsg("TRANSMISSION FAILED: " + (error.message || "UNKNOWN ERROR"));
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      if (status !== "LOADING") setStatus("IDLE");
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 text-white font-mono relative overflow-hidden">
      
      {/* Background Grid for Tech Feel */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="max-w-2xl w-full bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-4 flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-wider">ESTABLISH UPLINK</h2>
                <p className="text-xs text-zinc-400 mt-1">SECURE CHANNEL: ENCRYPTED</p>
            </div>
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
            </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Name Input */}
          <div className="group relative">
            <label className="text-xs text-green-500 mb-1 block uppercase tracking-widest group-focus-within:text-white transition-colors">
                // Identification
            </label>
            <input
              type="text"
              name="name"
              placeholder="ENTER CODENAME"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-black/60 transition-all placeholder:text-zinc-700"
            />
            <div className="absolute right-3 top-8 opacity-0 group-focus-within:opacity-100 transition-opacity text-green-500 text-xs animate-pulse">
                _cursor
            </div>
          </div>

          {/* Email & Mobile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
                <label className="text-xs text-green-500 mb-1 block uppercase tracking-widest">
                    // Frequency (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="USER@NETWORK.COM"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-black/60 transition-all placeholder:text-zinc-700"
                />
             </div>
             <div className="group">
                <label className="text-xs text-green-500 mb-1 block uppercase tracking-widest">
                    // Signal (Mobile)
                </label>
                <input
                  type="number"
                  name="mobile"
                  placeholder="+91 00000 00000"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-black/60 transition-all placeholder:text-zinc-700"
                />
             </div>
          </div>

          {/* Message Area */}
          <div className="group">
            <label className="text-xs text-green-500 mb-1 block uppercase tracking-widest">
                // Data Packet (Message)
            </label>
            <textarea
              name="message"
              placeholder="TYPE TRANSMISSION DATA HERE..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-black/60 transition-all placeholder:text-zinc-700 resize-none custom-scrollbar"
            ></textarea>
          </div>

          {/* Action Area & Status */}
          <div className="mt-4 flex items-center justify-between">
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "LOADING"}
                className={`
                    relative px-6 py-3 font-bold text-sm uppercase tracking-widest overflow-hidden transition-all
                    ${status === "LOADING" ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-green-400 hover:scale-[1.02] active:scale-95"}
                `}
                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }} // Cyberpunk Shape
              >
                <span className="relative z-10 flex items-center gap-2">
                    {status === "LOADING" ? (
                        <>UPLOADING <Loader2 size={16} className="animate-spin" /></>
                    ) : (
                        <>SEND DATA <Send size={16} /></>
                    )}
                </span>
              </button>

              {/* Status Message */}
              <AnimatePresence mode="wait">
                  {status === "SUCCESS" && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-400 text-xs font-mono"
                      >
                          <CheckCircle size={16} /> {responseMsg}
                      </motion.div>
                  )}
                  {status === "ERROR" && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-red-500 text-xs font-mono"
                      >
                          <AlertTriangle size={16} /> {responseMsg}
                      </motion.div>
                  )}
                  {status === "IDLE" && (
                      <div className="text-zinc-600 text-xs font-mono animate-pulse">
                          AWAITING INPUT...
                      </div>
                  )}
              </AnimatePresence>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Contact;