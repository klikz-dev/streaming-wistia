var template = _.template($('#template').html());

var items = [
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" },
  { title: "Test title", thumb: "http://placeimg.com/100/75" }
];

var create = function(id, opts) {
  opts = _.extend({
    perPage: 4,
    lazyLoadImages: false
  }, opts || {});

  var $elem = $(document.getElementById(id)).html(template(_.extend({}, opts, {
    items: items
  })));

  new app.components.Carousel($elem.find('.bcc-carousel'), opts);
};

create('basic', {
});

create('responsive-fluid', {
  responsive: true
});

create('responsive-breakpoints', {
  responsive: true,
  touchScrolling: 'track',
  breakpoints: [
    {
      minWidth: 400,
      perPage: 1,
      scroll: 'overflow'
    },
    {
      minWidth: 600,
      perPage: 2
    },
    {
      minWidth: 800,
      perPage: 3
    },
    {
      minWidth: 1000,
      perPage: 4
    }
  ]
});

create('fractions', {
  perPage: 3.5,
  responsive: true // needs to be set for fractions
});

create('responsive-fractions', {
  perPage: 3.5,
  responsive: true
});

create('lazyload', {
  moveBy: 4,
  lazyLoadImages: true
});

create('startIndex', {
  startIndex: 4
});

create('moveBy', {
  moveBy: 1
});

create('autoScroll', {
  moveBy: 1,
  autoscroll: {
    interval: 1000,
    autostart: true
  }
});

create('touchScroll', {
  perPage: 4,
  responsive: true,
  touchScrolling: 'track',
  touchScrollingSnap: 'page'
});

