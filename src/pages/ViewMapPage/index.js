import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import ViewMapCanvas from '../../components/ViewMapCanvas';
import firebase from '../../utils/firebase';
import { dijkstra_buildingToBuilding, dijkstra_roomToEntrance, getNodesInPathOrder } from '../../utils/dijkstra';
import ViewBuildingModal from '../../components/ViewBuildingModal';
import CategoryLegend from '../../components/CategoryLegend';
import RouteFinderCarousel from '../../components/RouteFinderCarousel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

import { useStyles } from '../../components/style.js';

const ViewMapPage = () => {

    const classes = useStyles();
    const [mapData, setMapData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showTextFields, setShowTextFields] = useState(false);
    const [showSearchTextField, setShowSearchTextField] = useState(false);
    const [showDirectionTextFields, setShowDirectionTextFields] = useState(false);
    const [search, setSearch] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showingResult, setShowingResult] = useState(false);
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [buildingClicked, setBuildingClicked] = useState(null);
    const [options, setOptions] = useState([]);
    const [showRouteFinderCarousel, setShowRouteFinderCarousel] = useState(false);
    const [pathwayShapes, setPathwayShapes] = useState([]);
    const [showEnterCodeModal, setShowEnterCodeModal] = useState(true);
    const [mapCode, setMapCode] = useState("");
    const [retrieveMapError, setRetrieveMapError] = useState("");


    useEffect(() => {
        if (!showBuildingModal && mapData !== null) {
            setShowingResult(false);
            resetShapes();
        }

    }, [showBuildingModal, showRouteFinderCarousel])

    function retrieveMap() {
        setRetrieveMapError("");
        if (mapCode.length !== 6) {
            setRetrieveMapError("Invalid Map Code")
            return;
        }
        var db = firebase.database();
        var dbData = db.ref("MapData/");

        dbData.orderByChild('code').equalTo(mapCode).on("value", function (snapshot) {
            if (snapshot.exists()) {
                snapshot.forEach(function (mapData) {

                    var retrieveMap = db.ref("MapData/" + mapData.key);
                    retrieveMap.on('value', (snapshot) => {
                        var data = snapshot.val();
                        if (data !== null && data.active) {
                            

                            var index = 0;

                            var searchOptions = [];

                            for (var i = 0; i < data.mapData.length; i++) {

                                if (data.mapData[i].name === "building") {
                                    searchOptions.push(data.mapData[i]);
                                    for (var j = 0; j < data.mapData[i].internal.length; j++) {
                                        if (data.mapData[i].internal[j][0] === "empty") {
                                            data.mapData[i].internal[j] = [];
                                        }
                                        else {
                                            for (var k = 0; k < data.mapData[i].internal[j].length; k++) {
                                                if (data.mapData[i].internal[j][k].name === "room") {
                                                    searchOptions.push(data.mapData[i].internal[j][k]);
                                                }
                                            }
                                        }
                                    }

                                    if (data.mapData[i].lifts[0] === "empty") {
                                        data.mapData[i].lifts = [];
                                    }

                                    if (data.mapData[i].stairs[0] === "empty") {
                                        data.mapData[i].stairs = [];
                                    }
                                }
                            }
                            

                            for (var i = 0; i < data.mapData.length; i++) {
                                data.mapData[i].index = index++;
                                if (data.mapData[i].name === "building") {
                                    if (data.mapData[i].entrance !== undefined) {
                                        data.mapData[i].entrance.index = index++;
                                    }

                                    for (var j = 0; j < data.mapData[i].internal.length; j++) {
                                        for (var k = 0; k < data.mapData[i].internal[j].length; k++) {
                                            data.mapData[i].internal[j][k].index = index++;                                            
                                        }
                                    }

                                    for (var j = 0; j < data.mapData[i].lifts.length; j++) {
                                        data.mapData[i].lifts[j].index = index++;
                                    }

                                    for (var j = 0; j < data.mapData[i].stairs.length; j++) {
                                        data.mapData[i].stairs[j].index = index++;
                                    }
                                }

                            }
                            
                            
                            setMapData([...data.mapData]);
                            setCategories([...data.categories]);
                            setOptions([...searchOptions]);
                            setShowEnterCodeModal(false);
                            
                        }
                    })

                });
            }
            else {
                setRetrieveMapError("Map not Found");
            }
        });

    }


    // Reset search, origin and destination attibutes 
    // for all buildings and internal rooms
    function resetShapes() {

        var data = mapData;

        for (var i = 0; i < data.length; i++) {
            data[i].search = false;
            data[i].origin = false;
            data[i].destination = false;
            data[i].pathwayShape = false;

            if (data[i].name === "building") {
                for (var j = 0; j < data[i].internal.length; j++) {
                    for (var k = 0; k < data[i].internal[j].length; k++) {
                        if (data[i].internal[j][k].name === "room") {
                            data[i].internal[j][k].search = false;
                            data[i].internal[j][k].origin = false;
                            data[i].internal[j][k].destination = false;
                            data[i].internal[j][k].pathwayShape = false;
                        }
                    }
                }
            }
        }

        setMapData([...data]);
    }

    // Which textfields to show
    function textfieldShowHandler(stage) {
        if (stage === 0) {
            setShowTextFields(false);
            setShowSearchTextField(false);
            setShowDirectionTextFields(false);
        }
        else if (stage === 1) {
            setShowTextFields(true);
            setShowSearchTextField(true);
            setShowDirectionTextFields(false);
        }
        else if (stage === 2) {
            setShowTextFields(true);
            setShowSearchTextField(false);
            setShowDirectionTextFields(true);
        }
    }

    // Search for building
    function searchFunction() {
        resetShapes();

        var data = [...mapData];

        // If searched value is building, find value and set search field to true
        if (search.name === "building") {
            for (var i = 0; i < data.length; i++) {
                if (search.index === mapData[i].index) {
                    data[i].search = true;
                    break;
                }
            }
        }

        // If searched value is room
        if (search.name === "room") {
            // Loop through nodes
            for (var i = 0; i < data.length; i++) {
                // Check if node is building
                if (data[i].name === "building") {

                    // Loop through internal structure
                    for (var j = 0; j < data[i].internal.length; j++) {

                        // Loop through floors
                        for (var k = 0; k < data[i].internal[j].length; k++) {

                            // If found, set search field to true
                            if (data[i].internal[j][k].index === search.index) {
                                data[i].internal[j][k].search = true;

                                // Set building clicked to index
                                setBuildingClicked(data[i].index);

                                // Show building modal
                                setShowBuildingModal(true);
                                break;
                            }
                        }
                    }
                }
            }

        }

        // Update map data
        setMapData([...data]);

        // Set showing result to true
        setShowingResult(true);


    }

    // Get directions
    function getDirectionsFunction() {
        resetShapes();

        // If origin and destination are buildings
        if (origin.name === "building" && destination.name === "building") {

            var originFound = false;
            var destinationFound = false;

            var data = [...mapData];

            for (var i = 0; i < data.length; i++) {
                data[i].pathwayShape = false;
            }

            for (var i = 0; i < data.length; i++) {

                // If label and points of origin shape are equal, set origin field to true
                if (!originFound && origin.index === mapData[i].index) {
                    data[i].origin = true;
                    originFound = true;
                }


                // If label and points of destination shape are equal, set destination field to true
                if (!destinationFound && destination.index === mapData[i].index) {
                    data[i].destination = true;
                    destinationFound = true;
                }

                // If origin and destination found, break from loop
                if (originFound && destinationFound) {
                    break;
                }
            }

            // Run dijktra and determine path
            var visited = dijkstra_buildingToBuilding(mapData, origin, destination);
            var path = getNodesInPathOrder(visited[visited.length - 1]);

            // Loop through buildings and set pathway shapes to true
            for (var i = 0; i < path.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (path[i][0].index === data[j].index && path[i][0].name === data[j].name) {
                        data[j].pathwayShape = true;
                    }
                }

            }

            // Update map data and set showing result to true
            setMapData([...data]);
            setShowingResult(true);
            return;

        }
        else {

            var nodesInPathwayOrder = [];
            var originBuilding = null;
            var destinationBuilding = null;

            // Loop through map data
            for (var i = 0; i < mapData.length; i++) {

                // If shape is building
                if (mapData[i].name === "building") {

                    // Loop through internal structure of building
                    for (var j = 0; j < mapData[i].internal.length; j++) {

                        // Loop through floor
                        for (var k = 0; k < mapData[i].internal[j].length; k++) {

                            // Find building for shape
                            if (originBuilding !== null && destinationBuilding !== null) {
                                break;
                            }
                            if (originBuilding === null && origin.index === mapData[i].internal[j][k].index) {
                                originBuilding = mapData[i];
                            }
                            else if (destinationBuilding === null && destination.index === mapData[i].internal[j][k].index) {
                                destinationBuilding = mapData[i];
                            }
                        }
                    }
                }
            }

            // If origin and destination are both rooms
            if (origin.name === "room" && destination.name === "room") {

                // Get path from origin to entrance of building
                var nodes = dijkstra_roomToEntrance(mapData, origin);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

                // Get path from origin building to destination building
                nodes = dijkstra_buildingToBuilding(mapData, originBuilding, destinationBuilding);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

                // Get path from entrance of destination building entrance to destination
                nodes = dijkstra_roomToEntrance(mapData, destination);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));



            }

            // If origin is room and destination is building
            else if (origin.name === "room" && destination.name === "building") {

                // Get path from origin to entrance of building
                var nodes = dijkstra_roomToEntrance(mapData, origin);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

                // Get path from origin building to destination
                nodes = dijkstra_buildingToBuilding(mapData, originBuilding, destination);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

            }
            else if (origin.name === "building" && destination.name === "room") {

                // Get path from origin to destination building
                nodes = dijkstra_buildingToBuilding(mapData, origin, destinationBuilding);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

                // Get path from destination building entrance to destination
                nodes = dijkstra_roomToEntrance(mapData, destination);
                nodesInPathwayOrder.push(getNodesInPathOrder(nodes[nodes.length - 1]));

            }

            setShowingResult(true);
            setShowRouteFinderCarousel(true);

            setPathwayShapes([...nodesInPathwayOrder]);

        }

    }

    // Handler for back button
    function backButtonHandler() {
        textfieldShowHandler(0);
        resetShapes();
        setShowingResult(false);
    }

    // Handler for clicking on building
    function buildingClickHandler(buildingIndex) {
        for (var i = 0; i < mapData.length; i++) {
            if (mapData[i].index === buildingIndex) {
                setBuildingClicked(i);
                setShowBuildingModal(true);
                break;
            }

        }

    }

    return (
        <React.Fragment>
            {!showEnterCodeModal &&
                <React.Fragment>
                    <div className={classes.paper}>

                        {!showTextFields &&
                            <React.Fragment>
                                <Fab color="primary" variant="extended" className={classes.paperComponent} onClick={() => textfieldShowHandler(1)}>
                                    <SearchIcon style={{ marginRight: 1 }} />
                            Search
                        </Fab>

                                <br />

                                <Fab color="primary" variant="extended" className={classes.paperComponent} onClick={() => textfieldShowHandler(2)}>
                                    <FontAwesomeIcon icon={faRoute} style={{ fontSize: 17, marginRight: 5 }} />
                            Find Route
                        </Fab>
                            </React.Fragment>
                        }

                        {showTextFields && showSearchTextField &&

                            <React.Fragment>
                                <Fab color="secondary" variant="extended" className={classes.paperComponent} onClick={backButtonHandler}>
                                    <FontAwesomeIcon icon={faChevronCircleLeft} style={{ fontSize: 17, marginRight: 5 }} />
                            Back
                        </Fab>

                                <br />

                                {mapData &&
                                    <Autocomplete
                                        className={classes.paperComponent}
                                        style={{ width: 300, backgroundColor: "white" }}
                                        options={options}
                                        autoHighlight
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(option) => (
                                            option.label
                                        )}
                                        onChange={(event, newValue) => {
                                            setSearch(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{ padding: 0, margin: 0 }}
                                                label="Search For A Building"
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    // autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                }


                                <Fab color="primary" variant="extended" className={classes.paperComponent} onClick={searchFunction}>
                                    <SearchIcon style={{ marginRight: 1 }} />
                            Search
                        </Fab>
                            </React.Fragment>

                        }

                        {showTextFields && showDirectionTextFields &&

                            <React.Fragment>
                                <Fab color="secondary" variant="extended" className={classes.paperComponent} onClick={backButtonHandler}>
                                    <FontAwesomeIcon icon={faChevronCircleLeft} style={{ fontSize: 17, marginRight: 5 }} />
                                    Back
                                </Fab>

                                <br />

                                {mapData &&
                                    <Autocomplete
                                        className={classes.paperComponent}
                                        style={{ width: 300, backgroundColor: "white" }}
                                        options={options}
                                        autoHighlight
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(option) => (
                                            option.label
                                        )}
                                        onChange={(event, newValue) => {
                                            setOrigin(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Origin"
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                }



                                {mapData &&
                                    <Autocomplete
                                        className={classes.paperComponent}
                                        style={{ width: 300, backgroundColor: "white" }}
                                        options={options}
                                        autoHighlight

                                        getOptionLabel={(option) => option.label}
                                        renderOption={(option) => (
                                            option.label
                                        )}
                                        onChange={(event, newValue) => {
                                            setDestination(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                color="primary"
                                                label="Destination"
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                }



                                <Fab color="primary" variant="extended" className={classes.paperComponent} onClick={getDirectionsFunction}>
                                    <FontAwesomeIcon icon={faRoute} style={{ fontSize: 17, marginRight: 5 }} />
                            Get Directions
                        </Fab>
                            </React.Fragment>

                        }
                    </div>

                    <ViewMapCanvas clickHandler={buildingClickHandler} showingResult={showingResult} shapes={mapData} categories={categories} />

                    {showBuildingModal &&
                        <ViewBuildingModal handleClose={() => { setShowBuildingModal(false) }} building={mapData[buildingClicked]} categories={categories} showingResult={showingResult} />
                    }

                    {showRouteFinderCarousel &&
                        <RouteFinderCarousel pathway={pathwayShapes} origin={origin} destination={destination} mapData={mapData} categories={categories} handleClose={() => { setShowRouteFinderCarousel(false) }} />
                    }

                    {categories !== null && <CategoryLegend categories={categories} />}
                </React.Fragment>
            }

            {showEnterCodeModal &&
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={true}
                >
                    <div className={classes.modalContent}>
                        <h2>Enter Code</h2>
                        <TextField error={retrieveMapError === "" ? false : true} helperText={retrieveMapError} className={classes.formTextfield} id="enterMapCode" label="Enter Code" variant="outlined" onChange={(event) => setMapCode(event.target.value)} />
                        <br />
                        <Button style={{ marginLeft: 7 }} variant="contained" color="primary" onClick={retrieveMap}>Retrieve Map</Button>

                    </div>
                </Modal>

            }
        </React.Fragment>

    );

}

export default ViewMapPage;