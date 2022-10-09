type NodeOrNull<T> = Node<T> | null;
type Node<T> = { value: T; next: NodeOrNull<T> };

function new_node<T>(value: T, n?: Node<T>) {
    return { value, next: n ?? null };
}

// FIFO

export default class Queue<T> {
    head: NodeOrNull<T>;
    tail: NodeOrNull<T>;
    length: number;

    constructor() {
        this.length = 0;
        this.head = null;
        this.tail = null;
    }

    is_empty() {
        return !this.head && !this.tail;
    }

    enqueue(value: T) {
        this.length++;
        const node = new_node(value);

        if (!this.tail) {
            this.tail = this.head = node;
            return;
        }

        if (this.is_empty())
            throw new Error(
                `HEAD: ${this.head}, TAIL: ${this.tail}, LEN: ${this.length}`
            );

        // Add a new item at the end
        this.tail.next = node;
        // Point to a new tail
        this.tail = node;
    }

    dequeue(): T | null {
        if (this.is_empty()) {
            this.head = this.tail = null;
            return null;
        }

        this.length--;

        // Save head for later
        const head = this.head!;
        if (this.is_empty())
            throw new Error(
                `HEAD: ${this.head}, TAIL: ${this.tail}, LEN: ${this.length}`
            );

        // Make Head point to the next node
        this.head = this.head!.next;
        head.next = null;

        if (this.length === 0) {
            this.head = this.tail = null;
        }

        return head!.value;
    }

    check() {
        return this.head?.value ?? null;
    }
}
