import chroma, { Color } from "chroma-js"
import { nanoid } from "nanoid";
import { Swatch } from "./SwatchContext";
import { Dispatch } from "react";
import { partition } from "lodash";
import generate from "./math/generate"

// TODO: Create IdType instead of assuming id should always be string?

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

type SwatchRandomize = {
  type: "randomize",
  id: string,
}

type SwatchesRandomize = {
  type: "randomizeMany",
  ids: "unlocked" | string[],
}

type SwatchAction = SwatchCreate | SwatchUpdate | SwatchRandomize | SwatchesRandomize;
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
  }
  else if(action.type === "update") {
    const swatch = swatchMap.get(action.id);

    if(swatch !== undefined) {
      if(action.color !== undefined) swatch.color = action.color;
      if(action.isLocked !== undefined) swatch.isLocked = action.isLocked;
    }

    return;
  }
  else if(action.type === "randomize") {
    const allSwatches: Swatch[] = [...swatchMap.values()];
    const otherColors = allSwatches
      .filter(swatch => swatch.id !== action.id)
      .map(swatch => swatch.color);

    const newColor = generate(otherColors, 1)[0];
    const swatch = swatchMap.get(action.id);
    if(swatch !== undefined) swatch.color = newColor;
  }
  else if(action.type === "randomizeMany") {
    const allSwatches: Swatch[] = [...swatchMap.values()];

    let regenSwatches: Swatch[] = [];
    let otherSwatches: Swatch[] = [];

    if(action.ids === "unlocked") {
      [regenSwatches, otherSwatches] = partition(allSwatches, swatch => !swatch.isLocked);
    } else {
      [regenSwatches, otherSwatches] = partition(allSwatches,
        swatch => action.ids.includes(swatch.id)
      );
    }

    const otherColors = otherSwatches.map(swatch => swatch.color);
    const newColors = generate(otherColors, regenSwatches.length);
    newColors.forEach((newColor, index) => {
      if(index >= regenSwatches.length) return;
      regenSwatches[index].color = newColor;
    });
  }
}

export type { SwatchAction };
