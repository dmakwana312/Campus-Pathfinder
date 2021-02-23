import React, { useRef, useEffect } from 'react';
import { Rect, Group, Text } from 'react-konva';

const Shape = (props) => {

    const groupRef = useRef();
    const shapeRef = useRef();
    const textRef = useRef();



    return (
        <Group
            ref={groupRef}
            draggable
            onDragStart={(e) => props.dragStart(e, props.index)}
            onDragMove={(e) => props.dragMove(e, props.index)}
            onDragEnd={(e) => props.dragEnd(e, props.index)}
            x={props.shapeProps.x}
            y={props.shapeProps.y}
        >
            <Rect
                ref={shapeRef}
                key={props.index}
                fill={props.shapeProps.fill}
                width={props.shapeProps.width}
                height={props.shapeProps.height}


            />

            <Text 
                ref={textRef}
                text={props.shapeProps.label}
                width={props.shapeProps.width}
                height={props.shapeProps.height}
                fontSize={props.shapeProps.fontSize}
                fontFamily='Calibri'
                fill="#000000"
                verticalAlign="middle"
                align="center"
            />
        </Group>

    )

}

export default Shape;