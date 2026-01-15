const { chromium, devices } = require('playwright');

async function automateInstagramLogin(username, password) {
  let browser;
  
  try {
    // Launch browser (headless: true for production/deployment)
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set Playwright browser path explicitly for Railway
    const playwright = require('playwright');
    const browserPath = playwright.chromium.executablePath();
    console.log('Playwright browser path:', browserPath);
    
    browser = await chromium.launch({ 
      headless: isProduction ? true : false, // Headless in production
      slowMo: isProduction ? 0 : 500, // No slowMo in production
      executablePath: browserPath, // Explicitly set browser path
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--disable-translate',
        '--disable-wake-on-wifi',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-zygote',
        '--password-store=basic',
        '--use-mock-keychain',
        '--window-size=390,844'
      ]
    });
    
    // Use iPhone device emulation to force mobile mode
    const iPhone = devices['iPhone 12'];
    const context = await browser.newContext({
      ...iPhone,
      // Override user agent to ensure mobile
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 }, // iPhone 12 viewport
      // Force mobile viewport
      isMobile: true,
      hasTouch: true,
      // Additional settings to avoid detection
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: [],
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    const page = await context.newPage();
    
    // Use CDP (Chrome DevTools Protocol) for advanced evasion
    try {
      const client = await context.newCDPSession(page);
      
      // Override navigator.webdriver via CDP
      await client.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
          });
        `
      });
      
      // Override Chrome runtime via CDP
      await client.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `
          window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
          };
        `
      });
      
      // Override permissions
      await client.send('Browser.setPermission', {
        origin: 'https://www.instagram.com',
        permission: { name: 'notifications', state: 'granted' }
      });
    } catch (cdpError) {
      console.log('CDP session setup failed (non-critical):', cdpError.message);
    }
    
    // Enhanced bot detection evasion
    await page.addInitScript(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Override plugins to look like a real browser
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      
      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
      
      // Override Chrome runtime
      window.chrome = {
        runtime: {},
      };
      
      // Override permissions API
      const originalPermissions = navigator.permissions;
      Object.defineProperty(navigator, 'permissions', {
        get: () => originalPermissions,
      });
      
      // Mock missing properties
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
      });
      
      // Override getBattery if it exists
      if (navigator.getBattery) {
        navigator.getBattery = () => Promise.resolve({
          charging: true,
          chargingTime: 0,
          dischargingTime: Infinity,
          level: 1,
        });
      }
      
      // Override connection
      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          effectiveType: '4g',
          rtt: 50,
          downlink: 10,
          saveData: false,
        }),
      });
      
      // Canvas fingerprinting protection
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type) {
        if (type === '2d') {
          const context = getContext.apply(this, arguments);
          const originalFillText = context.fillText;
          context.fillText = function() {
            const shift = Math.random() * 0.0001;
            arguments[1] += shift;
            arguments[2] += shift;
            return originalFillText.apply(this, arguments);
          };
          return context;
        }
        return getContext.apply(this, arguments);
      };
      
      // WebGL fingerprinting protection
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) {
          return 'Intel Inc.';
        }
        if (parameter === 37446) {
          return 'Intel Iris OpenGL Engine';
        }
        return getParameter.apply(this, arguments);
      };
    });
    
    // Navigate to Instagram login page with mobile parameter
    console.log('Navigating to Instagram login page (mobile mode)...');
    
    // Add random scrolling and mouse movements to simulate human behavior
    await page.evaluate(() => {
      // Simulate some initial page interaction
      window.scrollTo(0, Math.random() * 100);
    });
    await page.waitForTimeout(500 + Math.random() * 1000);
    
    // Set up request interception to handle blocked requests
    await page.route('**/*', (route) => {
      const request = route.request();
      // Add random delays to requests to simulate human behavior
      const delay = Math.random() * 100;
      setTimeout(() => {
        route.continue();
      }, delay);
    });
    
    // Try navigation with retry logic and different strategies
    let navigationSuccess = false;
    let lastError = null;
    const urls = [
      'https://www.instagram.com/accounts/login/',
      'https://www.instagram.com/',
      'https://instagram.com/accounts/login/'
    ];
    
    for (const url of urls) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Navigation attempt to ${url} (${attempt}/2)...`);
          
          // Try with different wait strategies
          const waitStrategy = attempt === 1 ? 'domcontentloaded' : 'load';
          
          await page.goto(url, {
            waitUntil: waitStrategy,
            timeout: 40000
          });
          
          // Check if we're actually on Instagram (not blocked)
          const currentUrl = page.url();
          const pageTitle = await page.title().catch(() => '');
          const pageContent = await page.content().catch(() => '');
          
          // If we got redirected to a challenge or error page, try next URL
          if (currentUrl.includes('challenge') || 
              currentUrl.includes('blocked') ||
              pageContent.includes('blocked') ||
              pageContent.includes('unusual activity')) {
            console.log('Detected challenge/block page, trying next URL...');
            await page.waitForTimeout(1000);
            continue;
          }
          
          // If we're on login page or Instagram, success
          if (currentUrl.includes('instagram.com') && 
              (currentUrl.includes('login') || currentUrl.includes('/accounts/') || currentUrl === 'https://www.instagram.com/' || currentUrl === 'https://instagram.com/')) {
            navigationSuccess = true;
            console.log('Successfully navigated to Instagram');
            break;
          }
          
        } catch (error) {
          lastError = error;
          console.log(`Navigation attempt failed:`, error.message);
          
          // If it's a network error, wait longer before retry
          if (error.message.includes('ERR_HTTP_RESPONSE_CODE_FAILURE') || 
              error.message.includes('net::ERR')) {
            console.log('Network error detected, waiting longer...');
            await page.waitForTimeout(5000);
          } else {
            await page.waitForTimeout(2000);
          }
        }
      }
      
      if (navigationSuccess) break;
    }
    
    if (!navigationSuccess) {
      // Final attempt: try to access Instagram through a different method
      try {
        console.log('Trying final navigation method...');
        await page.goto('https://www.instagram.com/', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Try to navigate to login from homepage
        await page.waitForTimeout(2000);
        await page.goto('https://www.instagram.com/accounts/login/', {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
        navigationSuccess = true;
      } catch (finalError) {
        const errorMsg = `Instagram may be blocking automated access. Failed to navigate to Instagram. Error: ${lastError?.message || finalError.message}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
    }
    
    // Wait for page to fully load with more realistic timing
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    
    // Simulate human-like page interaction before proceeding
    await page.evaluate(() => {
      // Random scroll
      window.scrollTo(0, Math.random() * 200);
    });
    await page.waitForTimeout(1000 + Math.random() * 2000);
    
    // Random mouse movement
    await page.mouse.move(
      Math.random() * 390,
      Math.random() * 844
    );
    await page.waitForTimeout(500 + Math.random() * 1500);
    
    // Random wait to simulate human reading time
    await page.waitForTimeout(2000 + Math.random() * 3000);
    
    // Wait for login form to be visible - try multiple selectors for mobile
    console.log('Waiting for login form...');
    
    // More comprehensive selectors for mobile Instagram
    const usernameSelectors = [
      'input[name="username"]',
      'input[aria-label*="username" i]',
      'input[aria-label*="Username" i]',
      'input[aria-label*="Phone number" i]',
      'input[type="text"]',
      'input[autocomplete="username"]',
      'input[placeholder*="username" i]',
      'input[placeholder*="phone" i]'
    ];
    
    const passwordSelectors = [
      'input[name="password"]',
      'input[aria-label*="password" i]',
      'input[aria-label*="Password" i]',
      'input[type="password"]',
      'input[autocomplete="current-password"]',
      'input[placeholder*="password" i]'
    ];
    
    // Wait for username field
    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000, state: 'visible' });
        usernameField = await page.$(selector);
        if (usernameField) {
          const isVisible = await usernameField.isVisible();
          if (isVisible) {
            console.log(`Found username field with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!usernameField) {
      // Take screenshot for debugging
      await page.screenshot({ path: 'debug-username-not-found.png' }).catch(() => {});
      throw new Error('Could not find username input field on page');
    }
    
    // Wait for password field
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000, state: 'visible' });
        passwordField = await page.$(selector);
        if (passwordField) {
          const isVisible = await passwordField.isVisible();
          if (isVisible) {
            console.log(`Found password field with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!passwordField) {
      await page.screenshot({ path: 'debug-password-not-found.png' }).catch(() => {});
      throw new Error('Could not find password input field on page');
    }
    
    // Fill in credentials using the found fields with more human-like behavior
    console.log('Filling credentials...');
    
    // Add random mouse movement before typing
    await page.mouse.move(
      Math.random() * 100 + 100,
      Math.random() * 100 + 100
    );
    await page.waitForTimeout(200 + Math.random() * 300);
    
    // Clear and fill username with more realistic typing
    await usernameField.click({ delay: 50 + Math.random() * 50 });
    await page.waitForTimeout(100 + Math.random() * 200);
    await usernameField.fill('');
    await page.waitForTimeout(100);
    
    // Type username character by character with variable delays
    for (const char of username) {
      await usernameField.type(char, { delay: 80 + Math.random() * 120 });
    }
    await page.waitForTimeout(300 + Math.random() * 400);
    
    // Add small mouse movement
    await page.mouse.move(
      Math.random() * 50 + 50,
      Math.random() * 50 + 50
    );
    await page.waitForTimeout(200 + Math.random() * 300);
    
    // Clear and fill password with more realistic typing
    await passwordField.click({ delay: 50 + Math.random() * 50 });
    await page.waitForTimeout(100 + Math.random() * 200);
    await passwordField.fill('');
    await page.waitForTimeout(100);
    
    // Type password character by character with variable delays
    for (const char of password) {
      await passwordField.type(char, { delay: 80 + Math.random() * 120 });
    }
    await page.waitForTimeout(500 + Math.random() * 500);
    
    // Trigger input events to ensure React/form validation detects the changes
    await usernameField.evaluate(el => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    await passwordField.evaluate(el => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Wait for form validation with human-like behavior
    await page.waitForTimeout(1000 + Math.random() * 1000);
    
    // Simulate reading the form before submitting
    await page.evaluate(() => {
      window.scrollTo(0, Math.random() * 100);
    });
    await page.waitForTimeout(500 + Math.random() * 1000);
    
    // Click login button - try multiple selectors for mobile
    console.log('Clicking login button...');
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Log in")',
      'button:has-text("Log In")',
      'button:has-text("Login")',
      'div[role="button"]:has-text("Log in")',
      'button._acan._acap._acas._aj1-',
      'button[class*="_acan"]',
      'div[role="button"][tabindex="0"]'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          const isVisible = await button.isVisible();
          if (isVisible) {
            submitButton = button;
            console.log(`Found submit button with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!submitButton) {
      await page.screenshot({ path: 'debug-button-not-found.png' }).catch(() => {});
      throw new Error('Could not find login button');
    }
    
    // Check if button is enabled, if not wait a bit more
    const isEnabled = await submitButton.evaluate(el => !el.disabled && !el.hasAttribute('aria-disabled'));
    if (!isEnabled) {
      console.log('Button is disabled, waiting for form validation...');
      await page.waitForTimeout(2000);
    }
    
    // Try to click the button with human-like behavior
    try {
      // Move mouse to button first
      const box = await submitButton.boundingBox();
      if (box) {
        await page.mouse.move(
          box.x + box.width / 2 + (Math.random() - 0.5) * 10,
          box.y + box.height / 2 + (Math.random() - 0.5) * 10,
          { steps: 5 + Math.floor(Math.random() * 5) }
        );
        await page.waitForTimeout(100 + Math.random() * 200);
      }
      await submitButton.click({ timeout: 5000, delay: 50 + Math.random() * 100 });
      console.log('Login button clicked successfully');
    } catch (e) {
      // If click fails, try force click
      console.log('Normal click failed, trying force click...');
      await submitButton.click({ force: true, delay: 50 + Math.random() * 100 });
    }
    
    // Wait for navigation or error message
    console.log('Waiting for response...');
    
    // Wait for either navigation or error message with better error handling
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
        page.waitForSelector('div[role="alert"], #slfErrorAlert, p[role="alert"]', { timeout: 15000 }).catch(() => {}),
        page.waitForTimeout(5000) // Fallback timeout
      ]);
    } catch (e) {
      console.log('Navigation wait completed or timed out');
    }
    
    // Additional wait to ensure page is stable
    await page.waitForTimeout(2000);
    
    // Check if page/browser is still open
    if (page.isClosed()) {
      throw new Error('Page was closed unexpectedly');
    }
    
    // Check for "Can't find account" modal/popup
    const accountNotFoundSelectors = [
      'text="Can\'t find account"',
      'text="Can\'t find an account"',
      'div:has-text("Can\'t find account")',
      'div:has-text("Can\'t find an account")',
      'h1:has-text("Can\'t find account")',
      '[role="dialog"]:has-text("Can\'t find account")'
    ];
    
    let accountNotFoundError = null;
    for (const selector of accountNotFoundSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            // Get the full error message from the modal
            const modalText = await page.evaluate(() => {
              const modal = document.querySelector('[role="dialog"]') || 
                           document.querySelector('div[class*="modal"]') ||
                           document.querySelector('div[class*="dialog"]');
              return modal ? modal.textContent.trim() : null;
            });
            accountNotFoundError = modalText || "Can't find account - Invalid credentials";
            console.log('Detected "Can\'t find account" error');
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    // Check for other error messages
    const errorSelectors = [
      'div[role="alert"]',
      '#slfErrorAlert',
      'p[role="alert"]',
      '.error-container',
      'div:has-text("Sorry, your password was incorrect")',
      'div:has-text("The password you entered is incorrect")'
    ];
    
    let errorMessage = accountNotFoundError;
    if (!errorMessage) {
      for (const selector of errorSelectors) {
        try {
          const errorElement = await page.$(selector);
          if (errorElement) {
            const isVisible = await errorElement.isVisible().catch(() => false);
            if (isVisible) {
              errorMessage = await page.evaluate(el => el.textContent.trim(), errorElement);
              if (errorMessage) break;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Check if page is still open before getting URL
    let currentUrl = '';
    let isLoginPage = true;
    let feedIndicators = null;
    
    try {
      if (!page.isClosed()) {
        currentUrl = page.url();
        isLoginPage = currentUrl.includes('/accounts/login');
        
        // Additional check: look for Instagram feed indicators
        feedIndicators = await page.$('a[href="/"]').catch(() => null);
      } else {
        console.log('Page was closed, cannot check URL');
      }
    } catch (e) {
      console.log('Error checking page state:', e.message);
    }
    
    // If we found "Can't find account" error, it's definitely a failed login
    const isSuccess = !isLoginPage && !errorMessage && !accountNotFoundError && currentUrl !== '';
    
    console.log(`Login ${isSuccess ? 'successful' : 'failed'}`);
    console.log('Current URL:', currentUrl || 'N/A');
    
    return {
      success: isSuccess,
      url: currentUrl || 'N/A',
      error: errorMessage,
      message: isSuccess 
        ? 'Login successful! Redirected to Instagram.' 
        : (errorMessage || 'Login failed. Please check your credentials.')
    };
    
  } catch (error) {
    console.error('Playwright automation error:', error);
    
    const errorMsg = error.message || '';
    
    // Check if error is about browser/page being closed
    if (errorMsg.includes('closed') || errorMsg.includes('Target closed')) {
      return {
        success: false,
        error: 'Browser or page was closed unexpectedly. This may happen if Instagram blocks the automation or the connection times out.',
        message: 'Instagram may be blocking automated access. Browser closed unexpectedly during automation.'
      };
    }
    
    // Check if error is related to Instagram blocking
    const isInstagramBlocking = errorMsg.includes('blocking') || 
                                errorMsg.includes('blocked') ||
                                errorMsg.includes('challenge') ||
                                errorMsg.includes('unusual activity') ||
                                errorMsg.includes('ERR_HTTP_RESPONSE_CODE_FAILURE') ||
                                errorMsg.includes('net::ERR');
    
    if (isInstagramBlocking) {
      return {
        success: false,
        error: 'Instagram may be blocking automated access. This is common when Instagram detects automation attempts.',
        message: 'Instagram may be blocking automated access. The login attempt was recorded but could not be completed automatically.'
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: `Automation failed: ${error.message}`
    };
  } finally {
    // Only close browser if it's still open
    if (browser) {
      try {
        const contexts = browser.contexts();
        if (contexts.length > 0) {
          await browser.close();
        }
      } catch (e) {
        console.log('Browser already closed or error closing:', e.message);
      }
    }
  }
}

module.exports = { automateInstagramLogin };
