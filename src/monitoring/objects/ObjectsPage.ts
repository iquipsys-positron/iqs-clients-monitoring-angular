export const MonitoringObjectsStateName: string = 'app.objects';

class MonitoringObjectsController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    constructor(
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private pipMedia: pip.layouts.IMediaService,
        $injector: angular.auto.IInjectorService,
        private $location: ng.ILocationService,
        private pipNavService: pip.nav.INavService
    ) {
        "ngInject";

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));
        this.cf.push(this.$rootScope.$on('pipMainResized', () => {
            this.changeAppBar();
        }));

        this.cf.push(this.$rootScope.$on('iqsChangeNav', () => {
            this.changeAppBar();
        }));
        $scope.$on('$destroy', () => {
            for (const f of this.cf) { f(); }
        });
    }

    private appHeader(): void {

        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();

        this.changeAppBar();
    }

    private toMainFromDetails() {
        this.$location.search('details', 'main');
        this.$rootScope.$broadcast('iqsChangeNavPage');
        this.changeAppBar();
    }

    public changeAppBar() {
        this.pipNavService.breadcrumb.items = [
            <pip.nav.BreadcrumbItem>{ title: "MONITORING", click: () => { this.$state.go("app.map"); } },
            <pip.nav.BreadcrumbItem>{ title: "MONITORING_OBJECTS", click: () => { } }
        ];
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';

        if (!this.pipMedia('gt-sm')) {
            if (this.$location.search().details == 'details') {

                this.pipNavService.breadcrumb.items = [
                    <pip.nav.BreadcrumbItem>{ title: "MONITORING", click: () => { this.$state.go("app.map"); } },
                    <pip.nav.BreadcrumbItem>{
                        title: "MONITORING_OBJECTS", click: () => {
                            this.toMainFromDetails();
                        }
                    },
                    <pip.nav.BreadcrumbItem>{
                        title: "MONITORING_OBJECTS_DETAILS", click: () => {

                        }
                    }
                ];
                this.pipNavService.icon.showBack(() => {
                    this.toMainFromDetails();
                });
            } else {
                this.pipNavService.icon.showBack(() => {
                    this.$state.go("app.map");
                });
            }

        }
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureMonitoringObjectsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider

        .state(MonitoringObjectsStateName, {
            url: '/objects?type&curr_object_id&section&details',
            auth: true,
            reloadOnSearch: false,
            views: {
                '@': {
                    controller: MonitoringObjectsController,
                    controllerAs: '$ctrl',
                    reloadOnSearch: false,
                    templateUrl: "monitoring/objects/ObjectsPage.html"
                }
            }

        })
}

function configureMonitoringObjectsAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {
        objectEdit: iqs.shell.AccessRole.manager,
        changeDevice: iqs.shell.AccessRole.manager,
        detachDevice: iqs.shell.AccessRole.manager,
        goToDevice: iqs.shell.AccessRole.user,
        editDevice: iqs.shell.AccessRole.admin
    }
    iqsAccessConfigProvider.registerStateAccess(MonitoringObjectsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(MonitoringObjectsStateName, accessConfig);
}

(() => {

    const translateConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            "MONITORING_OBJECTS": 'Objects',
            'MONITORING_EMPTY': 'There are no objects found on the organization',
            'INFORMATION': "Information",
            "LOCATION": 'Location',
            "EVENTS": 'Events',
            "ASSINE": 'Assign',
            'UNKNOWN_OBJECT': 'Unknown tracker',
            'MONITORING_OBJECTS_DETAILS': 'Object',
            LOADING_OBJECTS: 'Loading objects'
        });

        pipTranslateProvider.translations('ru', {
            "MONITORING_OBJECTS": 'Объекты',
            'MONITORING_EMPTY': 'Наблюдаемых объектов на рабочей площадке не найдено',
            'INFORMATION': "Информация",
            'LOCATION': 'Позиция',
            'EVENTS': 'События',
            "ASSINE": 'Прикрепить',
            'UNKNOWN_OBJECT': "Неизвестный трекер",
            'MONITORING_OBJECTS_DETAILS': 'Объект',
            LOADING_OBJECTS: 'Загрузка объектов'
        });
    }
    angular
        .module('iqsMonitoring.Objects', [
            'iqsMonitoring.Objects.MapPanel',
            'iqsMonitoring.Objects.EventsPanel',
            'iqsMonitoring.Objects.InformationPanel',
            'iqsMonitoring.Objects.Panel'
        ])
        .config(configureMonitoringObjectsRoute)
        .config(translateConfig)
        .config(configureMonitoringObjectsAccess);
})();
