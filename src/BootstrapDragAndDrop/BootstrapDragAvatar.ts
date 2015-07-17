/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
module BootstrapDragAndDrop {
  export class BootstrapDragAvatar extends DragAndDrop.DragAvatar {
    public initFromEvent(downX:number, downY:number, event:MouseEvent):boolean {
      console.log(event)
      if (( <HTMLElement> event.target).tagName != 'LABEL') return false;

      this._dragZoneElem = (<HTMLElement> event.target).parentElement;
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
    private _destroy(): void {
      this._elem.parentNode.removeChild(this._elem);
    }

    /**
     * При любом исходе переноса элемент-клон больше не нужен
     */
    public onDragCancel(): void {
      this._destroy();
    }

    public onDragEnd(): void {
      this._destroy();
    }

  }
}

