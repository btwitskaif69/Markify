/**
 * WAF (Web Application Firewall) Middleware
 * 
 * Protects against common web attacks:
 * - SQL Injection
 * - NoSQL Injection
 * - XSS (Cross-Site Scripting)
 * - Path Traversal
 * - Command Injection
 * - Protocol Attacks
 * - LDAP Injection
 * - XXE (XML External Entity)
 * - SSRF (Server-Side Request Forgery)
 * - HTTP Response Splitting
 * - Log Injection
 * - Null Byte Injection
 */

// Attack pattern definitions
const ATTACK_PATTERNS = {
    // SQL Injection patterns (enhanced)
    sqlInjection: [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,
        /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\/\*))/gi,
        /\w*((\%27)|(\'))union/gi,
        /exec(\s|\+)+(s|x)p\w+/gi,
        /UNION(\s+)ALL(\s+)SELECT/gi,
        /UNION(\s+)SELECT/gi,
        /INSERT(\s+)INTO/gi,
        /DELETE(\s+)FROM/gi,
        /DROP(\s+)TABLE/gi,
        /DROP(\s+)DATABASE/gi,
        /ALTER(\s+)TABLE/gi,
        /TRUNCATE(\s+)TABLE/gi,
        /SELECT(\s+).*(\s+)FROM/gi,
        /UPDATE(\s+).*(\s+)SET/gi,
        /\bOR\b\s*\d+\s*=\s*\d+/gi,
        /\bAND\b\s*\d+\s*=\s*\d+/gi,
        /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE)/gi,
        /WAITFOR(\s+)DELAY/gi,
        /BENCHMARK\s*\(/gi,
        /SLEEP\s*\(/gi,
        /LOAD_FILE\s*\(/gi,
        /INTO\s+OUTFILE/gi,
        /INTO\s+DUMPFILE/gi,
        /INFORMATION_SCHEMA/gi,
        /SYSOBJECTS/gi,
        /SYSCOLUMNS/gi,
        /xp_cmdshell/gi,
        /xp_regread/gi,
        /xp_regwrite/gi,
        /@@version/gi,
        /@@datadir/gi,
        /CHAR\s*\(\s*\d+\s*\)/gi,
        /CONCAT\s*\(/gi,
        /GROUP_CONCAT\s*\(/gi,
        /HAVING\s+\d+\s*=\s*\d+/gi,
        /ORDER\s+BY\s+\d+/gi,
    ],

    // NoSQL Injection patterns
    noSqlInjection: [
        /\$where\s*:/gi,
        /\$gt\s*:/gi,
        /\$lt\s*:/gi,
        /\$ne\s*:/gi,
        /\$in\s*:/gi,
        /\$regex\s*:/gi,
        /\$exists\s*:/gi,
        /\$or\s*:\s*\[/gi,
        /\$and\s*:\s*\[/gi,
        /\$not\s*:/gi,
        /\$nor\s*:\s*\[/gi,
        /\{\s*\$\w+\s*:/gi,
        /mapReduce/gi,
        /\$function\s*:/gi,
    ],

    // XSS patterns (enhanced)
    xss: [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /<script[^>]*>/gi,
        /javascript\s*:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>/gi,
        /<object[^>]*>/gi,
        /<embed[^>]*>/gi,
        /<svg[^>]*on\w+/gi,
        /<img[^>]*on\w+/gi,
        /<body[^>]*on\w+/gi,
        /<input[^>]*on\w+/gi,
        /<form[^>]*on\w+/gi,
        /<video[^>]*on\w+/gi,
        /<audio[^>]*on\w+/gi,
        /<marquee[^>]*on\w+/gi,
        /<details[^>]*on\w+/gi,
        /expression\s*\(/gi,
        /vbscript\s*:/gi,
        /data\s*:\s*text\/html/gi,
        /<link[^>]*href\s*=\s*["']?javascript/gi,
        /<meta[^>]*http-equiv\s*=\s*["']?refresh/gi,
        /<base[^>]*href/gi,
        /\beval\s*\(/gi,
        /\bFunction\s*\(/gi,
        /\bsetTimeout\s*\(\s*["']/gi,
        /\bsetInterval\s*\(\s*["']/gi,
        /document\s*\.\s*cookie/gi,
        /document\s*\.\s*write/gi,
        /window\s*\.\s*location/gi,
        /\.innerHTML\s*=/gi,
        /\.outerHTML\s*=/gi,
        /fromCharCode/gi,
        /String\.fromCharCode/gi,
    ],

    // Path Traversal patterns (enhanced)
    pathTraversal: [
        /\.\.\//g,
        /\.\.\\/g,
        /\.\.%2f/gi,
        /\.\.%5c/gi,
        /%2e%2e%2f/gi,
        /%2e%2e%5c/gi,
        /%2e%2e\//gi,
        /%2e%2e\\/gi,
        /\.\.%252f/gi,
        /\.\.%255c/gi,
        /\/etc\/passwd/gi,
        /\/etc\/shadow/gi,
        /\/etc\/hosts/gi,
        /\/proc\/self/gi,
        /\/proc\/version/gi,
        /\/var\/log/gi,
        /c:\\windows/gi,
        /c:\/windows/gi,
        /c:\\boot\.ini/gi,
        /c:\\inetpub/gi,
        /win\.ini/gi,
        /boot\.ini/gi,
        /web\.config/gi,
        /.htaccess/gi,
        /.htpasswd/gi,
        /\.env$/gi,
        /\.git\//gi,
        /\.svn\//gi,
    ],

    // Command Injection patterns (enhanced)
    commandInjection: [
        /;\s*(?:ls|cat|rm|wget|curl|bash|sh|nc|netcat|python|perl|php|ruby|node|npm)/gi,
        /\|\s*(?:ls|cat|rm|wget|curl|bash|sh|nc|netcat|python|perl|php|ruby|node|npm)/gi,
        /`[^`]*`/g,
        /\$\([^)]*\)/g,
        /\$\{[^}]*\}/g,
        />\s*\/dev\/null/gi,
        /2>&1/g,
        /&&\s*(?:ls|cat|rm|wget|curl|bash|sh|nc|netcat|python|perl|php|ruby)/gi,
        /\n\s*(?:ls|cat|rm|wget|curl|bash|sh|nc|netcat|python|perl|php|ruby)/gi,
        /;\s*(?:whoami|id|uname|pwd|hostname|ifconfig|ipconfig)/gi,
        /\|\s*(?:whoami|id|uname|pwd|hostname|ifconfig|ipconfig)/gi,
        /;\s*(?:echo|print|printf)\s+/gi,
        /;\s*(?:chmod|chown|chgrp)\s+/gi,
        /;\s*(?:kill|pkill|killall)\s+/gi,
        /;\s*(?:dd|format|fdisk|mkfs)\s+/gi,
        /;\s*(?:sudo|su)\s+/gi,
        /;\s*(?:crontab|at)\s+/gi,
        /;\s*(?:mail|sendmail)\s+/gi,
    ],

    // Protocol attacks (enhanced)
    protocolAttack: [
        /file\s*:\/\//gi,
        /php\s*:\/\//gi,
        /zip\s*:\/\//gi,
        /phar\s*:\/\//gi,
        /expect\s*:\/\//gi,
        /glob\s*:\/\//gi,
        /ssh2\s*:\/\//gi,
        /rar\s*:\/\//gi,
        /ogg\s*:\/\//gi,
        /dict\s*:\/\//gi,
        /gopher\s*:\/\//gi,
        /ldap\s*:\/\//gi,
        /tftp\s*:\/\//gi,
    ],

    // LDAP Injection patterns
    ldapInjection: [
        /\(\|/g,
        /\(\&/g,
        /\)\(/g,
        /\*\)/g,
    ],

    // XXE (XML External Entity) patterns
    xxe: [
        /<!DOCTYPE[^>]*\[/gi,
        /<!ENTITY/gi,
        /SYSTEM\s*["'][^"']*["']/gi,
        /PUBLIC\s*["'][^"']*["']/gi,
        /<!ELEMENT/gi,
        /<!ATTLIST/gi,
        /<!\[CDATA\[/gi,
    ],

    // SSRF (Server-Side Request Forgery) patterns
    ssrf: [
        /127\.0\.0\.1/g,
        /0\.0\.0\.0/g,
        /\[::1\]/g,
        /169\.254\./g,
        /10\.\d{1,3}\.\d{1,3}\.\d{1,3}/g,
        /172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}/g,
        /192\.168\.\d{1,3}\.\d{1,3}/g,
        /metadata\.google\.internal/gi,
        /169\.254\.169\.254/g,
        /metadata\.aws/gi,
    ],

    // HTTP Response Splitting
    httpSplitting: [
        /%0d%0a/gi,
        /%0d/gi,
        /%0a/gi,
        /%5cr%5cn/gi,
    ],

    // Null Byte Injection
    nullByte: [
        /%00/g,
        /\\0/g,
        /\\x00/g,
    ],
};

// Routes that should be whitelisted (allow more content, e.g., blog posts with code, auth with special chars in passwords)
const WHITELISTED_ROUTES = [
    '/api/blog',
    '/api/gemini',
    '/api/users/login',
    '/api/users/initiate-signup',
    '/api/users/google-auth',
    '/api/contact',
];

// Check if route is whitelisted
const isWhitelistedRoute = (path) => {
    return WHITELISTED_ROUTES.some(route => path.startsWith(route));
};

// Check a string against attack patterns
const detectAttack = (value, patternCategory) => {
    if (typeof value !== 'string') return null;

    const patterns = ATTACK_PATTERNS[patternCategory];
    for (const pattern of patterns) {
        if (pattern.test(value)) {
            // Reset regex lastIndex for global patterns
            pattern.lastIndex = 0;
            return {
                category: patternCategory,
                pattern: pattern.toString(),
                value: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
            };
        }
    }
    return null;
};

// Recursively scan an object for attacks
const scanObject = (obj, depth = 0) => {
    if (depth > 10) return null; // Prevent infinite recursion
    if (!obj || typeof obj !== 'object') return null;

    for (const key of Object.keys(obj)) {
        const value = obj[key];

        // Check the key itself
        for (const category of Object.keys(ATTACK_PATTERNS)) {
            const attack = detectAttack(key, category);
            if (attack) return { ...attack, location: 'key' };
        }

        // Check string values
        if (typeof value === 'string') {
            for (const category of Object.keys(ATTACK_PATTERNS)) {
                const attack = detectAttack(value, category);
                if (attack) return { ...attack, location: 'value' };
            }
        }

        // Recursively check nested objects
        if (typeof value === 'object' && value !== null) {
            const nestedAttack = scanObject(value, depth + 1);
            if (nestedAttack) return nestedAttack;
        }
    }

    return null;
};

// Main WAF middleware
const wafMiddleware = (req, res, next) => {
    try {
        // Use originalUrl for whitelist check (includes the full path like /api/blog/...)
        const fullPath = req.originalUrl || req.url;

        // Skip whitelisted routes (they may contain code snippets)
        if (isWhitelistedRoute(fullPath)) {
            return next();
        }

        // Check URL path
        for (const category of Object.keys(ATTACK_PATTERNS)) {
            const attack = detectAttack(req.path, category);
            if (attack) {
                console.warn(`[WAF] Blocked ${category} attack in URL path:`, {
                    ip: req.ip,
                    method: req.method,
                    path: req.path,
                    pattern: attack.pattern,
                });
                return res.status(403).json({
                    message: 'Request blocked by security policy',
                    code: 'WAF_BLOCKED',
                });
            }
        }

        // Check URL
        const fullUrl = req.originalUrl || req.url;
        for (const category of Object.keys(ATTACK_PATTERNS)) {
            const attack = detectAttack(fullUrl, category);
            if (attack) {
                console.warn(`[WAF] Blocked ${category} attack in URL:`, {
                    ip: req.ip,
                    method: req.method,
                    url: fullUrl.substring(0, 200),
                    pattern: attack.pattern,
                });
                return res.status(403).json({
                    message: 'Request blocked by security policy',
                    code: 'WAF_BLOCKED',
                });
            }
        }

        // Check query parameters
        if (req.query && Object.keys(req.query).length > 0) {
            const queryAttack = scanObject(req.query);
            if (queryAttack) {
                console.warn(`[WAF] Blocked ${queryAttack.category} attack in query params:`, {
                    ip: req.ip,
                    method: req.method,
                    path: req.path,
                    pattern: queryAttack.pattern,
                });
                return res.status(403).json({
                    message: 'Request blocked by security policy',
                    code: 'WAF_BLOCKED',
                });
            }
        }

        // Check request body
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyAttack = scanObject(req.body);
            if (bodyAttack) {
                console.warn(`[WAF] Blocked ${bodyAttack.category} attack in request body:`, {
                    ip: req.ip,
                    method: req.method,
                    path: req.path,
                    pattern: bodyAttack.pattern,
                });
                return res.status(403).json({
                    message: 'Request blocked by security policy',
                    code: 'WAF_BLOCKED',
                });
            }
        }

        // Check headers (limited set to avoid false positives)
        const sensitiveHeaders = ['referer', 'user-agent', 'x-forwarded-for'];
        for (const header of sensitiveHeaders) {
            if (req.headers[header]) {
                for (const category of ['sqlInjection', 'xss', 'commandInjection']) {
                    const attack = detectAttack(req.headers[header], category);
                    if (attack) {
                        console.warn(`[WAF] Blocked ${category} attack in header '${header}':`, {
                            ip: req.ip,
                            method: req.method,
                            path: req.path,
                            pattern: attack.pattern,
                        });
                        return res.status(403).json({
                            message: 'Request blocked by security policy',
                            code: 'WAF_BLOCKED',
                        });
                    }
                }
            }
        }

        // All checks passed
        next();
    } catch (error) {
        // Fail open - don't block requests if WAF has an error
        console.error('[WAF] Error in middleware:', error);
        next();
    }
};

module.exports = wafMiddleware;
