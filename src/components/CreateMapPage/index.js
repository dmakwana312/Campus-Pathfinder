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

import { isColliding } from '../collisionDetection';

const CreateMapPage = () => {

    const [objectCategories, setObjectCategories] = useState(categories);

    const classes = useStyles();
    const [shapes, setShapes] = useState([]);
    const [savedShapes, setSavedShapes] = useState([]);
    const [lineGuides, setLineGuides] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [viewCategoryEditModal, setViewCategoryEditModal] = useState(false);
    const [viewAddCategoryModal, setViewAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryMainColour, setNewCategoryMainColour] = useState("");
    const [newCategoryFontColour, setNewCategoryFontColour] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [buildingBeingViewed, setBuildingBeingViewed] = useState(null);
    const [floorBeingViewed, setFloorBeingViewed] = useState(0);
    const layerRef = useRef();
    const stageRef = useRef();

    // var collisionTest = false;

    // collisionTest = isColliding([13, 10, 13, 3, 6, 3, 6, 10], [14, 18, 15, 11, 10, 13]);
    // if(collisionTest === true){
    //     console.log("Colliding")
    // }
    // else{
    //     console.log("Not Colliding")
    // }

    // collisionTest = isColliding([11, 10, 11, 3, 4, 3, 4, 10], [13, 13, 8, 9, 7, 15]);
    // if(collisionTest === true){
    //     console.log("Colliding")
    // }
    // else{
    //     console.log("Not Colliding")
    // }

    function createShape(shapeType) {
        var newShape = null;
        var x = window.innerWidth / 8;
        var y = document.documentElement.clientWidth / 8;
        if (shapeType === "building") {
            var width = 100;
            var height = 100;
            newShape = {
                x: x,
                y: y,
                width: width,
                height: height,
                selected: false,
                label: "Building",
                fontSize: 15,
                name: "building",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 0,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ],
                collision: false,
                internal: [[]],
                lifts: [],
                staircases: [],
                entrance: null

                // textRotation: 0,
            }
        }
        else if (shapeType === "path") {
            var width = 50;
            var height = 50;
            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 50,
                height: 50,
                selected: false,
                label: "",
                fontSize: 15,
                name: "path",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 1,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ]
                // textRotation: 0,
            }
        }
        else if (shapeType === "stairs") {
            var width = 50;
            var height = 50;
            var floors = [];

            for(var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++){
                floors.push(false);
            }

            floors[floorBeingViewed] = true;

            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 10,
                height: 10,
                selected: false,
                label: "",
                fontSize: 15,
                name: "stairs",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 1,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ],
                floors: floors
                // textRotation: 0,
            }
        }
        else if (shapeType === "lift") {
            var width = 50;
            var height = 50;
            var floors = [];

            for(var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++){
                floors.push(false);
            }

            floors[floorBeingViewed] = true;

            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 10,
                height: 10,
                selected: false,
                label: "",
                fontSize: 15,
                name: "lift",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 1,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ],
                floors: floors
                // textRotation: 0,
            }
        }
        else if (shapeType === "entrance") {
            var width = 50;
            var height = 50;
            var floors = [];

            for(var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++){
                floors.push(false);
            }

            floors[floorBeingViewed] = true;

            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                width: 10,
                height: 10,
                selected: false,
                label: "",
                fontSize: 15,
                name: "entrance",
                selected: false,
                textAlign: "center",
                rotation: 0,
                category: 1,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ],
                // textRotation: 0,
            }
        }
        else if (shapeType === "room"){
            var width = 50;
            var height = 50;

            var x = savedShapes[buildingBeingViewed].x + savedShapes[buildingBeingViewed].width / 2;
            var y = savedShapes[buildingBeingViewed].y + savedShapes[buildingBeingViewed].height / 2;
 
            var newPoint = rotatePoint(x, y, savedShapes[buildingBeingViewed].x, savedShapes[buildingBeingViewed].y, savedShapes[buildingBeingViewed].rotation)
            
            newShape = {
                x: savedShapes[buildingBeingViewed].x + savedShapes[buildingBeingViewed].width / 2,
                y: savedShapes[buildingBeingViewed].y + savedShapes[buildingBeingViewed].height / 2,
                width: 10,
                height: 10,
                selected: false,
                label: "Room",
                fontSize: 4,
                name: "room",
                selected: false,
                textAlign: "center",
                rotation: savedShapes[buildingBeingViewed].rotation,
                category: 1,
                points: [x,
                    y,
                    x + width,
                    y,
                    x + width,
                    y + height,
                    x,
                    y + height
                ]
                // textRotation: 0,
            }
        }

        var allShapes = [...shapes];
        allShapes.push(newShape);
        
        if(activeStep === 1){
            if(shapeType === "lift"){
                savedShapes[buildingBeingViewed].lifts.push(newShape);
            }
            else if(shapeType === "stairs"){
                savedShapes[buildingBeingViewed].staircases.push(newShape);
            }   
            else if(shapeType === "entrance"){
                savedShapes[buildingBeingViewed].entrance = newShape;
            }
            else{
                savedShapes[buildingBeingViewed].internal[floorBeingViewed].push(newShape);
            }

            
        }
        
        setShapes(allShapes);
    }

    function addFloor(){
        savedShapes[buildingBeingViewed].internal.push([]);
        
        var lifts = savedShapes[buildingBeingViewed].lifts;

        for(var i = 0; i < lifts.length; i++){
            lifts[i].push(false);
        }

        var staircases = savedShapes[buildingBeingViewed].staircases

        for(var i = 0; i < staircases.length; i++){
            staircases[i].push(false);
        }

        savedShapes[buildingBeingViewed].lifts = lifts;
        savedShapes[buildingBeingViewed].staircases = staircases;
    }

    function dragStart(e, index) {
        var allShapes = [...shapes];
        setShapes(allShapes);
        setSelectedIndex(index);
    }

    function updatePoints(index) {
        var allShapes = [...shapes];
        var shapeToUpdate = allShapes[selectedIndex];

        var points = [shapeToUpdate.x,
        shapeToUpdate.y,
        shapeToUpdate.x + shapeToUpdate.width,
        shapeToUpdate.y,
        shapeToUpdate.x + shapeToUpdate.width,
        shapeToUpdate.y - shapeToUpdate.height,
        shapeToUpdate.x,
        shapeToUpdate.y - shapeToUpdate.height
        ];


        for (var i = 0; i < 8; i += 2) {

            var newPoint = rotatePoint(points[i], points[i + 1], shapeToUpdate.x, shapeToUpdate.y, shapeToUpdate.rotation);
            points[i] = newPoint.x;
            points[i + 1] = newPoint.y;
        }

        shapeToUpdate.points = points;

        allShapes[index] = shapeToUpdate;
        setShapes(allShapes);
    }

    function dragMove(e, index) {
        var shapesOnCanvas = layerRef.current.getChildren(function (node) {
            return node.getClassName() === 'Group';
        });

        // for (var i = 0; i < shapesOnCanvas.length; i++) {
        //     if (e.target.index !== i) {
        //         console.log(isColliding(e.target, shapesOnCanvas[i]));
        //     }
        // }

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

        updatePoints(index);


        setLineGuides([]);

        if (e.target.getName() !== "path") {
            var paths = layerRef.current.getChildren(function (node) {
                return node.getName() === "path";
            });

            for (var i = 0; i < paths.length; i++) {
                if (isColliding(e.target, paths[i])) {
                    allShapes[index]["collision"] = true;
                }
                else {
                    allShapes[index]["collision"] = false;
                }

            }
        }

        setShapes(allShapes);

    }

    function rotatePoint(pointX, pointY, originX, originY, rotation) {
        var angle = rotation * (-Math.PI / 180);

        var rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;

        var rotatedY = -Math.sin(angle) * (pointX - originX) - Math.cos(angle) * (pointY - originY) + originY;

        return { x: rotatedX, y: rotatedY };
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

    function editCategory(index, fieldName, fieldValue) {
        var allCategories = objectCategories;
        allCategories[index][fieldName] = fieldValue;
        setObjectCategories(allCategories);
    }

    function showAddCategoryModal() {

        setNewCategoryName("");
        setNewCategoryMainColour("");
        setNewCategoryFontColour("");
        setViewAddCategoryModal(true);

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

    function incrementStep() {
        setSavedShapes([...shapes]);
        setShapes([]);
        setActiveStep(activeStep + 1);
    }

    function setBuildingBeingViewedHandler(buildingKey){
        setBuildingBeingViewed(buildingKey);
        setFloorBeingViewed(0);
    }

    function clearShapes(){
        setShapes([]);
        setBuildingBeingViewed(null);

    }
    
    return (
        <React.Fragment>
            <div className={classes.root}>
                <NavBar incrementStep={incrementStep} />
                <CreateMapSidebar activeStep={activeStep} buttonClick={createShape} />
                <main className={classes.content}>
                    <Toolbar />
                    <div>
                        <CreateMapProgressTracker
                            activeStep={activeStep}
                            buildingBeingViewed={savedShapes[buildingBeingViewed]}
                        />
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
                        updatePoints={updatePoints}
                        activeStep={activeStep}
                        buildingBeingViewed={savedShapes[buildingBeingViewed]}
                        floorBeingViewed={floorBeingViewed}
                    />
                </main>
                <CreateMapObjectPropertiesSidebar
                    setBuildingBeingViewed={setBuildingBeingViewedHandler}
                    buildingBeingViewed={savedShapes[buildingBeingViewed]}
                    properties={shapes[selectedIndex]}
                    updateProperty={updatePropertiesOfShape}
                    savedShapes={savedShapes}
                    categories={objectCategories}
                    showCategoryModal={() => setViewCategoryEditModal(true)}
                    activeStep={activeStep}
                    clearShapes={clearShapes}
                    setFloorBeingViewed={setFloorBeingViewed}
                    addFloor={addFloor}
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
                                                        onChange={(e) => editCategory(key, "categoryName", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        defaultValue={category["mainColour"]}
                                                        onChange={(e) => editCategory(key, "mainColour", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        defaultValue={category["fontColour"]}
                                                        onChange={(e) => editCategory(key, "fontColour", e.target.value)}
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