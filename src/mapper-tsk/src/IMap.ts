import { IBuilderFunction } from "./IMappingProfile";

export interface IMap {
  mapObject<S, D>(
    source: S,
    destination: D,
    profile?: {
      [sourceKey: string]: string | IBuilderFunction;
    },
  ): D;
  mapArray<S, D>(
    source: S[],
    activator: () => D,
    profile?: {
      [sourceKey: string]: string | IBuilderFunction;
    },
  ): D[];
  activator<D>(type: new () => D): D;
}
