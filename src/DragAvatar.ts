/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

 /**
 * "Аватар" - элемент, который перетаскивается.
 *
 * В простейшем случае аватаром является сам переносимый элемент
 * Также аватар может быть клонированным элементом
 * Также аватар может быть иконкой и вообще чем угодно.
 */
declare function getElementUnderClientXY(elem, clientX, clientY) : HTMLElement

function DragAvatarOld(dragZone, dragElem) {
    /** "родительская" зона переноса */
    this._dragZone = dragZone;

    /**
     * подэлемент родительской зоны, к которому относится аватар
     * по умолчанию - элемент, соответствующий всей зоне
     * может быть уточнен в initFromEvent
     */
    this._dragZoneElem = dragElem;

    /**
     * Сам элемент аватара, который будет носиться по экрану.
     * Инициализуется в initFromEvent
     */
    this._elem = dragElem;
}

/**
 * Инициализовать this._elem и позиционировать его
 * При необходимости уточнить this._dragZoneElem
 * @param downX Координата X нажатия мыши
 * @param downY Координата Y нажатия мыши
 * @param event Текущее событие мыши
 */
DragAvatarOld.prototype.initFromEvent = function(downX, downY, event) {
    /* override */
};

/**
 * Возвращает информацию о переносимом элементе для DropTarget
 * @param event
 */
DragAvatarOld.prototype.getDragInfo = function(event) {
    // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
    return {
        elem: this._elem,
        dragZoneElem: this._dragZoneElem,
        dragZone: this._dragZone
    };
};

/**
 * Возвращает текущий самый глубокий DOM-элемент под this._elem
 * Приватное свойство _currentTargetElem обновляется при каждом передвижении
 */
DragAvatarOld.prototype.getTargetElem = function() {
    return this._currentTargetElem;
};

/**
 * При каждом движении мыши перемещает this._elem
 * и записывает текущий элемент под this._elem в _currentTargetElem
 * @param event
 */
DragAvatarOld.prototype.onDragMove = function(event) {
    this._elem.style.left = event.pageX - this._shiftX + 'px';
    this._elem.style.top = event.pageY - this._shiftY + 'px';
    this._currentTargetElem = getElementUnderClientXY(this._elem, event.clientX, event.clientY);
};

/**
 * Действия с аватаром, когда перенос не удался
 * Например, можно вернуть элемент обратно или уничтожить
 */
DragAvatarOld.prototype.onDragCancel = function() {
    /* override */
};

/**
 * Действия с аватаром после успешного переноса
 */
DragAvatarOld.prototype.onDragEnd = function() {
    /* override */
};

/**
 * "Аватар" - элемент, который перетаскивается.
 *
 * В простейшем случае аватаром является сам переносимый элемент
 * Также аватар может быть клонированным элементом
 * Также аватар может быть иконкой и вообще чем угодно.
 */
class DragAvatar {
  /** "родительская" зона переноса */
  protected _dragZone: any;

  /**
   * подэлемент родительской зоны, к которому относится аватар
   * по умолчанию - элемент, соответствующий всей зоне
   * может быть уточнен в initFromEvent
   */
  protected _dragZoneElem: any;

  /**
   * Сам элемент аватара, который будет носиться по экрану.
   * Инициализуется в initFromEvent
   */
  protected _elem: any;

  /**
   * Текущий элемент под this._elem, обновление проиходит в методе onDragMove
   */
  protected _currentTargetElem: any;

  /**
   * вспомогательные свойства, которые хранят координаты точки первого нажатия при начали переноса,
   * относительно вернего левого угла элемента
   */
  protected _shiftX: number;
  protected _shiftY: number;

  constructor(dragZone: any, dragElem: any) {
    this._dragZone = dragZone;
    this._dragZoneElem = dragElem;
    this._elem = dragElem;
  }

  /**
   * Инициализовать this._elem и позиционировать его
   * При необходимости уточнить this._dragZoneElem
   * @param downX Координата X нажатия мыши
   * @param downY Координата Y нажатия мыши
   * @param event Текущее событие мыши
   */
  initFromEvent(downX: number, downY: number, event: Event) {
    /* override */
  }

  /**
   * Возвращает информацию о переносимом элементе для DropTarget
   * @param event
   */
  getDragInfo = function(event: Event) {
    // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
    return {
      elem: this._elem,
      dragZoneElem: this._dragZoneElem,
      dragZone: this._dragZone
    };
  }

  /**
   * Возвращает текущий самый глубокий DOM-элемент под this._elem
   * Приватное свойство _currentTargetElem обновляется при каждом передвижении
   */
  getTargetElem() {
    return this._currentTargetElem;
  }

  /**
   * При каждом движении мыши перемещает this._elem
   * и записывает текущий элемент под this._elem в _currentTargetElem
   * @param event
   */
  onDragMove(event: any) {
    this._elem.style.left = event.pageX - this._shiftX + 'px';
    this._elem.style.top = event.pageY - this._shiftY + 'px';

    this._currentTargetElem = getElementUnderClientXY(this._elem, event.clientX, event.clientY);
  }

  /**
   * Действия с аватаром, когда перенос не удался
   * Например, можно вернуть элемент обратно или уничтожить
   */
  onDragCancel() {
    /* override */
  }

  /**
   * Действия с аватаром после успешного переноса
   */
  onDragEnd () {
    /* override */
  }
}
