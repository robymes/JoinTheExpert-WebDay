this.webapp = (function (webapp) {
    var ctor = function (apiService, applicationBus) {
        var self = this;

        self.title = ko.observable("");
        self.description = ko.observable("");
        self.dueDate = ko.observable(moment().add(1, "d"));

        self.incorrectDueDate = ko.computed(function () {
            if (!this.dueDate()) {
                return true;
            }
            return !(this.dueDate().isValid() && (this.dueDate() > moment()));
        }, self);

        self.canInsertNewItem = ko.computed(function () {
            return this.title() &&
                this.description() &&
                !this.incorrectDueDate();
        }, self);

        self.insertNewItem = function () {
            var newItem = {
                title: self.title(),
                description: self.description(),
                dueDate: self.dueDate()
            };
            apiService.insertNewToDoItem(newItem)
                .done(function (result) {
                    if (result) {
                        self.title("");
                        self.description("");
                        self.dueDate(moment().add(1, "d"));
                        applicationBus.newToDoItemAdded.push(true);
                    } else {
                        applicationBus.newToDoItemAdded.error(new Bacon.Error("Error inserting a new ToDo item"));
                    }
                })
                .fail(function () {
                    applicationBus.newToDoItemAdded.error(new Bacon.Error("Error inserting a new ToDo item"));
                });
        };
    };
    webapp.NewToDoItemViewModel = function (apiService, applicationBus) {
        return new ctor(apiService, applicationBus);
    };
    return webapp;
}(this.webapp || {}));