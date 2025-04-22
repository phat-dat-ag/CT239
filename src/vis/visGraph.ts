// @ts-ignore
import { DataSet, Network, Node, Options } from "https://cdn.jsdelivr.net/npm/vis-network@9.1.2/standalone/esm/vis-network.min.js";
import { Container } from "../dom/domElements.js";
import { CustomNode } from "../type/vis.types.js";
import { DirectedTree } from "../type/common.types.js";

// Cấu hình đồ thị
const options: Options = {
    edges: {
        font: { size: 40, align: "top" },
        arrows: "to",
        color: "black"
    },
    nodes: {
        shape: "circle",
        font: { size: 50, color: "black" }
    }
};

// Hàm vẽ đồ thị
export function drawVisGraph(vertices: Array<number>, vertexMatrix: Array<Array<number>>) {
    // Tạo dữ liệu cho các node (đỉnh)
    let nodesList: DataSet<CustomNode> = [];
    for (let vertex of vertices) {
        nodesList.push({
            id: vertex,
            label: vertex.toString(),
            color: { background: "lightblue", border: "red" }
        })
    }
    const nodes = new DataSet<CustomNode>(nodesList);

    let edgeList: Array<DataSet> = [];
    for (let u of vertices)
        for (let v of vertices)
            if (vertexMatrix[u][v] > 0 && vertexMatrix[u][v] < 100)
                edgeList.push({
                    from: u,
                    to: v,
                    label: vertexMatrix[u][v].toString(),
                    arrows: "to"
                })
    const edges = new DataSet(edgeList);

    Container.replaceChildren();
    new Network(Container, { nodes, edges }, options);
}

// Chỉ áp dụng cho đơn đồ thị có hướng
export function drawDirectedTree(tree: Array<DirectedTree>) {
    let nodesList: DataSet<CustomNode> = [];
    for (let edge of tree) {
        nodesList.push({
            id: edge.u,
            label: edge.u.toString(),
            color: { background: "lightblue", border: "red" }
        })
    }
    const nodes = new DataSet<CustomNode>(nodesList);

    let edgeList: Array<DataSet> = [];
    for (let edge of tree)
        if (edge.p !== -1)
            edgeList.push({
                from: edge.p,
                to: edge.u,
                label: edge.w.toString(),
                arrows: "to"
            })
    const edges = new DataSet(edgeList);

    Container.replaceChildren();
    new Network(Container, { nodes, edges }, options);
}
