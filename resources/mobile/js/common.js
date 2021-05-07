var _commentAni = null;
var mainPopupSwiper;
var phoneList;
var productSwiper;
var miniScrollMove;
var swiperProgressbar = {
  slidesPerView: 'auto',
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
  },
  on: {
    // 스와이프 따라 스크롤 이동
    transitionEnd: function () {
      clearInterval(miniScrollMove);
      miniScrollMove = null;
      $(".product-mini-scroll").each(e => {
        $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
      });
    },
    // 스와이프 따라 스크롤 이동
    transitionStart: function () {
      miniScrollMove = setInterval(() => {
        $(".product-mini-scroll").each(e => {
          $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
        });
      }, 0);
    }
  }
}

let resize_height = window.innerHeight;
var IorA = navigator.userAgent.toLowerCase();

$(document).ready(function () {


  if (IorA.indexOf("android") !== -1) {
    $(window).resize(function () {
      if (resize_height < window.innerHeight) {
        $('.scroll-control').css('height', window.innerHeight + 'px');
        $('.phone-select-popup').css('bottom', '-100px');
        resize_height = window.innerHeight;
      }
      else {
        $('.scroll-control').css('height', window.innerHeight + 'px');
        $('.phone-select-popup').css('bottom', '-40px');
        resize_height = window.innerHeight;
      }
    })
  } else if (IorA.indexOf("iphone") !== -1) {
  }

  var time = new Date();
  var hour = time.getHours();
  var min = time.getMinutes();
  $('.gnb-time').text(plusZero(hour) + ":" + plusZero(min));
  // 시간 표시
  setInterval(() => {
    time = new Date();
    hour = time.getHours();
    min = time.getMinutes();
    $('.gnb-time').text(plusZero(hour) + ":" + plusZero(min));
  }, 1000);

  var pageClass = document.querySelector('.wrap') ? document.querySelector('.wrap').getAttribute('class').split(' ')[1] : undefined;

  switch (pageClass) {
    case 'home':
      homeMethods();
      break;
    case 'tplanner':
      tplannerMethods();
      break;
  }
  $(".category-swiper .list").each(e => {
    $(".category-swiper .list").eq(e).click(function () {
      $(".category-swiper .list").removeClass('select');
      $(".category-swiper .list").eq(e).addClass('select');
    });
  });
})

function homeMethods() {

  /////////////////////////////////////////home 페이지 ///////////////////////////////////////////////////

  //스와이퍼 세팅
  productSwiper = new Swiper('.product-swiper', swiperProgressbar);

  //첫 메뉴바 인터렉션
  _commentAni = commentAni();

  //페이지 이동
  $('#Cart').click(function () {
    window.location.href = "tplanner.html"
  })
  //문구 미들 점 처리
  limitTxt($('.js-review-txt'), 20);


  function limitTxt(el, limitNum) {
    var $limitNum = limitNum;
    var _el = el;
    if (_el.html().length >= $limitNum) {
      _el.html(_el.html().substring(0, $limitNum) + "<span>&#183;</span><span>&#183;</span><span>&#183;</span>");
    }
  }

  ///////////////////스크롤 스와이프 별개
  let curPos = 0;
  let postion = 0;
  let start_x, end_x;
  const IMAGE_WIDTH = 336;
  const content = document.querySelector(".review-scroll-content")

  content.addEventListener('touchstart', touch_start);
  content.addEventListener('touchend', touch_end);

  function prev() {
    if (curPos > 0) {
      postion += IMAGE_WIDTH;
      content.style.transform = `translateX(${postion}px)`;
      curPos = curPos - 1;
    }
  }
  function next() {
    if (curPos < 3) {
      postion -= IMAGE_WIDTH;
      content.style.transform = `translateX(${postion}px)`;
      curPos = curPos + 1;
    }
  }

  function touch_start(event) {
    start_x = event.touches[0].pageX
  }

  function touch_end(event) {
    end_x = event.changedTouches[0].pageX;
    if (start_x == end_x)
      return
    if (start_x > end_x) {
      next();
    } else {
      prev();
    }
  }
  /////////////////////////////////////

  /////별점 추가 스크립트
  $('.starRev span').click(function () {
    $(this).parent().children('span').removeClass('on');
    $(this).addClass('on').prevAll('span').addClass('on');
    $(this).parent().children('.starTxt').html(($(this).addClass('on').prevAll().length / 2) + 0.5);
    return false;
  });

  /////////////////////////////////////
  //// T 다이렉트 상단 인터렉션 움직이는 프로그레스
  $(document).scroll(function () {
    if (_commentAni != null)
      return
    if ($(document).scrollTop() == 0) {
      _commentAni = commentAni();
    }

    if ($('.nav').height() >= $('.visual-header-wrap').get(0).getBoundingClientRect().top) {
      $('.visual-header').addClass('scroll-on');
    }
    else {
      $('.visual-header').removeClass('scroll-on');
    }
    // if (($('.nav').height() + $('.gnb').height()) >= $('.visual-header-wrap').get(0).getBoundingClientRect().top) {
    //   $('.visual-header').addClass('scroll-on');
    // }
    // else {
    //   $('.visual-header').removeClass('scroll-on');
    // } ///// gnb 영역
  });

  function commentAni() {
    setTimeout(() => {
      if ($('.nav-comment-img').hasClass('is-on'))
        return
      $('.nav-comment-img').addClass('is-on')
      setTimeout(() => {
        $('.nav-comment-img').removeClass('is-on')
        _commentAni = null;
      }, 2000);
    }, 500);
  }
  /////////////////////////////////////

  //////////////스와이프 따라 스크롤 이동///////////////////////////////
  $(".swiper-slide").each(e => {
    $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
  });

  $(".product-swiper").on("touchmove touchend", function () {
    $(".product-mini-scroll").each(e => {
      $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
    });
  });
  //////////////////////////////////////

  /// #상품 리스트 
  $(".label-txt-scroll span").each(e => {
    $(".label-txt-scroll span").eq(e).click(function () {
      $(".label-txt-scroll span").removeClass("select");
      $(".label-txt-scroll span").eq(e).addClass("select");
    })
  })
  ///
}

