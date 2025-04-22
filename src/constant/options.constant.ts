import { Option } from "../type/common.types.js"

// Hình thức tạo đồ thị
export const methodOptions: Array<Option> = [
    { methodID: "0", title: "Ngẫu nhiên" },
    { methodID: "1", title: "Đọc file" },
];

// Tốc độ giải thuật
export const speedOptions: Array<Option> = [
    { speed: 3000, title: "Rất chậm" },
    { speed: 2000, title: "Chậm" },
    { speed: 1000, title: "Bình thường" },
    { speed: 100, title: "Nhanh" },
    { speed: 10, title: "Rất nhanh" }
];

// Chế độ xem
export const viewModeOptions: Array<Option> = [
    { viewMode: "weight", title: "Ma trận với trọng số" },
    { viewMode: "vertex", title: "Ma trận số thứ tự đỉnh" },
    { viewMode: "graph", title: "Đồ thị minh họa" }
];

// Thuật toán
export const algorithmOptions: Array<Option> = [
    { algorithmID: 1, title: "Moore Dijkstra" },
    { algorithmID: 2, title: "Cây phủ tối thiểu" },
    { algorithmID: 3, title: "Bài toán TSP" },
    { algorithmID: 4, title: "Cây duyệt DFS" },
    { algorithmID: 5, title: "Cây duyệt BFS" },
    { algorithmID: 6, title: "Cây duyệt Đệ quy" },
    { algorithmID: 7, title: "DFS toàn đồ thị" },
    { algorithmID: 8, title: "BFS toàn đồ thị" },
    { algorithmID: 9, title: "Đệ quy toàn đồ thị" },
];