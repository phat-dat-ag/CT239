import { Option } from "../type/common.types.js"

// Hình thức tạo đồ thị
export const methodOptions: Array<Option> = [
    { value: "0", title: "Ngẫu nhiên" },
    { value: "1", title: "Đọc file" },
];

// Tốc độ giải thuật
export const speedOptions: Array<Option> = [
    { value: 3000, title: "Rất chậm" },
    { value: 2000, title: "Chậm" },
    { value: 1000, title: "Bình thường" },
    { value: 100, title: "Nhanh" },
    { value: 10, title: "Rất nhanh" }
];

// Chế độ xem
export const viewModeOptions: Array<Option> = [
    { value: 1, title: "Ma trận với trọng số" },
    { value: 2, title: "Ma trận số thứ tự đỉnh" },
    { value: 3, title: "Đồ thị minh họa" }
];

// Thuật toán
export const algorithmOptions: Array<Option> = [
    { value: 1, title: "Moore Dijkstra" },
    { value: 2, title: "Cây phủ tối thiểu" },
    { value: 3, title: "Bài toán TSP" },
    { value: 4, title: "Cây duyệt DFS" },
    { value: 5, title: "Cây duyệt BFS" },
    { value: 6, title: "Cây duyệt Đệ quy" },
    { value: 7, title: "DFS toàn đồ thị" },
    { value: 8, title: "BFS toàn đồ thị" },
    { value: 9, title: "Đệ quy toàn đồ thị" },
];