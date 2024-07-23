// import React, { ReactNode, useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Menu,
//   MenuItem,
//   Divider,
//   ListItemIcon,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import PersonIcon from '@mui/icons-material/Person';
// import ReviewsIcon from '@mui/icons-material/Reviews';
// import HandshakeIcon from '@mui/icons-material/Handshake';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
// import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// interface AppTemplateProps {
//   children: ReactNode;
// }

// const AdminTemplate: React.FC<AppTemplateProps> = ({ children }) => {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     console.log('Logging out...');
//     // Add your logout logic here
//     localStorage.removeItem('code');
//     handleMenuClose();
//     navigate('/');
//   };

//   const handleMenuItemClick = (index: number) => {
//     setSelectedIndex(index);
//     handleDrawerClose();
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       {/* Drawer */}
//       <Drawer
//         variant="temporary"
//         anchor="left"
//         open={open}
//         onClose={handleDrawerClose}
//         sx={{
//           width: 240,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: 240,
//           },
//         }}
//       >
//         <List>
//           {/* Menu Options */}
//           <ListItem
//             button
//             component={RouterLink}
//             to="/employee"
//             selected={selectedIndex === 0}
//             onClick={() => handleMenuItemClick(0)}
//           >
//             <PersonIcon sx={{ mr: 1 }} color={selectedIndex === 0 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Empleados" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/reviews"
//             selected={selectedIndex === 1}
//             onClick={() => handleMenuItemClick(1)}
//           >
//             <ReviewsIcon sx={{ mr: 1 }} color={selectedIndex === 1 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Reseñas" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/partners"
//             selected={selectedIndex === 2}
//             onClick={() => handleMenuItemClick(2)}
//           >
//             <HandshakeIcon sx={{ mr: 1 }} color={selectedIndex === 2 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Socios" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/treatments"
//             selected={selectedIndex === 3}
//             onClick={() => handleMenuItemClick(3)}
//           >
//             <ManageAccountsIcon sx={{ mr: 1 }} color={selectedIndex === 3 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Tratamientos" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/services"
//             selected={selectedIndex === 4}
//             onClick={() => handleMenuItemClick(4)}
//           >
//             <SelfImprovementIcon sx={{ mr: 1 }} color={selectedIndex === 4 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Servicios" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/videos"
//             selected={selectedIndex === 5}
//             onClick={() => handleMenuItemClick(5)}
//           >
//             <SlowMotionVideoIcon sx={{ mr: 1 }} color={selectedIndex === 5 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Videos" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/questions"
//             selected={selectedIndex === 6}
//             onClick={() => handleMenuItemClick(6)}
//           >
//             <HelpOutlineIcon sx={{ mr: 1 }} color={selectedIndex === 6 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Responder Dudas" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/branches"
//             selected={selectedIndex === 7}
//             onClick={() => handleMenuItemClick(7)}
//           >
//             <HouseOutlinedIcon sx={{ mr: 1 }} color={selectedIndex === 7 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Sucursales" />
//           </ListItem>
//           <Divider />
//           <ListItem
//             button
//             component={RouterLink}
//             to="/appointment"
//             selected={selectedIndex === 8}
//             onClick={() => handleMenuItemClick(8)}
//           >
//             <HouseOutlinedIcon sx={{ mr: 1 }} color={selectedIndex === 8 ? 'primary' : 'inherit'} />
//             <ListItemText primary="Agenda" />
//           </ListItem>
//           <Divider />
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <div style={{ marginLeft: open ? 240 : 0, width: '100%', transition: 'margin-left 0.3s ease' }}>
//         <AppBar position="static" sx={{ backgroundColor: '#00D6B2' }}>
//           <Toolbar>
//             <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
//               <MenuIcon />
//             </IconButton>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: 'yellow' }}
//             >
//               H A R M O N Y
//               {/* <img
//                 src="https://e7.pngegg.com/pngimages/303/436/png-clipart-cabinet-de-physiotherapie-y-physio-logo-physical-therapy-organization-physiotherapist-physiotherapie-logo-text-logo.png"
//                 alt="Logo"
//                 style={{
//                   width: '30px',
//                   height: '50px',
//                   marginRight: '16px',
//                   borderRadius: '50px 50px'
//                 }}
//               /> */}
//             </Typography>
//             {/* Profile Menu Trigger */}
//             <IconButton
//               color="inherit"
//               onClick={handleMenuOpen}
//               aria-label="account of current user"
//               aria-controls="profile-menu"
//               aria-haspopup="true"
//             >
//               <AccountCircleIcon />
//             </IconButton>
//           </Toolbar>
//         </AppBar>
//         {children}
//       </div>

