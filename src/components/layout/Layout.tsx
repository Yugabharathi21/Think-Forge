
import { ReactNode } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 px-4 container mx-auto">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </TooltipProvider>
  );
};

export default Layout;
