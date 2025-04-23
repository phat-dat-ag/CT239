import { block_2 } from "../dom/domElements.js";
import { GraphType } from "../type/graph.types.js";
import { algorithmSelection } from "../constant/common.constant.js";
import Dijkstra from "../algorithm/Dijkstra.js";
import ChuLiu from "../algorithm/ChuLiuEdmonds.js";
import Tree_TSP from "../algorithm/TSP.js";
import { All_Tree_DFS, Tree_DFS } from "../algorithm/TreeDFS.js";
import { All_Tree_BFS, Tree_BFS } from "../algorithm/TreeBFS.js";
import { All_Tree_Recursion, Tree_Recursion } from "../algorithm/TreeRecursion.js";
import { turnOffSelectedCell } from "../utils/ui.utils.js";
import { MenuConfig } from "../dom/domElements.js";
import { algorithmNeeds } from "../constant/common.constant.js";

export async function runAlgorithm(G: GraphType, s: number | null, t: number | null, ms: number, selectedAlgorithm: number, selectedCell: HTMLSpanElement) {
    // Xóa phần trình bày trước đó của thuật toán Moore Dijkstra
    block_2.replaceChildren();
    const nodeCount: number = G.getNodeCount();
    s = parseInt(MenuConfig.startInput.value);
    for (let algo of algorithmNeeds)
        if (selectedAlgorithm === algo)
            if (isNaN(s) || s <= 0 || s > nodeCount) {
                confirm("Đỉnh bắt đầu không hợp lệ!");
                return;
            }
    t = parseInt(MenuConfig.endInput.value);
    if (selectedAlgorithm === algorithmSelection.DIJKSTRA && (isNaN(t) || t <= 0 || t > nodeCount)) {
        confirm("Đỉnh kết thúc không hợp lệ!");
        return;
    }

    switch (selectedAlgorithm) {
        case algorithmSelection.DIJKSTRA:
            turnOffSelectedCell(selectedCell);
            await Dijkstra(G, s, t, ms);
            break;
        case algorithmSelection.SPANNING:
            ChuLiu(G, s);
            break;
        case algorithmSelection.TSP:
            Tree_TSP(G, s);
            break;
        case algorithmSelection.DFS:
            Tree_DFS(G, s);
            break;
        case algorithmSelection.BFS:
            Tree_BFS(G, s);
            break;
        case algorithmSelection.RECURSION:
            Tree_Recursion(G, s);
            break;
        case algorithmSelection.DFS_ALL:
            All_Tree_DFS(G);
            break;
        case algorithmSelection.BFS_ALL:
            All_Tree_BFS(G);
            break;
        case algorithmSelection.RECURSION_ALL:
            All_Tree_Recursion(G);
            break;
        default:
            confirm("Chưa hỗ trợ các chức năng còn lại");
    }
}