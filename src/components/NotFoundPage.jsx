import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Frown } from "lucide-react";
import SEO from "@/components/SEO/SEO";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <SEO
        title="Page not found"
        description="The page you requested could not be found."
        noindex
      />
      {/* Abstract SVG graphic for visual flair */}
      <Frown className="w-24 h-24 mb-4 text-primary" />
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-4 max-w-sm text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or maybe you just mistyped the URL.
      </p>
      <Button onClick={handleGoHome} className="mt-8">
        Go Back Home
      </Button>
    </div>
  );
}
