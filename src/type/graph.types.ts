import Graph_EdgeList from "../Graph_EdgeList.js";

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
}