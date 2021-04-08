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

                        // Loop through path
                        for (var i = 0; i < path.length; i++) {

                            // Through the map data
                            for (var j = 0; j < props.mapData.length; j++) {

                                // If shape in path is equal to map data shape, set it as pathway shape
                                if (path[i][0].index === props.mapData[j].index) {
                                    internalLevel = false;
                                    buildingIndex = j;
                                    props.mapData[j].pathwayShape = true;

                                }

                                // If shape in path is equal to origin, set it as origin
                                else if (props.origin.index === props.mapData[j].index) {
                                    props.mapData[j].origin = true;
                                }

                                // If shape in path is equal to destination, set it as origin
                                else if (props.destination.index === props.mapData[j].index) {
                                    props.mapData[j].destination = true;
                                }

                                // If shape represents building, check if pathway shape is internal
                                if (props.mapData[j].name === "building") {

                                    // Loop through internal structure of building
                                    for (var k = 0; k < props.mapData[j].internal.length; k++) {

                                        // Loop through floor
                                        for (var l = 0; l < props.mapData[j].internal[k].length; l++) {

                                            // Check if shape in path is equal and determine if shape is part of path
                                            // or is origin or destination
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
                                            
                                        }
                                    }

                                    // Loop through lifts to check if pathway shape is a lift
                                    for (var k = 0; k < props.mapData[j].lifts.length; k++) {
                                        if (path[i][0].index === props.mapData[j].lifts[k].index) {
                                            props.mapData[j].lifts[k].pathwayShape = true;
                                        }
                                    }

                                    // Loop through staircases to check if pathway shape is a staircase
                                    for (var k = 0; k < props.mapData[j].stairs.length; k++) {
                                        if (path[i][0].index === props.mapData[j].stairs[k].index) {
                                            props.mapData[j].stairs[k].pathwayShape = true;
                                        }
                                    }

                                }
                            }
                        }

                        // If path represents shapes that are internal, display a map of the building floors
                        if (internalLevel) {

                            // Current floor number
                            var floorNumber = 0;

                            // Determine number of columns (for displaying floors)
                            var cols = Math.ceil(Math.sqrt(props.mapData[buildingIndex].internal.length));

                            // Determine initial x and y
                            var x = (-props.mapData[buildingIndex].width - 50) + 50;
                            var y = 50;

                            // Current column number
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

                                                // If current column is greater than current column, reset values
                                                if (colNumber > cols) {
                                                    colNumber = 1;
                                                    x = 50;
                                                    y += props.mapData[buildingIndex].height + 50;
                                                }
                                                else {
                                                    x += props.mapData[buildingIndex].width + 50;

                                                }

                                                // Increment current column number and floor number
                                                colNumber++;
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

                                                            // Determine shape fill colour and opacity
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

                                                        {/* Display lifts */}
                                                        {props.mapData[buildingIndex].lifts.map((shape, key) => {

                                                            // Determine shape fill colour and opacity
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

                                                            // If lift is accessible through current floor display
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

                                                        { /* Display lifts */}
                                                        {props.mapData[buildingIndex].stairs.map((shape, key) => {

                                                            // Determine shape fill colour and opacity
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
                                                            // If stair case is accessible through current floor
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

                                                        {/* Display entrance for building */}
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