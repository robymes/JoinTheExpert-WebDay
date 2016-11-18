this.webapp = (function (webapp) {
    var ctor = function () {
        var self = this;
        self.loadTodoItems = function () {
            var items =
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
            return jQuery.ajax(items);
        };
    };
    webapp.ApiService = function () {
        return new ctor();
    };
    return webapp;
}(this.webapp || {}));