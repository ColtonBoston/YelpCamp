$('#campground-search').on('input', function() {
  var search = $(this)[0].value;
  $('#campground-grid').html('');
  campgrounds.forEach(function(campground) {
    if(search === "" || new RegExp(search, "i").test(campground.name)){
      $('#campground-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ campground.image }">
            <div class="caption">
              <h4>${ campground.name }</h4>
            </div>
            <p>
              <a href="/campgrounds/${ campground._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    }
  });
});

$('#campground-search').submit(function(event) {
  event.preventDefault();
});
