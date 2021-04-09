import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';

import { useStyles } from '../style';

import Firebase from '../../utils/firebase';

import { loggedInUser } from '../../utils/userState';


const AdminPageTable = (props) => {

    const classes = useStyles();
    const [allMaps, setAllMaps] = useState([]);
    const [deletedKey, setDeletedKey] = useState("");

    var user = loggedInUser.use();

    useEffect(() => {
        var db = Firebase.database();
        var data = db.ref("MapData/");

        if (user !== null) {
            console.log(user.uid);
            data.orderByChild('userID').equalTo(user.uid).on("value", function (snapshot) {
                var maps = [];
                snapshot.forEach(function (data) {
                    
                        var retrieveMap = db.ref("MapData/" + data.key);
                        retrieveMap.on('value', (snapshot) => {
                            maps.push([data.key, snapshot.val()]);
                            console.log(snapshot);
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
        console.log(map.length)
        for (var i = 0; i < map.length; i++) {
            if (map[i][0] === key) {
                setDeletedKey(key);
                map.splice(i);
                break;

            }
        }

        setAllMaps([...map]);
        

    }


    return (
        <Paper className={classes.centerPaper}>
            <h2>Admin</h2>
            <TableContainer component={Paper}>

                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Map ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Active</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allMaps.map((map, key) => {
                            console.log("rerender")
                            
                            if (map[1] !== null && map[1] !== deletedKey) {
                                return (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {map[0]}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {map[1]["mapName"]}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Checkbox
                                                checked={map[1]["active"]}
                                                onChange={() => { changeActivePropertyOfMap(map[0]) }}
                                                name="active"
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button onClick={() => deleteMap(map[0])} variant="contained"><DeleteForeverIcon color={"secondary"} /></Button>
                                        </TableCell>

                                    </TableRow>
                                )
                            }
                        })}

                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>

    )
}

export default AdminPageTable;