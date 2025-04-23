import { Point } from "../type/common.types";
import { GraphType } from "../type/graph.types";
import { algorithmSelection, algorithmNeeds } from "../constant/common.constant.js";

// Sinh ngẫu nhiên từ 0 - number
export function randomFromZeroTo(number: number): number {
    if (number <= 0)
        return 0;
    return Math.round(Math.random() * number);
};

// Tọa độ => Đỉnh
export function getVertexFromPoint(point: Point, n: number): number {
    return point.i * n + (point.j + 1);
}

// Đỉnh => Tọa độ
export function getPointFromVertex(u: number, n: number): Point {
    return {
        i: Math.floor((u - 1) / n),
        j: (u - 1) % n
    }
}

// Kiểm tra ma trận hợp lệ
export function checkInput(matrix: Array<Array<number>>): boolean {
    const columnAmount: number = matrix[0].length;
    for (let i = 0; i < matrix.length; i++)
        if (matrix[i].length !== columnAmount)
            return false;
    return true;
}

export function checkParameters(G: GraphType, s: number, t: number, selectedAlgorithm: number): boolean {
    const nodeCount: number = G.getNodeCount();
    // Tập chỉ gồm các đỉnh
    const vertices: Array<number> = G.getVertices();

    // Chỉ kiểm tra thuật toán cần đỉnh bắt đầu
    if (algorithmNeeds.includes(selectedAlgorithm)) {
        if (isNaN(s) || s <= 0 || s > nodeCount) {
            confirm("Đỉnh bắt đầu không hợp lệ!");
            return false;
        }
        if (!vertices.includes(s)) {
            confirm(`Đỉnh bắt đầu: ${s}: là chướng ngại vật => không hợp lệ`);
            return false;
        }
    }

    // Chỉ kiểm tra thuật toán cần đỉnh kết thúc
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA) {
        if ((isNaN(t) || t <= 0 || t > nodeCount)) {
            confirm("Đỉnh kết thúc không hợp lệ!");
            return false;
        }
        if (!vertices.includes(t)) {
            confirm(`Đỉnh kết thúc: ${t}: là chướng ngại vật => không hợp lệ`);
            return false;
        }
    }
    return true;
}