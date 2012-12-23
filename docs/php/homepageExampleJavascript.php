$(document).ready(function() {
  initFilters();
});

function initFilters() {
  $('#tariffTable').DataFilter('init', { 
    filters: [
      { heading: "Tariff Length", "id": 3, "dataType": "period",   "filterType": "checkboxes", "alias": "tariffLength" },
      { heading: "Monthly Cost",  "id": 1, "dataType": "currency", "filterType": "maxWithBanding" },
      { heading: "UK Minutes",    "id": 4, "dataType": "amount",   "filterType": "min"            },
      { heading: "UK Data",       "id": 6, "dataType": "amount",   "filterType": "minMax"         },          
      { heading: "UK Texts",      "id": 5, "dataType": "amount",   "filterType": "min"            },
      { heading: "Phone Price",   "id": 2, "dataType": "currency", "filterType": "rangeBanding"   }
    ],
    pageSize: 20,
    maxPagingNumbers: 10,
    useFreeTextSearch: true, 
    onSuccess: onSuccessFn,
    scrollToEnabled: true       
  });            
}