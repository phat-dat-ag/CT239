import { Point } from "../type/common.types.js";

// Vô cùng lớn
export const OO = 999999999;

// Lưu trữ lựa chọn hiển thị: trọng số hay đỉnh của 1 ô
export const inforSelection = {
    WEIGHT: 1,
    VERTEX: 2
}

// Đánh dấu không phải là cug
// -99 <= Trọng số 1 cung <= 99
export const NO_EDGE: number = 500;
// 4 đỉnh lân cận của 1 đỉnh
export const directions: Array<Point> = [
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
    { i: 1, j: 0 }
];

// Số phần tử tối đa của Stack, Queue
export const MAX_LENGTH = 1000;

// main.ts
// Xử lý hỗ trợ chọn nhanh đỉnh, hạn chế nhập
export const quickSelection = {
    START: 1,
    END: 2,
    NO_CHOICE: -1
}
// 3 chế độ xem
export const viewModeSelection = {
    WEIGHT_GRAPH: 1,
    VERTEX_GRAPH: 2,
    DIRECTED_GRAPH: 3
}
// 9 thuật toán
export const algorithmSelection = {
    DIJKSTRA: 1,
    SPANNING: 2,
    TSP: 3,
    DFS: 4,
    BFS: 5,
    RECURSION: 6,
    DFS_ALL: 7,
    BFS_ALL: 8,
    RECURSION_ALL: 9
}

export const algorithmNeeds: Array<number> = [
    algorithmSelection.DIJKSTRA,
    algorithmSelection.SPANNING,
    algorithmSelection.TSP,
    algorithmSelection.DFS,
    algorithmSelection.BFS,
    algorithmSelection.RECURSION
];