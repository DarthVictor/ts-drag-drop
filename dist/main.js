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

function getElementUnderClientXY(elem, clientX, clientY) {
    var display = elem.style.display || '';
    elem.style.display = 'none';

    var target = document.elementFromPoint(clientX, clientY);

    elem.style.display = display;

    if (!target || target == document) { // ��� ������ ��� ������ �� ������� ����
        target = document.body; // ��������� ��������, ����� ��� ������ �������
    }

    return target;
}

function extend(Child, Parent) {
    function F() {}
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.parent = Parent.prototype
}
/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
function DragAvatar(dragZone, dragElem) {
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
DragAvatar.prototype.initFromEvent = function (downX, downY, event) {
    /* override */
};
/**
 * Возвращает информацию о переносимом элементе для DropTarget
 * @param event
 */
DragAvatar.prototype.getDragInfo = function (event) {
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
    this._currentTargetElem = getElementUnderClientXY(this._elem, event.clientX, event.clientY);
};
/**
 * Действия с аватаром, когда перенос не удался
 * Например, можно вернуть элемент обратно или уничтожить
 */
DragAvatar.prototype.onDragCancel = function () {
    /* override */
};
/**
 * Действия с аватаром после успешного переноса
 */
DragAvatar.prototype.onDragEnd = function () {
    /* override */
};

/**
 * Created by DarthVictor on 27.06.2015.
 * https://learn.javascript.ru/drag-and-drop-plus
 */
var dragManager = new function () {
    var dragZone, avatar, dropTarget;
    var downX, downY;
    var self = this;
    function onMouseDown(e) {
        if (e.which != 1) {
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
        if (!dragZone)
            return; // элемент не зажат
        if (!avatar) {
            if (Math.abs(e.pageX - downX) < 3 && Math.abs(e.pageY - downY) < 3) {
                return;
            }
            // попробовать захватить элемент
            avatar = dragZone.onDragStart(downX, downY, e);
            if (!avatar) {
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
        if (e.which != 1) {
            return false;
        }
        if (avatar) {
            if (dropTarget) {
                // завершить перенос и избавиться от аватара, если это нужно
                // эта функция обязана вызвать avatar.onDragEnd/onDragCancel
                dropTarget.onDragEnd(avatar, e);
            }
            else {
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
    document.ondragstart = function () {
        return false;
    };
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;
};

/**
 * Зона, из которой можно переносить объекты
 * Умеет обрабатывать начало переноса на себе и создавать "аватар"
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
    /* override */
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
        return false;
    }
    return avatar;
};

/**
 * Зона, в которую объекты можно класть
 * Занимается индикацией передвижения по себе, добавлением в себя
 */
function DropTarget(elem) {
    elem.dropTarget = this;
    this._elem = elem;
    /**
     * Подэлемент, над которым в настоящий момент находится аватар
     */
    this._targetElem = null;
}
/**
 * Возвращает DOM-подэлемент, над которым сейчас пролетает аватар
 *
 * @return DOM-элемент, на который можно положить или undefined
 */
DropTarget.prototype._getTargetElem = function (avatar, event) {
    return this._elem;
};
/**
 * Спрятать индикацию переноса
 * Вызывается, когда аватар уходит с текущего this._targetElem
 */
DropTarget.prototype._hideHoverIndication = function (avatar) {
    /* override */
};
/**
 * Показать индикацию переноса
 * Вызывается, когда аватар пришел на новый this._targetElem
 */
DropTarget.prototype._showHoverIndication = function (avatar) {
    /* override */
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

var TypescriptDragDrop;
(function (TypescriptDragDrop) {
    var HelloWorld = (function () {
        function HelloWorld() {
            alert('Hello World');
        }
        return HelloWorld;
    })();
    TypescriptDragDrop.HelloWorld = HelloWorld;
})(TypescriptDragDrop || (TypescriptDragDrop = {}));

function TreeDragAvatar(dragZone, dragElem) {
    DragAvatar.apply(this, arguments);
}
extend(TreeDragAvatar, DragAvatar);
TreeDragAvatar.prototype.initFromEvent = function (downX, downY, event) {
    if (event.target.tagName != 'SPAN')
        return false;
    this._dragZoneElem = event.target;
    var elem = this._elem = this._dragZoneElem.cloneNode(true);
    elem.className = 'avatar';
    // создать вспомогательные свойства shiftX/shiftY
    var coords = getCoords(this._dragZoneElem);
    this._shiftX = downX - coords.left;
    this._shiftY = downY - coords.top;
    // инициировать начало переноса
    document.body.appendChild(elem);
    elem.style.zIndex = 9999;
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

function TreeDragZone(elem) {
    DragZone.apply(this, arguments);
}
extend(TreeDragZone, DragZone);
TreeDragZone.prototype._makeAvatar = function () {
    return new TreeDragAvatar(this, this._elem);
};

function TreeDropTarget(elem) {
    DropTarget.prototype.constructor.apply(this, arguments);
}
extend(TreeDropTarget, DropTarget);
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
        elem = elem.parentNode;
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
    var ul = this._targetElem.parentNode.getElementsByTagName('UL')[0];
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
