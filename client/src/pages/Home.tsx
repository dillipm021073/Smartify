import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Smartphone, Shield, CreditCard, MapPin, QrCode } from "lucide-react";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';
import { QRCodeSVG } from 'qrcode.react';
import { useNetworkInfo } from "@/lib/api";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: networkInfo, isLoading: networkLoading } = useNetworkInfo();

  // Generate the URL for the QR code (customer portal)
  const getQRCodeUrl = () => {
    if (!networkInfo || networkInfo.ipv4.length === 0) {
      return window.location.origin + '/apply';
    }
    // Use the first non-localhost IP address
    const ip = networkInfo.ipv4[0];
    // Always use port 5173 for Vite dev server (not window.location.port which might be empty or wrong)
    const port = '5173';
    return `http://${ip}:${port}/apply`;
  };

  // Get the correct port for displaying URLs
  const getDisplayPort = () => {
    // For development, always use 5173 (Vite dev server)
    // For production, this would come from environment or be 80/443
    return '5173';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <img src={logoImage} alt="Smartify" className="h-8" />
          <Button variant="outline" onClick={() => setLocation('/agent')} data-testid="button-agent-portal">
            Agent Portal
          </Button>
        </div>
      </header>

      <main>
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Get Your Dream Device with Flexible Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Purchase the latest mobile devices with affordable monthly payment plans. Complete your application online in just 7 easy steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setLocation('/apply')} data-testid="button-start-application">
                Start Application
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* QR Code Section for Mobile Access */}
        <section className="py-16 bg-background border-y border-border">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Scan to Apply on Mobile
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  Use your mobile device to scan this QR code and start your application. Experience our mobile-optimized interface with camera support for document uploads.
                </p>
                <div className="space-y-2">
                  {networkInfo && networkInfo.isWSL && networkInfo.ipv4.length === 0 && (
                    <div className="text-sm bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                      <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">⚠️ WSL2 Detected - Setup Required</p>
                      <p className="text-muted-foreground text-xs mb-2">
                        You're running on WSL2. Mobile access requires port forwarding.
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Run this in Windows PowerShell (as Admin):
                      </p>
                      <code className="block bg-black/5 dark:bg-white/5 p-2 rounded text-xs mt-1 font-mono">
                        ./setup-wsl-port-forwarding.ps1
                      </code>
                    </div>
                  )}
                  {networkInfo && networkInfo.ipv4.length > 0 && (
                    <div className="text-sm text-muted-foreground space-y-3">
                      <div>
                        <p className="font-medium text-foreground mb-2">📱 Mobile Access URLs:</p>
                        {networkInfo.ipv4.map((ip, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-mono text-primary bg-primary/5 px-3 py-2 rounded border border-primary/20">
                              http://{ip}:{getDisplayPort()}/apply
                            </p>
                          </div>
                        ))}
                      </div>
                      {networkInfo.isWSL && (
                        <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded border border-yellow-500/20">
                          💡 WSL2: Make sure port forwarding is set up! Run setup-wsl-port-forwarding.ps1
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ✓ Make sure your mobile device is on the same WiFi network
                      </p>
                    </div>
                  )}
                  {networkLoading && (
                    <p className="text-sm text-muted-foreground">Detecting network addresses...</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Card className="p-8 bg-white">
                  <div className="space-y-4">
                    {!networkLoading && (
                      <>
                        <QRCodeSVG
                          value={getQRCodeUrl()}
                          size={256}
                          level="H"
                          includeMargin={true}
                        />
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Scan with your mobile camera
                          </p>
                        </div>
                      </>
                    )}
                    {networkLoading && (
                      <div className="w-64 h-64 flex items-center justify-center bg-muted rounded">
                        <p className="text-sm text-muted-foreground">Loading QR Code...</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Smartify?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Latest Devices</h3>
                <p className="text-sm text-muted-foreground">
                  Access to the newest smartphones and tablets from top brands
                </p>
              </Card>

              <Card className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Flexible Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Low monthly payments with 0% interest on select plans
                </p>
              </Card>

              <Card className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Secure Process</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level security for your personal and financial information
                </p>
              </Card>

              <Card className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Convenient Pickup</h3>
                <p className="text-sm text-muted-foreground">
                  Collect your device from any of our nationwide store locations
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Complete your application online and get your device delivered to your nearest store
            </p>
            <Button size="lg" onClick={() => setLocation('/apply')} data-testid="button-apply-now">
              Apply Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Smartify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
