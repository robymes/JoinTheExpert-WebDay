//redefinition fake ajax
jQuery.ajax = function (response) {
    var deferred = jQuery.Deferred().resolve(response);
    return deferred.promise();
};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().datepickerOptions || {
                language: "it",
                format: "dd/mm/yyyy",
                startDate: moment().add(1, "d").toDate(),
                clearBtn: true,
                todayBtn: "linked",
                autoclose: true,
                todayHighlight: true
            },
            initialMoment = valueAccessor();
        $(element).datepicker(options);
        $(element).datepicker("setDate", initialMoment().toDate());
        ko.utils.registerEventHandler(element, "changeDate", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(moment(event.date));
            }
        });
        ko.utils.registerEventHandler(element, "clearDate", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(null);
            }
        });
    },
    update: function (element, valueAccessor) {
        var widget = $(element).data("datepicker"),
            val;
        if (widget) {
            val = ko.utils.unwrapObservable(valueAccessor());
            widget.date = val ? val.toDate() : null;
            widget.setValue();
        }
    }
};
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
this.webapp = (function (webapp) {
    var ctor = function () {
        var self = this,
            fakeItems =
                Enumerable.cycle({
                    title: "Star Wars Rogue One",
                    description: "Hype!",
                    dueDate: moment()
                })
                .take(1)
                .union(
                    Enumerable.cycle({
                        title: "Todo ",
                        description: "This is the Todo #",
                        dueDate: moment()
                    })
                    .take(5)
                    .select(function (item, i) {
                        var index = i += 1;
                        return {
                            title: item.title + index,
                            description: item.description + index,
                            dueDate: item.dueDate
                        };
                    })
                )
                .toArray();

        self.loadTodoItems = function () {
            var result = [];
            Enumerable.from(fakeItems)
                .forEach(function (item) {
                    result.push(item);
                });
            return jQuery.ajax(result);
        };

        self.insertNewToDoItem = function (newToDoItem) {
            fakeItems.push(newToDoItem);
            return jQuery.ajax(true);
        };
    };
    webapp.ApiService = function () {
        return new ctor();
    };
    return webapp;
}(this.webapp || {}));
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
this.webapp = (function (webapp) {
    jQuery(document).ready(function () {
        var apiService = webapp.ApiService(),
            applicationBus = webapp.ApplicationBus(),
            viewModel = {
                toDoList: webapp.ToDoListViewModel(apiService, applicationBus),
                newToDoItem: webapp.NewToDoItemViewModel(apiService, applicationBus)
            };
        ko.applyBindings(viewModel);
        viewModel.toDoList.init();
    });
    return webapp;
}(this.webapp || {}));