import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../store/rootReducer';
import App from '../App';

// Server-side rendering utility
class ServerSideRenderer {
    // Create initial state
    static createInitialState(req) {
        return {
            auth: {
                user: null,
                isAuthenticated: false
            },
            // Add other initial state based on request
            location: req.url
        };
    }

    // Create server-side store
    static createServerStore(initialState) {
        return createStore(rootReducer, initialState);
    }

    // Render to string for server-side rendering
    static renderApp(req, store) {
        const context = {};
        const html = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </Provider>
        );

        // Check for redirects
        if (context.url) {
            return {
                redirectUrl: context.url,
                html: null
            };
        }

        return {
            html,
            state: store.getState()
        };
    }

    // Generate HTML template
    static generateHtmlTemplate(html, preloadedState) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Precision Detailing</title>
                <link rel="stylesheet" href="/static/css/main.css" />
                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                </script>
            </head>
            <body>
                <div id="root">${html}</div>
                <script src="/static/js/main.js"></script>
            </body>
            </html>
        `;
    }

    // Performance optimization middleware
    static performanceMiddleware(req, res, next) {
        // Add performance headers
        res.set({
            'Cache-Control': 'public, max-age=3600', // 1-hour cache
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        });

        // Compression
        if (req.acceptsCompression('gzip')) {
            res.set('Content-Encoding', 'gzip');
        }

        next();
    }

    // Critical rendering path optimization
    static criticalRenderingOptimization(html) {
        // Extract critical CSS
        const criticalCSS = this.extractCriticalCSS(html);

        // Inline critical CSS
        return html.replace('</head>', `
            <style>${criticalCSS}</style>
            </head>
        `);
    }

    // Extract critical CSS (simplified example)
    static extractCriticalCSS(html) {
        // In a real implementation, use a library like 'critical'
        return `
            body { font-family: Arial, sans-serif; }
            .critical-content { visibility: visible; }
        `;
    }
}

export default ServerSideRenderer;
