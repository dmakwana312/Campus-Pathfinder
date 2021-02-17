import React, { useState } from 'react';
import NavBar from '../NavBar';
import CreateMapSidebar from '../CreateMapSidebar';
import CreateMapObjectPropertiesSidebar from '../CreateMapObjectPropertiesSidebar';
import CreateMapCanvas from '../CreateMapCanvas';
import { useStyles } from '../style.js';
import Toolbar from '@material-ui/core/Toolbar';
import CreateMapProgressTracker from '../CreateMapProgressTracker';
const CreateMapPage = () => {

    const classes = useStyles();
    const [text, setText] = useState("");
    function buttonClick(buttonname) {
        setText(buttonname);
    }


    return (
        <div className={classes.root}>
            <NavBar />
            <CreateMapSidebar buttonClick={buttonClick} />
            <main className={classes.content}>
                <Toolbar />
                <div>
                    
                    <CreateMapProgressTracker />
                </div>

                <CreateMapCanvas />
            </main>
            <CreateMapObjectPropertiesSidebar text={text} />
        </div>
    );

}

export default CreateMapPage;