/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="TreeDragAndDrop.ts" />
module TreeDragAndDrop {
  export function Main(tree: HTMLElement) {
      new TreeDragZone(<DragAndDrop.HTMLElementWithDragZone> tree);
      new TreeDropTarget(<DragAndDrop.HTMLElementWithDropTarget> tree);
  }
}

