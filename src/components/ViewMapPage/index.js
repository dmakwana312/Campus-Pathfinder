import React, { useState, useRef, useEffect } from 'react';

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

        <ViewMapCanvas shapes={mapData} categories={categories}/>

    );
    
}

export default ViewMapPage;