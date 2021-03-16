export function isColliding(shape1, shape2) {

    var shape1Points = shape1.points;
    var shape2Points = shape2.points;

    // var shape1Points = shape1;
    // var shape2Points = shape2;

    var shape1Edges = generateEdges(shape1Points);
    var shape2Edges = generateEdges(shape2Points);

    var perpendicularLine = [];
    var dot = 0;
    var perpendicularStack = [];
    var aMin = 0;
    var aMax = 0;
    var bMin = 0;
    var bMax = 0;

    for (var i = 0; i < shape1Edges.length; i += 2) {
        perpendicularLine = [-shape1Edges[i + 1], shape1Edges[i]];
        // perpendicularStack.push(-shape1Edges[i + 1], shape1Edges[i]);
        perpendicularStack.push(-shape1Edges[i + 1]);
        perpendicularStack.push(shape1Edges[i]);
    }

    for (var i = 0; i < shape2Edges.length; i += 2) {
        perpendicularLine = [-shape2Edges[i + 1], shape2Edges[i]];
        perpendicularStack.push(-shape2Edges[i + 1]);
        perpendicularStack.push(shape2Edges[i]);
    }

    for (var i = 0; i < perpendicularStack.length; i += 2) {
        aMin = null;
        aMax = null;
        bMin = null;
        bMax = null;

        for (var j = 0; j < shape1Points.length; j += 2) {
            dot = shape1Points[j] * perpendicularStack[i] + shape1Points[j + 1] * perpendicularStack[i + 1];

            if(aMax === null || dot > aMax){
                aMax = dot;
            }

            if(aMin === null || dot < aMin){
                aMin = dot;
            }
        }

        for (var j = 0; j < shape2Points.length; j += 2) {
            dot = shape2Points[j] * perpendicularStack[i] + shape2Points[j + 1] * perpendicularStack[i + 1];

            if(bMax === null || dot > bMax){
                bMax = dot;
            }

            if(bMin === null || dot < bMin){
                bMin = dot;
            }
        }

       

        if((aMin <= bMax && aMin >= bMin) || (bMin <= aMax && bMin >= aMin)){
            continue;
        }
        else{
            return false;
        }

    }
    return true;


}



function generateEdges(shapePoints) {
    var edges = []

    for (var i = 2; i < shapePoints.length; i++) {
        edges.push(shapePoints[i] - shapePoints[i - 2]);
    }

    edges.push(shapePoints[0] - shapePoints[shapePoints.length - 2]);
    edges.push(shapePoints[1] - shapePoints[shapePoints.length - 1])

    return edges;

}