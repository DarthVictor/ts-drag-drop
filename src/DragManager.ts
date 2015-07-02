/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

var dragManagerOld = new function() {

    var dragZone, avatar, dropTarget;
    var downX, downY;

    var self = this;

    function onMouseDown(e) {

        if (e.which != 1) { // не левой кнопкой
            return false;
        }

        dragZone = findDragZone(e);

        if (!dragZone) {
            return;
        }

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        downX = e.pageX;
        downY = e.pageY;

        return false;
    }

    function onMouseMove(e) {
        if (!dragZone) return; // элемент не зажат

        if (!avatar) { // элемент нажат, но пока не начали его двигать
            if (Math.abs(e.pageX - downX) < 3 && Math.abs(e.pageY - downY) < 3) {
                return;
            }
            // попробовать захватить элемент
            avatar = dragZone.onDragStart(downX, downY, e);

            if (!avatar) { // не получилось, значит перенос продолжать нельзя
                cleanUp(); // очистить приватные переменные, связанные с переносом
                return;
            }
        }

        // отобразить перенос объекта, перевычислить текущий элемент под курсором
        avatar.onDragMove(e);

        // найти новый dropTarget под курсором: newDropTarget
        // текущий dropTarget остался от прошлого mousemove
        // *оба значения: и newDropTarget и dropTarget могут быть null
        var newDropTarget = findDropTarget(e);

        if (newDropTarget != dropTarget) {
            // уведомить старую и новую зоны-цели о том, что с них ушли/на них зашли
            dropTarget && dropTarget.onDragLeave(newDropTarget, avatar, e);
            newDropTarget && newDropTarget.onDragEnter(dropTarget, avatar, e);
        }

        dropTarget = newDropTarget;

        dropTarget && dropTarget.onDragMove(avatar, e);

        return false;
    }

    function onMouseUp(e) {

        if (e.which != 1) { // не левой кнопкой
            return false;
        }

        if (avatar) { // если уже начали передвигать

            if (dropTarget) {
                // завершить перенос и избавиться от аватара, если это нужно
                // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
                dropTarget.onDragEnd(avatar, e);
            } else {
                avatar.onDragCancel();
            }

        }

        cleanUp();
    }

    function cleanUp() {
        // очистить все промежуточные объекты
        dragZone = avatar = dropTarget = null;
    }

    function findDragZone(event) {
        var elem = event.target;
        while (elem != document && !elem.dragZone) {
            elem = elem.parentNode;
        }
        return elem.dragZone;
    }

    function findDropTarget(event) {
        // получить элемент под аватаром
        var elem = avatar.getTargetElem();

        while (elem != document && !elem.dropTarget) {
            elem = elem.parentNode;
        }

        if (!elem.dropTarget) {
            return null;
        }

        return elem.dropTarget;
    }

    document.ondragstart = function() {
        return false;
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;
};


class DragManager {
  private static _instance: DragManager = new DragManager();
  public static getInstace(){
    return this._instance;
  }
  protected dragZone: any;
  protected avatar: any;
  protected dropTarget: any;
  protected downX: any;
  protected downY: any;

  constructor(){
    document.ondragstart = function() {
      return false;
    }
    var self =  this;
    document.onmousemove = function(e){ return self.onMouseMove(e);};
    document.onmouseup =  function(e){ return self.onMouseUp(e);};
    document.onmousedown =  function(e){ return self.onMouseDown(e)};
  }

  protected onMouseDown(e) {

    if (e.which != 1) { // не левой кнопкой
      return false;
    }

    this.dragZone = this.findDragZone(e);

    if (!this.dragZone) {
      return;
    }

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    this.downX = e.pageX;
    this.downY = e.pageY;

    return false;
  }

  protected  onMouseMove(e) {
    if (!this.dragZone) return; // элемент не зажат

    if (!this.avatar) { // элемент нажат, но пока не начали его двигать
      if (Math.abs(e.pageX - this.downX) < 3 && Math.abs(e.pageY - this.downY) < 3) {
        return;
      }
      // попробовать захватить элемент
      this.avatar = this.dragZone.onDragStart(this.downX, this.downY, e);

      if (!this.avatar) { // не получилось, значит перенос продолжать нельзя
        this.cleanUp(); // очистить приватные переменные, связанные с переносом
        return;
      }
    }

    // отобразить перенос объекта, перевычислить текущий элемент под курсором
    this.avatar.onDragMove(e);

    // найти новый dropTarget под курсором: newDropTarget
    // текущий dropTarget остался от прошлого mousemove
    // *оба значения: и newDropTarget и dropTarget могут быть null
    var newDropTarget = this.findDropTarget(e);

    if (newDropTarget != this.dropTarget) {
      // уведомить старую и новую зоны-цели о том, что с них ушли/на них зашли
      this.dropTarget && this.dropTarget.onDragLeave(newDropTarget, this.avatar, e);
      newDropTarget && newDropTarget.onDragEnter(this.dropTarget, this.avatar, e);
    }

    this.dropTarget = newDropTarget;

    this.dropTarget && this.dropTarget.onDragMove(this.avatar, e);

    return false;
  }

  protected onMouseUp(e) {

    if (e.which != 1) { // не левой кнопкой
      return false;
    }

    if (this.avatar) { // если уже начали передвигать

      if (this.dropTarget) {
        // завершить перенос и избавиться от аватара, если это нужно
        // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
        this.dropTarget.onDragEnd(this.avatar, e);
      } else {
        this.avatar.onDragCancel();
      }

    }

    this.cleanUp();
  }

  protected cleanUp() {
    // очистить все промежуточные объекты
    this.dragZone = this.avatar = this.dropTarget = null;
  }

  protected findDragZone(event) {
    var elem = event.target;
    while (elem != document && !elem.dragZone) {
      elem = elem.parentNode;
    }
    return elem.dragZone;
  }

  protected findDropTarget(event) {
    // получить элемент под аватаром
    var elem = this.avatar.getTargetElem();

    while (elem != document && !elem.dropTarget) {
      elem = elem.parentNode;
    }

    if (!elem.dropTarget) {
      return null;
    }

    return elem.dropTarget;
  }

}

var dragManager = DragManager.getInstace();
