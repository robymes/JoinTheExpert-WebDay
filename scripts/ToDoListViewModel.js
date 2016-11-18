this.webapp = (function (webapp) {
    var ctor = function (apiService, applicationBus) {
        var self = this,
            loadItems;

        self.items = ko.observableArray([]);
        self.errorMessage = ko.observable("");

        loadItems = function () {
            apiService.loadTodoItems()
                .then(function (items) {
                    self.items.removeAll();
                    self.items(items);
                })
                .fail(function (error) {
                    self.errorMessage("WARNING: an error has occurred loading items");
                });
        };

        applicationBus.newToDoItemAdded
            .onValue(function () {
                loadItems();
            });

        applicationBus.newToDoItemAdded
            .onError(function (error) {
                self.errorMessage(error.message);
            });

        self.init = function () {
            self.errorMessage("");
            loadItems();
        };
    };
    webapp.ToDoListViewModel = function (apiService, applicationBus) {
        return new ctor(apiService, applicationBus);
    };
    return webapp;
}(this.webapp || {}));