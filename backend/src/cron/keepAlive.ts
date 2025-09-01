import cron from 'node-cron';
import axios from 'axios';

// Get the server URL from environment or use default
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || 'http://localhost:5000';

/**
 * Keep-alive function that pings the server to prevent it from sleeping
 */
const keepServerAlive = async () => {
  try {
    console.log(`🏃 Keep-alive ping started at ${new Date().toISOString()}`);
    
    // Make a simple GET request to our health endpoint
    const response = await axios.get(`${SERVER_URL}/api/health`, {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'User-Agent': 'KeepAlive-Cron-Job'
      }
    });
    
    if (response.status === 200) {
      console.log(`✅ Keep-alive ping successful - Server is active`);
    } else {
      console.log(`⚠️ Keep-alive ping returned status: ${response.status}`);
    }
  } catch (error: any) {
    // Don't crash the server if ping fails
    console.error(`❌ Keep-alive ping failed:`, error.message);
  }
};

/**
 * Start the keep-alive cron job
 * Runs every 14 minutes to prevent Render free tier from sleeping (sleeps after 15 min)
 */
export const startKeepAliveCron = () => {
  // Only run keep-alive in production environment on Render
  if (process.env.NODE_ENV === 'production' && process.env.RENDER) {
    console.log('🚀 Starting keep-alive cron job for Render deployment...');
    
    // Run every 14 minutes: '0 */14 * * * *'
    // Run every 5 minutes for more frequent pings: '0 */5 * * * *'
    cron.schedule('0 */5 * * * *', async () => {
      await keepServerAlive();
    }, {
      scheduled: true,
      timezone: "UTC"
    });
    
    console.log('⏰ Keep-alive cron job scheduled to run every 5 minutes');
    
    // Initial ping after 30 seconds to ensure server is responding
    setTimeout(async () => {
      await keepServerAlive();
    }, 30000);
    
  } else {
    console.log('🔧 Keep-alive cron job disabled (not running on Render production)');
  }
};

/**
 * Manual keep-alive function for testing
 */
export const manualKeepAlive = async () => {
  console.log('🧪 Manual keep-alive test triggered');
  await keepServerAlive();
};
