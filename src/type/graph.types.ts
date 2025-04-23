import Graph_EdgeList from "../Graph_EdgeList.js";
import { Point } from "./common.types.js";

// Đồ thị: Đỉnh- Đỉnh
export interface GraphType {
    getNeighborsOf(u: number): Array<number>;
    getNodeCount(): number;
    getVertices(): Array<number>;
    adjacent(u: number, v: number): boolean;
    convertEdgeList(): Graph_EdgeList;
    getRowCount(): number;
    getColumnCount(): number;
    getWeightOfEdge(u: number, v: number): number;
    getWeightAtCell(point: Point): number;
    getWeightMatrix(): Array<Array<number>>;
    buildGraph(matrix: Array<Array<number>>): void;
    setWeightMatrixAt(point: Point, newWeight: number): void;
    updateEdgesFromNode(u: number): void;
    updateEdgesToNode(u: number): void;
    removeEdgesOfNode(u: number): void;
}