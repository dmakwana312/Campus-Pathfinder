import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';

import ViewMapCanvas from '../ViewMapCanvas';
import firebase from '../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'

import { useStyles } from '../style.js';

const ViewMapPage = () => {

    const classes = useStyles();
    const [mapData, setMapData] = useState(null);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        var db = firebase.database();
        var data = db.ref("MapData/-MXCqzQ3DNVYTzfiFqxr");

        data.on('value', (snapshot) => {
            const data = snapshot.val();
            setMapData([...data.mapData]);
            setCategories([...data.categories]);
        });
    }, [])

    return (
        <React.Fragment>
            {mapData &&
                <Autocomplete
                    style={{ width: 300 }}
                    options={mapData.filter(function (shape) {
                        return shape.name === "building";
                    })}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(option) => (
                        option.label
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
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
            
            {/* <Paper elevation={3} className={classes.paper}> */}
            <div className={classes.paper}>
            <Fab color="primary" variant="extended" className={classes.paperButton}>
                    <SearchIcon style={{ marginRight: 1 }} />
                    Search
                </Fab>

                <br />

                <Fab color="primary" variant="extended" className={classes.paperButton}>
                <FontAwesomeIcon icon={faRoute} style={{ fontSize: 17, marginRight: 5}}/>
                    {/* <NavigationIcon style={{ marginRight: 1 }} /> */}
                    Find Route
                </Fab>
                </div>
                
                
            {/* </Paper> */}

            <ViewMapCanvas shapes={mapData} categories={categories} />
            
        </React.Fragment>

    );

}

export default ViewMapPage;