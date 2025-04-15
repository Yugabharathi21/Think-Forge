
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-thinkforge-black p-4">
      <div className="glass-card p-8 rounded-xl neon-border max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-thinkforge-purple mb-2">404</h1>
          <p className="text-xl font-semibold mb-4">Page Not Found</p>
          <p className="text-foreground/70 text-sm mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-thinkforge-purple hover:bg-thinkforge-purple/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
