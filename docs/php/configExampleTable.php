  $('#exampleTable').DataFilter('init', { 
    filters: [
      { "heading": "Make",  "id": 1, "dataType": "default",  "filterType": "checkboxes"   },
      { "heading": "Price", "id": 3, "dataType": "currency", "filterType": "rangeBanding" }
    ]      
  });