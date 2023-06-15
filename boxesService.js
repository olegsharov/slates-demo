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