function tplannerMethods() {
  /////////////////////////////////////////tplanner 페이지 ///////////////////////////////////////
  //페이지 이동
  $('#userIcon').click(function () {
    window.location.href = "home.html"
  })

  // 휴대폰 리스트 뷰 버튼
  $('#js-select-view-btn').click(function () {
    if ($('.phone-select-popup').hasClass('is-on')) {
      $('.phone-select-popup').removeClass('is-on');
      $('.phone-select-popup').css('height', '0px');
      $('body').css('overflow-y', '');
    }
    else {
      $('.phone-select-popup').addClass('is-on');
      $('.phone-select-popup').css('height', '260px');
      $('.popup-panel').css('display', 'block');
      $('body').css('overflow-y', 'hidden');
      $(document).scrollTop(-1000);
      setTimeout(() => {
        //스크롤 제어
        if (IorA.indexOf("android") !== -1) {
          if (resize_height == window.innerHeight)
            return;
          if (resize_height < window.innerHeight) {
            $('.scroll-control').css('height', window.innerHeight + 'px');
            $('.phone-select-popup').css('bottom', '-100px');
            resize_height = window.innerHeight
          }
          else {
            $('.scroll-control').css('height', window.innerHeight + 'px');
            $('.phone-select-popup').css('bottom', '-40px');
            resize_height = window.innerHeight
          }
        }
        
        $('.scroll-control').css('height', window.innerHeight + 'px');
        $('.scroll-control').css('overflow', 'hidden');
        if (IorA.indexOf("iphone") !== -1) {
          $('.phone-select-popup').css('bottom', '-40px');
        }
      }, 100);
    }
  });

  $('.popup-panel').click(function () {
    if ($('.phone-select-popup').hasClass('is-on')) {
      $('.phone-select-popup').removeClass('is-on');
      $('.phone-select-popup').css('height', '0px');
      $('body').css('overflow-y', '');
      $(this).css('display', 'none');
      $('.scroll-control').css('overflow', "");
      $('.scroll-control').css('height', "");
    }
  })

  // 결제내역 더보기 아코디언
  $(".payment-amount").click(function () {
    if ($(this).hasClass("is-on")) {
      $(this).removeClass('is-on');
      $(".payment-view").slideUp();
      $('.payment-txt').removeClass('changed');
    }
    else {
      $(this).addClass("is-on");
      $(".payment-view").slideDown();
      $('.payment-txt').addClass('changed');
    }
  });
}

//현제 시간
function plusZero(time) {
  (time < 10) ? time = "0" + time : time;
  return time;
}