import { describe, it, expect } from "vitest";
import {
  formatTimeAgo,
  groupNotificationsByDate,
  notificationIcons,
} from "@/lib/notifications";

describe("formatTimeAgo", () => {
  it("renvoie 'à l'instant' pour < 1 min", () => {
    const now = new Date();
    expect(formatTimeAgo(now)).toBe("à l'instant");
  });

  it("renvoie un format en minutes pour < 1 h", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60_000);
    expect(formatTimeAgo(tenMinAgo)).toBe("il y a 10m");
  });

  it("renvoie un format en heures pour < 24 h", () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 3_600_000);
    expect(formatTimeAgo(fiveHoursAgo)).toBe("il y a 5h");
  });

  it("renvoie un format en jours pour < 7 jours", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
    expect(formatTimeAgo(threeDaysAgo)).toBe("il y a 3j");
  });
});

describe("groupNotificationsByDate", () => {
  it("groupe les notifications par jour", () => {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    const lastMonth = new Date(Date.now() - 60 * 86_400_000).toISOString();

    const groups = groupNotificationsByDate([
      { created_at: today },
      { created_at: yesterday },
      { created_at: lastMonth },
    ]);

    expect(groups["Aujourd'hui"]?.length).toBe(1);
    expect(groups["Hier"]?.length).toBe(1);
    expect(groups["Plus ancien"]?.length).toBe(1);
  });
});

describe("notificationIcons", () => {
  it("définit un emoji pour chaque type connu", () => {
    expect(notificationIcons.new_message).toBe("💬");
    expect(notificationIcons.new_booking).toBe("📅");
    expect(notificationIcons.booking_confirmed).toBe("✅");
    expect(notificationIcons.booking_cancelled).toBe("❌");
    expect(notificationIcons.new_review).toBe("⭐");
    expect(notificationIcons.system).toBe("ℹ️");
  });
});
