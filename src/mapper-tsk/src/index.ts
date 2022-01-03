import { IBuilderFunction } from "./IMappingProfile";
import { IMap } from "./IMap";

class Mapper implements IMap {
  mapObject<S, D>(
    source: S,
    destination: D,
    profile?: Record<string, string | IBuilderFunction>,
  ): D {
    if (!source) {
      return destination;
    }

    try {
      const keysToMap: string[] = !profile
        ? Object.keys(destination)
        : Object.keys(profile);
      if (!profile) {
        keysToMap.forEach((destinationKey) => {
          if (typeof destination[destinationKey] === "boolean") {
            destination[destinationKey] = source[destinationKey];
          } else {
            destination[destinationKey] = source[destinationKey] || null;
          }
        });
      } else {
        keysToMap.forEach((keyToMap) => {
          const mappingProfile = profile[keyToMap];

          if (typeof mappingProfile === "string") {
            this.createDeepChainingDestinationObject<D>(
              profile[keyToMap] as string,
              destination,
              this.getChainingDeepSourceObjectValue(keyToMap, source),
              null,
            );
          } else {
            this.createDeepChainingDestinationObject<D>(
              (mappingProfile as IBuilderFunction).destinationKey,
              destination,
              null,
              () =>
                (mappingProfile as IBuilderFunction).mappingFunction(
                  this.getChainingDeepSourceObjectValue(keyToMap, source),
                ),
            );
          }
        });
      }
    } catch (error) {
      console.log("mapper-tsk error: ", error);
    }

    return destination;
  }

  mapArray<S, D>(
    source: S[],
    activator: () => D,
    profile?: Record<string, string | IBuilderFunction>,
  ): D[] {
    const destination: D[] = [];
    if (source?.length === 0) {
      return destination;
    }
    source.forEach((sElement) => {
      const dElement: D = activator();
      destination.push(this.mapObject<S, D>(sElement, dElement, profile));
    });

    return destination;
  }

  activator<D>(type: new () => D): D {
    return new type();
  }

  private getChainingDeepSourceObjectValue(
    sourceChainingKeys: string,
    chainingSource: unknown,
  ): unknown {
    const keys = sourceChainingKeys.split(".");
    if (sourceChainingKeys?.length === 0) {
      return null;
    }
    let value = null;
    keys.forEach((key) => {
      if (!value) {
        value = chainingSource[key];
        return;
      }
      value = value[key];
    });

    return value;
  }

  private createDeepChainingDestinationObject<D>(
    destinationChainingKeys: string,
    destination: D,
    value: unknown,
    functionValue: CallableFunction,
  ): void {
    function deepNavigation(
      limit: number,
      index: number,
      destinationKeys: string[],
      destination: D,
    ): void {
      const key = destinationKeys[index];
      if (!destination[key]) {
        if (index < limit) {
          destination[key] = {};
          deepNavigation(limit, index + 1, destinationKeys, destination[key]);
        } else {
          if (!functionValue) {
            if (value && typeof value === "object") {
              destination[key] = { ...value } || null;
            } else if (typeof value === "boolean") {
              destination[key] = value;
            } else {
              destination[key] = value || null;
            }
          } else {
            destination[key] = functionValue();
          }
        }
      } else {
        if (index < limit) {
          deepNavigation(limit, index + 1, destinationKeys, destination[key]);
        }
      }
    }

    const destinationKeys = destinationChainingKeys.split(".");
    if (destinationKeys?.length === 0) {
      return;
    }

    const limit = destinationKeys.length - 1;
    const index = 0;
    deepNavigation(limit, index, destinationKeys, destination);
  }
}

const mapper = new Mapper();

export { IMap };
export default mapper;
