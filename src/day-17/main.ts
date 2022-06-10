import { readFileSync } from "fs";

class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x; // left -1, right +1
        this.y = y; // down -1, up +1
    }

    add(b: Vector) {
        let a = this;
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static New(x: number, y: number) {
        return new Vector(x, y);
    }

    get string() {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }

    static Zero() {
        return Vector.New(0, 0);
    }
}

class Probe {
    position: Vector;
    velocity: Vector;

    public constructor(velocity: Vector) {
        this.position = Vector.New(0, 0);
        this.velocity = velocity;
    }

    restart(velocity: Vector) {
        this.position = Vector.New(0, 0);
        this.velocity = velocity;
    }

    apply_velocity() {
        this.position = this.position.add(this.velocity);
    }

    apply_drag() {
        let velocityX = this.velocity.x;
        if (velocityX != 0) {
            let drag = Math.sign(velocityX) * -1;
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

class Area {
    start: Vector
    end: Vector

    static From(line: string): [Area, boolean] {
        let regex = /^target\s+area:\s+x=\d+..\d+,\s+y=-?\d+..-?\d+/gm
        if (!regex.test(line)) {
            console.error(`Invalid line: ${line}`);
            return [
                new Area(Vector.Zero(), Vector.Zero()),
                false
            ];
        }

        const ranges = line
            .slice(12)
            .trim()
            .split(", ")
            .map(r => r.slice(2).split("..").map(Number))

        const xrange = ranges[0];
        const yrange = ranges[1];

        const [startx, endx] = xrange;
        const [starty, endy] = yrange;

        return [
            new Area(Vector.New(startx, starty), Vector.New(endx, endy)),
            true
        ];
    }

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    get min_x() { return this.start.x }
    get min_y() { return this.start.y }

    get max_x() { return this.end.x }
    get max_y() { return this.end.y }

    contains(point: Vector) {
        // minx <= x <= maxx
        // miny <= y <= maxy
        return this.start.x <= point.x && point.x <= this.end.x &&
            this.start.y <= point.y && point.y <= this.end.y
    }
}

class ProbeLauncher {
    private probe: Probe;
    private area: Area;
    private heights: number[];
    velocities: Set<Vector>;

    constructor(area: Area, velocity?: Vector) {
        this.probe = new Probe(velocity || Vector.New(0, 0));
        this.area = area;
        this.heights = []
        this.velocities = new Set();
    }

    get max_x_position() {
        return this.area.max_x;
    }

    get min_y_position() {
        return this.area.min_y;
    }

    private reset_probe(velocity: Vector) {
        this.probe.restart(velocity);
    }

    get_highest_y() {
        let sorted = this.heights.sort((a, b) => b - a);
        return sorted.length > 0 ? sorted[0] : 0;
    }

    get_velocities_count() {
        return this.velocities.size;
    }

    recalibrate(velocity: Vector) {
        this.reset_probe(velocity);
    }

    is_overshoot(position: Vector) {
        return position.x > this.max_x_position || position.y < this.min_y_position;
    }

    launch() {
        let initial_velocity = this.probe.velocity;
        // console.log("initial velocity", initial_velocity);

        let probe_y_positions = [this.probe.y_position];
        let in_area = this.area.contains(this.probe.position);

        while (!in_area && !this.is_overshoot(this.probe.position)) {

            this.probe.simulate();
            probe_y_positions.push(this.probe.y_position);
            in_area = this.area.contains(this.probe.position);
            // console.log(this.probe.position.string);
        }

        if (in_area) {
            this.heights.push(...probe_y_positions);
            this.velocities.add(initial_velocity);
            // console.log("Final position:", this.probe.position.string, "\n");
        }
    }
}

function get_input(type: number) {
    if (type === 0) {
        return "target area: x=20..30, y=-10..-5";
    }
    return readFileSync("input.txt", "utf-8").replace("\n", "");
}

const [area, ok] = Area.From(get_input(0));
if (ok) {
    resolve(area);
}

function resolve(area: Area) {
    const velocities = []

    for (let y = area.max_y - 50; y < area.max_x + 50; y++) {
        for (let x = 0; x < area.max_x + 50; x++) {
            velocities.push(Vector.New(x, y));
        };
    }

    const launcher = new ProbeLauncher(area);

    velocities.forEach(v => {
        launcher.recalibrate(v);
        launcher.launch();
    });

    console.log("Highest y position:", launcher.get_highest_y());
    console.log("Valid velocities:", launcher.get_velocities_count());
}


