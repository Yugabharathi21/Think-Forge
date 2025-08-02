import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery,
  Paper
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
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface MaterialLayoutProps {
  children: React.ReactNode;
}

const MaterialLayout: React.FC<MaterialLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Home', path: '/', icon: <BrainIcon /> },
    { title: 'AI Chat', path: '/chat', icon: <ChatIcon /> },
    { title: 'MCQ Quiz', path: '/mcq-quiz', icon: <QuizIcon /> },
    { title: 'Progress', path: '/progress', icon: <ProgressIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 600 }}>
        ThinkForge
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ 
                textAlign: 'start',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: muiTheme.palette.mode === 'light' 
                    ? 'rgba(134, 26, 255, 0.08)'
                    : 'rgba(134, 26, 255, 0.16)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={toggleColorMode}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <BrainIcon 
              sx={{ mr: 1, color: 'primary.contrastText' }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 600,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ThinkForge
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 600,
                  color: 'inherit',
                  textDecoration: 'none',
                  alignItems: 'center'
                }}
              >
                ThinkForge
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    color: 'white',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      right: 8,
                      height: 2,
                      backgroundColor: 'white',
                      transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease'
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)'
                    }
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>

              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt={user?.name || "User"} 
                        src={user?.photoURL || undefined} 
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        {user?.name?.[0] || "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                      <ListItemIcon>
                        <UserIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Settings</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    component={Link} 
                    to="/login"
                    variant="text"
                    sx={{ color: 'white' }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/signup" 
                    variant="contained"
                    color="secondary"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        <Container maxWidth="xl" sx={{ 
          py: 3, 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1 
        }}>
          {children}
        </Container>
      </Box>
      
      <Paper 
        component="footer" 
        square 
        elevation={3}
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          bgcolor: mode === 'light' ? 'grey.100' : 'background.paper' 
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BrainIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                ThinkForge © {new Date().getFullYear()}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 1, sm: 3 },
              alignItems: 'center'
            }}>
              <Typography component={Link} to="/about" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
                About
              </Typography>
              <Typography component={Link} to="/privacy" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
                Privacy Policy
              </Typography>
              <Typography component={Link} to="/terms" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default MaterialLayout;
