const MAX_LENGTH = 1000;

interface Pair {
    u: number;
    p: number;
}

export class Queue {
    private Elements: Array<Pair>;
    private FRONT: number;
    private REAR: number;
    constructor() {
        this.Elements = new Array(MAX_LENGTH);
        this.FRONT = -1;
        this.REAR = -1;
    };
    make_null_queue() {
        this.FRONT = -1;
        this.REAR = -1;
    };
    empty_queue() {
        return this.FRONT === -1;
    }
    full_queue() {
        return (this.REAR - this.FRONT + 1) === MAX_LENGTH;
    }
    en_queue(x: Pair) {
        if (this.full_queue())
            console.log("Hàng đợi đã đầy! Không thể thêm!");
        else {
            if (this.empty_queue())
                this.FRONT = 0;
            // Chia lấy nguyên
            this.REAR = (this.REAR + 1) % MAX_LENGTH;
            this.Elements[this.REAR] = x;
        }
    }
    de_queue() {
        if (this.empty_queue())
            console.log("Hàng đợi rỗng! Không thể xóa!");
        else {
            if (this.FRONT === this.REAR)
                this.make_null_queue();
            else
                this.FRONT = (this.FRONT + 1) % MAX_LENGTH;
        }
    }
    front(): Pair {
        if (this.empty_queue()) {
            console.log("Hàng đợi rỗng! Không thể lấy dữ liệu!");
            return { u: -100, p: -100 };
        } else
            return this.Elements[this.FRONT];
    }
}

export class Stack {
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