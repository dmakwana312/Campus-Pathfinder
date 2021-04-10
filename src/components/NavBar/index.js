import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, List, ListItem,
    Grid, SwipeableDrawer, Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useStyles } from '../style.js';

import { loggedInUser, setUser } from '../../utils/userState';

import Firebase from '../../utils/firebase';
import { Redirect } from 'react-router-dom';

const NavBar = (props) => {

    const theme = useTheme();

    // Check if device is a mobile device
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();

    // State to track if drawer is open (responsive)
    const [drawerOpen, setDrawerOpen] = useState(false);

    const user = loggedInUser.use();

    function logout() {
        Firebase.auth().signOut();
        setUser(null)
    }

    // Create a drawer for mobile devices
    const createDrawer = () => {
        return (
            <div>
                {/* Navbar */}
                <AppBar>
                    <Toolbar>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <MenuIcon
                                className={classes.sideBarIcon}
                                onClick={() => { setDrawerOpen(true) }} />
                            <Typography color="inherit">Campus Route Finder</Typography>
                            <Typography color="inherit"></Typography>
                        </Grid>
                    </Toolbar>
                </AppBar>

                {/* Sidebar for options */}
                <SwipeableDrawer
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false) }}
                    onOpen={() => { setDrawerOpen(true) }}>

                    <div
                        tabIndex={0}
                        role="button"
                        onClick={() => { setDrawerOpen(false) }}
                        onKeyDown={() => { setDrawerOpen(false) }}>

                        <List className={classes.list}>
                            <ListItem key={1} button divider onClick={user === null ? () =>() => {} : logout}>{user === null ? "Login" : "Logout"} </ListItem>
                        </List>
                    </div>

                </SwipeableDrawer>

            </div>
        );
    }

    // Only create navbar for non-mobile devices
    const destroyDrawer = () => {
        return (
            <AppBar>
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }} color="inherit" >Campus Route Finder</Typography>
                    <Button className={classes.button} color="inherit" onClick={user === null ? () => {} : logout}>{user === null ? "Login" : "Logout"}</Button>
                </Toolbar>
            </AppBar>
        )
    }

    return (
        isMobile ? createDrawer() : destroyDrawer()
    );


}


export default NavBar;