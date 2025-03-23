// @ts-ignore
import { DataSet, Network, Node, Options } from "https://cdn.jsdelivr.net/npm/vis-network@9.1.2/standalone/esm/vis-network.min.js";


// Định nghĩa kiểu dữ liệu cho Node
interface CustomNode extends Node {
    color?: { background: string; border?: string };
}

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
export function drawVisGraph(container: HTMLElement, vertices: Array<number>, vertexMatrix: Array<Array<number>>) {
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

    container.replaceChildren();
    new Network(container, { nodes, edges }, options);
}

export function drawDirectedTree(container: HTMLDivElement, parent: Array<number>) {
    let nodesList: DataSet<CustomNode> = [];
    for (let vertex in parent) {
        if (parent[vertex] === 0)
            continue;
        else
            nodesList.push({
                id: parseInt(vertex),
                label: vertex.toString(),
                color: { background: "lightblue", border: "red" }
            })
    }
    const nodes = new DataSet<CustomNode>(nodesList);

    let edgeList: Array<DataSet> = [];
    for (let u in parent)
        if (parent[u] === -1 || parent[u] === 0)
            continue;
        else
            edgeList.push({
                from: parent[u],
                to: parseInt(u),
                arrows: "to"
            })
    const edges = new DataSet(edgeList);

    container.replaceChildren();
    new Network(container, { nodes, edges }, options);
}
