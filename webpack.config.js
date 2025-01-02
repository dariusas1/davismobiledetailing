/* eslint-disable import/no-anonymous-default-export */
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment ? 'development' : 'none',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      fallback: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        path: 'path-browserify',
        timers: 'timers-browserify',
        zlib: 'browserify-zlib',
        http: 'stream-http',
        fs: false,
        net: false
      }
    },
    plugins: [
      new NodePolyfillPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  };
}
