'use strict';

angular.module('mms')
.directive('mmsTranscludeDoc', ['ElementService', '$compile', '$modal', mmsTranscludeDoc]);

function mmsTranscludeDoc(ElementService, $compile, $modal) {

    var mmsTranscludeDocLink = function(scope, element, attrs, mmsViewCtrl) {
        var modalTemplate = '<div class="modal-header"><h3>Element</h3></div>';
        if (mmsViewCtrl === undefined || mmsViewCtrl === null)
            modalTemplate += '<div class="modal-body"><mms-spec eid="{{eid}}" editable-field="documentation"></mms-spec></div>';
        else 
            modalTemplate += '<div class="modal-body"><mms-spec eid="{{eid}}" editable-field="documentation" transcludable-elements="viewElements"></mms-spec></div>';
        modalTemplate += '<div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Close</button></div>';

        element.click(function(e) {
            if (mmsViewCtrl === null || mmsViewCtrl === undefined || !mmsViewCtrl.isEditable())
                return false;
            mmsViewCtrl.getViewAllowedElements().then(function(elems) {
                    scope.viewElements = elems;
            });
            $modal.open({
                template: modalTemplate,
                scope: scope,
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                    $scope.close = function() {
                        $modalInstance.close(true);
                    };
                }]
            });
            //e.stopPropagation();
            return false;
        });

        scope.$watch('eid', function(newVal, oldVal) {
            if (newVal === undefined || newVal === null || newVal === '')
                return;
            ElementService.getElement(scope.eid).then(function(data) {
                scope.element = data;
                var doc = scope.element.documentation;
                var el = $compile(doc)(scope);
                element.append(el);
                scope.$watch('element.documentation', function(n, o) {
                    element.empty();
                    doc = scope.element.documentation;
                    var el = $compile(doc)(scope);
                    element.append(el);
                });
            });
        });
    };

    return {
        restrict: 'E',
        scope: {
            eid: '@',
        },
        require: '?^mmsView',
        //controller: ['$scope', controller]
        link: mmsTranscludeDocLink
    };
}