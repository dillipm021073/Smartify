import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ReviewSection, { ReviewItem } from "@/components/ReviewSection";
import { Search, FileText, CheckCircle2, XCircle, LogOut, Loader2 } from "lucide-react";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';
import { useAgentLogin, useAgentApplications, type Application } from "@/lib/api";
import AgentReviewFlow from "./AgentReviewFlow";

export default function AgentPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentFullName, setAgentFullName] = useState('');
  const [agentStoreId, setAgentStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);

  const loginMutation = useAgentLogin();
  const { data: applications, isLoading: applicationsLoading, refetch: refetchApplications } = useAgentApplications(agentId);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    loginMutation.mutate({ username, password }, {
      onSuccess: (data) => {
        console.log('Agent logged in:', data);
        setIsLoggedIn(true);
        setAgentId(data.agent.id);
        setAgentFullName(data.agent.fullName || username);
        setAgentStoreId(data.agent.storeId || '');
      },
      onError: (error: any) => {
        console.error('Login failed:', error);
        setLoginError(error.message || 'Invalid username or password');
      }
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAgentId(null);
    setAgentFullName('');
    setAgentStoreId('');
    setUsername('');
    setPassword('');
    setSearchQuery('');
    setSelectedApp(null);
    setNotes('');
    setLoginError('');
    setIsReviewMode(false);
  };

  const handleStartReview = () => {
    setIsReviewMode(true);
  };

  const handleReviewComplete = () => {
    setIsReviewMode(false);
    setSelectedApp(null);
    refetchApplications();
  };

  const handleReviewCancel = () => {
    setIsReviewMode(false);
  };

  // Filter applications based on search query
  const filteredApplications = applications?.filter(app => {
    const query = searchQuery.toLowerCase();
    return (
      app.cartId?.toLowerCase().includes(query) ||
      app.customerIdNumber?.toLowerCase().includes(query) ||
      app.email?.toLowerCase().includes(query)
    );
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
      case 'submitted': return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'verified': return 'bg-green-500/10 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-500/10 text-red-700 border-red-300';
      default: return '';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            {loginError && (
              <div className="bg-red-500/10 text-red-700 border border-red-300 rounded-md p-3 text-sm">
                {loginError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="agent.username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
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
                {agentFullName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
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
                    placeholder="Search by Cart ID, Customer ID, or Email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  {applicationsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading applications...
                    </div>
                  ) : (
                    `Found ${filteredApplications.length} application(s)`
                  )}
                </div>
              </div>
            </Card>

            {applicationsLoading ? (
              <Card className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading applications...</p>
              </Card>
            ) : filteredApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No applications found matching your search.' : 'No applications available.'}
                </p>
              </Card>
            ) : (
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
                            {app.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">SIM Type:</span>{' '}
                            <span className="text-foreground">{app.simType || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID Number:</span>{' '}
                            <span className="text-foreground">{app.customerIdNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>{' '}
                            <span className="text-foreground">{formatDate(app.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>{' '}
                            <span className="text-foreground">{app.status}</span>
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
            )}
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            {selectedApp && isReviewMode ? (
              <AgentReviewFlow
                application={selectedApp}
                agentId={agentId || ''}
                agentName={agentFullName}
                storeId={agentStoreId}
                onComplete={handleReviewComplete}
                onCancel={handleReviewCancel}
              />
            ) : selectedApp && (
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Application ID: {selectedApp.id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(selectedApp.status)}>
                      {selectedApp.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <ReviewSection title="Application Information" defaultOpen>
                      <ReviewItem label="Email" value={selectedApp.email} />
                      <ReviewItem label="SIM Type" value={selectedApp.simType || 'N/A'} />
                      <ReviewItem label="Status" value={selectedApp.status} />
                      <ReviewItem label="Created At" value={formatDate(selectedApp.createdAt)} />
                      <ReviewItem label="Updated At" value={formatDate(selectedApp.updatedAt)} />
                      {selectedApp.submittedAt && (
                        <ReviewItem label="Submitted At" value={formatDate(selectedApp.submittedAt)} />
                      )}
                    </ReviewSection>

                    <ReviewSection title="Customer Identification">
                      <ReviewItem label="ID Type" value={selectedApp.customerIdType || 'Not provided'} />
                      <ReviewItem label="ID Number" value={selectedApp.customerIdNumber || 'Not provided'} />
                      <ReviewItem label="Email Verified" value={selectedApp.emailVerified ? 'Yes' : 'No'} />
                    </ReviewSection>

                    <ReviewSection title="Assignment">
                      <ReviewItem label="Assigned Agent ID" value={selectedApp.assignedAgentId || 'Not assigned'} />
                      <ReviewItem label="Store ID" value={selectedApp.storeId || 'Not assigned'} />
                      <ReviewItem label="Assigned Number" value={selectedApp.assignedNumber || 'Not assigned'} />
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
                        alert('Reject functionality to be implemented');
                      }}
                      disabled={selectedApp.status === 'verified'}
                      data-testid="button-reject"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleStartReview}
                      disabled={selectedApp.status === 'verified'}
                      data-testid="button-approve"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Start Review Process
                    </Button>
                  </div>
                  {selectedApp.status === 'verified' && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      This application has already been verified and cannot be modified.
                    </p>
                  )}
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
