import React, { useRef, useEffect, useState } from 'react';
import { Rect, Group, Text, Transformer, Line, Tag } from 'react-konva';

const ViewShape = (props) => {  


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