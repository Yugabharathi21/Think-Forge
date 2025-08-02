
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider, 
  IconButton,
  useTheme
} from '@mui/material';
import BrainIcon from '@mui/icons-material/Psychology';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

const Footer = () => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        mt: 10,
        bgcolor: mode === 'dark' ? 'background.paper' : 'grey.100',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mb: 2 }}>
                <BrainIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    background: 'linear-gradient(to right, #861aff, #c87eff)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}
                >
                  ThinkForge
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Identify and improve your academic weak areas through AI-powered interactive quizzes.
              </Typography>
              <Box>
                <IconButton aria-label="GitHub" size="small" color="inherit">
                  <GitHubIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="Twitter" size="small" color="inherit" sx={{ ml: 1 }}>
                  <TwitterIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="primary" fontWeight="medium" gutterBottom>
              Product
            </Typography>
            <Link component={RouterLink} to="/features" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Features
            </Link>
            <Link component={RouterLink} to="/pricing" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Pricing
            </Link>
            <Link component={RouterLink} to="/testimonials" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Testimonials
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="primary" fontWeight="medium" gutterBottom>
              Resources
            </Typography>
            <Link component={RouterLink} to="/blog" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Blog
            </Link>
            <Link component={RouterLink} to="/faq" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              FAQ
            </Link>
            <Link component={RouterLink} to="/support" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Support
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="primary" fontWeight="medium" gutterBottom>
              Legal
            </Typography>
            <Link component={RouterLink} to="/privacy" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Privacy
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" sx={{ display: 'block', mt: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Terms
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} ThinkForge. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
