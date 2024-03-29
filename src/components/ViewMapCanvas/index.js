import React, { useState } from 'react';
import { 
    Stage, 
    Layer, 
    Group 
} from 'react-konva';

import ViewShape from '../ViewShape';

import { useStyles } from '../style.js';

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
            width={props.width === undefined ? document.documentElement.clientWidth : props.width}
            height={props.height === undefined ? document.documentElement.clientHeight : props.height}
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            draggable
            x={stageX}
            y={stageY}
        >

            <Layer>
                <Group>
                    {props.shapes != null && props.categories != null &&
                        props.shapes.map((shape, key) => {

                            // Determine shape fill and opacity
                            var shapeFill = null;
                            var opacity = 1;

                            if(props.showingResult){
                                if(shape.search) {
                                    shapeFill = '#03b1fc';
                                }
                                else if(shape.origin) {
                                    shapeFill = '#03fc0f';
                                }
                                else if(shape.destination) {
                                    shapeFill = '#fc03ce';
                                }
                                else if(shape.pathwayShape) {
                                    shapeFill = '#0000FF';
                                }
                                else{ 
                                    shapeFill = props.categories[shape.category].mainColour;
                                    opacity = 0.5;
                                }
                            }
                            else {
                                shapeFill = props.categories[shape.category].mainColour;
                            }

                            return (
                                <ViewShape
                                    key={key}
                                    shapeProps={shape}
                                    shapeColour={shapeFill}
                                    fontColour={props.categories[shape.category].fontColour}
                                    opacity={opacity}
                                    clickHandler={props.clickHandler}
                                />
                            );
                        })
                    }
                </Group>

            </Layer>

        </Stage>
    );
}

export default ViewMapCanvas;