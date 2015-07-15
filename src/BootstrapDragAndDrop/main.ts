/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
/// <reference path="BootstrapDragZone.ts" />
/// <reference path="BootstrapDropTarget.ts" />
module BootstrapDragAndDrop {
  export function Main(form: HTMLElement) {
      new BootstrapDragZone (<DragAndDrop.HTMLElementWithDragZone> form);
      new BootstrapDropTarget (<DragAndDrop.HTMLElementWithDropTarget> form);
  }
}

