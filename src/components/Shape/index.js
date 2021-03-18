import React, { useRef, useEffect } from 'react';
import { Rect, Group, Text, Transformer, Line, Tag } from 'react-konva';

const Shape = (props) => {

    // References 
    const transformRef = useRef();
    const groupRef = useRef();
    const shapeRef = useRef();
    const textRef = useRef();

    // Attach transformer to selected shape
    useEffect(() => {
        if (props.shapeProps.selected) {
            transformRef.current.nodes([groupRef.current]);
            transformRef.current.getLayer().batchDraw();

        }
    }, [props.shapeProps.selected])
    
    return (

        <React.Fragment>
        
            <Group
                ref={groupRef}
                shapePoints={props.shapeProps.points}
                // key={props.index}
                // index={props.index}
                draggable
                onDragStart={(e) => props.dragStart(e, props.index)}
                onDragMove={(e) => props.dragMove(e, props.index)}
                onDragEnd={(e) => props.dragEnd(e, props.index)}
                onClick={() => props.onSelect(props.index)}
                onTap={() => props.onSelect(props.index)}
                rotation={parseInt(props.shapeProps.rotation)}
                x={props.shapeProps.x}
                y={props.shapeProps.y}
                // offsetX={props.shapeProps.width / 2}
                // offsetY={props.shapeProps.height / 2}
                width={props.shapeProps.width}
                height={props.shapeProps.height}
                name={props.shapeProps.name}

                // On completion of transformation
                onTransformEnd={(e) => {

                    // Get scaled values for X and Y axis for selected shape
                    var node = groupRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Reset scale of selected shape
                    node.scaleX(1);
                    node.scaleY(1);

                    // Get new width and height for selected shape
                    var shape = shapeRef.current;
                    const width = shape.width();
                    const height = shape.height();

                    // Reset text scale to prevent font size changing
                    var text = textRef.current;
                    const absScale = text.getAbsoluteScale();
                    text.scaleX(text.scaleX() / absScale.x);
                    text.scaleY(text.scaleY() / absScale.y);

                    // Update properties of shape
                    props.updatePropertiesOfShape("x", node.x());
                    props.updatePropertiesOfShape("y", node.y());
                    props.updatePropertiesOfShape("width", width * scaleX);
                    props.updatePropertiesOfShape("height", height * scaleY);
                    props.updatePropertiesOfShape("rotation", Math.floor(node.rotation()));
                    
                    // Update points of shape
                    props.updatePoints();

                    // props.dragEnd(e, props.index);

                }}
            >

                {/* Rectangle to represent building */}
                <Rect
                    ref={shapeRef}
                    fill={props.shapeColour}
                    width={props.shapeProps.width}
                    height={props.shapeProps.height}

                />

                {/* Text component for label */}
                <Text
                    ref={textRef}
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

            {/* Display transformer is shape is selected */}
            {props.shapeProps.selected && (
                <Transformer
                    width={200}
                    ref={transformRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        
                        // Limit transformation to prevent it getting too small
                        if (newBox.width < 10 || newBox.height < 10) {
                            return oldBox;
                        }

                        return newBox;

                    }}
                />
            )}
        </React.Fragment>
    )

}

export default Shape;