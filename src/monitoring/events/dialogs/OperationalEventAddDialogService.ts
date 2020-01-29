import { IOperationalEventAddDialogService, OperationalEventAddDialogParams } from './IOperationalEventAddDialogService';

class OperationalEventAddDialogService implements IOperationalEventAddDialogService {
    public _mdDialog: angular.material.IDialogService;

    public constructor($mdDialog: angular.material.IDialogService) {
        "ngInject";
        
        this._mdDialog = $mdDialog;
    }


    public show(event, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        let params: OperationalEventAddDialogParams = {
            event: event
        }
        this._mdDialog.show({
            templateUrl: 'monitoring/events/dialogs/OperationalEventAddDialog.html',
            controller: 'iqsOperationalEventAddDialogController',
            controllerAs: '$ctrl',
            targetEvent: event,
            bindToController: true,
            locals: params,
            clickOutsideToClose: true
        })
            .then(
                (data?: any) => {
                    if (successCallback) {
                        successCallback(data);
                    }
                },
                () => {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            );
    }

}

angular
    .module('iqsOperationalEventAddDialog')
    .service('iqsOperationalEventAddDialog', OperationalEventAddDialogService);