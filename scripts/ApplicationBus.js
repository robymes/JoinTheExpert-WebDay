this.webapp = (function (webapp) {
    var ctor = function () {
        var self = this;

        self.newToDoItemAdded = new Bacon.Bus();
    };
    webapp.ApplicationBus = function () {
        return new ctor();
    };
    return webapp;
}(this.webapp || {}));