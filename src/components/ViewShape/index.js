import React, { useRef, useEffect, useState } from 'react';
import { Rect, Group, Text, Transformer, Line, Tag } from 'react-konva';

const ViewShape = (props) => {

    // Change cursor on mouse enter
    function mouseEnter(e){
        const container = e.target.getStage().container();
        container.style.cursor = "pointer";
    }

    // Change cursor on mouse leave
    function mouseLeave(e){
        const container = e.target.getStage().container();
        container.style.cursor = "default";
    }

    var mouseHandlerProps = {};

    if(props.shapeProps.name === "building"){
        // Create mouse handler props
        mouseHandlerProps = {
            onClick: () => props.clickHandler(props.shapeProps.index),
            onMouseEnter: mouseEnter,
            onMouseLeave: mouseLeave

        }
    }

    return (

        <Group
            shapePoints={props.shapeProps.points}
            // key={props.index}
            // index={props.index}

            rotation={parseInt(props.shapeProps.rotation)}
            x={props.shapeProps.x}
            y={props.shapeProps.y}
            // offsetX={props.shapeProps.width / 2}
            // offsetY={props.shapeProps.height / 2}
            width={props.shapeProps.width}
            height={props.shapeProps.height}
            name={props.shapeProps.name}
            opacity={props.opacity}
            {...mouseHandlerProps}
        >

            {/* Rectangle to represent building */}
            <Rect
                fill={props.shapeColour}
                width={props.shapeProps.width}
                height={props.shapeProps.height}
            />

            {/* Text component for label */}
            <Text
                text={props.shapeProps.label}
                width={props.shapeProps.width}
                height={props.shapeProps.height}
                fontSize={parseInt(props.shapeProps.fontSize)}
                fontFamily='Calibri'
                fill={props.fontColour}
                verticalAlign="middle"
                align={props.shapeProps.textAlign}
            />

        </Group>
    )

}

export default ViewShape;