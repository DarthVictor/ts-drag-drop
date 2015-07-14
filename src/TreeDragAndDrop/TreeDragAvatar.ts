/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../Lib/Lib.ts" />
/// <reference path="../DragAndDrop/DragAndDrop.ts" />

/// <reference path="TreeDragAndDrop.ts" />
module TreeDragAndDrop {
  export class TreeDragAvatar extends DragAndDrop.DragAvatar {
    public initFromEvent(downX:number, downY:number, event:MouseEvent):boolean {
      if (( <HTMLElement> event.target).tagName != 'SPAN') return false;

      this._dragZoneElem = <HTMLElement> event.target;
      var elem = this._elem = <HTMLElement> this._dragZoneElem.cloneNode(true);
      elem.className = 'avatar';

      // создать вспомогательные свойства shiftX/shiftY
      var coords = Lib.getCoords(this._dragZoneElem);
      this._shiftX = downX - coords.left;
      this._shiftY = downY - coords.top;

      // инициировать начало переноса
      document.body.appendChild(elem);
      elem.style.zIndex = '9999';
      elem.style.position = 'absolute';

      return true;
    }

    /**
     * Вспомогательный метод
     */
    private _destroy():void {
      this._elem.parentNode.removeChild(this._elem);
    }

    /**
     * При любом исходе переноса элемент-клон больше не нужен
     */
    public onDragCancel():void {
      this._destroy();
    }

    public onDragEnd():void {
      this._destroy();
    }

  }
}
