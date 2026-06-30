<template>
  <div class="flex flex-col min-h-[calc(100vh-140px)] pt-6 pb-0">
    <div
      class="card-glass rounded-[28px] flex flex-col border border-white/80 shadow-glass overflow-hidden flex-1"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-black/5 flex-shrink-0"
      >
        <div class="flex flex-col gap-0.5">
          <h1 class="font-header font-bold text-lg text-brand-dark">
            Community Chat
          </h1>
          <p class="text-[11px] text-brand-slate font-medium">
            {{ communityName }} · {{ memberCount }} {{ memberCount === 1 ? 'member' : 'members' }}
          </p>
        </div>
      </div>

      <!-- Messages -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-6 py-4 space-y-3 scroll-smooth"
      >
        <div v-if="loading" class="flex items-center justify-center py-16">
          <span class="text-sm text-brand-slate">Loading messages…</span>
        </div>

        <template v-else-if="messages.length === 0">
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mb-4">
              <PhChats :size="28" weight="bold" class="text-primary/60" />
            </div>
            <p class="text-sm font-bold text-brand-dark mb-1">No messages yet.</p>
            <p class="text-xs text-brand-slate">Start your community conversation.</p>
          </div>
        </template>

        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg._id"
            class="flex gap-3 group"
            :class="isOwnMessage(msg) ? 'flex-row-reverse' : 'flex-row'"
          >
            <img
              :src="getAvatarUrl(msg.sender)"
              :alt="getSenderName(msg.sender)"
              class="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
            />
            <div
              class="flex flex-col max-w-[70%]"
              :class="isOwnMessage(msg) ? 'items-end' : 'items-start'"
            >
              <div
                class="flex items-center gap-2 mb-1"
                :class="isOwnMessage(msg) ? 'flex-row-reverse' : 'flex-row'"
              >
                <span class="text-[11px] font-bold text-brand-dark">
                  {{ getSenderName(msg.sender) }}
                </span>
                <RoleBadge :role="msg.sender?.role || 'member'" />
                <span class="text-[9px] text-brand-slate font-semibold">
                  {{ formatTime(msg.createdAt) }}
                </span>
                <button
                  v-if="canDelete(msg)"
                  @click="handleDelete(msg._id)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/5 cursor-pointer"
                  title="Delete message"
                >
                  <PhTrash :size="11" weight="bold" class="text-brand-slate" />
                </button>
              </div>
              <div
                class="rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-wrap break-words"
                :class="
                  isOwnMessage(msg)
                    ? 'bg-grad-primary text-white rounded-tr-md'
                    : 'bg-white/70 border border-black/5 text-brand-dark rounded-tl-md'
                "
              >
                {{ msg.message }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input -->
      <div class="flex-shrink-0 border-t border-black/5 px-6 py-4">
        <div
          class="flex items-end gap-3 bg-white/60 border border-black/8 rounded-2xl px-4 py-2.5 focus-within:border-primary/30 focus-within:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-200"
        >
          <textarea
            v-model="messageText"
            @keydown="handleKeydown"
            placeholder="Type a message..."
            rows="1"
            class="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-brand-dark placeholder:text-brand-slate/60 font-body leading-relaxed max-h-32"
            :disabled="sending"
          ></textarea>
          <button
            @click="handleSend"
            :disabled="!canSend || sending"
            class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            :class="canSend && !sending ? 'bg-grad-primary text-white shadow-[0_4px_12px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_16px_rgba(75,104,255,0.35)] active:scale-95' : 'bg-black/5 text-brand-slate'"
          >
            <PhPaperPlaneRight :size="16" weight="bold" />
          </button>
        </div>
        <p class="text-[9px] text-brand-slate/50 mt-1.5 text-center">
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import { PhTrash, PhPaperPlaneRight, PhChats } from "@phosphor-icons/vue";
import RoleBadge from "@/components/common/RoleBadge.vue";
import Toast from "@/components/ui/Toast.vue";
import { useToasts } from "@/composables/useToasts";
import {
  getChatSocket,
  sendChatMessage,
} from "@/services/chatSocket";

const { success, warning } = useToasts();

const messages = ref([]);
const messageText = ref("");
const sending = ref(false);
const loading = ref(true);
const communityName = ref("");
const memberCount = ref(0);
const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const messagesContainer = ref(null);

const canSend = computed(() => messageText.value.trim().length > 0);

const isOwnMessage = (msg) => {
  return msg.sender?._id === currentUser.value._id;
};

const getSenderName = (sender) => {
  if (!sender) return "Unknown";
  return sender.name || `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Unknown";
};

const getAvatarUrl = (sender) => {
  if (!sender) return "";
  if (sender.avatar) {
    return `http://localhost:5000/uploads/${sender.avatar}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getSenderName(sender))}&background=4B68FF&color=ffffff`;
};

const canDelete = (msg) => {
  if (!currentUser.value) return false;
  const isOwner = msg.sender?._id === currentUser.value._id;
  const isAdmin = currentUser.value.role === "admin";
  return isOwner || isAdmin;
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    const el = messagesContainer.value;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  });
};

const handleSend = async () => {
  if (!canSend.value || sending.value) return;
  const socket = getChatSocket();
  if (!socket?.connected) {
    warning("Chat connection lost. Reconnecting…");
    return;
  }
  sending.value = true;
  try {
    await sendChatMessage(messageText.value.trim());
    messageText.value = "";
    scrollToBottom();
  } catch (err) {
    warning(err.message || "Failed to send message.");
  } finally {
    sending.value = false;
  }
};

const handleKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const handleDelete = async (messageId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/community-chat/${messageId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    messages.value = messages.value.filter((m) => m._id !== messageId);
    success("Message deleted.");
  } catch (err) {
    warning(err.response?.data?.message || "Failed to delete message.");
  }
};

const fetchMessages = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      "http://localhost:5000/api/community-chat",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data.success) {
      messages.value = data.messages;
      if (data.messages.length > 0) {
        const firstMsg = data.messages[0];
        if (firstMsg.sender?.communityName) {
          communityName.value = firstMsg.sender.communityName;
        }
      }
      scrollToBottom(false);
    }
  } catch (err) {
    console.error("Failed to load messages", err);
    warning(err.response?.data?.message || err.message || "Failed to load messages.");
  } finally {
    loading.value = false;
  }
};

const fetchCommunityInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      "http://localhost:5000/api/communities/overview",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data.success) {
      communityName.value = data.community.name;
      memberCount.value = data.community.memberCount;
    }
  } catch {
    // silently fail
  }
};

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetchCommunityInfo();
  await fetchMessages();

  const socket = getChatSocket();
  if (!socket) return;

  socket.on("chat:message", (msg) => {
    messages.value.push(msg);
    scrollToBottom();
  });

  socket.on("chat:error", (err) => {
    warning(err.message);
  });
});

onUnmounted(() => {
  const socket = getChatSocket();
  if (socket) {
    socket.off("chat:message");
    socket.off("chat:error");
  }
});
</script>
