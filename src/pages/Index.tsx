
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Calendar, Link as LinkIcon, RefreshCw, ArrowRight, AlertTriangle, Home, LayoutDashboard, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-8 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">PropertySync Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Create Account</Button>
          </Link>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 bg-gradient-to-b from-background to-muted/50">
          <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                One Dashboard for All Your Property Bookings
              </h1>
              <p className="text-muted-foreground md:text-lg md:max-w-2xl">
                Synchronize bookings across Airbnb, Booking.com, and all major platforms with our powerful calendar integration. Never double-book again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-video bg-muted relative rounded-lg overflow-hidden border shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center animate-pulse">
                    <Calendar className="h-16 w-16 text-primary" />
                    <RefreshCw className="h-8 w-8 text-primary mx-4 animate-spin" />
                    <Building className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30 px-4 md:px-6">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground text-center mb-12 md:max-w-2xl mx-auto">
              Everything you need to streamline your property management
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card rounded-lg p-6 shadow border">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <LinkIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Platform Integration</h3>
                <p className="text-muted-foreground">
                  Connect Airbnb, Booking.com, Vrbo with a single click
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow border">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Unified Calendar</h3>
                <p className="text-muted-foreground">
                  View all bookings in one place with color-coded platforms
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow border">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Conflict Detection</h3>
                <p className="text-muted-foreground">
                  Detect and resolve double bookings across platforms
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow border">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Synchronization</h3>
                <p className="text-muted-foreground">
                  Keep availability up-to-date across all platforms
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-center mb-12 md:max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Add Your Properties",
                  description: "Enter property details or import from existing platforms",
                  icon: Home
                },
                {
                  step: 2,
                  title: "Connect Your Platforms",
                  description: "Link accounts via iCal URLs",
                  icon: LinkIcon
                },
                {
                  step: 3,
                  title: "Manage Everything in One Place",
                  description: "Control all bookings from a single dashboard",
                  icon: LayoutDashboard
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center rounded-full bg-primary h-14 w-14 shadow-lg mb-4">
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="absolute top-0 -left-10 right-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-muted-foreground/20">
                        {item.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-muted/30 px-4 md:px-6">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-center mb-12 md:max-w-2xl mx-auto">
              Choose the plan that works for your business
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$9.99",
                  period: "per month",
                  features: [
                    "Up to 3 properties",
                    "Basic calendar sync",
                    "Email notifications"
                  ],
                  cta: "Start Free Trial",
                  highlighted: false
                },
                {
                  name: "Professional",
                  price: "$24.99",
                  period: "per month",
                  features: [
                    "Up to 10 properties",
                    "Advanced conflict resolution",
                    "Priority sync (every 15 minutes)"
                  ],
                  cta: "Start Free Trial",
                  highlighted: true
                },
                {
                  name: "Enterprise",
                  price: "$49.99",
                  period: "per month",
                  features: [
                    "Unlimited properties",
                    "Real-time sync",
                    "Team access"
                  ],
                  cta: "Contact Sales",
                  highlighted: false
                },
              ].map((plan) => (
                <div 
                  key={plan.name}
                  className={cn(
                    "rounded-lg overflow-hidden border",
                    plan.highlighted ? "border-primary shadow-lg scale-105" : "border-border bg-card",
                  )}
                >
                  <div 
                    className={cn(
                      "p-6",
                      plan.highlighted ? "bg-primary text-primary-foreground" : "bg-card"
                    )}
                  >
                    <h3 className={cn(
                      "text-xl font-semibold",
                      !plan.highlighted && "text-foreground"
                    )}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-background">
                    <ul className="space-y-4 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-t from-background to-muted/20">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to Simplify Your Property Management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 md:max-w-2xl mx-auto">
              Join thousands of property owners who have streamlined their booking management
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8">Start Your Free Trial</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="mt-auto py-8 px-4 md:px-6 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <span>PropertySync Hub &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Twitter</a>
              <a href="#" className="hover:text-foreground">LinkedIn</a>
              <a href="#" className="hover:text-foreground">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
