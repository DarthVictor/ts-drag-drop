/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../Lib/closest.ts" />
/// <reference path="../Lib/getCoords.ts" />

/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragZone.ts" />

/// <reference path="BootstrapDragAndDrop.ts" />
module BootstrapDragAndDrop {
  enum RowClass  {Before, Current, After};
  function getRowClass(_relativePositionOnRow: number) : RowClass {
    if(_relativePositionOnRow < 0.25) return RowClass.Before;
    else if(_relativePositionOnRow > 0.75) return RowClass.After;
    else return RowClass.Current;
  }

  export class BootstrapDragAvatar extends DragAndDrop.DragAvatar {
    protected _currentTargetRow: DragAndDrop.HTMLElementWithDropTarget; // элемент текущей строки
    protected _currentTargetRowColumnElement: DragAndDrop.HTMLElementWithDropTarget; // другой элемент текущей строки, над которым мы находимся
    protected _shadeElement : HTMLElement;
    protected _shadeRow : HTMLElement;
    private _currentRowClass: RowClass

    public initFromEvent(downX: number, downY: number, event: MouseEvent):boolean {
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
    public onDragMove(event: MouseEvent): void {
      super.onDragMove(event);
      var targetRow : HTMLElement,
          targetRowHeight : number,
          relativePositionOnRow : number,
          newRowClass: RowClass,
          newShadeRow: HTMLElement;
      var target = this.getTargetElem();
      targetRow = Lib.closest(target, '.row.drop-target');
      if(targetRow != null){
        targetRowHeight = targetRow.offsetHeight;
        relativePositionOnRow = (event.pageY - Lib.getCoords(target).top)/targetRowHeight

        newRowClass = getRowClass(relativePositionOnRow);
        this._currentRowClass = getRowClass(relativePositionOnRow);
        if(this._currentRowClass !== newRowClass){
          this._dragZoneElem.classList.add('old-element');
          // вставка строк в перед или после текущей строки
          if(this._currentRowClass === RowClass.Before || this._currentRowClass === RowClass.After){
            newShadeRow = <HTMLElement> targetRow.cloneNode();
            newShadeRow.appendChild(this._shadeElement);
            if(this._currentRowClass === RowClass.Before){
              targetRow.parentElement.insertBefore(newShadeRow, targetRow)
            }
            else{
              targetRow.parentElement.insertBefore(newShadeRow, targetRow.nextSibling)
            }
            this._currentTargetRow =  <DragAndDrop.HTMLElementWithDropTarget> newShadeRow;
            this._currentTargetRowColumnElement = null;
          }
          else if(this._currentRowClass === RowClass.Current){ //вставка в текущую строку
            if(target.classList.contains('row') && // навели на строку - вставляем в конец,
              target.tagName === 'DIV' &&          // но только если вставляемый элемент не был в конце
              target.lastElementChild !== this._dragZoneElem) {
              this._currentTargetRow = target;
              this._currentTargetRowColumnElement = null;
              this._currentTargetRow.appendChild(this._shadeElement);
            }
            else if (target.classList.contains('form-group') && // навели на элемент - вставляем перед ним,
              target.tagName === 'DIV' &&
              target !== this._dragZoneElem &&              // но только если навели не на самого себя
              target.previousElementSibling !== this._dragZoneElem) {  // и если вставляемый элемент не был до этого перед ним
              this._currentTargetRowColumnElement = target;
              this._currentTargetRow = <DragAndDrop.HTMLElementWithDropTarget> target.parentElement;
              this._currentTargetRow.insertBefore(this._shadeElement, this._currentTargetRowColumnElement);
            }
          }

          // действия с вставлявшимися ранее строками
          if(this._currentRowClass === RowClass.Before || this._currentRowClass === RowClass.After){
            this._shadeRow.parentElement.removeChild(this._shadeRow);
          }
          if(newShadeRow){
            this._shadeRow = newShadeRow;
          }
        }
      }
      else{
        this._dragZoneElem.classList.remove('old-element');
        this._shadeElement.style.display = 'none';
        if(this._shadeRow) {
          this._shadeRow.style.display = 'none';
        }
      }

      /*
      if(target.classList.contains('row') && // навели на строку - вставляем в конец,
        target.tagName === 'DIV' &&          // но только если вставляемый элемент не был в конце
        target.lastElementChild !== this._dragZoneElem) {
            this._currentTargetRow = target;
            this._currentTargetRowColumnElement = null;
            this._currentTargetRow.appendChild(this._shadeElement);
            this._shadeElement.style.display = 'block';
            this._dragZoneElem.classList.add('old-element');
      }
      else if (target.classList.contains('form-group') && // навели на элемент - вставляем перед ним,
        target.tagName === 'DIV' &&
        target !== this._dragZoneElem &&              // но только если навели не на самого себя
        target.previousElementSibling !== this._dragZoneElem) {  // и если вставляемый элемент не был до этого перед ним
            this._currentTargetRowColumnElement = target;
            this._currentTargetRow = <DragAndDrop.HTMLElementWithDropTarget> target.parentElement;
            this._currentTargetRow.insertBefore(this._shadeElement, this._currentTargetRowColumnElement);
            this._shadeElement.style.display = 'block';
            this._dragZoneElem.classList.add('old-element');
      }
      else {
            this._shadeElement.style.display = 'none';
            this._dragZoneElem.classList.remove('old-element');
            document.body.appendChild(this._shadeElement);
      }*/

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

    getDragInfo(event:MouseEvent): BootstrapDragInfo {
      // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
      return new BootstrapDragInfo(
        //this._currentTargetRow,
        //this._currentTargetRowColumnElemnt,
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

    constructor(//currentTargetRow: DragAndDrop.HTMLElementWithDropTarget,
                //currentTargetRowColumnElemnt: DragAndDrop.HTMLElementWithDropTarget,
                shadeElement : HTMLElement,
                elem:HTMLElement,
                dragZoneElem: HTMLElement,
                dragZone: DragAndDrop.DragZone) {
        super(elem, dragZoneElem, dragZone);
        //this.currentTargetRow = currentTargetRow;
        //this.currentTargetRowColumnElemnt = currentTargetRowColumnElemnt;
        this.shadeElement = shadeElement;
    }
  }
}

