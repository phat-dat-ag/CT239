import { Point } from "../type/common.types";

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