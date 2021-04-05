import { isColliding } from './collisionDetection';

// shape
// distance
// visited
// previousShape

export function dijkstra(shapes, start, finish) {

    var visitedNodesInOrder = [];
    var unvisitedNodes = getAllNodes(shapes, start);

    while (unvisitedNodes.length) {

        sortNodesByDistance(unvisitedNodes);
        var closestNode = unvisitedNodes.shift();
        closestNode[2] = true;
        visitedNodesInOrder.push(closestNode);

        if (areEqual(closestNode[0], finish)) {
            return visitedNodesInOrder;
        }

        updateUnvisitedNeighbours(unvisitedNodes, closestNode);

    }

    return visitedNodesInOrder;
}

export function getNodesInPathOrder(finish) {

    var nodeInPathOrder = [];
    var currentNode = finish;
    while (currentNode !== null) {
        nodeInPathOrder.unshift(currentNode);
        currentNode = currentNode[3];
    }

    for(var i = 0; i < nodeInPathOrder.length; i++){
        nodeInPathOrder[i] = nodeInPathOrder[i][0].index;
    }


    return nodeInPathOrder;
}

function updateUnvisitedNeighbours(shapes, node) {
    var unvisitedNeighbours = getClosestShapes(shapes, node);

    for (var neighbour of unvisitedNeighbours) {

        neighbour[1] = node[1] + 1;
        neighbour[3] = node;

    }

}

function getAllNodes(shapes, start) {
    var allNodes = [];
    for (var i = 0; i < shapes.length; i++) {

        allNodes.push([shapes[i], Infinity, false, null]);
    }

    allNodes[findIndex(allNodes, start)][1] = 0;
    return allNodes;
}


function sortNodesByDistance(nodes) {

    nodes.sort(distanceComparator);

}

function distanceComparator(nodeA, nodeB) {
    return (nodeA[1] < nodeB[1]) ? -1 : 1;
}


function getClosestShapes(shapes, start) {
    var closestShapes = [];
    for (var i = 0; i < shapes.length; i++) {

        if (!areEqual(start[0], shapes[i][0]) && isColliding(start[0], shapes[i][0])) {
            closestShapes.push(shapes[i]);

        }

    }
    return closestShapes;
}

function findIndex(shapesArray, shape) {
    for (var i = 0; i < shapesArray.length; i++) {
        var node = shapesArray[i][0];

        if (areEqual(node, shape)) {
            return i;
        }
    }

    return -1;
}

function areEqual(shape1, shape2) {
    return shape1.label === shape2.label && (shape1.points.length == shape2.points.length) && shape1.points.every(function (element, index) {
        return element === shape2.points[index];
    });
}