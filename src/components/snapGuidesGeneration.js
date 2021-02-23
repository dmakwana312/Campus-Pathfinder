function getObjectSnappingEdges(node) {
    var box = node.getClientRect();
    var absolutePosition = node.absolutePosition();

    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(absolutePosition.x - box.x),
                snap: 'start',
            },
            {
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(absolutePosition.x - box.x - box.width / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(absolutePosition.x - box.x - box.width),
                snap: 'end',
            }
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(absolutePosition.y - box.y),
                snap: 'start',
            },
            {
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(absolutePosition.y - box.y - box.height / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(absolutePosition.y - box.y - box.height),
                snap: 'end',
            },
        ],
    };
}

function getLineGuideStops(skipShape, shapes, stageRef) {
    var vertical = [0, stageRef.current.width() / 2, stageRef.current.width()];
    var horizontal = [0, stageRef.current.height() / 2, stageRef.current.height()];

    shapes.forEach(shape => {
        if (shape === skipShape) {
            return;
        }

        var box = shape.getClientRect();

        vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
        horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);

    });

    return {
        vertical: vertical.flat(),
        horizontal: horizontal.flat()

    };
}

export function getGuides(shape, allShapes, stageRef) {

    var lineGuideStops = getLineGuideStops(shape, allShapes, stageRef);

    var itemBounds = getObjectSnappingEdges(shape);

    var resultV = [];
    var resultH = [];

    var GUIDELINEOFFSET = 5;

    lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);

            if (diff < GUIDELINEOFFSET) {
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        })
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < GUIDELINEOFFSET) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        })
    });

    var guides = [];

    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];

    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap,
        })
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap,
        });
    }
    return guides;
}