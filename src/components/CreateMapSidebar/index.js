import React from 'react';

import {
    Drawer,
    Toolbar,
    List,
    Divider,
    ListItem,
    ListItemText
} from '@material-ui/core';

import { useStyles } from '../style.js';

const CreateMapSidebar = (props) => {
    const classes = useStyles();

    // Options for when active step is 0
    function exteriorMapOptions() {
        return (
            <List>

                <ListItem button key={"building"} onClick={() => { props.buttonClick("building") }}>
                    <ListItemText primary={"Building"} />
                </ListItem>
                <ListItem button key={"path"} onClick={() => { props.buttonClick("path") }}>
                    <ListItemText primary={"Path"} />
                </ListItem>

            </List>
        );
    }

    // Options for when active step is 1
    function internalMapOptions() {
        var disabled = props.buildingBeingViewed === null;
        return (
            <List>
                <ListItem disabled={disabled} button key={"entrance"} onClick={() => { props.buttonClick("entrance") }}>
                    <ListItemText primary={"Entrance"} />
                </ListItem>
                <ListItem disabled={disabled} button key={"room"} onClick={() => { props.buttonClick("room") }}>
                    <ListItemText primary={"Room"} />
                </ListItem>
                <ListItem disabled={disabled} button key={"stairs"} onClick={() => { props.buttonClick("stairs") }}>
                    <ListItemText primary={"Staircase"} />
                </ListItem>
                <ListItem disabled={disabled} button key={"lift"} onClick={() => { props.buttonClick("lifts") }}>
                    <ListItemText primary={"Lift"} />
                </ListItem>
                <ListItem disabled={disabled} button key={"path"} onClick={() => { props.buttonClick("path") }}>
                    <ListItemText primary={"Path"} />
                </ListItem>

            </List>
        );
    }

    return (

        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                {props.activeStep === 0 ? exteriorMapOptions() : internalMapOptions() }
                <Divider />
            </div>
        </Drawer>

    );
}

export default CreateMapSidebar;