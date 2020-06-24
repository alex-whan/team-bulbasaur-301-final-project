'use strict';

// $('.preState').hide();

function hideAddButton(event) {
    event.preventDefault();
    $('#addButton').hide();
    $('.preState').show();

}

// $('#addButton').on('click', hideAddButton);
