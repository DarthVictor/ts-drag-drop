/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
module BootstrapDragAndDrop {
  export class BootstrapDropTarget extends DragAndDrop.DropTarget {
    protected _showHoverIndication(avatar: BootstrapDragAvatar) {
      this._targetElem && this._targetElem == avatar.getDragInfo(null).currentTargetRowColumnElemnt && this._targetElem.classList.add('hover');
    }

    protected _hideHoverIndication(avatar:DragAndDrop.DragAvatar) {
      this._targetElem && this._targetElem.classList.remove('hover');
    }

    protected _getTargetElem(avatar:DragAndDrop.DragAvatar, event:MouseEvent): DragAndDrop.HTMLElementWithDropTarget {
      var target = avatar.getTargetElem();
      if (!target.classList.contains('drop-target')) {
        return;
      }
      //var dragInfo = avatar.getDragInfo(event);
      //console.log(target)
      return target;
    }

    public onDragEnd(avatar: BootstrapDragAndDrop.BootstrapDragAvatar, event:MouseEvent):void {
      // получить информацию об объекте переноса
      var dragInfo = avatar.getDragInfo(event);
      if (!this._targetElem || dragInfo.shadeElement.parentElement !== dragInfo.currentTargetRow) {
        // перенос закончился вне подходящей точки приземления
        avatar.onDragCancel();
        return;
      }

      this._hideHoverIndication(avatar);
      // вставить элемент в детей в отсортированном порядке
      var elemToMove = dragInfo.dragZoneElem;
      elemToMove.classList.remove('old-element');
      dragInfo.currentTargetRow.insertBefore(elemToMove, dragInfo.shadeElement)
      dragInfo.currentTargetRow.removeChild(dragInfo.shadeElement)
      avatar.onDragEnd(); // аватар больше не нужен, перенос успешен
      this._targetElem = null;
    }
  }
}
