import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ReviewSection, { ReviewItem } from "@/components/ReviewSection";
import { Search, FileText, CheckCircle2, XCircle, LogOut } from "lucide-react";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';

// todo: remove mock functionality
const mockApplications = [
  {
    id: '1',
    cartId: 'CART-17613046178401234',
    email: 'john.doe@email.com',
    nationalId: '1234-5678-9012',
    status: 'pending' as const,
    device: 'Premium Flagship - 256GB',
    plan: 'Unlimited Data Plan',
    submittedAt: '2024-01-15 10:30 AM',
    idType: 'Philippine Passport',
    address: '123 Main St, Makati City',
    employment: 'Full-time Employee at ABC Corp',
    monthlyIncome: '₱50,000 - ₱75,000'
  },
  {
    id: '2',
    cartId: 'CART-17613046178405678',
    email: 'jane.smith@email.com',
    nationalId: '9876-5432-1098',
    status: 'in_review' as const,
    device: 'Mid-Range Pro - 128GB',
    plan: 'Basic Plan',
    submittedAt: '2024-01-14 02:15 PM',
    idType: 'National ID',
    address: '456 Oak Ave, Quezon City',
    employment: 'Self-employed',
    monthlyIncome: '₱25,000 - ₱50,000'
  }
];

export default function AgentPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<typeof mockApplications[0] | null>(null);
  const [notes, setNotes] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Agent login:', username);
    setIsLoggedIn(true);
  };

  const filteredApplications = mockApplications.filter(app =>
    app.cartId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.nationalId.includes(searchQuery) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
      case 'in_review': return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'approved': return 'bg-green-500/10 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-500/10 text-red-700 border-red-300';
      default: return '';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <img src={logoImage} alt="Smartify" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Agent Portal</h1>
            <p className="text-muted-foreground">Sign in to review applications</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="agent.username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
              />
            </div>

            <Button type="submit" className="w-full" data-testid="button-login">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoImage} alt="Smartify" className="h-8" />
              <h1 className="text-lg font-semibold text-foreground">Agent Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLoggedIn(false)}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList>
            <TabsTrigger value="search" data-testid="tab-search">
              <Search className="w-4 h-4 mr-2" />
              Search Applications
            </TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedApp} data-testid="tab-detail">
              <FileText className="w-4 h-4 mr-2" />
              Application Detail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Cart ID, National ID, or Email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Found {filteredApplications.length} application(s)
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="p-6 hover-elevate cursor-pointer" onClick={() => setSelectedApp(app)}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{app.email}</h3>
                          <p className="text-sm text-muted-foreground">Cart ID: {app.cartId}</p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Device:</span>{' '}
                          <span className="text-foreground">{app.device}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Plan:</span>{' '}
                          <span className="text-foreground">{app.plan}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>{' '}
                          <span className="text-foreground">{app.submittedAt}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">National ID:</span>{' '}
                          <span className="text-foreground">{app.nationalId}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" data-testid={`button-view-${app.id}`}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            {selectedApp && (
              <>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        Application Details
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Cart ID: {selectedApp.cartId}
                      </p>
                    </div>
                    <Badge className={getStatusColor(selectedApp.status)}>
                      {selectedApp.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <ReviewSection title="Product Information" defaultOpen>
                      <ReviewItem label="Device" value={selectedApp.device} />
                      <ReviewItem label="Plan" value={selectedApp.plan} />
                      <ReviewItem label="Submitted Date" value={selectedApp.submittedAt} />
                    </ReviewSection>

                    <ReviewSection title="Customer Information">
                      <ReviewItem label="Email" value={selectedApp.email} />
                      <ReviewItem label="National ID" value={selectedApp.nationalId} />
                      <ReviewItem label="ID Type" value={selectedApp.idType} />
                      <ReviewItem label="Address" value={selectedApp.address} />
                    </ReviewSection>

                    <ReviewSection title="Employment Information">
                      <ReviewItem label="Employment" value={selectedApp.employment} />
                      <ReviewItem label="Monthly Income" value={selectedApp.monthlyIncome} />
                    </ReviewSection>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Agent Notes</h3>
                  <Textarea
                    placeholder="Add internal notes about this application..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-32"
                    data-testid="textarea-notes"
                  />
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Process Application</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        console.log('Application rejected');
                        setSelectedApp(null);
                      }}
                      data-testid="button-reject"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        console.log('Application approved');
                        setSelectedApp(null);
                      }}
                      data-testid="button-approve"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve & Submit to Cart
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
