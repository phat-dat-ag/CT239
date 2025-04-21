import { Pair } from "./type/common.types.js";
const MAX_LENGTH = 1000;

export default class Stack {
    private Elements: Array<Pair>;
    private top_index: number;
    constructor() {
        this.Elements = new Array(MAX_LENGTH);
        this.top_index = MAX_LENGTH;
    }
    make_null_stack() {
        this.top_index = MAX_LENGTH;
    }
    empty_stack() {
        return this.top_index === MAX_LENGTH;
    }
    full_stack() {
        return this.top_index === 0;
    }
    top(): Pair {
        if (this.empty_stack())
            return { u: -100, p: -100 };
        else return this.Elements[this.top_index];
    }
    push(x: Pair) {
        if (this.full_stack())
            console.log("Ngăn xếp đầy! Không thể thêm!");
        else {
            this.top_index--;
            this.Elements[this.top_index] = x;
        }
    }
    pop() {
        if (this.empty_stack())
            console.log("Ngăn xếp rỗng! Không thể xóa!");
        else
            this.top_index++;
    }
}