$(function() {
  $.material.init();

  if ($('#message').length > 0) {
    $('#message').snackbar('show');
  }
});

