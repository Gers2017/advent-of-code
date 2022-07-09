export function range_ls(end: number, start = 0, step = 1) {
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
    const result = [];
    for (const item of generator) {
        result.push(item);
    }
    return result;
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
