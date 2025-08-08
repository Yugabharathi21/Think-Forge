
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme as useMuiTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BrainIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import QuizIcon from '@mui/icons-material/Quiz';
import ProgressIcon from '@mui/icons-material/Leaderboard';
import UserIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    handleCloseUserMenu();
  };

  const getInitials = (email: string) => {
    return email?.split('@')[0].substring(0, 2).toUpperCase() || 'U';
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <BrainIcon /> },
    { name: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
    { name: 'MCQ Quiz', path: '/mcq-quiz', icon: <QuizIcon /> },
    { name: 'Progress', path: '/progress', icon: <ProgressIcon /> },
    { name: 'Flowchart Studio', path: '/flowchart', icon: <AccountTreeIcon /> },
    // Development/Demo routes (can be hidden in production)
    ...(process.env.NODE_ENV === 'development' ? [
      { name: 'YouTube Demo', path: '/youtube-demo', icon: <AccountTreeIcon /> },
    ] : []),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <BrainIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ background: 'linear-gradient(to right, #861aff, #c87eff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ThinkForge
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                textAlign: 'left',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ p: 2 }}>
        <Button 
          variant="outlined"
          startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleColorMode}
          fullWidth
          sx={{ mb: 1 }}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        
        {isAuthenticated ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            fullWidth
          >
            Sign Out
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              fullWidth
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ 
        bgcolor: mode === 'dark' ? 'background.paper' : 'white',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Mobile menu icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BrainIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #861aff, #c87eff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                ThinkForge
              </Typography>
              
              {/* Mobile Logo */}
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #861aff, #c87eff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                ThinkForge
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: 'text.primary', 
                    mx: 1,
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.name}
                </Button>
              ))}
              
              {/* Theme Toggle Button */}
              <IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <Box>
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {user?.email ? getInitials(user.email) : 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem component={RouterLink} to="/profile">
                      <ListItemIcon>
                        <UserIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography>Profile</Typography>
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/settings">
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography>Settings</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography>Sign Out</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', ml: 2 }}>
                  <Button 
                    component={RouterLink} 
                    to="/login" 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/signup" 
                    variant="contained"
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        container={document.body}
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
