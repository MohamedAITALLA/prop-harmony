
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Calendar, Link as LinkIcon, RefreshCw, ArrowRight } from "lucide-react";

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
        <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6">
          <div className="container flex flex-col items-center text-center space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter md:max-w-3xl">
              Synchronize Your Property Listings Across Multiple Platforms
            </h1>
            <p className="text-muted-foreground md:text-lg md:max-w-2xl">
              PropertySync Hub allows property managers to effortlessly manage bookings and calendars across Airbnb, Booking.com, and all major platforms in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-muted/50 px-4 md:px-6">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12">
              Key Features
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow">
                <LinkIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multiple Platform Integration</h3>
                <p className="text-muted-foreground">
                  Connect with Airbnb, Booking.com, VRBO, Expedia and more with just a few clicks.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow">
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar Synchronization</h3>
                <p className="text-muted-foreground">
                  Keep your availability up-to-date across all platforms automatically.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow">
                <RefreshCw className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conflict Detection</h3>
                <p className="text-muted-foreground">
                  Automatically detect and resolve booking conflicts before they become problems.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Ready to simplify your property management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 md:max-w-2xl mx-auto">
              Join thousands of property managers who have streamlined their operations with PropertySync Hub.
            </p>
            <Link to="/register">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="mt-auto py-6 px-4 md:px-6 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>PropertySync Hub &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
