import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from "framer-motion";
import Layout from '@/components/layout/Layout';

const MaterialNotFound = () => {
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <Container 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 250px)',
          pt: 6,
          pb: 6 
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 500 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 5, 
              textAlign: 'center',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: theme.palette.primary.main,
              }} 
            />
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '5rem',
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              404
            </Typography>
            
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Page Not Found
            </Typography>
            
            <Typography 
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            
            <Button 
              component={RouterLink} 
              to="/"
              variant="contained"
              startIcon={<ArrowBackIcon />}
              size="large"
            >
              Return to Home
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default MaterialNotFound;
