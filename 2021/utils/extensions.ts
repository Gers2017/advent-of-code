export function range_ls(start: number, end: number, step = 1) {
    const length = Math.ceil(Math.abs(end - start) / step);
    const dir = Math.sign(end - start);
    return Array.from({ length }, (_, i) => start + i * step * dir);
}

export function* range(start: number, end: number, step = 1) {
    const length = Math.ceil(Math.abs(end - start) / step);
    const dir = Math.sign(end - start);

    for (let i = 0; i < length; i++) {
        yield start + i * step * dir;
    }
}

export function for_range<T>(generator: Generator<T>) {
    return Array.from(generator);
}

export function time(callback: () => void) {
    console.time();
    try {
        callback();
    } catch (e) {
        console.error(e);
    }

    console.timeEnd();
}

export function regex_extract(pattern: RegExp, text: string) {
    const result = pattern.exec(text);
    return result?.slice(1);
}

export function first_or_null<T, U>(
    list: T[],
    transformer: (it: T) => U | null
) {
    for (const it of list) {
        const v = transformer(it);
        if (v) return v;
    }
    return null;
}

export function combinator<T, U, W>(
    l1: T[],
    l2: U[],
    transformer: (x: T, y: U) => W
): W[] {
    return l1.map((x) => l2.map((y) => transformer(x, y))).flat();
}

export function filter_with<T>(
    l1: T[],
    l2: T[],
    predicate: (it: T, l2: T[]) => boolean
) {
    return l1.filter((it) => predicate(it, l2));
}

export function zip<T, U>(l1: T[], l2: T[], zipper: (x: T, y: T) => U): U[] {
    return l1.map((it, i) => zipper(it, l2[i]));
}
