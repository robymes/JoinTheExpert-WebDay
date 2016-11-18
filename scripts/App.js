this.webapp = (function (webapp) {
    jQuery(document).ready(function () {
        var apiService = webapp.ApiService(),
            viewModel = {
                toDoList: webapp.ToDoListViewModel(apiService)
            };
        ko.applyBindings(viewModel);
        viewModel.toDoList.init();
    });
    return webapp;
}(this.webapp || {}));