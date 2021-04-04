import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useStyles } from '../style.js';

import ViewShape from '../ViewShape';

const ViewMapCanvas = (props) => {

    const classes = useStyles();

    const [stageScale, setStageScale] = useState(1);
    const [stageX, setStageX] = useState(0);
    const [stageY, setStageY] = useState(0);

    function handleWheel(e) {
        e.evt.preventDefault();
    
        // Initial scale of stage
        const scaleBy = 1.01;
    
        // Stage in current form
        const stage = e.target.getStage();
    
        // Previous Scale
        const oldScale = stage.scaleX();
    
        // Find where mouse is pointing
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };
    
        // Calculate and set new scale of stage
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: newScale });
    
        // Set properties with calculated values
        setStageScale(newScale)
        setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
        setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
    
    };
    
    return (
        <Stage
            className={classes.viewMapCanvas}
            width={document.documentElement.clientWidth}
            height={document.documentElement.clientHeight}
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            draggable
            x={stageX}
            y={stageY}
    
        >
    
            <Layer>

                {props.shapes != null && props.categories != null &&
                    props.shapes.map((shape, key) => {
                        return (
                            <ViewShape 
                                key={key}
                                shapeProps={shape}
                                shapeColour={props.categories[shape.category].mainColour}
                                fontColour={props.categories[shape.category].fontColour}
                            />
                        );
                    })
                }
                
            </Layer>
    
        </Stage>
    );
}

export default ViewMapCanvas;