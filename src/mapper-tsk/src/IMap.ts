export interface IMap {
  MapObject<S, D>(
    source: S,
    destination: D,
    profile?: { [sourceKey: string]: string },
  ): D;
  MapArray<S, D>(
    source: S[],
    activator: () => D,
    profile?: { [sourceKey: string]: string },
  ): D[];
  Activator<D>(type: new () => D): D;
}
