"use client";

interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  timestamp: string;
  senderName?: string;
}

export function MessageBubble({
  message,
  isOwn,
  timestamp,
  senderName,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-primary text-white rounded-br-none"
            : "bg-gray-100 text-neutral-text rounded-bl-none"
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold opacity-75 mb-1">{senderName}</p>
        )}
        <p className="text-sm break-words">{message}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-primary-100" : "text-gray-500"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
