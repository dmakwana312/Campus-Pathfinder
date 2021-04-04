import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ViewMapCanvas from '../ViewMapCanvas';
import firebase from '../firebase';

const ViewMapPage = () => {

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
            <ViewMapCanvas shapes={mapData} categories={categories} />
        </React.Fragment>

    );

}

export default ViewMapPage;