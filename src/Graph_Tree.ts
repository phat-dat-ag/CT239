const OO = 999999;

// Cấu trúc Cây (đồ thị xấp xỉ)
export default class Tree {
    n: number;
    parent: Array<number> = [];
    weight: Array<number> = [];
    link: Array<number> = [];

    // Cũng chính là hàm init_tree
    constructor(n: number) {
        this.n = n;
        for (let i = 1; i <= this.n; i++) {
            this.parent[i] = -1;
            this.weight[i] = OO;
            this.link[i] = -1;
        }
    }

    printTree() {
        for (let v = 1; v <= this.n; v++) {
            console.log(`(${this.parent[v]}, ${v}): ${this.weight[v]}, ${this.link[v]}`);
        }
        console.log();
    }
}