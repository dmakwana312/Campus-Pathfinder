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

import Firebase from '../../utils/firebase';

import { loggedInUser, setUser } from '../../utils/userState';

import { useStyles } from '../style.js';

const NavBar = (props) => {

    const theme = useTheme();

    // Check if device is a mobile device
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();

    // State to track if drawer is open (responsive)
    const [drawerOpen, setDrawerOpen] = useState(false);

    function logout() {
        Firebase.auth().signOut();
        setUser(null)
    }

    // Create a drawer for mobile devices
    const createDrawer = () => {
        return (
            <div>
                {/* Navbar */}
                <AppBar className={classes.createMapAppBar}>
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
                            <ListItem id={"previousStepLink"} key={1} onClick={props.decrementStep} button divider> Previous Step </ListItem>
                            <ListItem id={"nextStepLink"} key={2} onClick={props.incrementStep} button divider> Next Step </ListItem>
                            <ListItem id={"loginLogoutButton"} key={3} button divider onClick={loggedInUser === null ? () => {} : logout}>{loggedInUser === null ? "Login" : "Logout"} </ListItem>

                        </List>
                    </div>
                    
                </SwipeableDrawer>

            </div>
        );
    }

    // Only create navbar for non-mobile devices
    const destroyDrawer = () => {
        return (
            <AppBar className={classes.createMapAppBar}>
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }} color="inherit" >Capus Pathfinder</Typography>
                    <Button id={"previousStepLink"} onClick={props.decrementStep} className={classes.button} color="inherit">Previous Step</Button>
                    <Button id={"nextStepLink"} onClick={props.incrementStep} className={classes.button} color="inherit">Next Step</Button>
                    <Button id={"loginLogoutButton"} className={classes.button} color="inherit" onClick={loggedInUser === null ? () => {} : logout}>{loggedInUser === null ? "Login" : "Logout"}</Button>
                </Toolbar>
            </AppBar>
        )
    }

    return (
        isMobile ? createDrawer() : destroyDrawer()
    );


}


export default NavBar;