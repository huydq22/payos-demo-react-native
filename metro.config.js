// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Cấu hình để hỗ trợ kết nối với máy ảo
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db'];

// Cấu hình network cho localhost
config.server = {
  ...config.server,
  port: 3000,
  host: 'localhost',
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Cho phép CORS cho localhost
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
