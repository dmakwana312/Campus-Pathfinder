import React, { useState } from 'react';

import {
    TextField,
    Grid,
    Drawer,
    Toolbar,
    List,
    Divider,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    Select,
    Input,
    MenuItem,
    Chip,
    Button,
    Paper,
    Tab,
    Tabs
} from '@material-ui/core';

import {
    ToggleButton,
    ToggleButtonGroup
} from '@material-ui/lab';

import {
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight
} from '@material-ui/icons';

import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { useStyles } from '../style.js';

const CreateMapObjectPropertiesSidebar = (props) => {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
    const [accessibleLiftstairsValues, setAccessibleLiftstairsValues] = useState([]);
    const [shapeIndex, setShapeIndex] = useState("");

    // Determine class name of the list based on active step
    let listClassName = props.activeStep === 0 ? classes.drawerContainer + " " + classes.propertiesForm : classes.drawerContainer;

    // If properties of a shape are provided, have the fields enabled
    let fieldsDisabled = props.properties ? false : true;

    // Determine class name of properties tab
    let propertiesClassName = props.properties ? "" : classes.propertiesFormDisabled;

    // If properties of a shape are provided and the shape index is 
    // not equal to the shape index already stored, set shape index
    if (props.properties && shapeIndex !== props.properties.index) {

        // Set the shape index
        setShapeIndex(props.properties.index);

        // If the properties are for a lift or straicase, add the floors to a list,
        // for the floor selection
        if (props.properties.name === "lifts" || props.properties.name === "stairs") {
            var accessible = [];
            for (var i = 0; i < props.properties.floors.length; i++) {
                if (props.properties.floors[i]) {
                    accessible.push("Floor " + i);
                }
            }
            // Set the array of floors
            setAccessibleLiftstairsValues([...accessible]);
        }
    }

    // Set tab value when a tab is clicked
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Set tab value when slided with mouse
    const handleTabChangeIndex = (index) => {
        setTabValue(index);
    };


    // Update the property when a field value is changed
    function fieldEdit(e, propertyName) {
        props.updateProperty(propertyName, e.target.value);
    }

    // Handle a floor being selected from the menu
    function handleFloorSelect(e) {
        // Update the values of the floor selection field
        setAccessibleLiftstairsValues(e.target.value);
        var indexes = [];
        for (var i = 0; i < e.target.value.length; i++) {
            indexes.push(parseInt(e.target.value[i].split(" ")[1]));
        }

        // Update the accessibility of lift/staircase
        props.updateLiftStaircaseAccessibility(props.properties.name, indexes, props.properties.index);

    }

    // Properties tab
    function properties() {
        return (

            <div className={classes.drawerContainer + " " + classes.propertiesForm}>
                <List className={propertiesClassName}>

                    {props.activeStep === 0 &&
                        <Button onClick={props.deleteSelected} style={{ backgroundColor: "red", marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20, width: "85%" }} variant="contained" >
                            Delete
                        </Button>
                    }

                    {/* If properties of a shape are for a lift or staircase show the floor selection field */}
                    {props.properties && (props.properties.name === "lifts" || props.properties.name === "stairs") &&
                        <ListItem>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                                <Select
                                    labelId="demo-mutiple-chip-label"
                                    id="demo-mutiple-chip"
                                    multiple
                                    value={accessibleLiftstairsValues}
                                    onChange={handleFloorSelect}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(accessibleLiftstairsValues) => (
                                        <div className={classes.chips}>
                                            {accessibleLiftstairsValues.map((value) => (
                                                <Chip key={value} label={value} className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                // MenuProps={MenuProps}
                                >
                                    {props.properties.floors.map((floor, key) => (
                                        <MenuItem key={key} value={"Floor " + key} name={key}>
                                            {"Floor " + key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                    }
                    <ListItem>

                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >

                            <Grid item>
                                {/* X position text field */}
                                <TextField
                                    className={classes.textField + ' ' + classes.positionTextField}
                                    disabled
                                    variant="outlined"
                                    label="X"
                                    value={props.properties ? props.properties.x : ""}
                                />
                            </Grid>
                            <Grid item>
                                {/* Y position text field */}
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
                        {/* Rotation text field */}
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
                        {/* Label of shape text field */}
                        <TextField
                            className={classes.textField}
                            disabled={fieldsDisabled}
                            variant="outlined"
                            label="Label"
                            onChange={(e) => fieldEdit(e, "label")}
                            value={props.properties ? props.properties.label : ""}
                        />
                    </ListItem>
                    <ListItem>
                        {/* Font size of label text field */}
                        <TextField
                            label="Font Size"
                            disabled={fieldsDisabled}
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
                        {/* Text allignment buttons */}
                        <ToggleButtonGroup value={props.properties ? props.properties.textAlign : ""} exclusive className={classes.textField} aria-label="outlined primary button group">
                            <ToggleButton value="left" onClick={() => props.updateProperty("textAlign", "left")}><FormatAlignLeft /></ToggleButton>
                            <ToggleButton value="center" onClick={() => props.updateProperty("textAlign", "center")}><FormatAlignCenter /></ToggleButton>
                            <ToggleButton value="right" onClick={() => props.updateProperty("textAlign", "right")}><FormatAlignRight /></ToggleButton>
                        </ToggleButtonGroup>
                    </ListItem>

                    <Divider />
                    <ListItem>
                        {/* Category selection of shape */}
                        <FormControl variant="outlined" className={classes.textField}>
                            <InputLabel htmlFor="outlined-age-native-simple">Category</InputLabel>
                            <Select
                                disabled={fieldsDisabled}
                                native
                                value={props.properties ? props.properties.category : ""}
                                onChange={(e) => fieldEdit(e, "category")}
                                label="Category"
                                inputProps={{
                                    name: 'Category',
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
                        {/* Button to edit categories */}
                        <span><Button onClick={props.showCategoryModal} variant="contained"><EditIcon /></Button></span>

                    </ListItem>



                </List>



                {/* If fields are diabled display message */}
                {fieldsDisabled ? <h2 className={classes.propertiesFormDisabledText}>Select Shape to View Properties</h2> : ""}

            </div>
        );
    }

    // Floors tab
    function floors() {

        // If building being viewed property is provided create and display list as buttons
        if (props.buildingBeingViewed) {
            return (
                <div className={listClassName}>
                    <h1 style={{ textAlign: "center" }}>Select Floor From Below</h1>
                    <List>
                        {props.buildingBeingViewed.internal.map((floor, key) => {

                            return (
                                <ListItem button key={"floor" + key} onClick={() => { props.setFloorBeingViewed(key) }}>
                                    <ListItemText primary={"Floor " + key} />
                                </ListItem>
                            )
                        })}

                        <ListItem button key={"addFloor"} onClick={props.addFloor}>
                            <ListItemText primary={"Add Floor"} />
                        </ListItem>
                    </List>
                </div >
            );
        }

    }

    // Buildings tab
    function buildings() {
        // Create and display list of buildings' name
        return (
            <div className={listClassName}>
                <h1 style={{ textAlign: "center" }}>Select Building From Below</h1>
                <List>
                    {props.savedShapes.map((shape, key) => {
                        if (shape.name != "path") {
                            return (
                                <ListItem selected={false} button key={shape.label} onClick={() => { props.setBuildingBeingViewed(key) }}>
                                    <ListItemText primary={shape.label} />
                                </ListItem>
                            )
                        }

                    })}

                </List>
            </div>
        );

    }

    // Tab panel
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

    // Prop types of tab panel component 
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
                {/* Tab buttons */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                >
                    <Tab classes={{ root: classes.tab }} label="Properties" />
                    <Tab classes={{ root: classes.tab }} disabled={props.activeStep === 0} label="Buildings" />
                    <Tab classes={{ root: classes.tab }} disabled={props.activeStep === 0} label="Floors" />
                </Tabs>

                {/* Tab panel content */}
                <SwipeableViews
                    axis={'x-reverse'}
                    index={tabValue}
                    onChangeIndex={handleTabChangeIndex}
                >
                    <TabPanel value={tabValue} index={0} >
                        {properties()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} >
                        {buildings()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} >
                        {floors()}
                    </TabPanel>
                </SwipeableViews>
            </Paper>

        </Drawer >

    );
}

export default CreateMapObjectPropertiesSidebar;