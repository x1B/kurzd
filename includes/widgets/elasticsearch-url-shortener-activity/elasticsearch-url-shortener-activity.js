define(['exports', 'module'], function (exports, module) {
   'use strict';

   var injections = ['axEventBus', 'axFeatures'];

   function create(eventBus, features) {

      eventBus.subscribe('takeActionRequest.' + features.shorten.action, function (_ref) {
         var url = _ref.data.url;

         // simulate HTTP request:
         window.setTimeout(function () {
            eventBus.publish('didReplace.' + features.result.resource, {
               resource: features.result.resource,
               data: { url: url, shortUrl: 'http://www.example.com/abcdefg' }
            });
         }, 1000);
      });
   }

   module.exports = {
      name: 'elasticsearch-url-shortener-activity',
      injections: injections,
      create: create
   };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsYXN0aWNzZWFyY2gtdXJsLXNob3J0ZW5lci1hY3Rpdml0eS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsT0FBTSxVQUFVLEdBQUcsQ0FBRSxZQUFZLEVBQUUsWUFBWSxDQUFFLENBQUM7O0FBRWxELFlBQVMsTUFBTSxDQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUc7O0FBRW5DLGNBQVEsQ0FBQyxTQUFTLENBQUUsb0JBQW9CLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFpQixFQUFLO2FBQVosR0FBRyxHQUFiLElBQWlCLENBQWYsSUFBSSxDQUFJLEdBQUc7OztBQUUvRSxlQUFNLENBQUMsVUFBVSxDQUFFLFlBQU07QUFDdEIsb0JBQVEsQ0FBQyxPQUFPLENBQUUsYUFBYSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQ3pELHVCQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRO0FBQ2xDLG1CQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLFFBQVEsRUFBRSxnQ0FBZ0MsRUFBRTthQUMzRCxDQUFFLENBQUM7VUFDTixFQUFFLElBQUksQ0FBRSxDQUFDO09BQ1osQ0FBRSxDQUFDO0lBRU47O29CQUVjO0FBQ1osVUFBSSxFQUFFLHNDQUFzQztBQUM1QyxnQkFBVSxFQUFFLFVBQVU7QUFDdEIsWUFBTSxFQUFFLE1BQU07SUFDaEIiLCJmaWxlIjoiZWxhc3RpY3NlYXJjaC11cmwtc2hvcnRlbmVyLWFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGluamVjdGlvbnMgPSBbICdheEV2ZW50QnVzJywgJ2F4RmVhdHVyZXMnIF07XG5cbmZ1bmN0aW9uIGNyZWF0ZSggZXZlbnRCdXMsIGZlYXR1cmVzICkge1xuXG4gICBldmVudEJ1cy5zdWJzY3JpYmUoICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMuc2hvcnRlbi5hY3Rpb24sICh7IGRhdGE6IHsgdXJsIH0gfSkgPT4ge1xuICAgICAgLy8gc2ltdWxhdGUgSFRUUCByZXF1ZXN0OlxuICAgICAgd2luZG93LnNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICdkaWRSZXBsYWNlLicgKyBmZWF0dXJlcy5yZXN1bHQucmVzb3VyY2UsIHtcbiAgICAgICAgICAgIHJlc291cmNlOiBmZWF0dXJlcy5yZXN1bHQucmVzb3VyY2UsXG4gICAgICAgICAgICBkYXRhOiB7IHVybCwgc2hvcnRVcmw6ICdodHRwOi8vd3d3LmV4YW1wbGUuY29tL2FiY2RlZmcnIH1cbiAgICAgICAgIH0gKTtcbiAgICAgIH0sIDEwMDAgKTtcbiAgIH0gKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICBuYW1lOiAnZWxhc3RpY3NlYXJjaC11cmwtc2hvcnRlbmVyLWFjdGl2aXR5JyxcbiAgIGluamVjdGlvbnM6IGluamVjdGlvbnMsXG4gICBjcmVhdGU6IGNyZWF0ZVxufTtcbiJdfQ==