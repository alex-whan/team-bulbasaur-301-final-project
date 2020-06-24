'use strict';

function hidePreState() {
  $('.preState').hide();
}

function hideAddButton() {
  $('#addButton').hide();
  $('.preState').show();
}

$('#addButton').on('click', hideAddButton);
$('.preState').load('load', hidePreState);
