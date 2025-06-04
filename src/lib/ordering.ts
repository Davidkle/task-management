// Shared drag-and-drop ordering logic for tasks and categories

const DEFAULT_SPACING = 1_000;

/**
 * Reorders an array based on drag-and-drop, updates the moved item's position, and calls the update callback.
 * @param items The array of items to reorder (must have id and position fields)
 * @param activeId The id of the dragged item
 * @param overId The id of the item it was dropped over
 * @param updateFn Callback to persist the new position (id, newPosition)
 * @returns The updated array
 */
export function reorderWithPosition<T extends { id: string; position: number }>(
  items: T[],
  activeId: string,
  overId: string,
  updateFn: (id: string, newPosition: number) => void
): T[] {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);
  if (oldIndex === -1 || newIndex === -1) return items;

  const newData = [...items];
  const [moved] = newData.splice(oldIndex, 1);
  newData.splice(newIndex, 0, moved);

  // Find neighbors
  const after = newData[newIndex + 1];
  const before = newData[newIndex - 1];

  let newPosition = moved.position;
  if (before && after) {
    newPosition = (before.position + after.position) / 2;
  } else if (!before && after) {
    const next = after;
    const nextNext = newData[newIndex + 2];
    const diff = nextNext ? Math.abs(next.position - nextNext.position) : DEFAULT_SPACING;
    newPosition = next.position + diff;
  } else if (before && !after) {
    const prev = before;
    const prevPrev = newData[newIndex - 2];
    const diff = prevPrev ? Math.abs(prev.position - prevPrev.position) : DEFAULT_SPACING;
    newPosition = prev.position - diff;
  }
  moved.position = newPosition;
  updateFn(moved.id, newPosition);
  return newData;
}
