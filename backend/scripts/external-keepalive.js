#!/usr/bin/env node

/**
 * External Keep-Alive Script
 * 
 * This script can be used with external cron services like:
 * - cron-job.org
 * - EasyCron
 * - GitHub Actions (scheduled workflows)
 * 
 * Usage:
 * 1. Set your deployed Render URL in environment variable: RENDER_URL
 * 2. Run this script every 5-10 minutes to keep server alive
 */

const https = require('https');
const http = require('http');

// Your deployed Render app URL
const RENDER_URL = process.env.RENDER_URL || 'https://your-app-name.onrender.com';

/**
 * Make HTTP request to keep server alive
 */
function keepAlive() {
  const url = new URL(`${RENDER_URL}/api/health`);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'GET',
    headers: {
      'User-Agent': 'External-KeepAlive-Script',
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds
  };

  console.log(`⏰ Keep-alive ping to ${RENDER_URL} at ${new Date().toISOString()}`);

  const req = client.request(options, (res) => {
    console.log(`✅ Response status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`📊 Server uptime: ${Math.round(response.uptime / 60)} minutes`);
        console.log(`💾 Memory usage: ${response.memory?.used}MB`);
      } catch (e) {
        console.log('📝 Server responded successfully');
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Keep-alive failed: ${error.message}`);
  });

  req.on('timeout', () => {
    console.error('⏱️ Request timeout');
    req.destroy();
  });

  req.end();
}

// Execute keep-alive if this script is run directly
if (require.main === module) {
  keepAlive();
}

module.exports = { keepAlive };
