/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

class DragManager {
  private static _instance: DragManager = new DragManager();
  public static getInstance(){
    return this._instance;
  }
  protected dragZone: DragZone;
  protected avatar: DragAvatar;
  protected dropTarget: DropTarget;
  protected downX: number;
  protected downY: number;

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

  protected onMouseMove(e) {
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
    while (elem != <Node> document && !elem.dragZone) {
      elem = elem.parentNode;
    }
    return elem.dragZone;
  }

  protected findDropTarget(event) {
    // получить элемент под аватаром
    var elem = this.avatar.getTargetElem();

    while (elem !== <Node> document && !elem.dropTarget) {
      elem = <HTMLElementWithDropTarget>elem.parentElement;
    }

    if (!elem.dropTarget) {
      return null;
    }

    return elem.dropTarget;
  }

}
var dragManager = DragManager.getInstance();


