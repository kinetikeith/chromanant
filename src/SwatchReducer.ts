import chroma, { Color } from "chroma-js"
import { nanoid } from "nanoid";
import { Swatch } from "./SwatchContext";
import { Dispatch } from "react";

type SwatchCreate = {
  type: "create",
  loc?: number,
  color?: Color,
}

type SwatchUpdate = {
  type: "update",
  id: string,
  color?: Color,
  isLocked?: boolean,
}

type SwatchAction = SwatchCreate | SwatchUpdate;
export type DispatchSwatchFunc = Dispatch<SwatchAction>;

export function swatchReducer(swatchMap: Map<string, Swatch>, action: SwatchAction) {
  if(action.type === "create") {
    const color = action.color || chroma("#ff0000");
    const id = nanoid();
    const swatch = {id, color, isLocked: false};

    const swatchItemArray = [...swatchMap.entries()];
    if(action.loc === undefined) {
      swatchItemArray.push([id, swatch]);
    } else {
      swatchItemArray.splice(action.loc, 0, [id, swatch]);
    }

    return new Map(swatchItemArray);
  } else if(action.type === "update") {
    const swatch = swatchMap.get(action.id);

    if(swatch !== undefined) {
      if(action.color !== undefined) swatch.color = action.color;
      if(action.isLocked !== undefined) swatch.isLocked = action.isLocked;
    }

    return;
  }
}

export type { SwatchAction };
