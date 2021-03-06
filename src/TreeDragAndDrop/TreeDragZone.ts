/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragZone.ts" />
/// <reference path="TreeDragAndDrop.ts" />
/// <reference path="TreeDragAvatar.ts" />
module TreeDragAndDrop {
  export class TreeDragZone extends DragAndDrop.DragZone {
    protected _makeAvatar() {
      return new TreeDragAvatar(this, this._elem);
    }
  }
}
