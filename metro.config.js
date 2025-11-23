const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// Configure asset handling to prevent corruption
config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver?.assetExts || []), 'png', 'jpg', 'jpeg'],
};

config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};
 
module.exports = withNativeWind(config, { input: './assets/css/global.css' })