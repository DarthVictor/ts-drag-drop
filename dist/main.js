/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */





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
/// <reference path="../Lib/Lib.ts" />
/// <reference path="DragAndDrop.ts" />
var DragAndDrop;
(function (DragAndDrop) {
    var DragAvatar = (function () {
        function DragAvatar(dragZone, dragElem) {
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
        DragAvatar.prototype.initFromEvent = function (downX, downY, event) {
            throw new TypeError('Unimplemented method');
        };
        /**
         * Возвращает информацию о переносимом элементе для DropTarget
         * @param event
         */
        DragAvatar.prototype.getDragInfo = function (event) {
            // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
            return new DragInfo(this._elem, this._dragZoneElem, this._dragZone);
        };
        /**
         * Возвращает текущий самый глубокий DOM-элемент под this._elem
         * Приватное свойство _currentTargetElem обновляется при каждом передвижении
         */
        DragAvatar.prototype.getTargetElem = function () {
            return this._currentTargetElem;
        };
        /**
         * При каждом движении мыши перемещает this._elem
         * и записывает текущий элемент под this._elem в _currentTargetElem
         * @param event
         */
        DragAvatar.prototype.onDragMove = function (event) {
            this._elem.style.left = event.pageX - this._shiftX + 'px';
            this._elem.style.top = event.pageY - this._shiftY + 'px';
            this._currentTargetElem = Lib.getElementUnderClientXY(this._elem, event.clientX, event.clientY);
            this._currentTargetElem.dropTarget = null;
        };
        /**
         * Действия с аватаром, когда перенос не удался
         * Например, можно вернуть элемент обратно или уничтожить
         */
        DragAvatar.prototype.onDragCancel = function () {
            throw new TypeError('Unimplemented method');
        };
        /**
         * Действия с аватаром после успешного переноса
         */
        DragAvatar.prototype.onDragEnd = function () {
            throw new TypeError('Unimplemented method');
        };
        return DragAvatar;
    })();
    DragAndDrop.DragAvatar = DragAvatar;
    /**
     * Класс для хранения информации, необходимой для обработки конца или процесса переноса
     */
    var DragInfo = (function () {
        function DragInfo(elem, dragZoneElem, dragZone) {
            this.elem = elem;
            this.dragZoneElem = dragZoneElem;
            this.dragZone = dragZone;
        }
        return DragInfo;
    })();
    DragAndDrop.DragInfo = DragInfo;
})(DragAndDrop || (DragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="DragAndDrop.ts" />
var DragAndDrop;
(function (DragAndDrop) {
    /**
     * Зона, в которую объекты можно класть
     * Занимается индикацией передвижения по себе, добавлением в себя
     */
    var DropTarget = (function () {
        function DropTarget(elem) {
            elem.dropTarget = this;
            this._elem = elem;
            this._targetElem = null;
        }
        /**
         * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
         *
         * @return DOM-элемент, на который можно положить или undefined
         */
        DropTarget.prototype._getTargetElem = function (avatar, event) {
            return this._elem; // по-умолчанию сам элемент
        };
        /**
         * Спрятать индикацию переноса
         * Вызывается, когда аватар уходит с текущего this._targetElem
         */
        DropTarget.prototype._hideHoverIndication = function (avatar) {
            throw new TypeError('Unimplemented method');
        };
        /**
         * Показать индикацию переноса
         * Вызывается, когда аватар пришел на новый this._targetElem
         */
        DropTarget.prototype._showHoverIndication = function (avatar) {
            throw new TypeError('Unimplemented method');
        };
        /**
         * Метод вызывается при каждом движении аватара
         */
        DropTarget.prototype.onDragMove = function (avatar, event) {
            var newTargetElem = this._getTargetElem(avatar, event);
            if (this._targetElem != newTargetElem) {
                this._hideHoverIndication(avatar);
                this._targetElem = newTargetElem;
                this._showHoverIndication(avatar);
            }
        };
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
        DropTarget.prototype.onDragEnd = function (avatar, event) {
            this._hideHoverIndication(avatar);
            this._targetElem = null;
        };
        /**
         * Вход аватара в DropTarget
         */
        DropTarget.prototype.onDragEnter = function (fromDropTarget, avatar, event) {
        };
        /**
         * Выход аватара из DropTarget
         */
        DropTarget.prototype.onDragLeave = function (toDropTarget, avatar, event) {
            this._hideHoverIndication(null);
            this._targetElem = null;
        };
        return DropTarget;
    })();
    DragAndDrop.DropTarget = DropTarget;
})(DragAndDrop || (DragAndDrop = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
var BootstrapDragAndDrop;
(function (BootstrapDragAndDrop) {
    var BootstrapDragAvatar = (function (_super) {
        __extends(BootstrapDragAvatar, _super);
        function BootstrapDragAvatar() {
            _super.apply(this, arguments);
        }
        BootstrapDragAvatar.prototype.initFromEvent = function (downX, downY, event) {
            if (event.target.tagName != 'LABEL')
                return false;
            this._dragZoneElem = event.target.parentElement;
            var elem = this._elem = this._dragZoneElem.cloneNode(true);
            elem.className = 'avatar';
            // создать вспомогательные свойства shiftX/shiftY
            var coords = Lib.getCoords(this._dragZoneElem);
            this._shiftX = downX - coords.left;
            this._shiftY = downY - coords.top;
            // инициировать начало переноса
            document.body.appendChild(elem);
            elem.style.zIndex = '9999';
            elem.style.position = 'absolute';
            // создаем объект отображающий отбрасываемую элементом тень
            this.shadeElement = this._dragZoneElem.cloneNode(true);
            this.shadeElement.classList.add('shade-element');
            return true;
        };
        /**
         * При каждом движении мыши перемещает this._elem
         * и записывает текущий элемент под this._elem в _currentTargetElem
         * @param event
         */
        BootstrapDragAvatar.prototype.onDragMove = function (event) {
            _super.prototype.onDragMove.call(this, event);
            var target = this.getTargetElem();
            if (target.classList.contains('row') && target.tagName === 'DIV' && target.lastElementChild !== this._dragZoneElem) {
                this.currentTargetRow = target;
                this.currentTargetRowColumnElemnt = null;
                this.shadeElement.style.display = 'block';
                this.currentTargetRow.appendChild(this.shadeElement);
            }
            else if (target.classList.contains('form-group') && target.tagName === 'DIV' && target !== this._dragZoneElem && target.previousElementSibling !== this._dragZoneElem) {
                this.currentTargetRowColumnElemnt = target;
                this.currentTargetRow = target.parentElement;
                this.shadeElement.style.display = 'block';
                this.currentTargetRow.insertBefore(this.shadeElement, this.currentTargetRowColumnElemnt);
            }
            else {
                this.shadeElement.style.display = 'none';
                document.body.appendChild(this.shadeElement);
            }
        };
        /**
         * Вспомогательный метод
         */
        BootstrapDragAvatar.prototype._destroy = function () {
            this._elem.parentNode.removeChild(this._elem);
            if (this.shadeElement.parentElement) {
                this.shadeElement.parentElement.removeChild(this.shadeElement);
            }
        };
        /**
         * При любом исходе переноса элемент-клон больше не нужен
         */
        BootstrapDragAvatar.prototype.onDragCancel = function () {
            this._destroy();
        };
        BootstrapDragAvatar.prototype.onDragEnd = function () {
            this._destroy();
        };
        return BootstrapDragAvatar;
    })(DragAndDrop.DragAvatar);
    BootstrapDragAndDrop.BootstrapDragAvatar = BootstrapDragAvatar;
})(BootstrapDragAndDrop || (BootstrapDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="DragAndDrop.ts" />
var DragAndDrop;
(function (DragAndDrop) {
    /**
     * Зона, из которой можно переносить объекты
     * Умеет обрабатывать начало переноса на себе и создавать "аватар"
     */
    var DragZone = (function () {
        /*
         * @param elem DOM-элемент, к которому привязана зона
         */
        function DragZone(elem) {
            elem.dragZone = this;
            this._elem = elem;
        }
        /**
         * Создать аватар, соответствующий зоне.
         * У разных зон могут быть разные типы аватаров
         */
        DragZone.prototype._makeAvatar = function () {
            throw new TypeError('Unimplemented method');
        };
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
        DragZone.prototype.onDragStart = function (downX, downY, event) {
            var avatar = this._makeAvatar();
            if (!avatar.initFromEvent(downX, downY, event)) {
                return null;
            }
            return avatar;
        };
        return DragZone;
    })();
    DragAndDrop.DragZone = DragZone;
})(DragAndDrop || (DragAndDrop = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragZone.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
/// <reference path="BootstrapDragAvatar.ts" />
var BootstrapDragAndDrop;
(function (BootstrapDragAndDrop) {
    var BootstrapDragZone = (function (_super) {
        __extends(BootstrapDragZone, _super);
        function BootstrapDragZone() {
            _super.apply(this, arguments);
        }
        BootstrapDragZone.prototype._makeAvatar = function () {
            return new BootstrapDragAndDrop.BootstrapDragAvatar(this, this._elem);
        };
        return BootstrapDragZone;
    })(DragAndDrop.DragZone);
    BootstrapDragAndDrop.BootstrapDragZone = BootstrapDragZone;
})(BootstrapDragAndDrop || (BootstrapDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
var BootstrapDragAndDrop;
(function (BootstrapDragAndDrop) {
    var BootstrapDropTarget = (function (_super) {
        __extends(BootstrapDropTarget, _super);
        function BootstrapDropTarget() {
            _super.apply(this, arguments);
        }
        BootstrapDropTarget.prototype._showHoverIndication = function (avatar) {
            this._targetElem && this._targetElem == avatar.currentTargetRowColumnElemnt && this._targetElem.classList.add('hover');
        };
        BootstrapDropTarget.prototype._hideHoverIndication = function (avatar) {
            this._targetElem && this._targetElem.classList.remove('hover');
        };
        BootstrapDropTarget.prototype._getTargetElem = function (avatar, event) {
            var target = avatar.getTargetElem();
            if (!target.classList.contains('drop-target')) {
                return;
            }
            //var dragInfo = avatar.getDragInfo(event);
            //console.log(target)
            return target;
        };
        BootstrapDropTarget.prototype.onDragEnd = function (avatar, event) {
            if (!this._targetElem || avatar.shadeElement.parentElement !== avatar.currentTargetRow) {
                // перенос закончился вне подходящей точки приземления
                avatar.onDragCancel();
                return;
            }
            this._hideHoverIndication(avatar);
            // получить информацию об объекте переноса
            var avatarInfo = avatar.getDragInfo(event);
            // вставить элемент в детей в отсортированном порядке
            var elemToMove = avatar.getDragInfo(event).dragZoneElem;
            avatar.currentTargetRow.insertBefore(elemToMove, avatar.shadeElement);
            avatar.currentTargetRow.removeChild(avatar.shadeElement);
            avatar.onDragEnd(); // аватар больше не нужен, перенос успешен
            /*var title = avatarInfo.dragZoneElem.innerHTML; // переносимый заголовок
      
            // получить контейнер для узлов дерева, соответствующий точке преземления
            var ul:HTMLElement = <HTMLElement> this._targetElem.parentElement.getElementsByTagName('UL')[0];
      
            if (!ul) { // нет детей, создадим контейнер
              ul = document.createElement('UL');
              this._targetElem.parentNode.appendChild(ul);
            }
      
            // вставить новый узел в нужное место среди потомков, в алфавитном порядке
            var li = null;
            for (var i = 0; i < ul.children.length; i++) {
              li = ul.children[i];
              var childTitle = (<HTMLElement> (<HTMLElement>li).children[0]).innerHTML;
              if (childTitle > title) {
                break;
              }
            }
      */
            /* ul.insertBefore(elemToMove, li);*/
            this._targetElem = null;
        };
        return BootstrapDropTarget;
    })(DragAndDrop.DropTarget);
    BootstrapDragAndDrop.BootstrapDropTarget = BootstrapDropTarget;
})(BootstrapDragAndDrop || (BootstrapDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="BootstrapDragAndDrop.ts" />
/// <reference path="BootstrapDragZone.ts" />
/// <reference path="BootstrapDropTarget.ts" />
var BootstrapDragAndDrop;
(function (BootstrapDragAndDrop) {
    function Main(form) {
        new BootstrapDragAndDrop.BootstrapDragZone(form);
        new BootstrapDragAndDrop.BootstrapDropTarget(form);
    }
    BootstrapDragAndDrop.Main = Main;
})(BootstrapDragAndDrop || (BootstrapDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="DragAndDrop.ts" />
var DragAndDrop;
(function (DragAndDrop) {
    var DragManager = (function () {
        function DragManager() {
            document.ondragstart = function () {
                return false;
            };
            var self = this;
            document.onmousemove = function (e) {
                return self.onMouseMove(e);
            };
            document.onmouseup = function (e) {
                return self.onMouseUp(e);
            };
            document.onmousedown = function (e) {
                return self.onMouseDown(e);
            };
        }
        DragManager.getInstance = function () {
            return this._instance;
        };
        DragManager.prototype.onMouseDown = function (e) {
            if (e.which != 1) {
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
        };
        DragManager.prototype.onMouseMove = function (e) {
            if (!this.dragZone)
                return; // элемент не зажат
            if (!this.avatar) {
                if (Math.abs(e.pageX - this.downX) < 3 && Math.abs(e.pageY - this.downY) < 3) {
                    return;
                }
                // попробовать захватить элемент
                this.avatar = this.dragZone.onDragStart(this.downX, this.downY, e);
                if (!this.avatar) {
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
        };
        DragManager.prototype.onMouseUp = function (e) {
            if (e.which != 1) {
                return false;
            }
            if (this.avatar) {
                if (this.dropTarget) {
                    // завершить перенос и избавиться от аватара, если это нужно
                    // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
                    this.dropTarget.onDragEnd(this.avatar, e);
                }
                else {
                    this.avatar.onDragCancel();
                }
            }
            this.cleanUp();
        };
        DragManager.prototype.cleanUp = function () {
            // очистить все промежуточные объекты
            this.dragZone = this.avatar = this.dropTarget = null;
        };
        DragManager.prototype.findDragZone = function (event) {
            var elem = event.target;
            while (elem != document && !elem.dragZone) {
                elem = elem.parentNode;
            }
            return elem.dragZone;
        };
        DragManager.prototype.findDropTarget = function (event) {
            // получить элемент под аватаром
            var elem = this.avatar.getTargetElem();
            while (elem != document && !elem.dropTarget) {
                elem = elem.parentNode;
            }
            if (!elem.dropTarget) {
                return null;
            }
            return elem.dropTarget;
        };
        DragManager._instance = new DragManager();
        return DragManager;
    })();
    DragAndDrop.dragManager = DragManager.getInstance();
})(DragAndDrop || (DragAndDrop = {}));

/**
 * Created by DarthVictor on 14.07.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="Lib.ts" />
var Lib;
(function (Lib) {
    function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    }
    Lib.getCoords = getCoords;
})(Lib || (Lib = {}));

/**
 * Created by DarthVictor on 14.07.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="Lib.ts" />
var Lib;
(function (Lib) {
    function getElementUnderClientXY(elem, clientX, clientY) {
        var display = elem.style.display || '';
        elem.style.display = 'none';
        var target = document.elementFromPoint(clientX, clientY);
        elem.style.display = display;
        if (!target || target == document) {
            target = document.body; // поправить значение, чтобы был именно элемент
        }
        return target;
    }
    Lib.getElementUnderClientXY = getElementUnderClientXY;
})(Lib || (Lib = {}));



/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../Lib/Lib.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="TreeDragAndDrop.ts" />
var TreeDragAndDrop;
(function (TreeDragAndDrop) {
    var TreeDragAvatar = (function (_super) {
        __extends(TreeDragAvatar, _super);
        function TreeDragAvatar() {
            _super.apply(this, arguments);
        }
        TreeDragAvatar.prototype.initFromEvent = function (downX, downY, event) {
            if (event.target.tagName != 'SPAN')
                return false;
            this._dragZoneElem = event.target;
            var elem = this._elem = this._dragZoneElem.cloneNode(true);
            elem.className = 'avatar';
            // создать вспомогательные свойства shiftX/shiftY
            var coords = Lib.getCoords(this._dragZoneElem);
            this._shiftX = downX - coords.left;
            this._shiftY = downY - coords.top;
            // инициировать начало переноса
            document.body.appendChild(elem);
            elem.style.zIndex = '9999';
            elem.style.position = 'absolute';
            return true;
        };
        /**
         * Вспомогательный метод
         */
        TreeDragAvatar.prototype._destroy = function () {
            this._elem.parentNode.removeChild(this._elem);
        };
        /**
         * При любом исходе переноса элемент-клон больше не нужен
         */
        TreeDragAvatar.prototype.onDragCancel = function () {
            this._destroy();
        };
        TreeDragAvatar.prototype.onDragEnd = function () {
            this._destroy();
        };
        return TreeDragAvatar;
    })(DragAndDrop.DragAvatar);
    TreeDragAndDrop.TreeDragAvatar = TreeDragAvatar;
})(TreeDragAndDrop || (TreeDragAndDrop = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragZone.ts" />
/// <reference path="TreeDragAndDrop.ts" />
/// <reference path="TreeDragAvatar.ts" />
var TreeDragAndDrop;
(function (TreeDragAndDrop) {
    var TreeDragZone = (function (_super) {
        __extends(TreeDragZone, _super);
        function TreeDragZone() {
            _super.apply(this, arguments);
        }
        TreeDragZone.prototype._makeAvatar = function () {
            return new TreeDragAndDrop.TreeDragAvatar(this, this._elem);
        };
        return TreeDragZone;
    })(DragAndDrop.DragZone);
    TreeDragAndDrop.TreeDragZone = TreeDragZone;
})(TreeDragAndDrop || (TreeDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../DragAndDrop/DropTarget.ts" />
/// <reference path="../DragAndDrop/DragAvatar.ts" />
/// <reference path="TreeDragAndDrop.ts" />
var TreeDragAndDrop;
(function (TreeDragAndDrop) {
    var TreeDropTarget = (function (_super) {
        __extends(TreeDropTarget, _super);
        function TreeDropTarget() {
            _super.apply(this, arguments);
        }
        TreeDropTarget.prototype._showHoverIndication = function () {
            this._targetElem && this._targetElem.classList.add('hover');
        };
        TreeDropTarget.prototype._hideHoverIndication = function () {
            this._targetElem && this._targetElem.classList.remove('hover');
        };
        TreeDropTarget.prototype._getTargetElem = function (avatar, event) {
            var target = avatar.getTargetElem();
            if (target.tagName != 'SPAN') {
                return;
            }
            // проверить, может быть перенос узла внутрь самого себя или в себя?
            var elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;
            var elem = target;
            while (elem) {
                if (elem == elemToMove)
                    return; // попытка перенести родителя в потомка
                elem = elem.parentElement;
            }
            return target;
        };
        TreeDropTarget.prototype.onDragEnd = function (avatar, event) {
            if (!this._targetElem) {
                // перенос закончился вне подходящей точки приземления
                avatar.onDragCancel();
                return;
            }
            this._hideHoverIndication();
            // получить информацию об объекте переноса
            var avatarInfo = avatar.getDragInfo(event);
            avatar.onDragEnd(); // аватар больше не нужен, перенос успешен
            // вставить элемент в детей в отсортированном порядке
            var elemToMove = avatarInfo.dragZoneElem.parentNode; // <LI>
            var title = avatarInfo.dragZoneElem.innerHTML; // переносимый заголовок
            // получить контейнер для узлов дерева, соответствующий точке преземления
            var ul = this._targetElem.parentElement.getElementsByTagName('UL')[0];
            if (!ul) {
                ul = document.createElement('UL');
                this._targetElem.parentNode.appendChild(ul);
            }
            // вставить новый узел в нужное место среди потомков, в алфавитном порядке
            var li = null;
            for (var i = 0; i < ul.children.length; i++) {
                li = ul.children[i];
                var childTitle = li.children[0].innerHTML;
                if (childTitle > title) {
                    break;
                }
            }
            ul.insertBefore(elemToMove, li);
            this._targetElem = null;
        };
        return TreeDropTarget;
    })(DragAndDrop.DropTarget);
    TreeDragAndDrop.TreeDropTarget = TreeDropTarget;
})(TreeDragAndDrop || (TreeDragAndDrop = {}));

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
/// <reference path="../DragAndDrop/DragAndDrop.ts" />
/// <reference path="TreeDragAndDrop.ts" />
/// <reference path="TreeDragZone.ts" />
/// <reference path="TreeDropTarget.ts" />
var TreeDragAndDrop;
(function (TreeDragAndDrop) {
    function Main(tree) {
        new TreeDragAndDrop.TreeDragZone(tree);
        new TreeDragAndDrop.TreeDropTarget(tree);
    }
    TreeDragAndDrop.Main = Main;
})(TreeDragAndDrop || (TreeDragAndDrop = {}));
