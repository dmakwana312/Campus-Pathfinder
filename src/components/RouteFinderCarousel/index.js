import React, { useState, useRef } from 'react';

import Modal from '@material-ui/core/Modal';
import Carousel from 'react-material-ui-carousel';
import Paper from '@material-ui/core/Paper';

import { Stage, Layer, Text, Rect } from 'react-konva';

import ViewMapCanvas from '../ViewMapCanvas';

import { useStyles } from '../style.js';

const RouteFinderCarousel = (props) => {

    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={props.handleClose}
        >
            <div className={classes.modalContent}>
                <h2>Route</h2>
                <Carousel>
                    {props.pathway.map((path, key) => {
                        var internalLevel = true;
                        var buildingIndex = -1;

                        for (var i = 0; i < path.length; i++) {

                            for (var j = 0; j < props.mapData.length; j++) {

                                if (path[i][0].index === props.mapData[j].index) {
                                    internalLevel = false;
                                    buildingIndex = j;
                                    props.mapData[j].pathwayShape = true;

                                }
                                else if (props.origin.index === props.mapData[j].index) {
                                    props.mapData[j].origin = true;
                                }
                                else if (props.destination.index === props.mapData[j].index) {
                                    props.mapData[j].destination = true;
                                }

                                if (props.mapData[j].name === "building") {

                                    for (var k = 0; k < props.mapData[j].internal.length; k++) {
                                        for (var l = 0; l < props.mapData[j].internal[k].length; l++) {

                                            if (path[i][0].index === props.mapData[j].internal[k][l].index) {
                                                internalLevel = true;
                                                props.mapData[j].internal[k][l].pathwayShape = true;
                                                buildingIndex = j;
                                            }
                                            else if (props.origin.index === props.mapData[j].internal[k][l].index) {
                                                props.mapData[j].internal[k][l].origin = true;
                                            }
                                            else if (props.destination.index === props.mapData[j].internal[k][l].index) {
                                                props.mapData[j].internal[k][l].destination = true;
                                            }
                                            continue;
                                        }
                                    }

                                    for (var k = 0; k < props.mapData[j].lifts.length; k++) {
                                        if (path[i][0].index === props.mapData[j].lifts[k].index) {
                                            props.mapData[j].lifts[k].pathwayShape = true;
                                        }
                                    }

                                    for (var k = 0; k < props.mapData[j].stairs.length; k++) {
                                        if (path[i][0].index === props.mapData[j].stairs[k].index) {
                                            props.mapData[j].stairs[k].pathwayShape = true;
                                        }
                                    }

                                }
                            }
                        }

                        if (internalLevel) {
                            var floorNumber = 0;
                            var cols = Math.ceil(Math.sqrt(props.mapData[buildingIndex].internal.length));
                            var x = (-props.mapData[buildingIndex].width - 50) + 50;
                            var y = 50;

                            var colNumber = 1;

                            return (
                                <Paper>
                                    <Stage
                                        height={500}
                                        width={750}
                                        className={classes.viewMapCanvas}
                                        // onWheel={handleWheel}
                                        // scaleX={stageScale}
                                        // scaleY={stageScale}
                                        draggable
                                    // x={stageX}
                                    // y={stageY}

                                    >
                                        <Layer>
                                            {props.mapData[buildingIndex].internal.map((shape, key) => {

                                                if (colNumber > cols) {
                                                    colNumber = 1;
                                                    x = 50;
                                                    y += props.mapData[buildingIndex].height + 50;
                                                }
                                                else {
                                                    x += props.mapData[buildingIndex].width + 50;

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
                                                            width={props.mapData[buildingIndex].width}
                                                            height={props.mapData[buildingIndex].height}
                                                            fill={props.categories[props.mapData[buildingIndex].category].mainColour}
                                                        />

                                                        {props.mapData[buildingIndex].internal[floorNumber - 1].map((shape, key) => {

                                                            var shapeFill = null;
                                                            var opacity = 1;

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

                                                            return (
                                                                <React.Fragment>
                                                                    <Rect
                                                                        x={shape.x - props.mapData[buildingIndex].x + x}
                                                                        y={shape.y - props.mapData[buildingIndex].y + y}
                                                                        width={shape.width}
                                                                        height={shape.height}
                                                                        fill={shapeFill}
                                                                        opacity={opacity}

                                                                    />
                                                                    <Text
                                                                        x={shape.x - props.mapData[buildingIndex].x + x}
                                                                        y={shape.y - props.mapData[buildingIndex].y + y}
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

                                                        {props.mapData[buildingIndex].lifts.map((shape, key) => {
                                                            var shapeFill = null;
                                                            var opacity = 1;
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

                                                            if (shape.floors[floorNumber - 1]) {
                                                                return (
                                                                    <Rect
                                                                        x={shape.x - props.mapData[buildingIndex].x + x}
                                                                        y={shape.y - props.mapData[buildingIndex].y + y}
                                                                        width={shape.width}
                                                                        height={shape.height}
                                                                        fill={shapeFill}

                                                                    />
                                                                );

                                                            }
                                                        })}

                                                        {props.mapData[buildingIndex].stairs.map((shape, key) => {
                                                            if (shape.floors[floorNumber - 1]) {
                                                                return (
                                                                    <Rect
                                                                        x={shape.x - props.mapData[buildingIndex].x + x}
                                                                        y={shape.y - props.mapData[buildingIndex].y + y}
                                                                        width={shape.width}
                                                                        height={shape.height}
                                                                        fill={props.categories[shape.category].mainColour}

                                                                    />
                                                                );

                                                            }
                                                        })}

                                                        {props.mapData[buildingIndex].entrance !== undefined &&
                                                            props.mapData[buildingIndex].entrance.floorNumber === floorNumber - 1 &&
                                                            <Rect
                                                                x={props.mapData[buildingIndex].entrance.x - props.mapData[buildingIndex].x + x}
                                                                y={props.mapData[buildingIndex].entrance.y - props.mapData[buildingIndex].y + y}
                                                                width={props.mapData[buildingIndex].entrance.width}
                                                                height={props.mapData[buildingIndex].entrance.height}
                                                                fill={"#0000FF"}

                                                            />

                                                        }
                                                    </React.Fragment>
                                                );
                                            })}

                                        </Layer>
                                    </Stage>
                                </Paper>
                            );
                        }
                        else {
                            return (
                                <Paper>
                                    <ViewMapCanvas height={500} width={750} clickHandler={() => {}} showingResult={true} shapes={props.mapData} categories={props.categories} />

                                </Paper>
                            );
                        }

                    })}
                </Carousel>
            </div>

        </Modal>
    );

}

export default RouteFinderCarousel;