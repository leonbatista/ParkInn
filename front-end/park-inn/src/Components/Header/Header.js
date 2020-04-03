import React from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem, Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Sidebar from '../Sidebar/Sidebar';

export default props => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div class="header">
            <Sidebar />
            <div class="header-right">
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <AccountCircleIcon style={{ padding: 10 }} fontSize="large" />
                </Button>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <NavLink className="link" to='/management'>
                        <MenuItem onClick={handleClose}>Account Settings</MenuItem>
                    </NavLink>
                    
                    <NavLink className="link" to="/">
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </NavLink>
                </Menu>
            </div>
        </div>
    )
}