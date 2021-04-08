import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, List, ListItem,
    Grid, SwipeableDrawer, Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useStyles } from '../style.js';

const NavBar = (props) => {

    const theme = useTheme();

    // Check if device is a mobile device
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();

    // State to track if drawer is open (responsive)
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Create a drawer for mobile devices
    const createDrawer = () => {
        return (
            <div>
                {/* Navbar */}
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <MenuIcon
                                className={classes.sideBarIcon}
                                onClick={() => { setDrawerOpen(true) }} />
                            <Typography color="inherit">Title</Typography>
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
                            <ListItem key={1} onClick={props.decrementStep} button divider> Previous Step </ListItem>
                            <ListItem key={2} onClick={props.incrementStep} button divider> Next Step </ListItem>
                            <ListItem key={3} button divider> Option 3 </ListItem>
                        </List>
                    </div>
                    
                </SwipeableDrawer>

            </div>
        );
    }

    // Only create navbar for non-mobile devices
    const destroyDrawer = () => {
        return (
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }} color="inherit" >Title</Typography>
                    <Button onClick={props.decrementStep} className={classes.button} color="inherit">Previous Step</Button>
                    <Button onClick={props.incrementStep} className={classes.button} color="inherit">Next Step</Button>
                    <Button className={classes.button} color="inherit">OPTION 3</Button>
                </Toolbar>
            </AppBar>
        )
    }

    return (
        isMobile ? createDrawer() : destroyDrawer()
    );


}


export default NavBar;