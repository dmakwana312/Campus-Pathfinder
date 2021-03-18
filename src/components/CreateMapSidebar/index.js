import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
        
        return (
            <List>
                <ListItem button key={"entrance"} onClick={() => { props.buttonClick("entrance") }}>
                    <ListItemText primary={"Entrance"} />
                </ListItem>
                <ListItem button key={"room"} onClick={() => { props.buttonClick("room") }}>
                    <ListItemText primary={"Room"} />
                </ListItem>
                <ListItem button key={"stairs"} onClick={() => { props.buttonClick("stairs") }}>
                    <ListItemText primary={"Staircase"} />
                </ListItem>
                <ListItem button key={"lift"} onClick={() => { props.buttonClick("lifts") }}>
                    <ListItemText primary={"Lift"} />
                </ListItem>
                <ListItem button key={"path"} onClick={() => { props.buttonClick("path") }}>
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