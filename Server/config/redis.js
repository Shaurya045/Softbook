import Redis from "ioredis";
import { config } from "dotenv";
config();

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Handle Redis connection events
redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redis.on("close", () => {
  console.log("🔌 Redis connection closed");
});

// OTP helper functions
export const otpService = {
  // Store OTP with 10 minutes TTL
  async setOTP(studentId, otp) {
    try {
      const key = `otp:${studentId}`;
      await redis.setex(key, 600, otp); // 600 seconds = 10 minutes
      return { success: true };
    } catch (error) {
      console.error("Error storing OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Get OTP
  async getOTP(studentId) {
    try {
      const key = `otp:${studentId}`;
      const otp = await redis.get(key);
      return { success: true, otp };
    } catch (error) {
      console.error("Error getting OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Verify and delete OTP
  async verifyAndDeleteOTP(studentId, inputOTP) {
    try {
      const key = `otp:${studentId}`;
      const storedOTP = await redis.get(key);

      if (!storedOTP) {
        return { success: false, message: "OTP not found or expired" };
      }

      if (storedOTP !== inputOTP) {
        return { success: false, message: "Invalid OTP" };
      }

      // Delete OTP after successful verification
      await redis.del(key);
      return { success: true, message: "OTP verified successfully" };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete OTP (for cleanup)
  async deleteOTP(studentId) {
    try {
      const key = `otp:${studentId}`;
      await redis.del(key);
      return { success: true };
    } catch (error) {
      console.error("Error deleting OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Check if OTP exists
  async hasOTP(studentId) {
    try {
      const key = `otp:${studentId}`;
      const exists = await redis.exists(key);
      return { success: true, exists: exists === 1 };
    } catch (error) {
      console.error("Error checking OTP:", error);
      return { success: false, error: error.message };
    }
  },
};

export default redis;
