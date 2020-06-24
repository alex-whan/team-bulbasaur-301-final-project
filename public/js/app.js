'use strict';

function hidePreState(event) {
    $('.preState').hide();
}

function hideAddButton(event) {
    event.preventDefault();
    $('#addButton').hide();
    $('.preState').show();
}

$('#addButton').on('click', hideAddButton);
$('.preState').load('load', hidePreState);
