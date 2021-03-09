import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { useStyles } from '../style.js';
import { TextField, Grid } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@material-ui/icons';

const CreateMapObjectPropertiesSidebar = (props) => {
    const classes = useStyles();
    const [selectedBuilding, setSelectedBuilding] = useState(-1);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    let listClassName = props.activeStep === 0 ? classes.drawerContainer + " " + classes.propertiesForm : classes.drawerContainer;

    function fieldEdit(e, propertyName) {

        props.updateProperty(propertyName, e.target.value);

    }

    let fieldEnabled = props.properties ? false : true;
    let propertiesClassName = props.properties ? "" : classes.propertiesFormDisabled;

    function properties() {
        return (

            <div className={classes.drawerContainer + " " + classes.propertiesForm}>
                <List className={propertiesClassName}>

                    <ListItem>

                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >

                            <Grid item>

                                <TextField
                                    className={classes.textField + ' ' + classes.positionTextField}
                                    disabled
                                    variant="outlined"
                                    label="X"
                                    value={props.properties ? props.properties.x : ""}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className={classes.textField + ' ' + classes.positionTextField}
                                    disabled
                                    variant="outlined"
                                    label="Y"
                                    value={props.properties ? props.properties.y : ""}
                                />
                            </Grid>

                        </Grid>

                    </ListItem>
                    <ListItem>

                        <TextField
                            className={classes.textField}

                            variant="outlined"
                            label="Connected"
                            disabled
                            value={props.properties ? props.properties.collision : ""}
                        />

                    </ListItem>
                    <ListItem>
                        <TextField
                            className={classes.textField}
                            disabled
                            variant="outlined"
                            label="Rotation"
                            value={props.properties ? props.properties.rotation : ""}
                        />

                    </ListItem>

                    <Divider />

                    <ListItem>
                        <TextField
                            className={classes.textField}
                            disabled={fieldEnabled}
                            variant="outlined"
                            label="Label"
                            onChange={(e) => fieldEdit(e, "label")}
                            value={props.properties ? props.properties.label : ""}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Font Size"
                            disabled={fieldEnabled}
                            className={classes.textField}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: 1,

                            }}
                            variant="outlined"
                            onChange={(e) => fieldEdit(e, "fontSize")}
                            value={props.properties ? props.properties.fontSize : ""}
                        />
                    </ListItem>

                    <ListItem>
                        <ToggleButtonGroup value={props.properties ? props.properties.textAlign : ""} exclusive className={classes.textField} aria-label="outlined primary button group">
                            <ToggleButton value="left" onClick={() => props.updateProperty("textAlign", "left")}><FormatAlignLeft /></ToggleButton>
                            <ToggleButton value="center" onClick={() => props.updateProperty("textAlign", "center")}><FormatAlignCenter /></ToggleButton>
                            <ToggleButton value="right" onClick={() => props.updateProperty("textAlign", "right")}><FormatAlignRight /></ToggleButton>
                        </ToggleButtonGroup>
                    </ListItem>

                    <Divider />
                    <ListItem>
                        <FormControl variant="outlined" className={classes.textField}>
                            <InputLabel htmlFor="outlined-age-native-simple">Colour</InputLabel>
                            <Select
                                disabled={fieldEnabled}
                                native
                                value={props.properties ? props.properties.category : ""}
                                onChange={(e) => fieldEdit(e, "category")}
                                label="Colour"
                                inputProps={{
                                    name: 'Colour',
                                }}
                            >
                                <option aria-label="None" value="" />
                                {props.categories.map((category, key) => {
                                    return (
                                        <option key={key} value={key}>{category["categoryName"]}</option>
                                    )
                                })}

                            </Select>

                        </FormControl>
                        <span><Button onClick={props.showCategoryModal} variant="contained"><EditIcon /></Button></span>

                    </ListItem>

                </List>
                {fieldEnabled ? <h2 className={classes.propertiesFormDisabledText}>Select Shape to View Properties</h2> : ""}

            </div>
        );
    }

    function floors() {

        if (props.buildingBeingViewed) {
            return (
                <div className={listClassName}>
                    <h1 style={{ textAlign: "center" }}>Select Floor From Below</h1>
                    <List>
                        {props.buildingBeingViewed.internal.map((floor, key) => {
                            // console.log("Floor " + key);
                            return (
                                <ListItem button key={"floor" + key} onClick={() => { props.setFloorBeingViewed(key) }}>
                                    <ListItemText primary={"Floor " + key} />
                                </ListItem>
                            )
                        })}

                    </List>
                </div>
            );
        }

    }

    function buildings() {

        return (
            <div className={listClassName}>
                <h1 style={{ textAlign: "center" }}>Select Building From Below</h1>
                <List>
                    {props.savedShapes.map((shape, key) => {
                        return (
                            <ListItem button key={shape.label} onClick={() => { setSelectedBuilding(key); props.setBuildingBeingViewed(key) }}>
                                <ListItemText primary={shape.label} />
                            </ListItem>
                        )
                    })}

                </List>
            </div>
        );

    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <div>

                        {children}

                    </div>

                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    return (

        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="right"
        >
            <Toolbar />


            <Paper className={classes.paperTabs}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"

                // centered
                >
                    <Tab classes={{ root: classes.tab }} label="Properties" />
                    <Tab classes={{ root: classes.tab }} disabled={props.activeStep === 0} label="Buildings" />
                    <Tab classes={{ root: classes.tab }} disabled={props.activeStep === 0} label="Floors" />
                </Tabs>
                <SwipeableViews
                    axis={'x-reverse'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} >
                        {properties()}
                    </TabPanel>
                    <TabPanel value={value} index={1} >
                        {buildings()}
                    </TabPanel>
                    <TabPanel value={value} index={2} >
                        {floors()}
                    </TabPanel>
                </SwipeableViews>
            </Paper>

        </Drawer >

    );
}

export default CreateMapObjectPropertiesSidebar;