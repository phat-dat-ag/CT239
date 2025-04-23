// Hàm xử lý sự kiện click 1 ô
export type HandleClickCell = (e: MouseEvent) => void;

// Kích thước của ô, hàng, ma trận
export interface Size {
    height: number;
    width: number;
    fontSize?: number;
}

// Thông tin hiển thị của 1 ô
export interface Infor {
    vertex: number;
    weight: number;
    mode: number;
}

// Tọa độ của điểm (trong ma trận, bắt đầu từ 0)
export interface Point {
    i: number;
    j: number;
}

// Các thuộc tính của thẻ Option- Select trong DOM
export interface Option {
    value: number | string,
    title: string;
}

// u và cha của u: Stack và Queue
export interface Pair {
    u: number;
    p: number;
}

// Cây có hướng
export interface DirectedTree {
    u: number;
    p: number;
    w: number | string;
}