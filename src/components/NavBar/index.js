import React, { useState } from 'react';
import {
    AppBar, 
    Toolbar, 
    Typography, 
    List, 
    ListItem,
    Grid, 
    SwipeableDrawer, 
    Button,
    useTheme,
    useMediaQuery
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import { loggedInUser, setUser } from '../../utils/userState';

import Firebase from '../../utils/firebase';

import { Redirect } from 'react-router';

import { useStyles } from '../style.js';

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
                            <Typography color="inherit">Capus Pathfinder</Typography>
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
                            <ListItem key={1} id={"createMapLink"} button divider onClick={event =>  window.location.href='#/createmap'}>Create Map Map </ListItem>
                            <ListItem key={2} id={"viewMapLink"} button divider onClick={event =>  window.location.href='#/viewmap'}>View Map </ListItem>
                            <ListItem key={3} id={"viewAdminLink"} button divider onClick={event =>  window.location.href='#/admin'}>Admin </ListItem>
                            <ListItem key={4} id={"loginLogoutButton"} button divider onClick={user === null ? () => {} : logout}>{user === null ? "Login" : "Logout"} </ListItem>
                            
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
                    <Typography style={{ flexGrow: 1 }} color="inherit" >Capus Pathfinder</Typography>
                    <Button id={"createMapLink"} className={classes.button} color="inherit" onClick={event =>  window.location.href='#/createmap'}>Create Map</Button>
                    <Button id={"viewMapLink"} className={classes.button} color="inherit" onClick={event =>  window.location.href='#/viewmap'}>View Map</Button>
                    <Button id={"viewAdminLink"} className={classes.button} color="inherit" onClick={event =>  window.location.href='#/admin'}>Admin</Button>
                    <Button id={"loginLogoutButton"} className={classes.button} color="inherit" onClick={user === null ? () => {} : logout}>{user === null ? "Login" : "Logout"}</Button>

                </Toolbar>
            </AppBar>
        )
    }

    return (
        isMobile ? createDrawer() : destroyDrawer()
    );


}


export default NavBar;