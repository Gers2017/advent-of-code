import { get_input, InputMode } from "../utils/helpers.ts";

class Vector {
    x: number;
    y: number;

    static new(x: number, y: number) {
        return new Vector(x, y);
    }

    public constructor(x: number, y: number) {
        this.x = x; // left -1, right +1
        this.y = y; // down -1, up +1
    }

    add(b: Vector) {
        return new Vector(this.x + b.x, this.y + b.y);
    }

    get string() {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }

    static Zero() {
        return Vector.new(0, 0);
    }
}

class Probe {
    position: Vector;
    velocity: Vector;

    static new(velocity: Vector) {
        return new Probe(velocity);
    }

    public constructor(velocity: Vector) {
        this.position = Vector.new(0, 0);
        this.velocity = velocity;
    }

    restart(velocity: Vector) {
        this.position = Vector.new(0, 0);
        this.velocity = velocity;
    }

    apply_velocity() {
        this.position = this.position.add(this.velocity);
    }

    apply_drag() {
        const velocityX = this.velocity.x;
        if (velocityX != 0) {
            const drag = Math.sign(velocityX) * -1;
            this.velocity.x += drag;
        }
    }

    get y_position() {
        return this.position.y;
    }

    apply_gravity() {
        this.velocity.y -= 1;
    }

    simulate() {
        this.apply_velocity();
        this.apply_drag();
        this.apply_gravity();
    }
}

interface IError {
    message: string;
}

type Result<T> =
    | { payload: T; error?: undefined }
    | { payload?: undefined; error: IError };

class Area {
    start: Vector;
    end: Vector;

    static new(line: string): Result<Area> {
        const regex = /^target\s+area:\s+x=\d+..\d+,\s+y=-?\d+..-?\d+/gm;
        if (!regex.test(line)) {
            return {
                error: { message: `Invalid line: ${line}` },
            };
        }

        const ranges = line
            .replace("target area: ", "")
            .trim()
            .split(", ")
            .map((r) => r.slice(2).split("..").map(Number));

        const xrange = ranges[0];
        const yrange = ranges[1];

        const [startx, endx] = xrange;
        const [starty, endy] = yrange;

        return {
            payload: new Area(
                Vector.new(startx, starty),
                Vector.new(endx, endy)
            ),
        };
    }

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    get min_x() {
        return this.start.x;
    }
    get min_y() {
        return this.start.y;
    }

    get max_x() {
        return this.end.x;
    }
    get max_y() {
        return this.end.y;
    }

    contains(point: Vector) {
        // minx <= x <= maxx
        // miny <= y <= maxy
        return (
            this.start.x <= point.x &&
            point.x <= this.end.x &&
            this.start.y <= point.y &&
            point.y <= this.end.y
        );
    }
}

class ProbeLauncher {
    private probe: Probe;
    private area: Area;
    private heights: number[];
    velocities: Set<Vector>;

    constructor(area: Area, velocity?: Vector) {
        this.probe = new Probe(velocity || Vector.new(0, 0));
        this.area = area;
        this.heights = [];
        this.velocities = new Set();
    }

    get_highest_y() {
        const sorted = this.heights.sort((a, b) => b - a);
        return sorted.length > 0 ? sorted[0] : 0;
    }

    get_velocities_count() {
        return this.velocities.size;
    }

    restart(velocity: Vector) {
        this.probe.restart(velocity);
    }

    is_missing_shot(position: Vector) {
        return position.x > this.area.max_x || position.y < this.area.min_y;
    }

    launch() {
        const init = this.probe.velocity;
        const probe_y_positions = [this.probe.y_position];
        // console.log("initial velocity", initial_velocity);

        while (!this.area.contains(this.probe.position)) {
            if (this.is_missing_shot(this.probe.position)) {
                return;
            }

            this.probe.simulate();
            probe_y_positions.push(this.probe.y_position);
            // console.log(this.probe.position.string);
        }

        this.heights.push(...probe_y_positions);
        this.velocities.add(init);
        // console.log("Final position:", this.probe.position.string, "\n");
    }
}

function main() {
    const input = get_input(InputMode.Real).join("");
    console.log("Using:", input);

    const { payload, error } = Area.new(input);
    console.log(payload);

    if (error) {
        console.error(error.message);
        return;
    }

    const area = payload;
    const velocities = [];

    for (let y = area.max_y - 50; y < area.max_x; y++) {
        for (let x = 0; x < area.max_x + 50; x++) {
            velocities.push(Vector.new(x, y));
        }
    }

    const launcher = new ProbeLauncher(area);

    velocities.forEach((v) => {
        launcher.restart(v);
        launcher.launch();
    });

    console.log("Highest y position:", launcher.get_highest_y());
    console.log("Valid velocities:", launcher.get_velocities_count());
}

main();
