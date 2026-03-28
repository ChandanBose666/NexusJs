/**
 * webRenderer — satisfies the NexusRenderer<ReactElement> contract.
 *
 * Gives render targets a single object they can pass to a universal
 * component factory, keeping the framework host-agnostic.
 */

import type { ReactElement } from "react";
import type { NexusRenderer } from "@nexus/primitives";
import { Stack }  from "./Stack.js";
import { Text }   from "./Text.js";
import { Action } from "./Action.js";
import { Input }  from "./Input.js";

export const webRenderer: NexusRenderer<ReactElement> = {
  // The primitives' children type (NexusNode) is structurally opaque;
  // at runtime the web target always passes React elements as children.
  // The cast is safe — no runtime transformation happens.
  Stack:  Stack  as NexusRenderer<ReactElement>["Stack"],
  Text:   Text   as NexusRenderer<ReactElement>["Text"],
  Action: Action as NexusRenderer<ReactElement>["Action"],
  Input:  Input  as NexusRenderer<ReactElement>["Input"],
};
