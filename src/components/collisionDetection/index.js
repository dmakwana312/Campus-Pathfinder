export function isColliding(shape1, shape2) {

    // Points of both shapes
    var shape1Points = shape1.points;
    var shape2Points = shape2.points;

    // var shape1Points = shape1;
    // var shape2Points = shape2;

    // Generate edges using points
    var shape1Edges = generateEdges(shape1Points);
    var shape2Edges = generateEdges(shape2Points);

    var perpendicularLine = [];
    var perpendicularStack = [];
    var dot = 0;
    var aMin = 0;
    var aMax = 0;
    var bMin = 0;
    var bMax = 0;

    // Find perpendicular lines of edges for shape 1
    for (var i = 0; i < shape1Edges.length; i += 2) {
        perpendicularLine = [-shape1Edges[i + 1], shape1Edges[i]];
        perpendicularStack.push(-shape1Edges[i + 1]);
        perpendicularStack.push(shape1Edges[i]);
    }

    // Find perpendicular lines of edges for shape 2
    for (var i = 0; i < shape2Edges.length; i += 2) {
        perpendicularLine = [-shape2Edges[i + 1], shape2Edges[i]];
        perpendicularStack.push(-shape2Edges[i + 1]);
        perpendicularStack.push(shape2Edges[i]);
    }

    // For each line in the perpendicular stack
    for (var i = 0; i < perpendicularStack.length; i += 2) {
        aMin = null;
        aMax = null;
        bMin = null;
        bMax = null;

        // Generate dot product of each of the points for shape 1
        // and the perpendicular line
        for (var j = 0; j < shape1Points.length; j += 2) {
            dot = shape1Points[j] * perpendicularStack[i] + shape1Points[j + 1] * perpendicularStack[i + 1];

            if(aMax === null || dot > aMax){
                aMax = dot;
            }

            if(aMin === null || dot < aMin){
                aMin = dot;
            }
        }

        // Generate dot product of each of the points for shape 2
        // and the perpendicular line
        for (var j = 0; j < shape2Points.length; j += 2) {
            dot = shape2Points[j] * perpendicularStack[i] + shape2Points[j + 1] * perpendicularStack[i + 1];

            if(bMax === null || dot > bMax){
                bMax = dot;
            }

            if(bMin === null || dot < bMin){
                bMin = dot;
            }
        }

       
        // Determine if there is an overlap. If there is no overlap
        // there is no collision, and collision detection can return false
        if((aMin <= bMax && aMin >= bMin) || (bMin <= aMax && bMin >= aMin)){
            continue;
        }
        else{
            return false;
        }

    }
    return true;


}


// Generate edges
function generateEdges(shapePoints) {
    var edges = []

    for (var i = 2; i < shapePoints.length; i++) {
        edges.push(shapePoints[i] - shapePoints[i - 2]);
    }

    edges.push(shapePoints[0] - shapePoints[shapePoints.length - 2]);
    edges.push(shapePoints[1] - shapePoints[shapePoints.length - 1])

    return edges;

}