import { isColliding } from './collisionDetection';

// shape
// distance
// visited
// previousShape

export function dijkstra_buildingToBuilding(shapes, start, finish) {

    var shapesToUse = [];

    for(var i = 0; i < shapes.length; i++){
        if(shapes[i].name === "path"){
            shapesToUse.push(shapes[i])
        }
    }

    shapesToUse.push(start);
    shapesToUse.push(finish);

    var visitedNodesInOrder = [];
    var unvisitedNodes = getAllNodes(shapesToUse, start);
    
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

export function dijkstra_roomToEntrance(mapData, start) {
    var visitedNodesInOrder = [];
    var unvisitedNodes = getBuildingNodes(mapData, start);

    var floorWithEntrance = -1;
    var floorWithNode = -1;
    var currentFloor = -1;
    
    for (var i = 0; i < unvisitedNodes.length; i++) {
        for (var j = 0; j < unvisitedNodes[i].length; j++) {
            if (unvisitedNodes[i][j][0].name === "entrance") {
                floorWithEntrance = i;
            }
            else if (start.index === unvisitedNodes[i][j][0].index) {
                floorWithNode = i
                unvisitedNodes[i][j][1] = 0;
            }
        }
    }

    currentFloor = floorWithNode;

    var lift = null;

    while (unvisitedNodes[currentFloor].length) {
        sortNodesByDistance(unvisitedNodes[currentFloor]);
        var closestNode = unvisitedNodes[currentFloor].shift();
        closestNode[2] = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode[0].name === "lifts" && closestNode[0].floors[floorWithEntrance]) {
            lift = closestNode[0];
            break;
        }

        updateUnvisitedNeighbours(unvisitedNodes[currentFloor], closestNode);
    }

    currentFloor = floorWithEntrance;

    updateUnvisitedNeighbours(unvisitedNodes[currentFloor], visitedNodesInOrder[visitedNodesInOrder.length - 1])

    while (unvisitedNodes[currentFloor].length) {
        sortNodesByDistance(unvisitedNodes[currentFloor]);
        var closestNode = unvisitedNodes[currentFloor].shift();
        closestNode[2] = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode[0].name === "entrance") {
            break;
        }

        updateUnvisitedNeighbours(unvisitedNodes[currentFloor], closestNode);
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

function getBuildingNodes(mapData, start) {
    var allNodes = [];
    var building = getBuildingOfNode(mapData, start);

    for (var i = 0; i < building.internal.length; i++) {
        allNodes.push(floorToNodes(building.internal[i], start))
        
        if (building.entrance !== undefined && building.entrance.floorNumber === i) {
            allNodes[i].push([building.entrance, Infinity, false, null]);
            
        }

        for (var j = 0; j < building.lifts.length; j++) {
            if (building.lifts[j].floors[i]) {
                allNodes[i].push([building.lifts[j], Infinity, false, null]);
            }
        }
        for (var j = 0; j < building.stairs.length; j++) {
            if (building.stairs[j].floors[i]) {
                allNodes[i].push([building.stairs[j], Infinity, false, null]);
            }
        }
        
    }

    return allNodes;
}

function floorToNodes(floor, start) {
    var nodes = [];
    for (var i = 0; i < floor.length; i++) {
        if(floor[i].index === start.index || floor[i].name !== "room"){
            nodes.push([floor[i], Infinity, false, null]);
        }
        
    }
    return nodes;
}

function getBuildingOfNode(mapData, node) {
    for (var i = 0; i < mapData.length; i++) {
        if (mapData[i].name === "building") {
            for (var j = 0; j < mapData[i].internal.length; j++) {
                for (var k = 0; k < mapData[i].internal[j].length; k++) {
                    if (mapData[i].internal[j][k].index === node.index) {
                        return mapData[i];
                    }
                }
            }
        }

    }
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


        if (start[0].index !== shapes[i][0].index && isColliding(start[0], shapes[i][0])) {
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
    return shape1.index === shape2.index;
}