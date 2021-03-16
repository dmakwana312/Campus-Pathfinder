import React, { useState, useRef } from 'react';
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
                stairs: [],
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
            var width = 10;
            var height = 10;
            var floors = [];

            for (var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++) {
                floors.push(false);
            }

            floors[floorBeingViewed] = true;

            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                index: savedShapes[buildingBeingViewed].stairs.length,
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
            var width = 10;
            var height = 10;
            var floors = [];

            for (var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++) {
                floors.push(false);
            }

            floors[floorBeingViewed] = true;

            newShape = {
                x: window.innerWidth / 8,
                y: document.documentElement.clientWidth / 8,
                index: savedShapes[buildingBeingViewed].lifts.length,
                width: 10,
                height: 10,
                selected: false,
                label: "",
                fontSize: 15,
                name: "lifts",
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
            var width = 10;
            var height = 10;

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
                floorNumber: floorBeingViewed
                // textRotation: 0,
            }
        }
        else if (shapeType === "room") {
            var width = 10;
            var height = 10;

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

        if (activeStep === 1) {
            if (shapeType === "lift") {
                savedShapes[buildingBeingViewed].lifts.push(newShape);
            }
            else if (shapeType === "stairs") {
                savedShapes[buildingBeingViewed].stairs.push(newShape);
            }
            else if (shapeType === "entrance") {
                savedShapes[buildingBeingViewed].entrance = newShape;
            }
            else {
                savedShapes[buildingBeingViewed].internal[floorBeingViewed].push(newShape);
            }

            


        }

        setShapes(allShapes);
    }

    function addFloor() {
        savedShapes[buildingBeingViewed].internal.push([]);

        var lifts = savedShapes[buildingBeingViewed].lifts;

        for (var i = 0; i < lifts.length; i++) {
            lifts[i].floors.push(false);
        }

        var stairs = savedShapes[buildingBeingViewed].stairs

        for (var i = 0; i < stairs.length; i++) {
            stairs[i].floors.push(false);
        }

        savedShapes[buildingBeingViewed].lifts = lifts;
        savedShapes[buildingBeingViewed].stairs = stairs;

        setSavedShapes([...savedShapes])
    }

    function updateFloors(name, floorIndexes, index) {

        for (var i = 0; i < savedShapes[buildingBeingViewed][name][index].floors.length; i++) {
            if (floorIndexes.includes(i)) {
                savedShapes[buildingBeingViewed][name][index].floors[i] = true;
            }
            else {
                savedShapes[buildingBeingViewed][name][index].floors[i] = false;
            }
        }

        setSavedShapes([...savedShapes])
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

        // if (e.target.getName() !== "path") {
        //     var paths = layerRef.current.getChildren(function (node) {
        //         return node.getName() === "path";
        //     });

        //     for (var i = 0; i < paths.length; i++) {
        //         if (isColliding(e.target, paths[i])) {
        //             allShapes[index]["collision"] = true;
        //         }
        //         else {
        //             allShapes[index]["collision"] = false;
        //         }

        //     }
        // }

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
        if (activeStep === 0) {
            var buildings = shapes.filter(function (shape) {
                return shape.name === "building";
            });

            var pathways = shapes.filter(function (shape) {
                return shape.name === "path";
            });

            var nonCollisionShapes = [];

            for (var i = 0; i < buildings.length; i++) {
                var collision = false;
                for (var j = 0; j < pathways.length; j++) {
                    if (isColliding(buildings[i], pathways[j])) {
                        collision = true;
                        break;
                    }
                }

                if (!collision) {
                    nonCollisionShapes.push(buildings[i]);
                }

            }

            var pathwaysConnected = true;

            if (pathways.length > 1) {
                for (var i = 0; i < pathways.length; i++) {
                    var collision = false;
                    for (var j = 0; j < pathways.length; j++) {
                        if (i !== j) {
                            if (isColliding(pathways[i], pathways[j])) {
                                collision = true;
                                break;
                            }
                        }
                    }

                    if (!collision) {
                        pathwaysConnected = false;
                        break;
                    }

                }
            }


            if (nonCollisionShapes.length === 0 && pathwaysConnected) {
                setSavedShapes([...shapes]);
                setShapes([]);
                setActiveStep(activeStep + 1);
            }
            else {


                var message = "";

                if (!pathwaysConnected) {
                    message = "Ensure Pathways Are Connected To Each Other";
                }

                if (nonCollisionShapes.length !== 0) {
                    var nonCollisionShapeLabels = "";

                    for (var i = 0; i < nonCollisionShapes.length; i++) {
                        nonCollisionShapeLabels = nonCollisionShapeLabels + nonCollisionShapes[i].label + " ";
                    }

                    message += "\nEnsure Following Buildings Touch A Pathway: " + nonCollisionShapeLabels
                }
                alert(message);
            }
        }
        else if (activeStep === 1) {
            console.log("Verifying Internal Structure");

            var buildings = savedShapes.filter(function (shape) {
                return shape.name === "building";
            });

            var nonCollisionShapes = [];
            var pathwaysConnected = true;
            var liftsConnected = true;
            var stairsConnected = true;

            for (var i = 0; i < buildings.length; i++) {
                var internal = buildings[i].internal;
                var lifts = buildings[i].lifts;
                var stairs = buildings[i].stairs;

                for (var j = 0; j < internal.length; j++) {
                    var floor = internal[j];

                    for (var k = 0; k < floor.length; k++) {
                        var rooms = floor.filter(function (shape) {
                            return shape.name === "room";
                        });

                        var pathways = floor.filter(function (shape) {
                            return shape.name === "path";
                        });

                        for (var l = 0; l < lifts.length; l++) {
                            if (lifts[l].floors[j]) {
                                
                                var connected = false;
                                for (var m = 0; m < pathways.length; m++) {
                                    if (isColliding(lifts[l], pathways[m])) {
                                        connected = true;
                                        break;
                                    }
                                }

                                if (!connected) {
                                    liftsConnected = false;
                                }
                            }

                        }

                        for (var l = 0; l < stairs.length; l++) {
                            if (stairs[l].floors[j]) {
                                var connected = false;
                                for (var m = 0; m < pathways.length; m++) {
                                    if (isColliding(stairs[l], pathways[m])) {
                                        connected = true;
                                        break;
                                    }
                                }

                                if (!connected) {
                                    stairsConnected = false;
                                }
                            }

                        }

                        if (pathways.length > 1) {
                            for (var l = 0; l < pathways.length; l++) {
                                var collision = false;
                                for (var m = 0; m < pathways.length; m++) {
                                    if (l !== m) {
                                        if (isColliding(pathways[l], pathways[m])) {
                                            collision = true;
                                            break;
                                        }
                                    }
                                }

                                if (!collision) {
                                    pathwaysConnected = false;
                                    break;
                                }

                            }
                        }

                        for (var l = 0; l < rooms.length; l++) {
                            var collision = false;
                            for (var m = 0; m < pathways.length; m++) {
                                if (isColliding(rooms[l], pathways[m])) {
                                    collision = true;
                                    break;
                                }
                            }

                            if (!collision) {

                                nonCollisionShapes.push(rooms[l]);
                            }

                        }
                    }
                }
            }

            if (nonCollisionShapes.length === 0 && pathwaysConnected && liftsConnected && stairsConnected) {
                console.log("valid");
                // setSavedShapes([...shapes]);
                // setShapes([]);
                // setActiveStep(activeStep + 1);
            }
            else {
                var message = "";
                if (nonCollisionShapes.length !== 0) {
                    message += "Ensure All Rooms Are Connected To Pathways";
                }
                if (!pathwaysConnected) {
                    message += "\nEnsure All Pathways Are Connected With Each Other";
                }
                if (!liftsConnected) {
                    message += "\nEnsure All Lifts Are Connected To Pathways";
                }
                if (!stairsConnected) {
                    message += "\nEnsure All Staircases Are Connected To Pathways";
                }
                alert(message);
            }



        }

    }

    function viewFloor(floorNumber){
        setFloorBeingViewed(floorNumber);
        var floorShapes = [...savedShapes[buildingBeingViewed].internal[floorNumber]];
        floorShapes = floorShapes.concat(floorShapes, savedShapes[buildingBeingViewed].lifts);
        floorShapes = floorShapes.concat(floorShapes, savedShapes[buildingBeingViewed].stairs);
        if(savedShapes[buildingBeingViewed].entrance.floorNumber === floorNumber){
            floorShapes.push(savedShapes[buildingBeingViewed].entrance);
        }

        setShapes(floorShapes);
    }


    function setBuildingBeingViewedHandler(buildingKey) {
        setBuildingBeingViewed(buildingKey);
        setFloorBeingViewed(0);
    }

    function clearShapes() {
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
                    setFloorBeingViewed={viewFloor}
                    addFloor={addFloor}
                    updateFloors={updateFloors}
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