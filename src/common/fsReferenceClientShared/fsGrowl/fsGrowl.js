(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .config(function(growlProvider) {
      growlProvider.onlyUniqueMessages(true);
      growlProvider.globalTimeToLive({success: 15000, error: null, warning: null, info: 15000});
    })

    .directive('fsGrowl', function(_, $rootScope, growl) {
      return {
        templateUrl: 'fsReferenceClientShared/fsGrowl/fsGrowl.tpl.html',
        link: function(scope) {

          var unbind = $rootScope.$on('alert', function(event, message) {
            if (_.isString(message)) {
              message = {
                text: message
              };
            }
            if (message.level === 'warning') {
              growl.warning(message.text);
            }
            else if (message.level === 'error') {
              growl.error(message.text);
            }
            else if (message.level === 'success') {
              growl.success(message.text);
            }
            else {
              growl.info(message.text);
            }
          });

          scope.$on('$destroy', unbind);
        }
      };
    });
})();