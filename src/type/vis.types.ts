// Định nghĩa kiểu dữ liệu cho Node
export interface CustomNode extends Node {
    color?: { background: string; border?: string };
}