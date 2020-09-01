import { IMap } from "./IMap";

class Mapper implements IMap {
  MapObject<S, D>(
    source: S,
    destination: D,
    profile: { [sourceKey: string]: string } = null,
  ): D {
    if (!source) {
      return destination;
    }
    const keysToMap: string[] = profile ? Object.keys(profile) : Object.keys(destination);
    if (!profile) {
      keysToMap.forEach((destKey) => {
        if (typeof destination[destKey] === "boolean") {
          destination[destKey] = source[destKey];
        } else {
          destination[destKey] = source[destKey] || null;
        }
      });
    } else {
      keysToMap.forEach((originKey) => {
        if (typeof source[originKey] === "boolean") {
          destination[profile[originKey]] = source[originKey];
        } else {
          destination[profile[originKey]] = source[originKey] || null;
        }
      });
    }
    keysToMap.forEach((destKey) => {
      if (typeof destination[destKey] === "boolean") {
        destination[destKey] = source[destKey];
      } else {
        destination[destKey] = source[destKey] || null;
      }
    });
    return destination;
  }
  MapArray<S, D>(
    source: S[],
    activator: () => D,
    profile: { [sourceKey: string]: string } = null,
  ): D[] {
    const destination: D[] = [];
    if (source?.length === 0) {
      return destination;
    }
    source.forEach((sElement) => {
      const dElement: D = activator();
      destination.push(this.MapObject<S, D>(sElement, dElement, profile));
    });
    return destination;
  }
  Activator<D>(type: new () => D): D {
    return new type();
  }
}

const mapper = new Mapper();

export { IMap };
export default mapper;
