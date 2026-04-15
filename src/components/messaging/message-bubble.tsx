"use client";

import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  timestamp: string;
  senderName?: string;
  isRead?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  timestamp,
  senderName,
  isRead = false,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-3xl transition-all duration-200 ${
          isOwn
            ? "bg-[#F0917B] text-white rounded-br-none shadow-sm"
            : "bg-gray-100 text-[#4A6670] rounded-bl-none shadow-sm"
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold opacity-70 mb-1">{senderName}</p>
        )}
        <p className="text-sm break-words leading-normal">{message}</p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-xs ${
              isOwn ? "text-white/70" : "text-gray-500"
            }`}
          >
            {formatTime(timestamp)}
          </p>
          {isOwn && (
            <div className="flex items-center">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-white/80" strokeWidth={3} />
              ) : (
                <Check className="w-3.5 h-3.5 text-white/60" strokeWidth={3} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