//       {/* Profile Menu */}
//       <Menu id="profile-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         <MenuItem onClick={handleLogout}>
//           <ListItemIcon>
//             <ExitToAppIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Cerrar Sesión" />
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default AdminTemplate;


import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import ReviewsIcon from '@mui/icons-material/Reviews';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';

interface AppTemplateProps {
  children: ReactNode;
}

const AdminTemplate: React.FC<AppTemplateProps> = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('code');
    localStorage.removeItem('photo');
    localStorage.removeItem('fullName');
    localStorage.removeItem('_id');
    handleMenuClose();
    navigate('/');
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    handleDrawerClose();
  };

  const profileImage = localStorage.getItem('photo')?.toString() || ''; // Adjust key as necessary
  // console.log({profileImage})


  return (
    <div style={{ display: 'flex' }}>
      {/* Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
          },
        }}
      >
        <List>
          {/* Menu Options */}
          <ListItem
            button
            component={RouterLink}
            to="/employee"
            selected={selectedIndex === 0}
            onClick={() => handleMenuItemClick(0)}
          >
            <PersonIcon sx={{ mr: 1 }} color={selectedIndex === 0 || selectedIndex === null ? 'primary' : 'inherit'} />
            <ListItemText primary="Empleados" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/reviews"
            selected={selectedIndex === 1}
            onClick={() => handleMenuItemClick(1)}
          >
            <ReviewsIcon sx={{ mr: 1 }} color={selectedIndex === 1 ? 'primary' : 'inherit'} />
            <ListItemText primary="Reseñas" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/partners"
            selected={selectedIndex === 2}
            onClick={() => handleMenuItemClick(2)}
          >
            <HandshakeIcon sx={{ mr: 1 }} color={selectedIndex === 2 ? 'primary' : 'inherit'} />
            <ListItemText primary="Socios" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/treatments"
            selected={selectedIndex === 3}
            onClick={() => handleMenuItemClick(3)}
          >
            <ManageAccountsIcon sx={{ mr: 1 }} color={selectedIndex === 3 ? 'primary' : 'inherit'} />
            <ListItemText primary="Tratamientos" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/services"
            selected={selectedIndex === 4}
            onClick={() => handleMenuItemClick(4)}
          >
            <SelfImprovementIcon sx={{ mr: 1 }} color={selectedIndex === 4 ? 'primary' : 'inherit'} />
            <ListItemText primary="Servicios" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/videos"
            selected={selectedIndex === 5}
            onClick={() => handleMenuItemClick(5)}
          >
            <SlowMotionVideoIcon sx={{ mr: 1 }} color={selectedIndex === 5 ? 'primary' : 'inherit'} />
            <ListItemText primary="Videos" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/questions"
            selected={selectedIndex === 6}
            onClick={() => handleMenuItemClick(6)}
          >
            <HelpOutlineIcon sx={{ mr: 1 }} color={selectedIndex === 6 ? 'primary' : 'inherit'} />
            <ListItemText primary="Responder Dudas" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/branches"
            selected={selectedIndex === 7}
            onClick={() => handleMenuItemClick(7)}
          >
            <HouseOutlinedIcon sx={{ mr: 1 }} color={selectedIndex === 7 ? 'primary' : 'inherit'} />
            <ListItemText primary="Sucursales" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={RouterLink}
            to="/appointment"
            selected={selectedIndex === 8}
            onClick={() => handleMenuItemClick(8)}
          >
            <HouseOutlinedIcon sx={{ mr: 1 }} color={selectedIndex === 8 ? 'primary' : 'inherit'} />
            <ListItemText primary="Agenda" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ marginLeft: open ? 240 : 0, width: '100%', transition: 'margin-left 0.3s ease' }}>
        <AppBar position="static" sx={{ backgroundColor: '#00D6B2' }}>
        
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: 'yellow' }}
            >
              H A R M O N Y
            </Typography>
            {/* Profile Menu Trigger with Image */}
            <Tooltip title={localStorage.getItem('fullname')}>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <img 
                src={profileImage}
                alt="Profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }} // Adjust size as needed
              />
            </IconButton>
            </Tooltip>
          </Toolbar>
          
        </AppBar>
        {children}
      </div>

      {/* Profile Menu */}
      <Menu id="profile-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AdminTemplate;
