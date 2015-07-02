/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

declare function getCoords(elem) : any

class TreeDragAvatar extends DragAvatar{
  protected initFromEvent(downX, downY, event) {
    if (event.target.tagName != 'SPAN') return false;

    this._dragZoneElem = event.target;
    var elem = this._elem = this._dragZoneElem.cloneNode(true);
    elem.className = 'avatar';

    // создать вспомогательные свойства shiftX/shiftY
    var coords = getCoords(this._dragZoneElem);
    this._shiftX = downX - coords.left;
    this._shiftY = downY - coords.top;

    // инициировать начало переноса
    document.body.appendChild(elem);
    elem.style.zIndex = 9999;
    elem.style.position = 'absolute';

    return true;
  }

  /**
   * Вспомогательный метод
   */
  private _destroy () {
    this._elem.parentNode.removeChild(this._elem);
  }

  /**
   * При любом исходе переноса элемент-клон больше не нужен
   */
  protected onDragCancel() {
    this._destroy();
  }

  protected onDragEnd() {
    this._destroy();
  }

}
