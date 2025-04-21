export interface EdgeList {
    u: number;
    v: number;
    w: number;
}

// Hỗ trợ cho đồ thị danh sách cung: Graph_EdgeList
// Lưu cây: dùng trong ChuLiu Edmonds
export interface Edge {
    u: number;
    v: number;
    w: number;
    link: number;
}