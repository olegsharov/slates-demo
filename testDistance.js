import { boxToPoints, distance, getDistances } from "./boxesService.js";

const box1 = [ "1", "1", "602", "6", "602", "20", "572", "20" ];
const box2 = [ "1", "2", "636", "6", "636", "20", "512", "20" ];

const points1 = boxToPoints(box1)
const points2 = boxToPoints(box2);

const d = distance(points1[2], points2[2]);
console.log(d)
const distances = getDistances(points1, points2);
console.log(distances)
console.log(Math.min.apply(distances, distances))
