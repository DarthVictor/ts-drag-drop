/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

/// <reference path="DragAndDrop.ts" />
module DragAndDrop {

  /* Вспомогательный интерфейс */
  export interface HTMLElementWithDropTarget extends HTMLElement {
    dropTarget: DropTarget;
  }

  /**
   * Зона, в которую объекты можно класть
   * Занимается индикацией передвижения по себе, добавлением в себя
   */
  export class DropTarget {
    protected _elem:HTMLElementWithDropTarget;
    /**
     * Подэлемент, над которым в настоящий момент находится аватар
     */
    protected _targetElem:HTMLElementWithDropTarget;

    constructor(elem:HTMLElementWithDropTarget) {
      elem.dropTarget = this;
      this._elem = elem;
      this._targetElem = null;
    }

    /**
     * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
     *
     * @return DOM-элемент, на который можно положить или undefined
     */
    protected _getTargetElem(avatar:DragAvatar, event:MouseEvent):HTMLElementWithDropTarget {
      return this._elem; // по-умолчанию сам элемент
    }

    /**
     * Спрятать индикацию переноса
     * Вызывается, когда аватар уходит с текущего this._targetElem
     */
    protected _hideHoverIndication(avatar:DragAvatar) {
      /* override */
      throw new TypeError('Unimplemented method');
    }

    /**
     * Показать индикацию переноса
     * Вызывается, когда аватар пришел на новый this._targetElem
     */
    protected _showHoverIndication(avatar:DragAvatar) {
      /* override */
      throw new TypeError('Unimplemented method');
    }

    /**
     * Метод вызывается при каждом движении аватара
     */
    public onDragMove(avatar:DragAvatar, event:MouseEvent):void {
      var newTargetElem:HTMLElementWithDropTarget = this._getTargetElem(avatar, event);

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
    public onDragEnd(avatar:DragAvatar, event:MouseEvent):void {
      this._hideHoverIndication(avatar);
      this._targetElem = null;
    }

    /**
     * Вход аватара в DropTarget
     */
    public onDragEnter(fromDropTarget:DropTarget, avatar:DragAvatar, event:MouseEvent):void {

    }

    /**
     * Выход аватара из DropTarget
     */
    public onDragLeave(toDropTarget:DropTarget, avatar:DragAvatar, event:MouseEvent):void {
      this._hideHoverIndication(null);
      this._targetElem = null;
    }

  }
}
