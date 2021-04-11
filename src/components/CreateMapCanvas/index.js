import React, { useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

import EditShape from '../EditShape';

import { useStyles } from '../style.js';

const CreateMapCanvas = (props) => {

    const classes = useStyles();

    const [stageScale, setStageScale] = useState(1);
    const [stageX, setStageX] = useState(0);
    const [stageY, setStageY] = useState(0);

    let points = [];

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

    // Display building shapes (with paths) for when active step is 1
    function displayBuildings() {
        return (

            // Map shapes from props and display
            props.shapes.map((shape, key) => {

                return (

                    <EditShape
                        key={key}
                        index={key}
                        shapeProps={shape}
                        dragStart={props.dragStart}
                        dragMove={props.dragMove}
                        dragEnd={props.dragEnd}
                        onSelect={props.onSelect}
                        updatePropertiesOfShape={props.updateProperty}
                        shapeColour={props.categories[shape.category].mainColour}
                        fontColour={props.categories[shape.category].fontColour}
                        // updatePoints={() => props.updatePoints(key)}
                        updatePoints={props.updatePoints}
                    />

                )
            })
        );
    }

    // Display internal structure of selected building, when active step is 1
    function displayInternalStructure() {

        // If a building has been selected
        if (props.buildingBeingViewed) {

            points = [
                props.buildingBeingViewed.x, props.buildingBeingViewed.y,
                props.buildingBeingViewed.x + props.buildingBeingViewed.width, props.buildingBeingViewed.y,
                props.buildingBeingViewed.x + props.buildingBeingViewed.width, props.buildingBeingViewed.y + props.buildingBeingViewed.height,
                props.buildingBeingViewed.x, props.buildingBeingViewed.y + props.buildingBeingViewed.height
            ];

            return (
                <React.Fragment>

                    <Rect

                        x={props.buildingBeingViewed.x}
                        y={props.buildingBeingViewed.y}
                        width={props.buildingBeingViewed.width}
                        height={props.buildingBeingViewed.height}
                        fill={props.categories[props.buildingBeingViewed.category]["mainColour"]}
                        closed={true}
                        rotation={0}

                    />

                    {/* {props.buildingBeingViewed.internal[props.floorBeingViewed].map((shape, key) => {

                        if (shape !== null && shape.length > 0) {


                            return (
                                <React.Fragment>

                                    <Shape
                                        key={key}
                                        index={key}
                                        shapeProps={shape}
                                        dragStart={props.dragStart}
                                        dragMove={props.dragMove}
                                        dragEnd={props.dragEnd}
                                        onSelect={props.onSelect}
                                        updatePropertiesOfShape={props.updateProperty}
                                        shapeColour={props.categories[shape.category].mainColour}
                                        fontColour={props.categories[shape.category].fontColour}
                                        // updatePoints={() => props.updatePoints(key)}
                                        updatePoints={props.updatePoints}
                                    />
                                </React.Fragment>

                            )


                        }
                        else {

                        }

                    })} */}

                    {/* Map all shapes from given props and display */}
                    {props.shapes.map((shape, key) => {

                        // If shape is not null
                        if (shape !== null) {

                            // If the shape represents a lift or staircase 
                            if (shape.name === "lifts" || shape.name === "stairs") {

                                // If it is accessible by the floor being viewed, display it
                                if (shape.floors[props.floorBeingViewed]) {
                                    return (

                                        <EditShape
                                            key={key}
                                            index={key}
                                            shapeProps={shape}
                                            dragStart={props.dragStart}
                                            dragMove={props.dragMove}
                                            dragEnd={props.dragEnd}
                                            onSelect={props.onSelect}
                                            updatePropertiesOfShape={props.updateProperty}
                                            shapeColour={props.categories[shape.category].mainColour}
                                            fontColour={props.categories[shape.category].fontColour}
                                            // updatePoints={() => props.updatePoints(key)}
                                            updatePoints={props.updatePoints}
                                        />

                                    )
                                }
                            }
                            // If shape is not a lift or staircase, display it
                            else {
                                return (


                                    <EditShape
                                        key={key}
                                        index={key}
                                        shapeProps={shape}
                                        dragStart={props.dragStart}
                                        dragMove={props.dragMove}
                                        dragEnd={props.dragEnd}
                                        onSelect={props.onSelect}
                                        updatePropertiesOfShape={props.updateProperty}
                                        shapeColour={props.categories[shape.category].mainColour}
                                        fontColour={props.categories[shape.category].fontColour}
                                        // updatePoints={() => props.updatePoints(key)}
                                        updatePoints={props.updatePoints}
                                    />


                                )
                            }
                        }

                    })}
                </React.Fragment>

            );
        }

    }

    return (
        <Stage
            className={classes.canvas}
            width={document.documentElement.clientWidth}
            height={document.documentElement.clientHeight}
            draggable
            ref={props.stageRef}
            onMouseDown={(e) => props.checkDeselect(e)}
            onTouchStart={(e) => props.checkDeselect(e)}
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stageX}
            y={stageY}

        >
            <Layer
                ref={props.layerRef}
            >

                {/* Display shapes based on what the current active step is */}
                {props.activeStep === 0 ? displayBuildings() : displayInternalStructure()}

                {/* Map snap guidelines properties to shapes to display them */}
                {props.guides.map((guide, key) => {
                    if (guide['orientation'] === 'V') {
                        return (
                            <Line
                                key={key}
                                x={guide['lineGuide']}
                                y={0}
                                points={[0, -6000, 0, 6000]}
                                stroke={'#0000FF'}
                                strokeWidth={1}
                                name={'guide-line'}
                                dash={[4, 6]}
                            />
                        );
                    }
                    else if (guide['orientation'] === 'H') {
                        return (
                            <Line
                                key={key}
                                x={0}
                                y={guide['lineGuide']}
                                points={[-6000, 0, 6000, 0]}
                                stroke={'#0000FF'}
                                strokeWidth={1}
                                name={'guide-line'}
                                dash={[4, 6]}
                            />
                        );
                    }
                })}

            </Layer>
        </Stage>
    );
}

export default CreateMapCanvas;