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
      this._targetElem && this._targetElem == avatar.currentTargetRowColumnElemnt && this._targetElem.classList.add('hover');
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

      if (!this._targetElem || avatar.shadeElement.parentElement !== avatar.currentTargetRow) {
        // перенос закончился вне подходящей точки приземления
        avatar.onDragCancel();
        return;
      }

      this._hideHoverIndication(avatar);

      // получить информацию об объекте переноса
      var avatarInfo = avatar.getDragInfo(event);


      // вставить элемент в детей в отсортированном порядке
      var elemToMove = avatar.getDragInfo(event).dragZoneElem;
      avatar.currentTargetRow.insertBefore(elemToMove, avatar.shadeElement)
      avatar.currentTargetRow.removeChild(avatar.shadeElement)
      avatar.onDragEnd(); // аватар больше не нужен, перенос успешен
      /*var title = avatarInfo.dragZoneElem.innerHTML; // переносимый заголовок

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
*/
      /* ul.insertBefore(elemToMove, li);*/

      this._targetElem = null;
    }
  }
}
