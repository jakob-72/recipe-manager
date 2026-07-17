import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router';
import { useAuth } from '../auth/useAuth.ts';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import * as React from 'react';

export const Header = () => {
  const { authenticated, username, login, logout } = useAuth();
  const initials = username ? username.slice(0, 2).toUpperCase() : '?';

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    void logout();
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ top: 0, left: 0, right: 0, width: '100%' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <RestaurantMenuIcon sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 700, letterSpacing: 0.5, lineHeight: 1 }}
          >
            Recipe Manager
          </Typography>
        </Box>

        {authenticated ? (
          <>
            <Tooltip title={`${username ?? 'User'} · Open menu`}>
              <IconButton
                onClick={handleOpenUserMenu}
                color="inherit"
                aria-label="Open user menu"
                aria-controls={isUserMenuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen ? 'true' : undefined}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              id="user-menu"
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={() => void login(window.location.href)}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Log in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
