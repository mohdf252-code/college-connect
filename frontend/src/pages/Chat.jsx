import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket";

import {
  getMessages,
  sendMessage,
  getCommunityMessages,
  sendCommunityMessage,
} from "../services/messageService";

import { getUserById } from "../services/userService";

function Chat() {
  const { id } = useParams();
  const isCommunity = id === "community";

  const me = JSON.parse(localStorage.getItem("user")) || {};
  const myId = me._id || me.id;

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const [receiver, setReceiver] = useState(null);
  const [online, setOnline] = useState(false);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      if (isCommunity) {
        const res = await getCommunityMessages();
        setMessages(res.data);
      } else {
        const res = await getMessages(id);
        setMessages(res.data);
      }
    } catch {
      toast.error("Could not load messages");
    }
  }, [id, isCommunity]);

  // Load receiver
  const loadReceiver = useCallback(async () => {
    if (isCommunity) {
      setReceiver({ name: "Campus Doubts & Chitchat Lounge" });
      setOnline(true);
      return;
    }

    try {
      const res = await getUserById(id);
      setReceiver(res.data);
      setOnline(res.data.isOnline);
    } catch {
      toast.error("Could not load this student");
    }
  }, [id, isCommunity]);

  // Load receiver + messages and attach socket listeners
  useEffect(() => {
    loadMessages();
    loadReceiver();

    if (isCommunity) {
      const handleCommunityMsg = (message) => {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      };

      socket.on("receiveCommunityMessage", handleCommunityMsg);

      return () => {
        socket.off("receiveCommunityMessage", handleCommunityMsg);
      };
    } else {
      const handleMsg = (message) => {
        if (message.sender === id) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleOnline = (userId) => {
        if (userId === id) setOnline(true);
      };

      const handleOffline = (userId) => {
        if (userId === id) setOnline(false);
      };

      const handleTyping = (data) => {
        if (data.sender === id) setTyping(true);
      };

      const handleStopTyping = (data) => {
        if (data.sender === id) setTyping(false);
      };

      socket.on("receiveMessage", handleMsg);
      socket.on("userOnline", handleOnline);
      socket.on("userOffline", handleOffline);
      socket.on("userTyping", handleTyping);
      socket.on("userStoppedTyping", handleStopTyping);

      return () => {
        socket.off("receiveMessage", handleMsg);
        socket.off("userOnline", handleOnline);
        socket.off("userOffline", handleOffline);
        socket.off("userTyping", handleTyping);
        socket.off("userStoppedTyping", handleStopTyping);
        clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [id, isCommunity, loadMessages, loadReceiver]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const send = async () => {
    if (!text.trim()) return;

    try {
      if (isCommunity) {
        const res = await sendCommunityMessage(text);
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data.data._id)) return prev;
          return [...prev, res.data.data];
        });
        setText("");
      } else {
        const res = await sendMessage(id, text);
        setMessages((prev) => [...prev, res.data.data]);
        setText("");

        socket.emit("stopTyping", {
          sender: myId,
          receiver: id,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Message could not be sent");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="text-gray-400 hover:text-white text-sm">
              &larr; Back
            </Link>
            <h1 className="text-3xl font-bold text-white">
              {receiver?.name || "Loading..."}
            </h1>
          </div>

          <p className={online ? "text-green-400 mt-1 text-sm" : "text-gray-400 mt-1 text-sm"}>
            {isCommunity
              ? "🟢 Public College Room • Open to all students"
              : online
              ? "🟢 Online"
              : "⚪ Offline"}
          </p>
        </div>
      </div>

      {/* Messages Box */}
      <div className="bg-slate-900 rounded-xl h-[500px] overflow-y-auto p-5">

        {messages.map((msg) => {
          const senderId = msg.sender?._id || msg.sender;
          const isMe = senderId === myId;
          const senderName = msg.sender?.name || (isMe ? "You" : "Student");
          const senderBranch = msg.sender?.branch;

          return (
            <div
              key={msg._id}
              className={`mb-4 ${isMe ? "text-right" : "text-left"}`}
            >
              {isCommunity && !isMe && (
                <p className="text-xs text-blue-400 font-semibold mb-1 ml-1">
                  {senderName} {senderBranch ? `(${senderBranch})` : ""}
                </p>
              )}

              <div
                className={`inline-block max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                <p className="text-xs opacity-70 mt-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>

      </div>

      {/* Typing indicator */}
      {!isCommunity && typing && (
        <p className="text-gray-400 mt-3 text-sm">
          Typing...
        </p>
      )}

      {/* Input Box */}
      <div className="flex gap-3 mt-3">

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (!isCommunity) {
              socket.emit("typing", {
                sender: myId,
                receiver: id,
              });

              clearTimeout(typingTimeoutRef.current);

              typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", {
                  sender: myId,
                  receiver: id,
                });
              }, 800);
            }
          }}

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}

          placeholder={
            isCommunity
              ? "Ask a doubt or chitchat with everyone on campus..."
              : "Type a message..."
          }

          className="flex-1 p-3 rounded-lg bg-slate-800 text-white outline-none"
        />

        <button
          onClick={send}
          className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg text-white font-medium"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default Chat;
