import React, { useState, useEffect } from 'react';

import {
    Paper, 
    Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Tooltip
} from '@material-ui/core';

import {
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction
} from '@material-ui/lab';

import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import Firebase from '../../utils/firebase';
import { loggedInUser } from '../../utils/userState';
import { setMap } from '../../utils/mapState';
import { Redirect } from 'react-router';

import { useStyles } from '../style';

const AdminPageTable = (props) => {

    const classes = useStyles();
    const [allMaps, setAllMaps] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [showSpeedDialOptions, setShowSpeedDialOptions] = useState(false);

    var user = loggedInUser.use();

    useEffect(() => {
        setMap(null);
        var db = Firebase.database();
        var data = db.ref("MapData/");

        if (user !== null) {
            data.orderByChild('userID').equalTo(user.uid).on("value", function (snapshot) {
                var maps = [];
                snapshot.forEach(function (data) {

                    var retrieveMap = db.ref("MapData/" + data.key);
                    retrieveMap.on('value', (snapshot) => {
                        maps.push([data.key, snapshot.val()]);
                        setAllMaps([...maps]);
                    })

                });
            });

        };

    }, []);

    function changeActivePropertyOfMap(key) {
        var db = Firebase.database();
        var currentActiveProperty = false;

        for (var i = 0; i < allMaps.length; i++) {
            if (allMaps[i][0] === key) {
                currentActiveProperty = allMaps[i][1]["active"];
                break;
            }
        }

        db.ref("MapData/" + key).update({
            active: !currentActiveProperty
        })
    }

    function deleteMap(key) {
        var db = Firebase.database();
        db.ref("MapData/" + key).remove();
        var map = allMaps
        for (var i = 0; i < map.length; i++) {
            if (map[i][0] === key) {
                map.splice(i);
                break;

            }
        }

        setAllMaps([...map]);

    }

    function editMap(key) {
        for (var i = 0; i < allMaps.length; i++) {
            if (allMaps[i][0] === key) {
                setMap(allMaps[i]);
                setRedirect(true);
                break;
            }
        }


    }

    function createMapPageRedirect() {
        if (redirect) {
            return <Redirect to='/createmap' />;
        }
    }

    return (
        <React.Fragment>


            <Paper className={classes.centerPaper}>

                {createMapPageRedirect()}
                <h2>Admin</h2>
                <TableContainer component={Paper} elevation={5}>

                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Code</TableCell>
                                <TableCell align="center">Created On</TableCell>
                                <TableCell align="center">Last Updated</TableCell>
                                <TableCell align="center">Active</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allMaps.map((map, key) => {

                                if (map[1] !== null) {
                                    return (
                                        <TableRow key={key}>

                                            <TableCell component="th" scope="row">
                                                {map[1]["mapName"]}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {map[1]["code"]}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {map[1]["createdDate"]}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {map[1]["updatedDate"]}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Checkbox
                                                    checked={map[1]["active"]}
                                                    onChange={() => { changeActivePropertyOfMap(map[0]) }}
                                                    name="active"
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Tooltip title="Edit Map" placement="bottom" arrow>
                                                    <Button onClick={() => { editMap(map[0]) }} variant="contained"><EditIcon fontSize="small" /></Button>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Tooltip title="Delete Map" placement="bottom" arrow>
                                                    <Button onClick={() => deleteMap(map[0])} variant="contained"><FontAwesomeIcon icon={faTrashAlt} style={{ margin: "auto", color: "#FF0000", fontSize: 17 }} /></Button>
                                                </Tooltip>
                                            </TableCell>

                                        </TableRow>
                                    )
                                }
                            })}


                        </TableBody>
                    </Table>
                </TableContainer>



            </Paper>

            <SpeedDial
                ariaLabel="SpeedDial example"
                className={classes.speedDial}
                // hidden={hidden}
                icon={<SpeedDialIcon />}
                onClose={() => setShowSpeedDialOptions(false)}
                onOpen={() => setShowSpeedDialOptions(true)}
                open={showSpeedDialOptions}
                direction={"up"}
            >
                <SpeedDialAction
                    key={
                        "New Map"
                    }
                    icon={<AddBoxIcon />}
                    tooltipTitle={"Create New Map"}
                    onClick={() => {
                        setMap(null);
                        setRedirect(true);
                    }}
                />

            </SpeedDial>
        </React.Fragment>
    )
}

export default AdminPageTable;