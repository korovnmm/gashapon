import React from "react";
import pinklogo from "assets/gashapon_pink.png"
import greenlogo from "assets/gashapon_green.png"
import { useHistory } from 'react-router-dom'
//import { getTicketByCode } from 'db'

import { 
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Stack,
    Grid,

    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Avatar
} from '@mui/material'  

//import { Link } from 'react-router-dom'
import { useCallback } from "react";


export const FormContainer = ({...props}) => {
    const location = useHistory();
    
    const handleClick = useCallback(async e => {
        e.preventDefault(); // prevents auto-refresh

        const { shopTag, digitKey } = e.target.elements;
        console.log(shopTag.value, digitKey.value);
        location.push(`/redeem/${shopTag.value}/${digitKey.value}`);
    }, [location]);

    return (
        <div>
            <Box component="center"
                sx={{
                    '& > :not(style)': { m: 1, width: '40ch', height: '20ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Box {...props} component="form" onSubmit={handleClick}
                    sx={{
                        boxShadow: 3,
                        bgcolor: 'background.paper',

                        color: 'black',
                        p: 4,
                        m: 2,
                        borderRadius: 4,
                    }}
                    noValidate
                    autoComplete="off"
                />
            </Box>
        </div>
    )
}


export const Home = () => {
    return (
        <>
            <Container maxWidth="lg">
            <FormContainer>        
                <Typography variant="h2" component="h2" > Welcome!</Typography>
                <Typography variant="body" component="body" align="center"> Please Enter Play Code</Typography>
                <TextField required id="shopTag" type="shopTag" label="Shop Tag" autoComplete="off"/>
                <TextField required id="digitKey" type="digitKey" label="Digit Key" autoComplete="off" />                
                <Stack spacing={10} direction="column">
            
                <Button variant="outlined" color ="secondary" type="submit"  >Enter</Button>
                <Typography variant="overline" component="overline" align="center"> (No account needed to play)</Typography>
                
                </Stack>
            </FormContainer>      

            <Grid container justifyContent="space-between"> 
            <Box
                component="img"
                sx={{
                    justifyContent: 'flex-start',
                    height: 500,
                    width: 300,
                    maxHeight: { xs: 500, md: 250 },
                    maxWidth: { xs: 300, md: 150 },
                }}
                src={greenlogo}
            />
        
            <Box 
                component="img"
                sx={{
                    height: 500,
                    width: 300,
                    maxHeight: { xs: 500, md: 250 },
                    maxWidth: { xs: 300, md: 150 },
                }}
                src={pinklogo}
            />
            </Grid>
            </Container>
        </>
    )
}

//Navbar


const pages = ['Dashboard', 'Overview', 'Tickets'];
const settings = ['Dashboard', 'Overview', 'Tickets'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};