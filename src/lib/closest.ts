/**
 * Created by DarthVictor on 25.07.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="Lib.ts" />
module Lib {
  export function closest(elem, selector: String) : HTMLElement{

    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      } else {
        elem = elem.parentElement;
      }
    }
    return null;
  }
}
