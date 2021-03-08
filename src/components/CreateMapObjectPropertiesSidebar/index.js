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

import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@material-ui/icons';

const CreateMapObjectPropertiesSidebar = (props) => {
    const classes = useStyles();
    const [selectedBuilding, setSelectedBuilding] = useState(-1);

    function fieldEdit(e, propertyName) {

        props.updateProperty(propertyName, e.target.value);

    }

    let fieldEnabled = props.properties ? false : true;
    let propertiesClassName = props.properties ? "" : classes.propertiesFormDisabled;

    function activeStepIs0(selectedShape) {

        if (selectedShape !== undefined) {
            console.log("set");
        }

        return (
            <React.Fragment>
                {props.activeStep === 1 ? <Button onClick={() => {setSelectedBuilding(-1); props.clearShapes();}}>Back</Button> : ""}
                <List className={propertiesClassName}>

                    <ListItem>

                        <Grid
                            container
                            alignItems="center"
                            justify="center"
                        >
                            
                            <h1>Properties</h1>
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

            </React.Fragment>

        );
    }

    function activeStepIs1() {

        return (

            selectedBuilding !== -1 ?
                activeStepIs0(props.buildingBeingViewed) :
                <React.Fragment>
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
                </React.Fragment>

        );
    }

    let listClassName = props.activeStep === 0 ? classes.drawerContainer + " " + classes.propertiesForm : classes.drawerContainer;

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
            <div className={listClassName}>

                {props.activeStep === 0 ? activeStepIs0() : activeStepIs1()}

            </div>

        </Drawer >

    );
}

export default CreateMapObjectPropertiesSidebar;