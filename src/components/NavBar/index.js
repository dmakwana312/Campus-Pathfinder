import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, List, ListItem,
    Grid, SwipeableDrawer, Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useStyles } from '../style.js';

const NavBar = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();

    const [drawerOpen, setDrawerOpen] = useState(false);

    //Small Screens
    const createDrawer = () => {
        return (
            <div>
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
                            <ListItem key={1} button divider> Option 1 </ListItem>
                            <ListItem key={2} button divider> Option 2 </ListItem>
                            <ListItem key={3} button divider> Option 3 </ListItem>
                        </List>

                    </div>
                </SwipeableDrawer>

            </div>
        );
    }

    //Larger Screens
    const destroyDrawer = () => {
        return (
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography style={{ flexGrow: 1 }} color="inherit" >Title</Typography>
                    <Button className={classes.button} color="inherit">OPTION 1</Button>
                    <Button className={classes.button} color="inherit">OPTION 2</Button>
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