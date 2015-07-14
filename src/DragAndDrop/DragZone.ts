/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/// <reference path="DragAndDrop.ts" />
module DragAndDrop {

  /* Вспомогательный интерфейс */
  export interface HTMLElementWithDragZone extends HTMLElement {
    dragZone: DragZone;
  }

  /**
   * Зона, из которой можно переносить объекты
   * Умеет обрабатывать начало переноса на себе и создавать "аватар"
   */
  export class DragZone {
    protected _elem:HTMLElementWithDragZone;

    /*
     * @param elem DOM-элемент, к которому привязана зона
     */
    constructor(elem:HTMLElementWithDragZone) {
      elem.dragZone = this;
      this._elem = elem;
    }

    /**
     * Создать аватар, соответствующий зоне.
     * У разных зон могут быть разные типы аватаров
     */
    protected _makeAvatar():DragAvatar {
      /* override */
      throw new TypeError('Unimplemented method');
    }

    /**
     * Обработать начало переноса.
     *
     * Получает координаты изначального нажатия мышки, событие.
     *
     * @param downX Координата изначального нажатия по X
     * @param downY Координата изначального нажатия по Y
     * @param event текущее событие мыши
     *
     * @return аватар или false, если захватить с данной точки ничего нельзя
     */
    public onDragStart(downX:number, downY:number, event:MouseEvent):DragAvatar {

      var avatar:DragAvatar = this._makeAvatar();

      if (!avatar.initFromEvent(downX, downY, event)) {
        return null;
      }

      return avatar;
    }
  }
}
