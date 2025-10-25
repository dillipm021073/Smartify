import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // DOCUMENTATION API
  // ============================================================================

  // GET /api/docs - Get API documentation (HTML UI)
  app.get("/api/docs", async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/api`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smartify SIM API Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        header p { font-size: 1.1rem; opacity: 0.9; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-left: 10px;
        }
        .badge.version { background: rgba(255,255,255,0.2); }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info-card h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        .info-card code {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9rem;
        }
        .section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-header {
            background: #667eea;
            color: white;
            padding: 15px 20px;
            font-size: 1.3rem;
            font-weight: 600;
        }
        .section-content {
            padding: 20px;
        }
        .endpoint {
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }
        .endpoint:last-child { margin-bottom: 0; }
        .method {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.85rem;
            margin-right: 10px;
        }
        .method.get { background: #61affe; color: white; }
        .method.post { background: #49cc90; color: white; }
        .method.put { background: #fca130; color: white; }
        .method.delete { background: #f93e3e; color: white; }
        .path {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #333;
        }
        .description {
            color: #666;
            margin-top: 5px;
            font-size: 0.95rem;
        }
        .auth-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .auth-box strong { color: #856404; }
        footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Smartify SIM API <span class="badge version">v1.0.0</span></h1>
            <p>Complete REST API for the SIM with Device platform</p>
            <p style="margin-top: 10px; font-size: 0.95rem;">Base URL: <code style="background:rgba(255,255,255,0.2);padding:4px 8px;border-radius:4px;">${baseUrl}</code></p>
        </header>

        <div class="info-grid">
            <div class="info-card">
                <h3>📡 Status</h3>
                <p><strong>Healthy</strong> - Database Connected</p>
                <p style="margin-top:8px;color:#666;">30 endpoints available</p>
            </div>
            <div class="info-card">
                <h3>🔐 Agent Auth</h3>
                <p>Username: <code>admin</code> or <code>agent1</code></p>
                <p>Password: <code>admin123</code></p>
            </div>
            <div class="info-card">
                <h3>📱 OTP (Dev Mode)</h3>
                <p>Fixed Code: <code>123456</code></p>
                <p style="margin-top:8px;color:#666;">Always use 123456 in development</p>
            </div>
        </div>

        <div class="section">
            <div class="section-header">📍 Location APIs</div>
            <div class="section-content">
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/locations/provinces</span></div>
                    <div class="description">Get all provinces</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/locations/cities/:provinceId</span></div>
                    <div class="description">Get cities by province ID</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/locations/barangays/:cityId</span></div>
                    <div class="description">Get barangays by city ID</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">📦 Product APIs</div>
            <div class="section-content">
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/plans</span></div>
                    <div class="description">Get all active SIM plans</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/devices</span></div>
                    <div class="description">Get all active devices</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/devices/:id/configurations</span></div>
                    <div class="description">Get device configurations (colors, storage)</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/stores</span></div>
                    <div class="description">Get all active stores</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">🔐 OTP / Email Verification</div>
            <div class="section-content">
                <div class="auth-box">
                    <strong>Development Mode:</strong> OTP is always <code>123456</code> for testing
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/otp/send</span></div>
                    <div class="description">Send OTP code to email</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "email": "user@example.com" }</code></div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/otp/verify</span></div>
                    <div class="description">Verify OTP code</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "email": "user@example.com", "otpCode": "123456" }</code></div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">📝 Application APIs (Customer)</div>
            <div class="section-content">
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications</span></div>
                    <div class="description">Create new application - Returns Cart ID</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "email": "user@example.com", "simType": "physical" }</code></div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/applications/:cartId</span></div>
                    <div class="description">Get application details by Cart ID</div>
                </div>
                <div class="endpoint">
                    <div><span class="method put">PUT</span><span class="path">/applications/:id</span></div>
                    <div class="description">Update application</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/customer-information</span></div>
                    <div class="description">Add customer ID information</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/addresses</span></div>
                    <div class="description">Add address (residential/employment)</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/employment</span></div>
                    <div class="description">Add employment information</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/order-items</span></div>
                    <div class="description">Add order item (plan + device)</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/privacy-preferences</span></div>
                    <div class="description">Add privacy preferences</div>
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/applications/:id/submit</span></div>
                    <div class="description">Submit application with signature</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "signatureUrl": "/uploads/signature.png" }</code></div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">👤 Agent Portal APIs</div>
            <div class="section-content">
                <div class="auth-box">
                    <strong>Authentication Required:</strong> Use agent credentials to access these endpoints
                </div>
                <div class="endpoint">
                    <div><span class="method post">POST</span><span class="path">/agent/login</span></div>
                    <div class="description">Agent login - Returns agent details</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "username": "admin", "password": "admin123" }</code></div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/agent/applications</span></div>
                    <div class="description">Search applications</div>
                    <div class="description" style="margin-top:3px;"><code>Query: ?search=CART-123 or ?status=pending</code></div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/agent/applications/:id</span></div>
                    <div class="description">Get full application details with all related data</div>
                </div>
                <div class="endpoint">
                    <div><span class="method put">PUT</span><span class="path">/agent/applications/:id/status</span></div>
                    <div class="description">Update application status (approve/reject)</div>
                    <div class="description" style="margin-top:3px;"><code>Body: { "status": "approved", "agentId": "agent-admin", "notes": "..." }</code></div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">ℹ️ Utility Endpoints</div>
            <div class="section-content">
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/</span></div>
                    <div class="description">API root information</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/health</span></div>
                    <div class="description">Health check - Database status</div>
                </div>
                <div class="endpoint">
                    <div><span class="method get">GET</span><span class="path">/docs</span></div>
                    <div class="description">This documentation page</div>
                </div>
            </div>
        </div>

        <footer>
            <p><strong>Smartify SIM Backend API v1.0.0</strong></p>
            <p style="margin-top:10px;">For detailed request/response examples, see <code>API_DOCUMENTATION.md</code></p>
        </footer>
    </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // GET /api - API root information
  app.get("/api", async (req, res) => {
    res.json({
      name: "Smartify SIM Backend API",
      version: "1.0.0",
      status: "operational",
      endpoints: {
        documentation: "/api/docs",
        health: "/api/health"
      }
    });
  });

  // GET /api/health - Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      await storage.getAllProvinces();

      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        endpoints: 27
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Database connection failed"
      });
    }
  });

  // GET /api/network-info - Get server network information for QR code
  app.get("/api/network-info", async (req, res) => {
    try {
      const { networkInterfaces } = await import('os');
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const nets = networkInterfaces();
      const networkInfo: { ipv4: string[], port: string, windowsIP?: string, isWSL: boolean } = {
        ipv4: [],
        port: process.env.PORT || '5000',
        isWSL: false
      };

      // Check if running in WSL
      try {
        const { stdout } = await execAsync('uname -r');
        networkInfo.isWSL = stdout.toLowerCase().includes('microsoft') || stdout.toLowerCase().includes('wsl');
      } catch (e) {
        networkInfo.isWSL = false;
      }

      // If in WSL, try to get Windows host IP
      if (networkInfo.isWSL) {
        try {
          // Get Windows IP from nameserver in /etc/resolv.conf or from route
          const { stdout: routeOutput } = await execAsync("ip route show default | awk '{print $3}'");
          const windowsHostIP = routeOutput.trim();

          if (windowsHostIP && windowsHostIP.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
            networkInfo.windowsIP = windowsHostIP;

            // Get Windows actual network IP via ipconfig (more reliable than PowerShell)
            try {
              // Try WiFi adapter first
              let { stdout: ipconfigOutput } = await execAsync(
                '/mnt/c/Windows/System32/cmd.exe /c "ipconfig" | grep -A 4 "Wireless LAN" | grep "IPv4" | awk \'{print $NF}\' | head -1'
              );
              let windowsNetworkIP = ipconfigOutput.trim();

              // If no WiFi, try Ethernet
              if (!windowsNetworkIP || !windowsNetworkIP.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                const ethResult = await execAsync(
                  '/mnt/c/Windows/System32/cmd.exe /c "ipconfig" | grep -A 4 "Ethernet adapter" | grep "IPv4" | awk \'{print $NF}\' | head -1'
                );
                windowsNetworkIP = ethResult.stdout.trim();
              }

              if (windowsNetworkIP && windowsNetworkIP.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                // Exclude link-local addresses (169.254.x.x)
                if (!windowsNetworkIP.startsWith('169.254.')) {
                  // Add Windows network IP as the primary IP
                  networkInfo.ipv4.unshift(windowsNetworkIP);
                  console.log(`Detected Windows network IP: ${windowsNetworkIP}`);
                }
              }
            } catch (ipconfigError) {
              console.log("Could not get Windows IP via ipconfig");
            }
          }
        } catch (wslError) {
          console.log("Could not detect Windows host IP");
        }
      }

      // Get all IPv4 addresses from WSL/Linux
      for (const name of Object.keys(nets)) {
        const netInterface = nets[name];
        if (netInterface) {
          for (const net of netInterface) {
            // Skip internal (localhost) and non-IPv4 addresses
            // Also skip WSL2 internal network (172.16-32.x.x range)
            if (net.family === 'IPv4' &&
                !net.internal &&
                !net.address.startsWith('172.')) {
              networkInfo.ipv4.push(net.address);
            }
          }
        }
      }

      res.json(networkInfo);
    } catch (error) {
      console.error("Error fetching network info:", error);
      res.status(500).json({ error: "Failed to fetch network info" });
    }
  });

  // ============================================================================
  // LOCATION APIs
  // ============================================================================

  // GET /api/locations/provinces - Get all provinces
  app.get("/api/locations/provinces", async (req, res) => {
    try {
      const provinces = await storage.getAllProvinces();
      res.json(provinces);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      res.status(500).json({ error: "Failed to fetch provinces" });
    }
  });

  // GET /api/locations/cities/:provinceId - Get cities by province
  app.get("/api/locations/cities/:provinceId", async (req, res) => {
    try {
      const provinceId = parseInt(req.params.provinceId);
      const cities = await storage.getCitiesByProvince(provinceId);
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  // GET /api/locations/barangays/:cityId - Get barangays by city
  app.get("/api/locations/barangays/:cityId", async (req, res) => {
    try {
      const cityId = parseInt(req.params.cityId);
      const barangays = await storage.getBarangaysByCity(cityId);
      res.json(barangays);
    } catch (error) {
      console.error("Error fetching barangays:", error);
      res.status(500).json({ error: "Failed to fetch barangays" });
    }
  });

  // ============================================================================
  // PLAN & DEVICE APIs
  // ============================================================================

  // GET /api/plans - Get all active plans
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // GET /api/devices - Get all active devices
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await storage.getAllDevices();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ error: "Failed to fetch devices" });
    }
  });

  // GET /api/devices/:id/configurations - Get device configurations
  app.get("/api/devices/:id/configurations", async (req, res) => {
    try {
      const configurations = await storage.getDeviceConfigurationsByDevice(req.params.id);
      res.json(configurations);
    } catch (error) {
      console.error("Error fetching device configurations:", error);
      res.status(500).json({ error: "Failed to fetch device configurations" });
    }
  });

  // ============================================================================
  // STORE APIs
  // ============================================================================

  // GET /api/stores - Get all active stores
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  // ============================================================================
  // OTP APIs (Email Verification)
  // ============================================================================

  // POST /api/otp/send - Send OTP to email
  app.post("/api/otp/send", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // In development mode, use a fixed OTP
      const isDev = process.env.DEV_MODE === "true";
      const otpCode = isDev ? process.env.DEV_OTP_CODE || "123456" : generateOTP();

      // Calculate expiry time
      const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "5");
      const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

      // Save OTP to database
      await storage.createOtp({
        email,
        otpCode,
        expiresAt,
      });

      // In production, send email here
      if (!isDev) {
        // TODO: Implement email sending with nodemailer
        console.log(`OTP for ${email}: ${otpCode}`);
      }

      res.json({
        success: true,
        message: isDev
          ? `Development mode: Use OTP ${otpCode}`
          : "OTP sent to your email",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // POST /api/otp/verify - Verify OTP
  app.post("/api/otp/verify", async (req, res) => {
    try {
      const { email, otpCode } = req.body;

      if (!email || !otpCode) {
        return res.status(400).json({ error: "Email and OTP code are required" });
      }

      const isValid = await storage.verifyOtp(email, otpCode);

      if (isValid) {
        res.json({ success: true, message: "OTP verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // ============================================================================
  // APPLICATION APIs
  // ============================================================================

  // POST /api/applications - Create a new application
  app.post("/api/applications", async (req, res) => {
    try {
      const { email, simType, customerIdType, customerIdNumber } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check for existing pending application with same email
      const existingPendingApp = await storage.getPendingApplicationByEmail(email);
      if (existingPendingApp) {
        return res.status(409).json({
          error: "You already have a pending application",
          message: `An application with Cart ID ${existingPendingApp.cartId} is already pending for this email. Please complete or cancel that application first.`,
          existingCartId: existingPendingApp.cartId,
          existingApplicationId: existingPendingApp.id
        });
      }

      // Generate unique cart ID
      const cartId = `CART-${Date.now()}${Math.floor(Math.random() * 10000)}`;

      // Create application
      const application = await storage.createApplication({
        cartId,
        email,
        simType,
        customerIdType,
        customerIdNumber,
        status: "pending",
        emailVerified: false,
      });

      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  // GET /api/applications/:cartId - Get application by cart ID
  app.get("/api/applications/:cartId", async (req, res) => {
    try {
      const application = await storage.getApplicationByCartId(req.params.cartId);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Get related data
      const customerInfo = await storage.getCustomerInformationByApplicationId(application.id);
      const addresses = await storage.getAddressesByApplicationId(application.id);
      const employmentInfo = await storage.getEmploymentInformationByApplicationId(application.id);
      const orderItems = await storage.getOrderItemsByApplicationId(application.id);
      const privacyPrefs = await storage.getPrivacyPreferencesByApplicationId(application.id);

      res.json({
        ...application,
        customerInformation: customerInfo,
        addresses,
        employmentInformation: employmentInfo,
        orderItems,
        privacyPreferences: privacyPrefs,
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // PUT /api/applications/:id - Update application
  app.put("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const application = await storage.updateApplication(id, updateData);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // POST /api/applications/:id/customer-information - Add customer information
  app.post("/api/applications/:id/customer-information", async (req, res) => {
    try {
      const { id } = req.params;
      const { idType, idFrontUrl, idBackUrl, nationalId } = req.body;

      await storage.createCustomerInformation({
        applicationId: id,
        idType,
        idFrontUrl,
        idBackUrl,
        nationalId,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating customer information:", error);
      res.status(500).json({ error: "Failed to save customer information" });
    }
  });

  // POST /api/applications/:id/addresses - Add address
  app.post("/api/applications/:id/addresses", async (req, res) => {
    try {
      const { id } = req.params;
      const addressData = req.body;

      await storage.createAddress({
        applicationId: id,
        ...addressData,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ error: "Failed to save address" });
    }
  });

  // POST /api/applications/:id/employment - Add employment information
  app.post("/api/applications/:id/employment", async (req, res) => {
    try {
      const { id } = req.params;
      const employmentData = req.body;

      await storage.createEmploymentInformation({
        applicationId: id,
        ...employmentData,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating employment information:", error);
      res.status(500).json({ error: "Failed to save employment information" });
    }
  });

  // POST /api/applications/:id/order-items - Add order item
  app.post("/api/applications/:id/order-items", async (req, res) => {
    try {
      const { id } = req.params;
      const orderItemData = req.body;

      await storage.createOrderItem({
        applicationId: id,
        ...orderItemData,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating order item:", error);
      res.status(500).json({ error: "Failed to save order item" });
    }
  });

  // POST /api/applications/:id/privacy-preferences - Add privacy preferences
  app.post("/api/applications/:id/privacy-preferences", async (req, res) => {
    try {
      const { id } = req.params;
      const privacyData = req.body;

      console.log('Saving privacy preferences for application:', id);
      console.log('Privacy data:', privacyData);

      // Verify application exists
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      await storage.createPrivacyPreferences({
        applicationId: id,
        ...privacyData,
      });

      console.log('Privacy preferences saved successfully');
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error creating privacy preferences:", error);
      const errorMessage = error.message || "Failed to save privacy preferences";
      res.status(500).json({
        error: "Failed to save privacy preferences",
        details: errorMessage
      });
    }
  });

  // POST /api/applications/:id/signature - Upload signature
  app.post("/api/applications/:id/signature", async (req, res) => {
    try {
      const { id } = req.params;
      const { signatureDataUrl } = req.body;

      if (!signatureDataUrl) {
        return res.status(400).json({ error: "Signature data is required" });
      }

      // Update application with signature
      const application = await storage.updateApplication(id, {
        signatureUrl: signatureDataUrl,
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json({ success: true, signatureUrl: signatureDataUrl });
    } catch (error) {
      console.error("Error uploading signature:", error);
      res.status(500).json({ error: "Failed to upload signature" });
    }
  });

  // POST /api/applications/:id/submit - Submit application
  app.post("/api/applications/:id/submit", async (req, res) => {
    try {
      const { id } = req.params;
      const { signatureUrl } = req.body;

      const application = await storage.updateApplication(id, {
        status: "submitted",
        signatureUrl,
        submittedAt: new Date(),
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        applicationId: id,
        action: "application_submitted",
        changes: { status: "submitted" },
      });

      res.json(application);
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // ============================================================================
  // AGENT APIs
  // ============================================================================

  // POST /api/agent/login - Agent login
  app.post("/api/agent/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Find agent by username
      const agent = await storage.getAgentByUsername(username);

      if (!agent || !agent.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, agent.passwordHash);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return agent data (excluding password hash)
      const { passwordHash, ...agentData } = agent;

      res.json({
        success: true,
        agent: agentData,
      });
    } catch (error) {
      console.error("Error during agent login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // GET /api/agent/applications - Search applications
  app.get("/api/agent/applications", async (req, res) => {
    try {
      const { search, status, agentId } = req.query;

      let applications;

      if (search && typeof search === "string") {
        applications = await storage.searchApplications(search);
      } else if (agentId && typeof agentId === "string") {
        // Get applications specific to this agent:
        // - All "pending" applications (available to pick up)
        // - "submitted" and "verified" applications assigned to this agent
        applications = await storage.getApplicationsForAgent(agentId);
      } else if (status && typeof status === "string") {
        applications = await storage.getApplicationsByStatus(status);
      } else {
        // Get all pending, submitted, and verified applications by default
        const pending = await storage.getApplicationsByStatus("pending");
        const submitted = await storage.getApplicationsByStatus("submitted");
        const verified = await storage.getApplicationsByStatus("verified");
        applications = [...pending, ...submitted, ...verified];
      }

      res.json(applications);
    } catch (error) {
      console.error("Error searching applications:", error);
      res.status(500).json({ error: "Failed to search applications" });
    }
  });

  // GET /api/agent/applications/:id - Get full application details
  app.get("/api/agent/applications/:id", async (req, res) => {
    try {
      const application = await storage.getApplicationById(req.params.id);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Get all related data
      const customerInfo = await storage.getCustomerInformationByApplicationId(application.id);
      const addresses = await storage.getAddressesByApplicationId(application.id);
      const employmentInfo = await storage.getEmploymentInformationByApplicationId(application.id);
      const orderItems = await storage.getOrderItemsByApplicationId(application.id);
      const privacyPrefs = await storage.getPrivacyPreferencesByApplicationId(application.id);

      // Enrich order items with plan and device details
      const enrichedOrderItems = await Promise.all(
        orderItems.map(async (item: any) => {
          const plan = await storage.getPlanById(item.planId);
          const device = await storage.getDeviceById(item.deviceId);
          const deviceConfig = item.deviceConfigId
            ? await storage.getDeviceConfigurationById(item.deviceConfigId)
            : null;

          return {
            ...item,
            plan,
            device,
            deviceConfiguration: deviceConfig,
          };
        })
      );

      // Enrich addresses with location details
      const enrichedAddresses = await Promise.all(
        addresses.map(async (address: any) => {
          const barangay = address.barangayId
            ? await storage.getBarangayById(address.barangayId)
            : null;

          return {
            ...address,
            barangay,
          };
        })
      );

      res.json({
        ...application,
        customerInformation: customerInfo,
        addresses: enrichedAddresses,
        employmentInformation: employmentInfo,
        orderItems: enrichedOrderItems,
        privacyPreferences: privacyPrefs,
      });
    } catch (error) {
      console.error("Error fetching application details:", error);
      res.status(500).json({ error: "Failed to fetch application details" });
    }
  });

  // POST /api/agent/applications/:id/assign - Assign application to agent
  app.post("/api/agent/applications/:id/assign", async (req, res) => {
    try {
      const { id } = req.params;
      const { agentId, storeId } = req.body;

      if (!agentId || !storeId) {
        return res.status(400).json({ error: "Agent ID and Store ID are required" });
      }

      // Get current application
      const currentApp = await storage.getApplicationById(id);
      if (!currentApp) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Check if application is in "pending" status
      if (currentApp.status !== "pending") {
        return res.status(400).json({
          error: "Application is not in pending status",
          currentStatus: currentApp.status
        });
      }

      // Check if already assigned to another agent
      if (currentApp.assignedAgentId && currentApp.assignedAgentId !== agentId) {
        return res.status(409).json({
          error: "Application is already assigned to another agent",
          assignedAgentId: currentApp.assignedAgentId
        });
      }

      // Assign agent and store, change status to "submitted"
      const application = await storage.updateApplication(id, {
        status: "submitted",
        assignedAgentId: agentId,
        storeId: storeId,
      });

      // Create audit log
      await storage.createAuditLog({
        applicationId: id,
        agentId,
        action: "application_assigned",
        changes: { status: "submitted", agentId, storeId },
      });

      res.json(application);
    } catch (error) {
      console.error("Error assigning application:", error);
      res.status(500).json({ error: "Failed to assign application" });
    }
  });

  // POST /api/agent/applications/:id/verify - Verify and complete application
  app.post("/api/agent/applications/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      const { agentId } = req.body;

      if (!agentId) {
        return res.status(400).json({ error: "Agent ID is required" });
      }

      // Get current application
      const currentApp = await storage.getApplicationById(id);
      if (!currentApp) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Check if application is in "submitted" status
      if (currentApp.status !== "submitted") {
        return res.status(400).json({
          error: "Application must be in submitted status to verify",
          currentStatus: currentApp.status
        });
      }

      // Check if assigned to this agent
      if (currentApp.assignedAgentId !== agentId) {
        return res.status(403).json({
          error: "Application is not assigned to this agent",
          assignedAgentId: currentApp.assignedAgentId
        });
      }

      // Change status to "verified" and set submittedAt timestamp
      const application = await storage.updateApplication(id, {
        status: "verified",
        submittedAt: new Date(),
      });

      // Create audit log
      await storage.createAuditLog({
        applicationId: id,
        agentId,
        action: "application_verified",
        changes: { status: "verified", submittedAt: new Date() },
      });

      res.json(application);
    } catch (error) {
      console.error("Error verifying application:", error);
      res.status(500).json({ error: "Failed to verify application" });
    }
  });

  // PUT /api/agent/applications/:id/status - Update application status
  app.put("/api/agent/applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, agentId, notes } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      // Update application status
      const application = await storage.updateApplication(id, {
        status,
        assignedAgentId: agentId,
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        applicationId: id,
        agentId,
        action: `status_changed_to_${status}`,
        changes: { status, notes },
      });

      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // ============================================================================
  // MSISDN (Phone Number) APIs
  // ============================================================================

  // GET /api/msisdn/available - Get available phone numbers
  app.get("/api/msisdn/available", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const availableNumbers = await storage.getAvailableNumbers(limit);
      res.json(availableNumbers);
    } catch (error) {
      console.error("Error fetching available numbers:", error);
      res.status(500).json({ error: "Failed to fetch available numbers" });
    }
  });

  // POST /api/agent/applications/:id/assign-number - Assign phone number to application
  app.post("/api/agent/applications/:id/assign-number", async (req, res) => {
    try {
      const { id } = req.params;
      const { msisdnId, agentId } = req.body;

      if (!msisdnId) {
        return res.status(400).json({ error: "MSISDN ID is required" });
      }

      // Get the MSISDN record
      const msisdn = await storage.getNumberById(msisdnId);
      if (!msisdn) {
        return res.status(404).json({ error: "Phone number not found" });
      }

      // Check if number is available
      if (msisdn.status !== "available") {
        return res.status(400).json({ error: "Phone number is not available" });
      }

      // Assign the number to the application
      await storage.assignNumberToApplication(msisdnId, id);

      // Update application with assigned number
      const application = await storage.updateApplication(id, {
        assignedNumber: msisdn.msisdn,
      });

      // Create audit log
      if (agentId) {
        await storage.createAuditLog({
          applicationId: id,
          agentId,
          action: "number_assigned",
          changes: { assignedNumber: msisdn.msisdn },
        });
      }

      res.json({ success: true, assignedNumber: msisdn.msisdn, application });
    } catch (error) {
      console.error("Error assigning number:", error);
      res.status(500).json({ error: "Failed to assign number" });
    }
  });

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const httpServer = createServer(app);

  return httpServer;
}
