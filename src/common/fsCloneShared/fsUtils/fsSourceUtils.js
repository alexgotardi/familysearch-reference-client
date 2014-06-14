(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsSourceUtils', function (fsApi, fsUtils, fsCreateSourceModal, fsConfirmationModal,
                                        fsAttachSourceConfirmationModal, fsDetachSourceConfirmationModal) {
      return {
        attachSource: function(description, context) {
          console.log('attach source', description, context);
          return fsAttachSourceConfirmationModal.open(context).then(function(changeMessage) {
            var sourceRef = new fsApi.SourceRef({
              $personId: context.person ? context.person.id : '',
              $coupleId: context.couple ? context.couple.id : '',
              $childAndParentsId: context.parents ? context.parents.id : '',
              sourceDescription: description.id
            });
            console.log('attach source ref', sourceRef);
            return sourceRef.$save(changeMessage).then(function (sourceRefId) {
              sourceRef.id = sourceRefId;
              // we can't refresh sourceRefs unfortunately, so attempt to approximate new attribution
              fsUtils.approximateAttribution(sourceRef);
              return sourceRef;
            });
          });
        },

        detachSource: function(context) {
          return fsDetachSourceConfirmationModal.open(context).then(function(changeMessage) {
            return context.sourceRef.$delete(changeMessage);
          });
        },

        createSource: function(form) {
          return fsCreateSourceModal.open(form).then(function(form) {
            var sourceDescription = new fsApi.SourceDescription(fsUtils.removeEmptyProperties({
              about: form.url,
              citation: form.citation,
              title: form.title,
              text: form.notes
            }));
            return sourceDescription.$save(null, true).then(function() {
              return sourceDescription;
            });
          });
        },

        deleteSource: function(description) {
          return fsConfirmationModal.open({
            title: 'Delete Source',
            subTitle: 'Are you sure that you want to delete this source? ' +
              'Not only will it be detached from all of the individuals that use it, but it will also be deleted from the system.',
            okLabel: 'Yes'
          }).then(function() {
            return description.$delete();
          });
        }

      };
    });
})();
