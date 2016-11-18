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