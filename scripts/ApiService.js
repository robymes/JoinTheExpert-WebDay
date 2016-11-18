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