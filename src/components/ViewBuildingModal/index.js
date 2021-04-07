import React, { useState, useEffect } from 'react';
import { useStyles } from '../style.js';

import { Stage, Layer, Text, Rect } from 'react-konva';
import Modal from '@material-ui/core/Modal';

const ViewBuildingModal = (props) => {

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

    var floorNumber = 0;
    var cols = Math.ceil(Math.sqrt(props.building.internal.length));
    var x = (-props.building.width - 50) + 50;
    var y = 50;

    var colNumber = 1;

    return (

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={props.handleClose}
        >
            <div className={classes.modalContent}>
                <h2>{props.building.label}</h2>
                <Stage
                    height={500}
                    width={750}
                    className={classes.viewMapCanvas}
                    onWheel={handleWheel}
                    scaleX={stageScale}
                    scaleY={stageScale}
                    draggable
                    x={stageX}
                    y={stageY}

                >
                    <Layer>
                        {props.building.internal.map((shape, key) => {

                            if (colNumber > cols) {
                                colNumber = 1;
                                x = 50;
                                y += props.building.height + 50;
                            }
                            else {
                                x += props.building.width + 50;

                            }
                            colNumber += 1;
                            floorNumber++;



                            return (
                                <React.Fragment>
                                    <Text
                                        x={x}
                                        y={y - 20}
                                        text={"Floor " + floorNumber}
                                        fontSize={20}
                                        fontFamily='Calibri'
                                    />
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={props.building.width}
                                        height={props.building.height}
                                        fill={props.categories[props.building.category].mainColour}
                                    />



                                    {props.building.internal[floorNumber - 1].map((shape, key) => {

                                        var shapeFill = null;
                                        var opacity = 1;



                                        if (props.showingResult) {
                                            console.log(shape);
                                            if (shape.search) {
                                                shapeFill = '#03b1fc';
                                            }
                                            else if (shape.origin) {
                                                shapeFill = '#03fc0f';
                                            }
                                            else if (shape.destination) {
                                                shapeFill = '#fc03ce';
                                            }
                                            else if (shape.pathwayShape) {
                                                shapeFill = '#0000FF';
                                            }
                                            else {
                                                shapeFill = props.categories[shape.category].mainColour;
                                                opacity = 0.6;
                                            }

                                        }
                                        else {
                                            shapeFill = props.categories[shape.category].mainColour;
                                        }

                                        console.log(shapeFill)

                                        return (
                                            <React.Fragment>
                                                <Rect
                                                    x={shape.x - props.building.x + x}
                                                    y={shape.y - props.building.y + y}
                                                    width={shape.width}
                                                    height={shape.height}
                                                    fill={shapeFill}
                                                    opacity={opacity}

                                                />
                                                <Text
                                                    x={shape.x - props.building.x + x}
                                                    y={shape.y - props.building.y + y}
                                                    text={shape.label}
                                                    width={shape.width}
                                                    height={shape.height}
                                                    fontSize={parseInt(shape.fontSize)}
                                                    fontFamily='Calibri'
                                                    fill={props.categories[shape.category].fontColour}
                                                    verticalAlign="middle"
                                                    align={shape.textAlign}
                                                    opacity={opacity}
                                                />

                                            </React.Fragment>

                                        );
                                    })}
                                    {console.log(props.building.lifts)}
                                    {props.building.lifts.map((shape, key) => {

                                        if (shape.floors[floorNumber - 1]) {
                                            return (
                                                <Rect
                                                    x={shape.x - props.building.x + x}
                                                    y={shape.y - props.building.y + y}
                                                    width={shape.width}
                                                    height={shape.height}
                                                    fill={props.categories[shape.category].mainColour}

                                                />
                                            );

                                        }
                                    })}

                                    {props.building.stairs.map((shape, key) => {
                                        if (shape.floors[floorNumber - 1]) {
                                            return (
                                                <Rect
                                                    x={shape.x - props.building.x + x}
                                                    y={shape.y - props.building.y + y}
                                                    width={shape.width}
                                                    height={shape.height}
                                                    fill={props.categories[shape.category].mainColour}

                                                />
                                            );

                                        }
                                    })}

                                    {props.building.entrance !== undefined &&
                                        props.building.entrance.floorNumber === floorNumber - 1 &&
                                        <Rect
                                            x={props.building.entrance.x - props.building.x + x}
                                            y={props.building.entrance.y - props.building.y + y}
                                            width={props.building.entrance.width}
                                            height={props.building.entrance.height}
                                            fill={props.categories[props.building.entrance.category].mainColour}

                                        />

                                    }
                                </React.Fragment>
                            );
                        })}

                    </Layer>
                </Stage>
            </div>
        </Modal>

    );
};

export default ViewBuildingModal;