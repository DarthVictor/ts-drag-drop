declare function extend(Child, Parent) : void

function TreeDragZoneOld(elem) {
    DragZone.apply(this, arguments);
}

extend(TreeDragZoneOld, DragZoneOld);

TreeDragZoneOld.prototype._makeAvatar = function() {
    return new TreeDragAvatar(this, this._elem);
};

class TreeDragZone extends DragZone{
  protected _makeAvatar() {
    return new TreeDragAvatar(this, this._elem);
  }
}
