import React, { useState, useRef, useEffect } from 'react';

import {
    Toolbar,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField
} from '@material-ui/core';

import NavBar from '../../components/CreateMapPageNavBar';
import CreateMapSidebar from '../../components/CreateMapSidebar';
import CreateMapObjectPropertiesSidebar from '../../components/CreateMapObjectPropertiesSidebar';
import CreateMapCanvas from '../../components/CreateMapCanvas';
import CreateMapProgressTracker from '../../components/CreateMapProgressTracker';
import ColourPicker from '../../components/ColourPicker';

import firebase from '../../utils/firebase';
import { getGuides } from '../../utils/snapGuidesGeneration.js';
import { categories } from '../../utils/categories.js';
import { isColliding } from '../../utils/collisionDetection';
import { loggedInUser, setUser } from '../../utils/userState';
import { map } from '../../utils/mapState';

import { Redirect } from 'react-router-dom';

import { useStyles } from '../../components/style.js';

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
    const [mapName, setMapName] = useState("");
    const [editingMap, setEditingMap] = useState(false);

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

    const mapToEdit = map.use();

    var userID = loggedInUser.use().uid;

    useEffect(() => {
        if (mapToEdit !== null) {

            for (var i = 0; i < mapToEdit[1]["mapData"].length; i++) {

                if (mapToEdit[1]["mapData"][i].name === "building") {
                    for (var j = 0; j < mapToEdit[1]["mapData"][i].internal.length; j++) {
                        if (mapToEdit[1]["mapData"][i].internal[j][0] === "empty") {
                            mapToEdit[1]["mapData"][i].internal[j][0] = [];
                        }
                    }

                    if (mapToEdit[1]["mapData"][i].lifts[0] === "empty") {
                        mapToEdit[1]["mapData"][i].lifts = [];
                        console.log(mapToEdit[1]["mapData"][i]);
                    }

                    if (mapToEdit[1]["mapData"][i].stairs[0] === "empty") {
                        mapToEdit[1]["mapData"][i].stairs = [];
                    }
                }
            }

            setShapes([...mapToEdit[1]["mapData"]]);
            setObjectCategories(mapToEdit[1]["categories"])
            setMapName(mapToEdit[1]["mapName"])
            setEditingMap(true);

        }
    }, [])

    // Create a new shape
    function createShape(shapeType) {

        // General shared attributes
        var x = window.innerWidth / 8;
        var y = document.documentElement.clientWidth / 8;
        var width = 0;
        var height = 0;
        var label = "";
        var category = 1;
        var fontSize = 15;

        // Assign updated values based on shapeType
        if (shapeType === "building") {
            width = 100;
            height = 100;
            label = "Building";
            category = 0;
        }
        else if (shapeType === "room") {
            width = 10;
            height = 10;
            label = "Room";
            fontSize = 4;

            x = savedShapes[buildingBeingViewed].x + savedShapes[buildingBeingViewed].width / 2;
            y = savedShapes[buildingBeingViewed].y + savedShapes[buildingBeingViewed].height / 2;

        }
        else if (shapeType === "path") {
            width = 50;
            height = 50;

        }
        else {
            width = 10;
            height = 10;
        }

        // Create basic new shape
        var newShape = {
            x: x,
            y: y,
            width: width,
            height: height,
            selected: false,
            label: label,
            fontSize: fontSize,
            name: shapeType,
            selected: false,
            textAlign: "center",
            rotation: 0,
            category: category,
            points: [x,
                y,
                x + width,
                y,
                x + width,
                y + height,
                x,
                y + height
            ]
        }

        // Add additional parameters based on shapeType
        if (shapeType === "building") {
            newShape.internal = [[]];
            newShape.lifts = [];
            newShape.stairs = [];
            newShape.entrance = null;
        }
        else if (shapeType === "lifts" || shapeType === "stairs") {
            var floors = [];

            for (var i = 0; i < savedShapes[buildingBeingViewed].internal.length; i++) {
                floors.push(false);
            }

            floors[floorBeingViewed] = true;
            newShape.floors = floors;
            newShape.index = savedShapes[buildingBeingViewed][shapeType].length;
        }
        else if (shapeType === "entrance") {
            newShape.floorNumber = floorBeingViewed;
        }

        // Add shape to list
        var allShapes = [...shapes];

        allShapes.push(newShape);

        // Assign new shape as attribute if activeStep is 1 and based on shapeType
        if (activeStep === 1) {
            if (shapeType === "lifts") {
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

        // Update shapes
        setShapes(allShapes);
    }

    // Add new floor to buildings
    function addFloor() {

        // Push empty array to internal attribute for building
        savedShapes[buildingBeingViewed].internal.push([]);

        // Update lifts and stairs to account for the new floor
        var lifts = savedShapes[buildingBeingViewed].lifts;

        for (var i = 0; i < lifts.length; i++) {
            lifts[i].floors.push(false);
        }

        var stairs = savedShapes[buildingBeingViewed].stairs

        for (var i = 0; i < stairs.length; i++) {
            stairs[i].floors.push(false);
        }

        // Update shapes state
        savedShapes[buildingBeingViewed].lifts = lifts;
        savedShapes[buildingBeingViewed].stairs = stairs;
        setSavedShapes([...savedShapes])
    }

    // Update accessibility of lift/staircase
    function updateLiftStaircaseAccessibility(name, floorIndexes, index) {

        // Loop through the floors in the lift/staircase
        for (var i = 0; i < savedShapes[buildingBeingViewed][name][index].floors.length; i++) {

            // If index i is contained within the new indexes, mark it as accessible
            if (floorIndexes.includes(i)) {
                savedShapes[buildingBeingViewed][name][index].floors[i] = true;
            }
            else {
                savedShapes[buildingBeingViewed][name][index].floors[i] = false;
            }
        }

        // Update saved shapes
        setSavedShapes([...savedShapes])
    }

    // When dragging starts, update the selected index
    function dragStart(e, index) {
        var allShapes = [...shapes];
        setShapes(allShapes);
        setSelectedIndex(index);
    }

    // Event handler for moving a shape
    function dragMove(e, index) {

        // Get shapesthat are currently on the canvas
        var shapesOnCanvas = layerRef.current.getChildren(function (node) {
            return node.getClassName() === 'Group';
        });

        // for (var i = 0; i < shapesOnCanvas.length; i++) {
        //     if (e.target.index !== i) {
        //         console.log(isColliding(e.target, shapesOnCanvas[i]));
        //     }
        // }

        // Generate guidelines for snapping
        var guides = getGuides(e.target, shapesOnCanvas, stageRef);

        // If no guides created, return
        if (!guides.length) {
            return;
        }

        // Retrieve absolute position of shape being being moved
        var absolutePosition = e.target.absolutePosition();

        // Generate absolute position for each created guidelines and set it
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

        // Update absolute position of shape and set line guides
        e.target.absolutePosition(absolutePosition)

        setLineGuides(guides);
    }

    // Event handler for end of dragging
    function dragEnd(e, index) {
        // Retrieve shapes
        var allShapes = [...shapes];
        var shape = e.target;

        // Update x and y positions for shape
        allShapes[index]["x"] = Math.floor(shape.x());
        allShapes[index]["y"] = Math.floor(shape.y());

        // Update points
        updatePoints(index);

        // Reset line guides
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

        // Update shapes
        setShapes(allShapes);

    }

    // Update the points attribute of a shape based on rotation
    function updatePoints(index) {

        // Get shape to update
        var allShapes = [...shapes];
        var shapeToUpdate = allShapes[selectedIndex];

        // Calculate the new points without rotation
        var points = [shapeToUpdate.x,
        shapeToUpdate.y,
        shapeToUpdate.x + shapeToUpdate.width,
        shapeToUpdate.y,
        shapeToUpdate.x + shapeToUpdate.width,
        shapeToUpdate.y - shapeToUpdate.height,
        shapeToUpdate.x,
        shapeToUpdate.y - shapeToUpdate.height
        ];

        // Apply rotation
        for (var i = 0; i < 8; i += 2) {

            var newPoint = rotatePoint(points[i], points[i + 1], shapeToUpdate.x, shapeToUpdate.y, shapeToUpdate.rotation);
            points[i] = newPoint.x;
            points[i + 1] = newPoint.y;
        }

        // Update property
        shapeToUpdate.points = points;
        allShapes[index] = shapeToUpdate;
        setShapes(allShapes);
    }

    // Rotate a point
    function rotatePoint(pointX, pointY, originX, originY, rotation) {
        var angle = rotation * (-Math.PI / 180);

        var rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;

        var rotatedY = -Math.sin(angle) * (pointX - originX) - Math.cos(angle) * (pointY - originY) + originY;

        return { x: rotatedX, y: rotatedY };
    }

    // Update a property for a shape
    function updatePropertiesOfShape(propertyName, propertyValue) {

        var allShapes = [...shapes];
        allShapes[selectedIndex][propertyName] = propertyValue;
        setShapes(allShapes);

    }

    // Set a shape as selected
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

    // Check if a shape is deselected
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

    // Edit a category
    function editCategory(index, fieldName, fieldValue) {
        var allCategories = objectCategories;
        allCategories[index][fieldName] = fieldValue;
        setObjectCategories(allCategories);
    }

    // Show category modal
    function showAddCategoryModal() {

        setNewCategoryName("");
        setNewCategoryMainColour("");
        setNewCategoryFontColour("");
        setViewAddCategoryModal(true);

    }

    // Add new category
    function addCategory() {
        // Validation to ensure all fields are filled out
        if (newCategoryName === "" || newCategoryMainColour === "" || newCategoryFontColour === "") {
            alert("Ensure All Fields Are Filled Out");
        }
        else {

            // Create object for new category
            var newCategory = {
                categoryName: newCategoryName,
                mainColour: newCategoryMainColour,
                fontColour: newCategoryFontColour
            }

            // Update categories
            var allCategories = [...objectCategories];
            allCategories.push(newCategory);
            setObjectCategories(allCategories);

            // Hide category modal
            setViewAddCategoryModal(false);
        }
    }

    // Validation for active step 1
    function step0Validation() {

        // Retrieve buildings and pathways
        var buildings = shapes.filter(function (shape) {
            return shape.name === "building";
        });

        var pathways = shapes.filter(function (shape) {
            return shape.name === "path";
        });

        // Array to hold shapes that are not colliding
        var nonCollisionShapes = [];

        // Check if all buildings connect with at least one pathway
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

        // Create initial value to assume all pathways are connected
        var pathwaysConnected = true;

        // If there is more than one pathway
        if (pathways.length > 1) {

            // Check if all pathways collide with another pathway
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

                // If collision is false, set pathways connected to false and break from loop
                if (!collision) {
                    pathwaysConnected = false;
                    break;
                }

            }
        }

        // If valid, move to next step.
        if (nonCollisionShapes.length === 0 && pathwaysConnected) {
            return true;
        }
        else {

            // Generate error messages
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

            // Display error message
            alert(message);
            return false;
        }
    }

    // Validation for when active step is 1
    function step1Validation() {

        // Retrieve building shapes
        var buildings = savedShapes.filter(function (shape) {
            return shape.name === "building";
        });

        // Initial values
        var nonCollisionShapes = [];
        var pathwaysConnected = true;
        var liftsConnected = true;
        var stairsConnected = true;

        // Loop through buildings that were retrieved
        for (var i = 0; i < buildings.length; i++) {

            // Get internal structure, lifts and stairs
            var internal = buildings[i].internal;
            var lifts = buildings[i].lifts;
            var stairs = buildings[i].stairs;

            // Loop through internal structure
            for (var j = 0; j < internal.length; j++) {
                var floor = internal[j];

                // Loop through floors
                for (var k = 0; k < floor.length; k++) {

                    // Get rooms and pathways
                    var rooms = floor.filter(function (shape) {
                        return shape.name === "room";
                    });

                    var pathways = floor.filter(function (shape) {
                        return shape.name === "path";
                    });

                    // Check if lifts are connected to at least one pathway
                    for (var l = 0; l < lifts.length; l++) {
                        console.log(lifts[l]);
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

                    // Check if staircases are connected to at least one pathway
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

                    // Check if pathways are connected to each other
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

                    // Check if rooms are connected to a pathway
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

        // If valid move to next step
        if (nonCollisionShapes.length === 0 && pathwaysConnected && liftsConnected && stairsConnected) {
            // console.log("valid");
            // // setSavedShapes([...shapes]);
            // // setShapes([]);
            return true;
        }
        else {
            // Generate error message
            var message = "";
            if (nonCollisionShapes.length !== 0) {
                message += "Ensure All Rooms Are Connected To Pathways";
            }
            if (!pathwaysConnected) {
                message += "\nEnsure All Pathways Are Connected With Each Other";
            }
            if (!liftsConnected) {
                message += "\nEnsure All lifts Are Connected To Pathways";
            }
            if (!stairsConnected) {
                message += "\nEnsure All Staircases Are Connected To Pathways";
            }

            // Display error message
            alert(message);

            return false;
        }
    }

    // Increment step
    function incrementStep() {

        if (activeStep === 0) {
            if (step0Validation()) {
                setSavedShapes([...shapes]);
                setShapes([]);
                setActiveStep(activeStep + 1);

            }
        }
        else if (activeStep === 1) {
            if (step1Validation()) {
                setActiveStep(activeStep + 1);
            }
        }

    }

    // Decrement Step
    function decrementStep() {
        if (activeStep != 0) {
            setShapes([...savedShapes]);
            setActiveStep(activeStep - 1);
        }

    }

    // Function to view floors when a floor is selected 
    function viewFloor(floorNumber) {

        // Update floor number
        setFloorBeingViewed(floorNumber);

        // Generate array of internal structure of floor with lifts and stairs
        var floorShapes = [...savedShapes[buildingBeingViewed].internal[floorNumber]];
        floorShapes = floorShapes.concat(floorShapes, savedShapes[buildingBeingViewed].lifts);
        floorShapes = floorShapes.concat(floorShapes, savedShapes[buildingBeingViewed].stairs);

        if (savedShapes[buildingBeingViewed].entrance !== null) {
            // Add entrance to floorShapes if it is on the same floor
            if (savedShapes[buildingBeingViewed].entrance.floorNumber === floorNumber) {
                floorShapes.push(savedShapes[buildingBeingViewed].entrance);
            }
        }

        // Update shapes state
        setShapes(floorShapes);
    }

    // Set building being viewed
    function setBuildingBeingViewedHandler(buildingKey) {
        setBuildingBeingViewed(buildingKey);
        setFloorBeingViewed(0);
        setShapes([]);
    }

    // Clear shapes
    function clearShapes() {
        setShapes([]);
        setBuildingBeingViewed(null);
    }

    function generateCode(length) {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var result = '';
        for (var i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }

    function deleteSelected(){
        console.log(shapes[selectedIndex])
        if(activeStep === 0){
            var shapesUpdated = [];
            for(var i = 0; i < shapes.length; i++){
                if(i !== selectedIndex){
                    shapesUpdated.push(shapes[i]);
                }
            }
            setShapes([...shapesUpdated])
            setSelectedIndex(-1);
        }
    }

    // Function to save map to firebase
    function saveMap() {

        // Loop through savedShapes and insert placeholder into 
        // empty arrays in order to save it into Firebase
        for (var i = 0; i < savedShapes.length; i++) {
            if (savedShapes[i].name === "building") {
                for (var j = 0; j < savedShapes[i].internal.length; j++) {
                    if (savedShapes[i].internal[j].length === 0) {
                        savedShapes[i].internal[j].push("empty");
                    }
                }

                if (savedShapes[i].lifts.length === 0) {
                    savedShapes[i].lifts.push("empty");
                }
                if (savedShapes[i].stairs.length === 0) {
                    savedShapes[i].stairs.push("empty");
                }

            }

        }

        var nowDate = new Date();
        var date = nowDate.getDate() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getFullYear();

        // Combine map name, categories and mapdata in to single object
        var mapData = {
            mapName: mapName,
            categories: objectCategories,
            mapData: savedShapes,
            userID: userID,
            active: true,
            updatedDate: date,
        }

        if (!editingMap) {
            mapData.createdDate = date;
            mapData.code = generateCode(6);
        }

        // Push data to database
        var db = firebase.database();
        if (editingMap) {
            db.ref("MapData/" + mapToEdit[0]).update({
                mapName: mapName,
                categories: objectCategories,
                mapData: savedShapes,
                userID: userID,
                active: true,
                updatedDate: date,
            })
        }
        else {
            var ref = db.ref("MapData");
            ref.push(mapData);
        }
    }

    function getDate() {

    }

    function checkLoggedIn() {
        if (loggedInUser.use() === null) {
            return <Redirect to='/' />;
        }
    }

    return (
        <React.Fragment>
            {checkLoggedIn()}
            <div className={classes.root}>
                <NavBar incrementStep={incrementStep} decrementStep={decrementStep} />
                <CreateMapSidebar activeStep={activeStep} buttonClick={createShape} buildingBeingViewed={buildingBeingViewed} />
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
                    updateLiftStaircaseAccessibility={updateLiftStaircaseAccessibility}
                    deleteSelected={deleteSelected}
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
                        <h2>View Categories</h2>
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
                                                    
                                                    <ColourPicker handleColourChange={(colour) => editCategory(key, "mainColour", colour)} colour={category["mainColour"]} />
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    
                                                    <ColourPicker handleColourChange={(colour) => editCategory(key, "fontColour", colour)} colour={category["fontColour"]} />

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
                        <h2>Add Categories</h2>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            label="Category Name"
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />

                        <div className={classes.textField}>
                            <p>Main Colour</p>
                            <ColourPicker handleColourChange={(colour) => setNewCategoryMainColour(colour)} colour={"#000000"} />
                        </div>

                        <div className={classes.textField}>
                            <p>Font Colour</p>
                            <ColourPicker handleColourChange={(colour) => setNewCategoryFontColour(colour)} colour={"#000000"} />
                        </div>
                        <Button className={classes.modalButton} variant="contained" color="primary" onClick={addCategory} style={{ float: "right" }}>Save</Button>

                    </div>
                </Modal>}

            <Modal
                open={activeStep === 2}
                onClose={() => setActiveStep(activeStep - 1)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={classes.modalContent}>
                    <h2>Save Map</h2>
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        label="Map Name"
                        defaultValue={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                    />
                    <Button className={classes.modalButton} variant="contained" color="primary" onClick={saveMap} style={{ float: "right" }}>Save</Button>
                </div>
            </Modal>
        </React.Fragment>

    );

}

export default CreateMapPage;