import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';

import ViewMapCanvas from '../ViewMapCanvas';
import firebase from '../firebase';
import { dijkstra, getNodesInPathOrder } from '../dijkstra';
import ViewBuildingModal from '../ViewBuildingModal';
import CategoryLegend from '../CategoryLegend';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

import { useStyles } from '../style.js';

const ViewMapPage = () => {

    const classes = useStyles();
    const [mapData, setMapData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [showTextFields, setShowTextFields] = useState(false);
    const [showSearchTextField, setShowSearchTextField] = useState(false);
    const [showDirectionTextFields, setShowDirectionTextFields] = useState(false);
    const [search, setSearch] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showingResult, setShowingResult] = useState(false);
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [buildingClicked, setBuildingClicked] = useState(null);

    useEffect(() => {
        var db = firebase.database();
        var data = db.ref("MapData/-MXabwvzdl1pdWImFfNa");

        data.on('value', (snapshot) => {
            const data = snapshot.val();

            for (var i = 0; i < data.mapData.length; i++) {
                data.mapData[i].index = i;
                if (data.mapData[i].name === "building") {
                    for (var j = 0; j < data.mapData[i].internal.length; j++) {
                        if (data.mapData[i].internal[j][0] === "empty") {
                            data.mapData[i].internal[j][0] = [];
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

            setMapData([...data.mapData]);
            setCategories([...data.categories]);
        });
    }, [])

    // Reset search, origin and destination attibutes for all buildings
    function resetShapes() {

        var data = mapData;

        for (var i = 0; i < data.length; i++) {
            if (data[i].name === "building") {
                data[i].search = false;
                data[i].origin = false;
                data[i].destination = false;
                data[i].pathwayShape = false;
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
        for (var i = 0; i < data.length; i++) {
            if (search.index === mapData[i].index) {
                data[i].search = true;
                break;
            }
        }

        setMapData([...data]);
        setShowingResult(true);
    }

    // Get directions
    function getDirectionsFunction() {
        resetShapes();

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

        var visited = dijkstra(mapData, origin, destination);
        var path = getNodesInPathOrder(visited[visited.length - 1]);

        for (var i = 0; i < path.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (path[i] === data[j].index) {
                    data[path[i]].pathwayShape = true;
                }
            }

        }

        setMapData([...data]);
        setShowingResult(true);

    }

    function backButtonHandler() {
        textfieldShowHandler(0);
        resetShapes();
        setShowingResult(false);
    }

    function buildingClickHandler(buildingIndex) {

        setBuildingClicked(buildingIndex);
        setShowBuildingModal(true);
    }

    return (
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
                                options={mapData.filter(function (shape) {
                                    return shape.name === "building";
                                })}
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
                                options={mapData.filter(function (shape) {
                                    return shape.name === "building";
                                })}
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
                                options={mapData.filter(function (shape) {
                                    return shape.name === "building";
                                })}
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
                <ViewBuildingModal handleClose={() => { setShowBuildingModal(false) }} building={mapData[buildingClicked]} categories={categories} />
            }

            {categories !== null && <CategoryLegend categories={categories} />}

        </React.Fragment>

    );

}

export default ViewMapPage;