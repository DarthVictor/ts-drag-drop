/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

class TreeDragZone extends DragZone{
  protected _makeAvatar() {
    return new TreeDragAvatar(this, this._elem);
  }
}
