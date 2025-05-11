// Add your code here

namespace Math {
    // Define a 2D vector structure
    export type Vector2 = { x: number; y: number }

    // Predefined directional vectors
    export const Vector2 = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
        zero: { x: 0, y: 0 },
        one: { x: 1, y: 1 },

        // Utility functions
        add: (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y }),
        sub: (a: Vector2, b: Vector2): Vector2 => ({ x: a.x - b.x, y: a.y - b.y }),
        scale: (v: Vector2, s: number): Vector2 => ({ x: v.x * s, y: v.y * s }),
        dot: (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y,
        magnitude: (v: Vector2): number => Math.sqrt(v.x * v.x + v.y * v.y),
        normalize: (v: Vector2): Vector2 => {
            const mag = Vector2.magnitude(v)
            return mag === 0 ? Vector2.zero : { x: v.x / mag, y: v.y / mag }
        }
    }
}
