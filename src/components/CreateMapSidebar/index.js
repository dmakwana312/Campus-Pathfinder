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

    function activeStepIs0() {
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

    function activeStepIs1() {
        
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
                <ListItem button key={"lift"} onClick={() => { props.buttonClick("lift") }}>
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
                {props.activeStep === 0 ? activeStepIs0() : activeStepIs1() }
                <Divider />
                {/* <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text} onClick={() => { props.buttonClick(text) }}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List> */}
            </div>
        </Drawer>

    );
}

export default CreateMapSidebar;