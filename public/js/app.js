'use strict';

function hideAddButton(event) {
    $('#addButton').hide();
}

$('#addButton').on('click', hideAddButton)
