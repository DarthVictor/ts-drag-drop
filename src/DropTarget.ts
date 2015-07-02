/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/**
 * Зона, в которую объекты можно класть
 * Занимается индикацией передвижения по себе, добавлением в себя
 */
class DropTarget{
  protected _elem: any;
  /**
   * Подэлемент, над которым в настоящий момент находится аватар
   */
  protected _targetElem: any;

  constructor(elem) {
    elem.dropTarget = this;
    this._elem = elem;
    this._targetElem = null;
  }

  /**
   * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
   *
   * @return DOM-элемент, на который можно положить или undefined
   */
  protected _getTargetElem(avatar, event) {
    return this._elem; // по-умолчанию сам элемент
  }

  /**
   * Спрятать индикацию переноса
   * Вызывается, когда аватар уходит с текущего this._targetElem
   */
  protected _hideHoverIndication(avatar) {
    /* override */
  }

  /**
   * Показать индикацию переноса
   * Вызывается, когда аватар пришел на новый this._targetElem
   */
  protected _showHoverIndication(avatar) {
    /* override */
  }

  /**
   * Метод вызывается при каждом движении аватара
   */
  protected onDragMove(avatar, event) {
    var newTargetElem = this._getTargetElem(avatar, event);

    if (this._targetElem != newTargetElem) {

      this._hideHoverIndication(avatar);
      this._targetElem = newTargetElem;
      this._showHoverIndication(avatar);
    }
  }

  /**
   * Завершение переноса.
   * Алгоритм обработки (переопределить функцию и написать в потомке):
   * 1. Получить данные переноса из avatar.getDragInfo()
   * 2. Определить, возможен ли перенос на _targetElem (если он есть)
   * 3. Вызвать avatar.onDragEnd() или avatar.onDragCancel()
   *  Если нужно подтвердить перенос запросом на сервер, то avatar.onDragEnd(),
   *  а затем асинхронно, если сервер вернул ошибку, avatar.onDragCancel()
   *  При этом аватар должен уметь "откатываться" после onDragEnd.
   *
   * При любом завершении этого метода нужно (делается ниже):
   *  снять текущую индикацию переноса
   *  обнулить this._targetElem
   */
  protected onDragEnd (avatar, event) {
    this._hideHoverIndication(avatar);
    this._targetElem = null;
  }

  /**
   * Вход аватара в DropTarget
   */
  protected onDragEnter(fromDropTarget, avatar, event) {}

  /**
   * Выход аватара из DropTarget
   */
  protected onDragLeave(toDropTarget, avatar, event) {
    this._hideHoverIndication(null);
    this._targetElem = null;
  }

}
