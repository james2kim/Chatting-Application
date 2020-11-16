import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {LogoutHandler} from '../../../Services/AuthenticationService'
import logo from './logo.png'
import styles from './Navbar.module.css'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }, 
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const Navbar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {currentUser} = props
  const logout = LogoutHandler()

  const handleDropClose = () => {
    setDropdownOpen(false);
    setAnchorEl(null);
  };

  const handleDropOpen = event => {
    setDropdownOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const logoutHandler = async () => {
    await logout(currentUser[0].token);     
    document.location.reload();
  }


  const arrowIcon = () => {
      if (dropdownOpen) return <ArrowDropUpIcon />
      return <ArrowDropDownIcon />;
  };

  const classes = useStyles();

  if (!currentUser) return <h1>Reinitializing...</h1>
 
    return (
    <header className={[classes.root, styles.Navbar].join(' ')}>
      <AppBar position="static">
          <Toolbar className={styles.Navbar}>
              <img 
                alt="logo" 
                src={logo} 
                className={styles.Logo}/>
              <p 
                className={classes.title}/>
              <Button
                  aria-owns={anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={handleDropOpen}
                  className={classes.userDropdown}
                  color="inherit">
                  {currentUser[0].user.name}
                  {arrowIcon()}
              </Button>
              <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleDropClose}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}>
                    <MenuItem 
                      onClick={() => {
                      props.history.push('/account')}}>
                      Account Settings
                    </MenuItem>
                    <MenuItem 
                      onClick={logoutHandler}>
                      Logout
                    </MenuItem>
              </Menu>
          </Toolbar>
      </AppBar>
  </header>
);
}

export default Navbar

