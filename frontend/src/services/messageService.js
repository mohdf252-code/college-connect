import api from "./api";

export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const getConversations = () => api.get("/messages/conversations");
export const sendMessage = (receiver, text) =>
  api.post("/messages/send", {
    receiver,
    text,
  });

export const getCommunityMessages = () => api.get("/messages/community");
export const sendCommunityMessage = (text) =>
  api.post("/messages/community", {
    text,
  });
