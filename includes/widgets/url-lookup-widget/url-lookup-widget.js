define(['exports', 'module', 'react', 'laxar'], function (exports, module, _react, _laxar) {
   /**
    * Copyright 2015 Michael Kurze
    * Released under the MIT license
    */
   'use strict';

   function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

   var _React = _interopRequireDefault(_react);

   var _ax = _interopRequireDefault(_laxar);

   var injections = ['axEventBus', 'axFeatures', 'axReactRender', 'axContext'];

   function create(eventBus, features, reactRender, context) {

      var model = {
         waiting: false,
         viewKey: '',
         submitKey: null,
         url: null
      };

      var lookup = _ax['default'].fn.debounce(lookupImmediately, 200);

      eventBus.subscribe('didReplace.' + features.result.resource, function (_ref) {
         var _ref$data = _ref.data;
         var url = _ref$data.url;
         var key = _ref$data.key;

         if (key !== model.submitKey) {
            // stale request
            return;
         }
         model.url = url;
         model.waiting = false;
         render();
      });

      return {
         onDomAvailable: render
      };

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function render() {
         reactRender(_React['default'].createElement(
            'div',
            null,
            renderForm(),
            renderResult()
         ));
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function renderForm() {
         var inputId = context.id('key');
         return _React['default'].createElement(
            'form',
            { className: 'jumbotron' },
            _React['default'].createElement(
               'h3',
               null,
               _React['default'].createElement(
                  'label',
                  { htmlFor: inputId },
                  _React['default'].createElement('i', { className: 'fa fa-search' }),
                  ' Enter a short-key to lookup'
               )
            ),
            _React['default'].createElement(
               'div',
               { className: 'form-group' },
               _React['default'].createElement('input', { type: 'text', className: 'form-control url-shortener-input', id: inputId,
                  placeholder: 'e.g. abc123', onChange: updateKey, value: model.viewKey })
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function renderResult() {
         var resultClasses = {
            waiting: model.waiting,
            hidden: !(model.waiting || model.shortUrl),
            'url-shortener-result-ok': model.shortUrl,
            jumbotron: true
         };

         var resultStatus = model.waiting ? '…looking up…' : 'Long URL for key "' + model.submitUrl + '"';
         var result = model.waiting ? _React['default'].createElement('i', { className: 'fa fa-spinner' }) : _React['default'].createElement(
            'a',
            { href: model.shortUrl, title: resultStatus },
            model.shortUrl
         );

         return _React['default'].createElement(
            'div',
            { className: classList(resultClasses) },
            _React['default'].createElement(
               'h1',
               { className: 'text-center' },
               result
            ),
            _React['default'].createElement(
               'h3',
               { className: 'text-center' },
               resultStatus
            )
         );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function updateKey(ev) {
         model.viewKey = ev.target.value;
         lookup();
         render();
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function lookupImmediately() {
         model.submitKey = model.viewKey;
         eventBus.publish('takeActionRequest.' + features.lookup.action, {
            action: features.lookup.action,
            data: {
               key: model.submitKey
            }
         });
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      function classList(classSet) {
         return Object.keys(classSet).filter(function (_) {
            return !!classSet[_];
         }).join(' ');
      }
   }

   module.exports = {
      name: 'url-lookup-widget',
      injections: injections,
      create: create
   };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC1sb29rdXAtd2lkZ2V0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBT0EsT0FBTSxVQUFVLEdBQUcsQ0FBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUUsQ0FBQzs7QUFFaEYsWUFBUyxNQUFNLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFHOztBQUV6RCxVQUFNLEtBQUssR0FBRztBQUNYLGdCQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFPLEVBQUUsRUFBRTtBQUNYLGtCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUcsRUFBRSxJQUFJO09BQ1gsQ0FBQzs7QUFFRixVQUFNLE1BQU0sR0FBRyxlQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUUsaUJBQWlCLEVBQUUsR0FBRyxDQUFFLENBQUM7O0FBRXhELGNBQVEsQ0FBQyxTQUFTLENBQUUsYUFBYSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQUMsSUFBc0IsRUFBSzt5QkFBM0IsSUFBc0IsQ0FBcEIsSUFBSTthQUFJLEdBQUcsYUFBSCxHQUFHO2FBQUUsR0FBRyxhQUFILEdBQUc7O0FBQzlFLGFBQUksR0FBRyxLQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUc7O0FBRTNCLG1CQUFPO1VBQ1Q7QUFDRCxjQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNoQixjQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUN0QixlQUFNLEVBQUUsQ0FBQztPQUNYLENBQUUsQ0FBQzs7QUFFSixhQUFPO0FBQ0osdUJBQWMsRUFBRSxNQUFNO09BQ3hCLENBQUM7Ozs7QUFJRixlQUFTLE1BQU0sR0FBRztBQUNmLG9CQUFXLENBQ1I7OztZQUNJLFVBQVUsRUFBRTtZQUNaLFlBQVksRUFBRTtVQUNaLENBQ1IsQ0FBQztPQUNKOzs7O0FBSUQsZUFBUyxVQUFVLEdBQUc7QUFDbkIsYUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBRSxLQUFLLENBQUUsQ0FBQztBQUNwQyxnQkFBTzs7Y0FBTSxTQUFTLEVBQUMsV0FBVztZQUMvQjs7O2VBQUk7O29CQUFPLE9BQU8sRUFBRSxPQUFPLEFBQUM7a0JBQUMsdUNBQUcsU0FBUyxFQUFDLGNBQWMsR0FBRzs7Z0JBQW9DO2FBQUs7WUFDcEc7O2lCQUFLLFNBQVMsRUFBQyxZQUFZO2VBQ3hCLDJDQUFPLElBQUksRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLGtDQUFrQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEFBQUM7QUFDdEUsNkJBQVcsRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFFLFNBQVMsQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxBQUFDLEdBQUc7YUFDM0U7VUFDRixDQUFDO09BQ1Y7Ozs7QUFJRCxlQUFTLFlBQVksR0FBRztBQUNyQixhQUFNLGFBQWEsR0FBRztBQUNuQixtQkFBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO0FBQ3RCLGtCQUFNLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUEsQUFBRTtBQUMzQyxxQ0FBeUIsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN6QyxxQkFBUyxFQUFFLElBQUk7VUFDakIsQ0FBQzs7QUFFRixhQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxHQUMvQixjQUFjLEdBQ2Qsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDaEQsYUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FDekIsdUNBQUcsU0FBUyxFQUFDLGVBQWUsR0FBRyxHQUMvQjs7Y0FBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQUFBQyxFQUFDLEtBQUssRUFBRSxZQUFZLEFBQUM7WUFBRSxLQUFLLENBQUMsUUFBUTtVQUFLLENBQUM7O0FBRXRFLGdCQUFPOztjQUFLLFNBQVMsRUFBRSxTQUFTLENBQUUsYUFBYSxDQUFFLEFBQUM7WUFDL0M7O2lCQUFJLFNBQVMsRUFBQyxhQUFhO2VBQUUsTUFBTTthQUFNO1lBQ3pDOztpQkFBSSxTQUFTLEVBQUMsYUFBYTtlQUFFLFlBQVk7YUFBTTtVQUM1QyxDQUFDO09BQ1Q7Ozs7QUFJRCxlQUFTLFNBQVMsQ0FBRSxFQUFFLEVBQUc7QUFDdEIsY0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxlQUFNLEVBQUUsQ0FBQztBQUNULGVBQU0sRUFBRSxDQUFDO09BQ1g7Ozs7QUFJRCxlQUFTLGlCQUFpQixHQUFHO0FBQzFCLGNBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNoQyxpQkFBUSxDQUFDLE9BQU8sQ0FBRSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUM5RCxrQkFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTTtBQUM5QixnQkFBSSxFQUFFO0FBQ0gsa0JBQUcsRUFBRSxLQUFLLENBQUMsU0FBUzthQUN0QjtVQUNILENBQUUsQ0FBQztPQUNOOzs7O0FBSUQsZUFBUyxTQUFTLENBQUUsUUFBUSxFQUFHO0FBQzVCLGdCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLENBQUMsTUFBTSxDQUFFLFVBQUEsQ0FBQzttQkFBSSxDQUFDLENBQUMsUUFBUSxDQUFFLENBQUMsQ0FBRTtVQUFBLENBQUUsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7T0FDNUU7SUFDSDs7b0JBRWM7QUFDWixVQUFJLEVBQUUsbUJBQW1CO0FBQ3pCLGdCQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFNLEVBQUUsTUFBTTtJQUNoQiIsImZpbGUiOiJ1cmwtbG9va3VwLXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE1IE1pY2hhZWwgS3VyemVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF4IGZyb20gJ2xheGFyJztcblxuY29uc3QgaW5qZWN0aW9ucyA9IFsgJ2F4RXZlbnRCdXMnLCAnYXhGZWF0dXJlcycsICdheFJlYWN0UmVuZGVyJywgJ2F4Q29udGV4dCcgXTtcblxuZnVuY3Rpb24gY3JlYXRlKCBldmVudEJ1cywgZmVhdHVyZXMsIHJlYWN0UmVuZGVyLCBjb250ZXh0ICkge1xuXG4gICBjb25zdCBtb2RlbCA9IHtcbiAgICAgIHdhaXRpbmc6IGZhbHNlLFxuICAgICAgdmlld0tleTogJycsXG4gICAgICBzdWJtaXRLZXk6IG51bGwsXG4gICAgICB1cmw6IG51bGxcbiAgIH07XG5cbiAgIGNvbnN0IGxvb2t1cCA9IGF4LmZuLmRlYm91bmNlKCBsb29rdXBJbW1lZGlhdGVseSwgMjAwICk7XG5cbiAgIGV2ZW50QnVzLnN1YnNjcmliZSggJ2RpZFJlcGxhY2UuJyArIGZlYXR1cmVzLnJlc3VsdC5yZXNvdXJjZSwgKHsgZGF0YTogeyB1cmwsIGtleSB9IH0pID0+IHtcbiAgICAgIGlmKCBrZXkgIT09IG1vZGVsLnN1Ym1pdEtleSApIHtcbiAgICAgICAgIC8vIHN0YWxlIHJlcXVlc3RcbiAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vZGVsLnVybCA9IHVybDtcbiAgICAgIG1vZGVsLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgIHJlbmRlcigpO1xuICAgfSApO1xuXG4gICByZXR1cm4ge1xuICAgICAgb25Eb21BdmFpbGFibGU6IHJlbmRlclxuICAgfTtcblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgcmVhY3RSZW5kZXIoXG4gICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3JlbmRlckZvcm0oKX1cbiAgICAgICAgICAgIHtyZW5kZXJSZXN1bHQoKX1cbiAgICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyRm9ybSgpIHtcbiAgICAgIGNvbnN0IGlucHV0SWQgPSBjb250ZXh0LmlkKCAna2V5JyApO1xuICAgICAgcmV0dXJuIDxmb3JtIGNsYXNzTmFtZT0nanVtYm90cm9uJz5cbiAgICAgICAgIDxoMz48bGFiZWwgaHRtbEZvcj17aW5wdXRJZH0+PGkgY2xhc3NOYW1lPSdmYSBmYS1zZWFyY2gnIC8+IEVudGVyIGEgc2hvcnQta2V5IHRvIGxvb2t1cDwvbGFiZWw+PC9oMz5cbiAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmb3JtLWdyb3VwJz5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyAgY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wgdXJsLXNob3J0ZW5lci1pbnB1dCcgaWQ9e2lucHV0SWR9XG4gICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2UuZy4gYWJjMTIzJyBvbkNoYW5nZT17dXBkYXRlS2V5fSB2YWx1ZT17bW9kZWwudmlld0tleX0gLz5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPjtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gcmVuZGVyUmVzdWx0KCkge1xuICAgICAgY29uc3QgcmVzdWx0Q2xhc3NlcyA9IHtcbiAgICAgICAgIHdhaXRpbmc6IG1vZGVsLndhaXRpbmcsXG4gICAgICAgICBoaWRkZW46ICEobW9kZWwud2FpdGluZyB8fCBtb2RlbC5zaG9ydFVybCApLFxuICAgICAgICAgJ3VybC1zaG9ydGVuZXItcmVzdWx0LW9rJzogbW9kZWwuc2hvcnRVcmwsXG4gICAgICAgICBqdW1ib3Ryb246IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJlc3VsdFN0YXR1cyA9IG1vZGVsLndhaXRpbmcgP1xuICAgICAgICAgJ+KApmxvb2tpbmcgdXDigKYnIDpcbiAgICAgICAgICdMb25nIFVSTCBmb3Iga2V5IFwiJyArIG1vZGVsLnN1Ym1pdFVybCArICdcIic7XG4gICAgICBjb25zdCByZXN1bHQgPSBtb2RlbC53YWl0aW5nID9cbiAgICAgICAgIDxpIGNsYXNzTmFtZT0nZmEgZmEtc3Bpbm5lcicgLz4gOlxuICAgICAgICAgPGEgaHJlZj17bW9kZWwuc2hvcnRVcmx9IHRpdGxlPXtyZXN1bHRTdGF0dXN9Pnttb2RlbC5zaG9ydFVybH08L2E+O1xuXG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2NsYXNzTGlzdCggcmVzdWx0Q2xhc3NlcyApfT5cbiAgICAgICAgIDxoMSBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57cmVzdWx0fTwvaDE+XG4gICAgICAgICA8aDMgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Jlc3VsdFN0YXR1c308L2gzPlxuICAgICAgPC9kaXY+O1xuICAgfVxuXG4gICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICBmdW5jdGlvbiB1cGRhdGVLZXkoIGV2ICkge1xuICAgICAgbW9kZWwudmlld0tleSA9IGV2LnRhcmdldC52YWx1ZTtcbiAgICAgIGxvb2t1cCgpO1xuICAgICAgcmVuZGVyKCk7XG4gICB9XG5cbiAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgIGZ1bmN0aW9uIGxvb2t1cEltbWVkaWF0ZWx5KCkge1xuICAgICAgbW9kZWwuc3VibWl0S2V5ID0gbW9kZWwudmlld0tleTtcbiAgICAgIGV2ZW50QnVzLnB1Ymxpc2goICd0YWtlQWN0aW9uUmVxdWVzdC4nICsgZmVhdHVyZXMubG9va3VwLmFjdGlvbiwge1xuICAgICAgICAgYWN0aW9uOiBmZWF0dXJlcy5sb29rdXAuYWN0aW9uLFxuICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiBtb2RlbC5zdWJtaXRLZXlcbiAgICAgICAgIH1cbiAgICAgIH0gKTtcbiAgIH1cblxuICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgZnVuY3Rpb24gY2xhc3NMaXN0KCBjbGFzc1NldCApIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyggY2xhc3NTZXQgKS5maWx0ZXIoIF8gPT4gISFjbGFzc1NldFsgXyBdICkuam9pbiggJyAnICk7XG4gICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgIG5hbWU6ICd1cmwtbG9va3VwLXdpZGdldCcsXG4gICBpbmplY3Rpb25zOiBpbmplY3Rpb25zLFxuICAgY3JlYXRlOiBjcmVhdGVcbn07XG4iXX0=