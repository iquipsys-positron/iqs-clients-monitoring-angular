interface IOperationalEventAddPanelBindings {
    [key: string]: any;

    selectedItem: any;
    collection: any;
}

const OperationalEventAddPanelBindings: IOperationalEventAddPanelBindings = {
    selectedItem: '&iqsSelectedItem',
    collection: '<?iqsEventTemplates'
}

class OperationalEventAddPanelChanges implements ng.IOnChangesObject, IOperationalEventAddPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    selectedItem: ng.IChangesObject<() => ng.IPromise<void>>;
    collection: ng.IChangesObject<iqs.shell.EventTemplate[]>;
}

class OperationalEventAddPanelController implements ng.IController {          public $onInit() {}
    public selectedItem: (params: any) => void;
    public collection: iqs.shell.EventTemplate[];

    constructor(
        private $element: JQuery
    ) {
        "ngInject";
        
        $element.addClass('iqs-operational-event-add-panel');
    }
    
    public $onChanges(changes: OperationalEventAddPanelChanges): void {
        if (changes.collection && changes.collection.previousValue) {
            if (!_.isEqual(this.collection, changes.collection.previousValue)) {
                this.collection = changes.collection.currentValue;
            }
        }
    }

    public selectItem(item: iqs.shell.EventTemplate): void {
        if (this.selectedItem) {
            this.selectedItem({
                item: item
            });
        }
    }


}

(() => {
    angular
        .module('iqsOperationalEventAddPanel', ['pipSelected'])
        .component('iqsOperationalEventAddPanel', {
            bindings: OperationalEventAddPanelBindings,
            templateUrl: 'monitoring/events/panels/OperationalEventAddPanel.html',
            controller: OperationalEventAddPanelController,
            controllerAs: '$ctrl'
        })
})();
