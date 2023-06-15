export default function makeBoxesJson(csv) {
    const result = {};
    csv.split('\n').forEach((line,index) => {
        const frameNumber = line.substring(0, line.indexOf(','));
        if (!frameNumber) return;
        const boxesLine = line.substring(line.indexOf(',')+1);
        let allBoxes = boxesLine.split(',');
        let boxes = [];
        do {
            boxes.push(allBoxes.splice(-8));
        } while (allBoxes.length >= 8)

        const boxesAtFrame = {};
        result[frameNumber] = boxes.reverse();
    });
    return result;
}

export function boxToPoints(box) {
    return [
        [box[0], box[1]],
        [box[2], box[3]],
        [box[4], box[5]],
        [box[6], box[7]]
    ]
}

export function distance(pointFrom, pointTo) {
    return Math.sqrt(
        Math.pow(Math.abs(pointFrom[0] - pointTo[0]), 2) +
        Math.pow(Math.abs(pointFrom[1] - pointTo[1]), 2)
    );
}

export function getDistances(pointsFrom, pointsTo) {
    const distances = [];
    pointsFrom.forEach(pointFrom => {
        pointsTo.forEach(pointTo => {
            distances.push(distance(pointFrom, pointTo));
        });
    });
    return distances;
}

export function getClosestDistance(thisBox, nextBoxes) {
    const minDistances = nextBoxes.map((nextBox) => {
        const distances = getDistances(boxToPoints(thisBox), boxToPoints(nextBox))
        const minDistance = Math.min.apply(distances, distances);
        return minDistance;
    });  
    return Math.min.apply(minDistances, minDistances);
}

export function findMovingBoxes(thisBoxes, nextBoxes, thershold) {
    const result = [];
    // console.log(thisBoxes)
    for (let thisBox of thisBoxes) {
        if (getClosestDistance(thisBox, nextBoxes) > thershold) {
            result.push(thisBox);
        }
    }
    return result;
}

export function removeStaticBoxes(boxes, thershold) {
    const frames = Object.getOwnPropertyNames(boxes);
    const lastFrame = frames[frames.length - 1];
    const resultBoxes = {};
    for (let frame = 0; frame < lastFrame - 1; frame += 1) {
        resultBoxes[frame] = findMovingBoxes(boxes[frame], boxes[frame + 1], thershold = 1);
    }
    return resultBoxes;
}