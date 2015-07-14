/**
 * Created by DarthVictor on 14.07.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */

function getElementUnderClientXY(elem: HTMLElement, clientX: number, clientY: number) {
  var display = elem.style.display || '';
  elem.style.display = 'none';

  var target = document.elementFromPoint(clientX, clientY);

  elem.style.display = display;

  if (!target || target == <Node> document) { // это бывает при выносе за границы окна
    target = document.body; // поправить значение, чтобы был именно элемент
  }

  return target;
}
