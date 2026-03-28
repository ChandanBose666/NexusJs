import type { ReactElement } from "react";
import type { NexusRenderer } from "@nexus/primitives";
import { Stack }  from "./Stack.js";
import { Text }   from "./Text.js";
import { Action } from "./Action.js";
import { Input }  from "./Input.js";

export const nativeRenderer: NexusRenderer<ReactElement> = {
  Stack:  Stack  as NexusRenderer<ReactElement>["Stack"],
  Text:   Text   as NexusRenderer<ReactElement>["Text"],
  Action: Action as NexusRenderer<ReactElement>["Action"],
  Input:  Input  as NexusRenderer<ReactElement>["Input"],
};
