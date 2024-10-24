import { dragAndDrop as initParent, isBrowser, ParentConfig, tearDown } from "../index";
import { createEffect, createSignal, on, type Accessor, type Signal, type Setter } from "solid-js";
import type { SolidDragAndDropConfig } from "./types";
import { handleSolidElements } from "./utils";

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<HTMLElement, Signal<Array<any>>> =
  new WeakMap();

/**
 * Returns the values of the parent element.
 *
 * @param parent - The parent element.
 *
 * @returns The values of the parent element.
 */
function getValues<T>(parent: HTMLElement): Array<T> {
  const values = parentValues.get(parent);

  if (!values) {
    console.warn("No values found for parent element");

    return [];
  }

  return (values[0] as Accessor<Array<T>>)();
}

/**
 * Sets the values of the parent element.
 *
 * @param parent - The parent element.
 *
 * @param newValues - The new values for the parent element.
 *
 * @returns void
 */
function setValues(newValues: Array<any>, parent: HTMLElement): void {
  const currentValues = parentValues.get(parent);

  if (currentValues)
    currentValues[1](newValues);
  
  // parentValues.set(parent, currentValues!);
}

function handleParent<E extends Accessor<HTMLElement | null> | HTMLElement, T>(
  config: Partial<SolidDragAndDropConfig<E, T[]>>,
  values: Signal<T[]>
) {
  return (el: HTMLElement) => {
    parentValues.set(el, values);

    initParent<T>({ parent: el, getValues, setValues, config });
  };
}

export function dragAndDrop<E extends HTMLElement, I>(
  data:
  | SolidDragAndDropConfig<Accessor<E| null> | HTMLElement, I[]>
  | Array<SolidDragAndDropConfig<Accessor<E| null> | HTMLElement, I[]>>
): void {
  if (!isBrowser) return;

  if (!Array.isArray(data)) data = [data];

  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;

    handleSolidElements(parent, handleParent(rest, state));
  });
}

/**
 * Hook for adding drag and drop/sortable support to a list of items.
 *
 * @param list - Initial list of data.
 * @param options - The drag and drop configuration.
 * @returns
 */
export function useDragAndDrop<E extends HTMLElement, T = unknown>(
  list: T[],
  options: Partial<ParentConfig<T>> = {}
): [Accessor<E | null>, Accessor<T[]>, Setter<T[]>, (config?: Partial<ParentConfig<T>>) => void] {
  const [parent] = createSignal<E | null>(null);

  const [values, setValues] = createSignal(list);

  function updateConfig(config: Partial<ParentConfig<T>> = {}) {
    dragAndDrop({ parent, state: [values, setValues], ...config });
  }

  createEffect(on(values, () => updateConfig(options)));
  createEffect(on(parent, (e) => e && tearDown(e)))

  return [parent, values, setValues, updateConfig];
}
