/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragZone.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
/// <reference path="BootstrapDragAvatar.ts" />
module BootstrapDragAndDrop {
  export class BootstrapDragZone extends DragAndDrop.DragZone {
    protected _makeAvatar() {
      return new BootstrapDragAvatar(this, this._elem);
    }
  }
}
