/**
 * @nexus/web — Web renderer for Nexus.js semantic UI primitives.
 *
 * Exports four React components (Stack, Text, Action, Input) that implement
 * the NexusRenderer<ReactElement> contract defined in @nexus/primitives.
 *
 * Usage:
 *   import { Stack, Text, Action, Input } from "@nexus/web";
 *   // or import the renderer object:
 *   import { webRenderer } from "@nexus/web";
 */

export { Stack }  from "./Stack.js";
export { Text }   from "./Text.js";
export { Action } from "./Action.js";
export { Input }  from "./Input.js";

// Re-export the renderer object that satisfies NexusRenderer<ReactElement>.
export { webRenderer } from "./renderer.js";
