/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragZone.ts" />

/// <reference path="BootstrapDragAndDrop.ts" />
module BootstrapDragAndDrop {
  export class BootstrapDragAvatar extends DragAndDrop.DragAvatar {
    protected _currentTargetRow: DragAndDrop.HTMLElementWithDropTarget; // элемент текущей строки
    protected _currentTargetRowColumnElemnt: DragAndDrop.HTMLElementWithDropTarget; // другой элемент текущей строки, над которым мы находимся
    protected _shadeElement : HTMLElement;

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
      this._shadeElement = <HTMLElement> this._dragZoneElem.cloneNode(true);
      this._shadeElement.classList.add('shade-element')
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
            this._currentTargetRow = target;
            this._currentTargetRowColumnElemnt = null;
            this._currentTargetRow.appendChild(this._shadeElement);
            this._shadeElement.style.display = 'block';
            this._dragZoneElem.classList.add('old-element');
      }
      else if (target.classList.contains('form-group') && // навели на элемент - вставляем перед ним,
        target.tagName === 'DIV' &&
        target !== this._dragZoneElem &&              // но только если навели не на самого себя
        target.previousElementSibling !== this._dragZoneElem) {  // и если вставляемый элемент не был до этого перед ним
            this._currentTargetRowColumnElemnt = target;
            this._currentTargetRow = <DragAndDrop.HTMLElementWithDropTarget> target.parentElement;
            this._currentTargetRow.insertBefore(this._shadeElement, this._currentTargetRowColumnElemnt);
            this._shadeElement.style.display = 'block';
            this._dragZoneElem.classList.add('old-element');
      }
      else {
            this._shadeElement.style.display = 'none';
            this._dragZoneElem.classList.remove('old-element');
            document.body.appendChild(this._shadeElement);
      }
    }

    /**
     * Вспомогательный метод
     */
    private _destroy(): void {
      this._elem.parentNode.removeChild(this._elem);
      if(this._shadeElement.parentElement) {
        this._shadeElement.parentElement.removeChild(this._shadeElement);
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

    getDragInfo(event:MouseEvent):BootstrapDragInfo {
      // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
      return new BootstrapDragInfo(
        this._currentTargetRow,
        this._currentTargetRowColumnElemnt,
        this._shadeElement,
        this._elem,
        this._dragZoneElem,
        this._dragZone
      );
    }
  }

  export class BootstrapDragInfo extends DragAndDrop.DragInfo {
    public currentTargetRow: DragAndDrop.HTMLElementWithDropTarget; // элемент текущей строки
    public currentTargetRowColumnElemnt: DragAndDrop.HTMLElementWithDropTarget; // другой элемент текущей строки, над которым мы находимся
    public shadeElement : HTMLElement;

    constructor(currentTargetRow: DragAndDrop.HTMLElementWithDropTarget,
                currentTargetRowColumnElemnt: DragAndDrop.HTMLElementWithDropTarget,
                shadeElement : HTMLElement,
                elem:HTMLElement,
                dragZoneElem: HTMLElement,
                dragZone: DragAndDrop.DragZone) {
        super(elem, dragZoneElem, dragZone);
        this.currentTargetRow = currentTargetRow;
        this.currentTargetRowColumnElemnt = currentTargetRowColumnElemnt;
        this.shadeElement = shadeElement;
    }
  }
}

