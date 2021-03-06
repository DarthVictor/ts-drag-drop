/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="TreeDragAndDrop.ts" />
module TreeDragAndDrop {
  export class TreeDropTarget extends DragAndDrop.DropTarget {
    protected _showHoverIndication() {
      this._targetElem && this._targetElem.classList.add('hover');
    }

    protected _hideHoverIndication() {
      this._targetElem && this._targetElem.classList.remove('hover');
    }

    protected _getTargetElem(avatar:DragAndDrop.DragAvatar, event:MouseEvent):DragAndDrop.HTMLElementWithDropTarget {
      var target = avatar.getTargetElem();
      if (target.tagName != 'SPAN') {
        return;
      }

      // проверить, может быть перенос узла внутрь самого себя или в себя?
      var elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;

      var elem = target;
      while (elem) {
        if (elem == elemToMove) return; // попытка перенести родителя в потомка
        elem = <DragAndDrop.HTMLElementWithDropTarget> elem.parentElement;
      }

      return target;
    }

    public onDragEnd(avatar:DragAndDrop.DragAvatar, event:MouseEvent):void {

      if (!this._targetElem) {
        // перенос закончился вне подходящей точки приземления
        avatar.onDragCancel();
        return;
      }

      this._hideHoverIndication();

      // получить информацию об объекте переноса
      var avatarInfo = avatar.getDragInfo(event);

      avatar.onDragEnd(); // аватар больше не нужен, перенос успешен

      // вставить элемент в детей в отсортированном порядке
      var elemToMove = avatarInfo.dragZoneElem.parentNode; // <LI>
      var title = avatarInfo.dragZoneElem.innerHTML; // переносимый заголовок

      // получить контейнер для узлов дерева, соответствующий точке преземления
      var ul:HTMLElement = <HTMLElement> this._targetElem.parentElement.getElementsByTagName('UL')[0];

      if (!ul) { // нет детей, создадим контейнер
        ul = document.createElement('UL');
        this._targetElem.parentNode.appendChild(ul);
      }

      // вставить новый узел в нужное место среди потомков, в алфавитном порядке
      var li = null;
      for (var i = 0; i < ul.children.length; i++) {
        li = ul.children[i];
        var childTitle = (<HTMLElement> (<HTMLElement>li).children[0]).innerHTML;
        if (childTitle > title) {
          break;
        }
      }

      ul.insertBefore(elemToMove, li);

      this._targetElem = null;
    }
  }
}
