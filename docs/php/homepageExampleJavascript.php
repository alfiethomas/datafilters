$(document).ready(function() {
  initFilters();
});

function initFilters() {
  $('#tariffTable').DataFilter('init', { 
      dataElements: {
        "Tariff Length"    : { "id": 3, "dataType": "period",   "filterType": "checkboxes"     },
        "Monthly Cost"     : { "id": 1, "dataType": "currency", "filterType": "maxWithBanding" },
        "UK Minutes"       : { "id": 4, "dataType": "amount",   "filterType": "min"            },
        "UK Data"          : { "id": 6, "dataType": "amount",   "filterType": "minMax"         },          
        "UK Texts"         : { "id": 5, "dataType": "amount",   "filterType": "min"            },
        "Phone Price"      : { "id": 2, "dataType": "currency", "filterType": "maxWithBanding" }
      },
      pageSize: 20,
      defaultTableSort: { "id": 1, "direction": "1"},
      onSuccess: onSuccessFn       
    });        

  filterGroups(4);      
}