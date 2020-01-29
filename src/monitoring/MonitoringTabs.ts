class MonitoringTab {
    title: string;
    state: string;
}

class MonitoringTabs {
    static all: MonitoringTab[] = [
        { title: 'MAP', state: 'app.map' },
        { title: 'EVENTS', state: 'app.events' },
        { title: 'OBJECTS', state: 'app.objects' }
    ];
}

export class MonitoringTabsController implements ng.IController {
    public $onInit() { }
    private _tab: MonitoringTab;
    private _timeout;
    private tabStateName: string = 'app';

    public tabs: any;
    public tabIndex: number;
    public onSelect: any;
    public pipMedia: pip.layouts.IMediaService;
    public hideTab: boolean = true;

    constructor(
        private $state: angular.ui.IStateService,
        $scope: ng.IScope,
        $timeout: any,
        pipMedia: pip.layouts.IMediaService,
        private iqsTabState: iqs.shell.ITabStateService
    ) {
        "ngInject";

        this.tabs = _.cloneDeep(MonitoringTabs.all);
        this.pipMedia = pipMedia;
        this._timeout = $timeout;

        this.calcTabIndex();
        this.onSelect = (item) => {
            this.tabIndex = _.findIndex(this.tabs, { title: item.title });

            if (this.tabIndex > -1) {
                this._tab = this.tabs[this.tabIndex];
                this.iqsTabState.set(this.tabStateName, this._tab.state);
                this.$state.go(this.tabs[this.tabIndex].state);
            }
        };

        $scope.$on('bbTabChange', ($event, arg) => {
            if (arg && arg.state) {
                // todo add bind and watch to tabs
                this.tabIndex = null;
                this.hideTab = true;
                this._timeout(() => {
                    this.tabIndex = _.findIndex(this.tabs, { state: arg.state });
                    if (this.tabIndex == -1) {
                        this.tabIndex = 0;
                    }
                    this.hideTab = false;
                    this._tab = this.tabs[this.tabIndex];
                    this.iqsTabState.set(this.tabStateName, this._tab.state);
                }, 10);

            }
            if (arg && arg.hide) {
                this.hideTab = arg.hide;
            }
        });
    }

    private getTabsWithAccess(tabs) {
        let tabsWithAccess = [];
        _.each(tabs, (tab) => {
            tabsWithAccess.push(tab);

        });

        return tabsWithAccess;
    }

    private calcTabIndex() {
        let stateName: string = this.iqsTabState.get(this.tabStateName);
        if (!stateName) {
            stateName = this.$state.current.name;
        }
        this.tabIndex = _.findIndex(this.tabs, { state: stateName });
        this._tab = this.tabs[this.tabIndex];
    }

    public showTabs(): boolean {
        return true;
    }

}

angular.module('iqsMonitoring')
    .controller('iqsMonitoringTabsController', MonitoringTabsController);