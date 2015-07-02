/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/**
 * Зона, из которой можно переносить объекты
 * Умеет обрабатывать начало переноса на себе и создавать "аватар"
 */
class DragZone {
  protected _elem: any;

  /*
   * @param elem DOM-элемент, к которому привязана зона
   */
  constructor(elem){
    elem.dragZone = this;
    this._elem = elem;
  }

  /**
   * Создать аватар, соответствующий зоне.
   * У разных зон могут быть разные типы аватаров
   */
  protected _makeAvatar() {
    /* override */
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
  protected onDragStart(downX, downY, event) {

    var avatar:any = this._makeAvatar();

    if (!avatar.initFromEvent(downX, downY, event)) {
      return false;
    }

    return avatar;
  }
}
