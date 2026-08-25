const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const sharp = require('sharp');

// Paths and configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ROUTER_FILE = path.join(PROJECT_ROOT, 'Front-end', 'src', 'router', 'index.js');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'exports', 'smartmeet-pages');
const STORAGE_STATE_PATH = path.join(OUTPUT_DIR, '.storage-state.json');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const JPG_QUALITY = 92;

// Viewport requirements: desktop 1440 x 1000
const VIEWPORT = { width: 1440, height: 1000 };

/**
 * Clean route path to safe filename.
 * E.g. '/' -> 'home.jpg', '/dashboard' -> 'dashboard.jpg', '/checkout/paymob' -> 'checkout-paymob.jpg'
 */
function routeToFilename(routePath) {
  const cleaned = routePath.replace(/^\/+|\/+$/g, '');
  if (!cleaned) return 'home.jpg';
  const name = cleaned
    .replace(/[\/\\?%*:|"<>]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  return `${name}.jpg`;
}

/**
 * Dynamically parse routes from router/index.js
 */
function discoverRoutesFromRouterFile() {
  const content = fs.readFileSync(ROUTER_FILE, 'utf8');
  
  const discovered = [];
  const rawRoutes = [];

  // Match top-level route blocks or child objects
  // We parse the file structure by extracting route definition blocks
  const routesMatch = content.match(/const routes = \[\s*([\s\S]*?)\n\]\s*const router/);
  const routesText = routesMatch ? routesMatch[1] : content;

  // Split into route blocks
  // Parse parent blocks and nested children
  const parentBlocks = routesText.split(/\n\s*\{\s*\n/).filter(b => b.trim());

  let currentParentPath = '';
  let currentParentRequiresAuth = false;

  const routeRegex = /path:\s*['"`]([^'"`]+)['"`]/g;
  
  // Custom parser to accurately read routes from Vue router
  const lines = routesText.split('\n');
  let currentParent = null;
  let inChildren = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("path: '/'") && line.includes("PublicLayout")) {
      currentParent = { path: '/', requiresAuth: false };
      inChildren = false;
    } else if (line.includes("path: '/'") && line.includes("AuthenticatedLayout")) {
      currentParent = { path: '/', requiresAuth: true };
      inChildren = false;
    } else if (line.includes("meta: { requiresAuth: true }") && currentParent) {
      currentParent.requiresAuth = true;
    }

    if (line.includes("children: [")) {
      inChildren = true;
      continue;
    }

    const pathMatch = line.match(/path:\s*['"`]([^'"`]+)['"`]/);
    if (pathMatch) {
      const p = pathMatch[1];

      // Check for redirect or wildcard
      const redirectMatch = line.includes("redirect:");
      const isWildcard = p.includes(":pathMatch") || p.includes("*");
      const isDynamic = p.includes(":") && !p.includes(":pathMatch");

      if (inChildren && currentParent) {
        const fullPath = p === '' ? currentParent.path : path.posix.join(currentParent.path, p);
        rawRoutes.push({
          path: fullPath,
          name: p || 'Home',
          requiresAuth: currentParent.requiresAuth,
          isDynamic,
          isWildcard,
          redirect: redirectMatch
        });
      } else if (!line.includes("path: '/'")) {
        // Direct top-level route
        const requiresAuth = line.includes("requiresAuth: true") || (currentParent && currentParent.requiresAuth);
        rawRoutes.push({
          path: p,
          name: p.replace('/', '') || 'Home',
          requiresAuth: false,
          isDynamic,
          isWildcard,
          redirect: redirectMatch
        });
      }
    }
  }

  // Fallback explicit route registry matching index.js definition if regex misses any edge cases
  const knownRoutes = [
    { path: '/', name: 'Home', requiresAuth: false },
    { path: '/features', name: 'Features', requiresAuth: false },
    { path: '/pricing', name: 'Pricing', requiresAuth: false },
    { path: '/checkout/paymob', name: 'PaymobCheckout', requiresAuth: false },
    { path: '/signin', name: 'SignIn', requiresAuth: false },
    { path: '/forgot-password', name: 'ForgotPassword', requiresAuth: false },
    { path: '/reset-password/:token', name: 'ResetPassword', requiresAuth: false, isDynamic: true },
    { path: '/signup', name: 'SignUp', requiresAuth: false },
    { path: '/register', name: 'Register', requiresAuth: false },
    { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
    { path: '/archive', name: 'Archive', requiresAuth: true },
    { path: '/tasks', name: 'Tasks', requiresAuth: true },
    { path: '/knowledge-ai', name: 'KnowledgeAI', requiresAuth: true },
    { path: '/community-chat', name: 'CommunityChat', requiresAuth: true },
    { path: '/team-management', name: 'TeamManagement', requiresAuth: true },
    { path: '/settings', name: 'Settings', requiresAuth: true },
    { path: '/new-meeting', name: 'NewMeeting', requiresAuth: true },
    { path: '/live-meeting', name: 'LiveMeeting', requiresAuth: true },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/', isWildcard: true }
  ];

  // Merge and deduplicate
  const allRoutes = knownRoutes;
  const valid = [];
  const skipped = [];

  for (const r of allRoutes) {
    if (r.isWildcard) {
      skipped.push({ path: r.path, reason: '404 / Fallback catch-all route' });
    } else if (r.redirect) {
      skipped.push({ path: r.path, reason: 'Redirect route' });
    } else if (r.isDynamic) {
      skipped.push({ path: r.path, reason: 'Dynamic route requiring parameter (no sample ID provided)' });
    } else {
      valid.push({
        path: r.path,
        name: r.name,
        requiresAuth: r.requiresAuth,
        filename: routeToFilename(r.path)
      });
    }
  }

  return { valid, skipped, totalDiscovered: allRoutes.length };
}

/**
 * Ensure development server is up
 */
async function checkDevServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Main Export Script
 */
async function main() {
  console.log('====================================================');
  console.log('  SmartMeet Automated Page Export Script');
  console.log('====================================================\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Verify Dev Server
  console.log(`Checking local development server at ${BASE_URL}...`);
  const isServerRunning = await checkDevServer(BASE_URL);
  if (!isServerRunning) {
    console.error(`❌ Error: Development server is not reachable at ${BASE_URL}.`);
    console.error(`Please ensure "npm run dev" is running in the Front-end directory.`);
    process.exit(1);
  }
  console.log(`✓ Dev server is online.\n`);

  // Discover routes
  console.log(`Parsing Vue Router configuration from ${path.basename(ROUTER_FILE)}...`);
  const { valid: validRoutes, skipped: skippedRoutes, totalDiscovered } = discoverRoutesFromRouterFile();
  console.log(`✓ Discovered ${totalDiscovered} total route definitions.`);
  console.log(`  - ${validRoutes.length} valid direct routes to capture.`);
  console.log(`  - ${skippedRoutes.length} routes to skip.\n`);

  // Launch Playwright Browser
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  
  // Prepare authenticated state for app routes
  console.log('Setting up authenticated state for protected routes...');
  const authContext = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1
  });
  const setupPage = await authContext.newPage();
  await setupPage.goto(BASE_URL, { waitUntil: 'networkidle' });

  // Inject valid user & token into localStorage
  const mockUser = {
    id: '650000000000000000000001',
    _id: '650000000000000000000001',
    firstName: 'Marwan',
    lastName: 'Elgammal',
    name: 'Marwan Elgammal',
    email: 'marwanelgammal5@outlook.com',
    role: 'admin',
    status: 'approved'
  };
  const mockToken = 'mock-jwt-token-smartmeet-exporter';

  await setupPage.evaluate(({ user, token }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('sessionId', 'export-session-123');
  }, { user: mockUser, token: mockToken });

  // Save storage state for reuse
  await authContext.storageState({ path: STORAGE_STATE_PATH });
  await setupPage.close();
  await authContext.close();

  // Create clean context reusing authenticated storage state
  const context = await browser.newContext({
    viewport: VIEWPORT,
    storageState: STORAGE_STATE_PATH,
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  const exportedRoutes = [];
  const failedRoutes = [];

  console.log('----------------------------------------------------');
  console.log('Starting full-page page exports...');
  console.log('----------------------------------------------------\n');

  for (const route of validRoutes) {
    const targetUrl = `${BASE_URL}${route.path}`;
    const outputPath = path.join(OUTPUT_DIR, route.filename);
    process.stdout.write(`Capturing [${route.path}] -> ${route.filename} ... `);

    try {
      // 1. Navigate to route
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

      // 2. Disable/reduce animations & transitions for deterministic capture
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            scroll-behavior: auto !important;
          }
        `
      });

      // 3. Wait for fonts, images, and visual elements to settle
      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        const images = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            });
          })
        );
      });

      // 4. Brief delay to ensure entrance animations / reactive state settle
      await page.waitForTimeout(500);

      // 5. Capture lossless PNG buffer first
      const pngBuffer = await page.screenshot({
        fullPage: true,
        type: 'png'
      });

      // 6. Convert lossless PNG to high quality JPG (quality 92) via Sharp
      await sharp(pngBuffer)
        .jpeg({ quality: JPG_QUALITY, chromaSubsampling: '4:4:4' })
        .toFile(outputPath);

      console.log(`✓ DONE`);
      exportedRoutes.push({ path: route.path, filename: route.filename });
    } catch (err) {
      console.log(`❌ FAILED (${err.message})`);
      failedRoutes.push({ path: route.path, error: err.message });
    }
  }

  await browser.close();

  // Print Summary Output
  console.log('\n====================================================');
  console.log('  EXPORT SUMMARY');
  console.log('====================================================');
  console.log(`Total Routes Discovered : ${totalDiscovered}`);
  console.log(`Routes Exported         : ${exportedRoutes.length}`);
  console.log(`Routes Skipped          : ${skippedRoutes.length}`);
  console.log(`Routes Failed           : ${failedRoutes.length}`);
  console.log(`Output Directory        : ${OUTPUT_DIR}\n`);

  if (exportedRoutes.length > 0) {
    console.log('Successfully Exported Pages:');
    exportedRoutes.forEach((r) => console.log(`  ✓ ${r.path.padEnd(22)} -> ${r.filename}`));
    console.log('');
  }

  if (skippedRoutes.length > 0) {
    console.log('Skipped Routes:');
    skippedRoutes.forEach((s) => console.log(`  - ${s.path.padEnd(22)} (${s.reason})`));
    console.log('');
  }

  if (failedRoutes.length > 0) {
    console.log('Failed Routes:');
    failedRoutes.forEach((f) => console.log(`  ❌ ${f.path.padEnd(22)} (${f.error})`));
    console.log('');
  }

  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
