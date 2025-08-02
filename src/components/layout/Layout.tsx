
import { ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { mode } = useTheme();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ flexGrow: 1, pt: 12, px: { xs: 2, sm: 3, md: 4 } }}>
        {children}
      </Container>
      {!hideFooter && <Footer />}
    </Box>
  );
};

export default Layout;
