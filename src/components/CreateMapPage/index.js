import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../NavBar';
import CreateMapSidebar from '../CreateMapSidebar';
import CreateMapObjectPropertiesSidebar from '../CreateMapObjectPropertiesSidebar';
import CreateMapCanvas from '../CreateMapCanvas';
import { useStyles } from '../style.js';
import Toolbar from '@material-ui/core/Toolbar';
import Modal from '@material-ui/core/Modal'
import CreateMapProgressTracker from '../CreateMapProgressTracker';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { getGuides } from '../snapGuidesGeneration.js';

import { categories } from '../categories.js';

const CreateMapPage = () => {

    const [objectCategories, setObjectCategories] = useState(categories);

    const classes = useStyles();
    const [shapes, setShapes] = useState([]);
    const [lineGuides, setLineGuides] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [viewCategoryEditModal, setViewCategoryEditModal] = useState(false);
    const [viewAddCategoryModal, setViewAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryMainColour, setNewCategoryMainColour] = useState("");
    const [newCategoryFontColour, setNewCategoryFontColour] = useState("");
    const layerRef = useRef();
    const stageRef = useRef();


    function createShape(shapeType) {
        var newShape = null;
        if(shapeType === "building"){
            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 100,
                height: 100,
                selected: false,
                label: "Building",
                fontSize: 15,
                name: "building",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 0,
                // textRotation: 0,
            }
        }
        else if(shapeType === "path"){
            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 50,
                height: 50,
                selected: false,
                label: "Path",
                fontSize: 15,
                name: "path",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 1,
                // textRotation: 0,
            }
        }
        
        var allShapes = [...shapes];
        allShapes.push(newShape);
        setShapes(allShapes);
    }

    function dragStart(e, index) {
        var allShapes = [...shapes];
        allShapes[index]["fill"] = '#0000FF';
        setShapes(allShapes);
        setSelectedIndex(index);
    }

    function dragMove(e, index) {

        var shapesOnCanvas = layerRef.current.getChildren(function (node) {
            return node.getClassName() === 'Group';
        });

        for (var i = 0; i < shapesOnCanvas.length; i++) {
            // Collision Detection
        }

        var guides = getGuides(e.target, shapesOnCanvas, stageRef);

        if (!guides.length) {
            return;
        }

        var absolutePosition = e.target.absolutePosition();

        guides.forEach((lg) => {
            switch (lg.snap) {
                case 'start': {
                    switch (lg.orientation) {
                        case 'V': {
                            absolutePosition.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absolutePosition.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
                case 'center': {
                    switch (lg.orientation) {
                        case 'V': {
                            absolutePosition.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absolutePosition.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
                case 'end': {
                    switch (lg.orientation) {
                        case 'V': {
                            absolutePosition.x = lg.lineGuide + lg.offset;
                            break;
                        }
                        case 'H': {
                            absolutePosition.y = lg.lineGuide + lg.offset;
                            break;
                        }
                    }
                    break;
                }
            }
        });

        e.target.absolutePosition(absolutePosition)

        setLineGuides(guides);
    }


    function dragEnd(e, index) {
        var allShapes = [...shapes];
        var shape = e.target;

        allShapes[index]["x"] = Math.floor(shape.x());
        allShapes[index]["y"] = Math.floor(shape.y());
        allShapes[index]["fill"] = '#FF0000';
        setShapes(allShapes);
        setLineGuides([]);

    }

    function updatePropertiesOfShape(propertyName, propertyValue) {
        var allShapes = [...shapes];
        allShapes[selectedIndex][propertyName] = propertyValue;
        setShapes(allShapes);

    }

    function onSelect(index) {
        var allShapes = [...shapes];

        for (var i = 0; i < allShapes.length; i++) {
            if (index === i) {
                allShapes[i]["selected"] = true;
            }
            else {
                allShapes[i]["selected"] = false;
            }
        }

        setShapes(allShapes);
        setSelectedIndex(index);
    }

    function checkDeselect(e) {
        var clickedOnEmpty = e.target === e.target.getStage();

        if (clickedOnEmpty) {
            var shapesArray = [...shapes];
            for (var i = 0; i < shapesArray.length; i++) {
                shapesArray[i]["selected"] = false;
            }
            setShapes(shapesArray);
            setSelectedIndex(-1);
        }
    }

    function editCategory(index, fieldName, fieldValue){
        var allCategories = objectCategories;
        allCategories[index][fieldName] = fieldValue;
        setObjectCategories(allCategories);
    }

    function showAddCategoryModal() {

        setNewCategoryName("");
        setNewCategoryMainColour("");
        setNewCategoryFontColour("");
        setViewAddCategoryModal(true);
        // var categories = [...objectCategories];

        // categories.push({categoryName: 3});

        // setObjectCategories(categories);

    }

    function addCategory() {
        if (newCategoryName === "" || newCategoryMainColour === "" || newCategoryFontColour === "") {
            alert("Ensure All Fields Are Filled Out");
        }
        else {
            var newCategory = {
                categoryName: newCategoryName,
                mainColour: newCategoryMainColour,
                fontColour: newCategoryFontColour
            }

            var allCategories = [...objectCategories];
            allCategories.push(newCategory);
            setObjectCategories(allCategories);
            setViewAddCategoryModal(false);
        }
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
                <NavBar />
                <CreateMapSidebar buttonClick={createShape} />
                <main className={classes.content}>
                    <Toolbar />
                    <div>
                        <CreateMapProgressTracker />
                    </div>

                    <CreateMapCanvas
                        dragStart={dragStart}
                        dragMove={dragMove}
                        dragEnd={dragEnd}
                        guides={lineGuides}
                        shapes={shapes}
                        layerRef={layerRef}
                        stageRef={stageRef}
                        onSelect={onSelect}
                        updateProperty={updatePropertiesOfShape}
                        checkDeselect={checkDeselect}
                        categories={objectCategories}
                    />
                </main>
                <CreateMapObjectPropertiesSidebar
                    properties={shapes[selectedIndex]}
                    updateProperty={updatePropertiesOfShape}
                    categories={objectCategories}
                    showCategoryModal={() => setViewCategoryEditModal(true)}
                />
            </div>
            {viewCategoryEditModal &&
                <Modal
                    open={viewCategoryEditModal}
                    onClose={() => setViewCategoryEditModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={classes.modalContent}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category Name</TableCell>
                                        <TableCell align="center">Shape Colour</TableCell>
                                        <TableCell align="center">Font Colour</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {objectCategories.map((category, key) => {
                                        return (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        defaultValue={category["categoryName"]}
                                                        onChange = {(e) => editCategory(key, "categoryName", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        defaultValue={category["mainColour"]}
                                                        onChange = {(e) => editCategory(key, "mainColour", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        defaultValue={category["fontColour"]}
                                                        onChange = {(e) => editCategory(key, "fontColour", e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button className={classes.modalButton} variant="contained" color="primary" onClick={showAddCategoryModal} style={{ float: "right" }}>Add New Category</Button>

                    </div>
                </Modal>}
            {viewAddCategoryModal &&
                <Modal
                    open={viewAddCategoryModal}
                    onClose={() => setViewAddCategoryModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={classes.modalContent}>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            label="Category Name"
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            label="Main Colour"
                            onChange={(e) => setNewCategoryMainColour(e.target.value)}
                        />
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            label="Font Colour"
                            onChange={(e) => setNewCategoryFontColour(e.target.value)}
                        />
                        <Button className={classes.modalButton} variant="contained" color="primary" onClick={addCategory}>Save</Button>

                    </div>
                </Modal>}
        </React.Fragment>

    );

}

export default CreateMapPage;