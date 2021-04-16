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

                <ListItem id={"createBuilding"} button key={"building"} onClick={() => { props.buttonClick("building") }}>
                    <ListItemText primary={"Building"} />
                </ListItem>
                <ListItem id={"createPath"} button key={"path"} onClick={() => { props.buttonClick("path") }}>
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
                <ListItem id={"createEntrance"} disabled={disabled} button key={"entrance"} onClick={() => { props.buttonClick("entrance") }}>
                    <ListItemText primary={"Entrance"} />
                </ListItem>
                <ListItem id={"createRoom"} disabled={disabled} button key={"room"} onClick={() => { props.buttonClick("room") }}>
                    <ListItemText primary={"Room"} />
                </ListItem>
                <ListItem id={"createStaircase"} disabled={disabled} button key={"stairs"} onClick={() => { props.buttonClick("stairs") }}>
                    <ListItemText primary={"Staircase"} />
                </ListItem>
                <ListItem id={"createLift"} disabled={disabled} button key={"lift"} onClick={() => { props.buttonClick("lifts") }}>
                    <ListItemText primary={"Lift"} />
                </ListItem>
                <ListItem id={"createPath"} disabled={disabled} button key={"path"} onClick={() => { props.buttonClick("path") }}>
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