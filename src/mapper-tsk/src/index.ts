import { IBuilderFunction } from "./IMappingProfile";
import { IMap } from "./IMap";

class Mapper implements IMap {
  MapObject<S, D>(
    source: S,
    destination: D,
    profile?: {
      [sourceKey: string]: string | IBuilderFunction;
    },
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
            this.CreateDeepChainingDestinationObject<D>(
              profile[keyToMap] as string,
              destination,
              this.GetChainingDeepSourceObjectValue(keyToMap, source),
              null,
            );
          } else {
            this.CreateDeepChainingDestinationObject<D>(
              (mappingProfile as IBuilderFunction).destinationKey,
              destination,
              null,
              () =>
                (mappingProfile as IBuilderFunction).mappingFunction(
                  this.GetChainingDeepSourceObjectValue(keyToMap, source),
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

  MapArray<S, D>(
    source: S[],
    activator: () => D,
    profile?: {
      [sourceKey: string]: string | IBuilderFunction;
    },
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

  private GetChainingDeepSourceObjectValue(
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

  private CreateDeepChainingDestinationObject<D>(
    destinationChainingKeys: string,
    destination: D,
    value: unknown,
    functionValue: CallableFunction,
  ): void {
    function DeepNavigation(
      limit: number,
      index: number,
      destinationKeys: string[],
      destination: D,
    ): void {
      const key = destinationKeys[index];
      if (!destination[key]) {
        if (index < limit) {
          destination[key] = {};
          DeepNavigation(limit, index + 1, destinationKeys, destination[key]);
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
          DeepNavigation(limit, index + 1, destinationKeys, destination[key]);
        }
      }
    }

    const destinationKeys = destinationChainingKeys.split(".");
    if (destinationKeys?.length === 0) {
      return;
    }

    const limit = destinationKeys.length - 1;
    const index = 0;
    DeepNavigation(limit, index, destinationKeys, destination);
  }
}

const mapper = new Mapper();

export { IMap };
export default mapper;
