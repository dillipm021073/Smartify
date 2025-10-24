import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Smartphone, Shield, CreditCard, MapPin } from "lucide-react";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';

export default function Home() {
  const [, setLocation] = useLocation();

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
