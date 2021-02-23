import React, { useState, useRef } from 'react';
import NavBar from '../NavBar';
import CreateMapSidebar from '../CreateMapSidebar';
import CreateMapObjectPropertiesSidebar from '../CreateMapObjectPropertiesSidebar';
import CreateMapCanvas from '../CreateMapCanvas';
import { useStyles } from '../style.js';
import Toolbar from '@material-ui/core/Toolbar';
import CreateMapProgressTracker from '../CreateMapProgressTracker';

import { getGuides } from '../snapGuidesGeneration.js';
const CreateMapPage = () => {

    const classes = useStyles();
    const [shapes, setShapes] = useState([]);
    const [lineGuides, setLineGuides] = useState([]);
    const layerRef = useRef();
    const stageRef = useRef();

    function createShape(shapeType) {
        var newShape = {
            x: window.innerWidth / 8,
            y: document.documentElement.clientWidth / 8,
            width: 100,
            height: 100,
            selected: false,
            fill: "red",
            label: "Label",
            fontSize: 15


        }

        var allShapes = [...shapes];
        allShapes.push(newShape);
        setShapes(allShapes);
    }

    function dragStart(e, index) {
        var allShapes = [...shapes];
        allShapes[index]["fill"] = 'blue';
        setShapes(allShapes);

    }

    function dragMove(e, index) {
        var shapesOnCanvas = layerRef.current.getChildren(function (node) {
            return node.getClassName() === 'Group';
        });

        for (var i = 0; i < shapesOnCanvas.length; i++) {
            // Collision Detection
        }

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

        // var allShapes = [...shapes];

        // allShapes[index]["x"] = Math.floor(e.target.x());
        // allShapes[index]["y"] = Math.floor(e.target.y());
        // setShapes(allShapes);

        setLineGuides(guides);

    }


    function dragEnd(e, index) {
        var allShapes = [...shapes];
        var shape = e.target;

        allShapes[index]["x"] = Math.floor(shape.x());
        allShapes[index]["y"] = Math.floor(shape.y());
        allShapes[index]["fill"] = 'red';
        setShapes(allShapes);
        setLineGuides([]);

    }

    return (
        <div className={classes.root}>
            <NavBar />
            <CreateMapSidebar buttonClick={createShape} />
            <main className={classes.content}>
                <Toolbar />
                <div>
                    <CreateMapProgressTracker />
                </div>

                <CreateMapCanvas
                    dragStart={dragStart}
                    dragMove={dragMove}
                    dragEnd={dragEnd}
                    guides={lineGuides}
                    shapes={shapes}
                    layerRef={layerRef}
                    stageRef={stageRef}
                />
            </main>
            <CreateMapObjectPropertiesSidebar />
        </div>
    );

}

export default CreateMapPage;