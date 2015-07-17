/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
module BootstrapDragAndDrop {
  export class BootstrapDragAvatar extends DragAndDrop.DragAvatar {
    public currentTargetRow: DragAndDrop.HTMLElementWithDropTarget; // элемент текущей строки
    public currentTargetRowColumnElemnt: DragAndDrop.HTMLElementWithDropTarget; // другой элемент текущей строки, над которым мы находимся
    public shadeElement : HTMLElement;

    public initFromEvent(downX:number, downY:number, event:MouseEvent):boolean {
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

      // создаем объект отображающий отбрасываемую элементом тень
      this.shadeElement = <HTMLElement> this._dragZoneElem.cloneNode(true);
      this.shadeElement.classList.add('shade-element')
      return true;
    }

    /**
     * При каждом движении мыши перемещает this._elem
     * и записывает текущий элемент под this._elem в _currentTargetElem
     * @param event
     */
    public onDragMove(event:MouseEvent): void {
      super.onDragMove(event);
      var target = this.getTargetElem();
      if(target.classList.contains('row') && // навели на строку - вставляем в конец,
        target.tagName === 'DIV' &&          // но только если вставляемый элемент не был в конце
        target.lastElementChild !== this._dragZoneElem) {
            this.currentTargetRow = target;
            this.currentTargetRowColumnElemnt = null;
            this.shadeElement.style.display = 'block';
            this.currentTargetRow.appendChild(this.shadeElement);
      }
      else if (target.classList.contains('form-group') && // навели на элемент - вставляем перед ним,
        target.tagName === 'DIV' &&
        target !== this._dragZoneElem &&              // но только если навели не на самого себя
        target.previousElementSibling !== this._dragZoneElem) {  // и если вставляемый элемент не был до этого перед ним
            this.currentTargetRowColumnElemnt = target;
            this.currentTargetRow = <DragAndDrop.HTMLElementWithDropTarget> target.parentElement;
            this.shadeElement.style.display = 'block';
            this.currentTargetRow.insertBefore(this.shadeElement, this.currentTargetRowColumnElemnt);
      }
      else {
            this.shadeElement.style.display = 'none';
            document.body.appendChild(this.shadeElement)
      }
    }

    /**
     * Вспомогательный метод
     */
    private _destroy(): void {
      this._elem.parentNode.removeChild(this._elem);
      if(this.shadeElement.parentElement) {
        this.shadeElement.parentElement.removeChild(this.shadeElement);
      }
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

