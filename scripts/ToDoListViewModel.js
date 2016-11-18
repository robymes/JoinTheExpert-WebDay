this.webapp = (function (webapp) {
    var ctor = function (apiService) {
        var self = this;
        self.items = ko.observableArray([]);
        self.errorMessage = ko.observable("");

        self.init = function () {
            self.errorMessage("");
            apiService.loadTodoItems()
                .then(function (items) {
                    self.items.removeAll();
                    self.items(items);
                })
                .fail(function (error) {
                    self.errorMessage("WARNING: an error has occurred loading items");
                });
        };
    };
    webapp.ToDoListViewModel = function (apiService) {
        return new ctor(apiService);
    };
    return webapp;
}(this.webapp || {}));