describe("Dato il viewmodel della lista di item", function () {
    var apiService,
        applicationBus,
        toDoListViewModel;

    beforeEach(function () {
        apiService = webapp.ApiService();
        applicationBus = webapp.ApplicationBus();
        toDoListViewModel = webapp.ToDoListViewModel(apiService, applicationBus);
    });

    it("quando creato, non contiene elementi", function () {
        expect(toDoListViewModel.items().length).toEqual(0);
    });

    it("quando inizializzato, contiene più di un elemento", function (done) {
        toDoListViewModel.init();
        setTimeout(function () {
            expect(toDoListViewModel.items().length).toBeGreaterThan(0);
            done();
        }, 1000);
    });

});