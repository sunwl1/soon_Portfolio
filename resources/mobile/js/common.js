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
  //안드로이드의 경우
  if (IorA.indexOf("android") !== -1) {
    $(window).resize(function () {
      //화면 변경시 전 사이즈가 작을경우
      if (resize_height < window.innerHeight) {
        $('.scroll-control').css('height', window.innerHeight + 'px');
        $('.phone-select-popup').css('bottom', '-190px');
        //변경된 사이즈 resize_height변수에 세팅
        resize_height = window.innerHeight;
      }
      else {
        // 화면 변경시 전 사이즈가 클경우
        $('.scroll-control').css('height', window.innerHeight + 'px');
        $('.phone-select-popup').css('bottom', '-105px');
        //변경된 사이즈 resize_height변수에 세팅
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
    //최대 글자 갯수
    var $limitNum = limitNum;
    //적용 시킬 제이쿼리 타겟
    var _el = el;

    if (_el.html().length >= $limitNum) {
      //최대 글자 갯수 이후 <span>&#183;</span>으로 중간점 처리
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

  //터치 시작 좌표
  function touch_start(event) {
    start_x = event.touches[0].pageX
  }

  //터치 종료후 시작좌표와 비교 좌우 판단
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

    //부모의 자식 span의 on클래스 전부 제거(on 상태일때 별 활성화);
    $(this).parent().children('span').removeClass('on');

    //자신의 이전 span에 on 클래스 모두 추가
    $(this).addClass('on').prevAll('span').addClass('on');

    //별점 수치 추가
    $(this).parent().children('.starTxt').html(($(this).addClass('on').prevAll().length / 2) + 0.5);
    return false;
  });

  /////////////////////////////////////
  //// T 다이렉트 상단 인터렉션 움직이는 프로그레스
  $(document).scroll(function () {
    //_commentAni에 함수가 담겨있지 않으면(중복 함수 실행 방지)
    if (_commentAni != null)
      return
    // 최상단의 경우
    if ($(document).scrollTop() == 0) {
      _commentAni = commentAni();
    }

    // gnb 하단에 해당 .visual-header-wrap의 박스의 상단 면적이 닿으면 scroll-on 클래스 추가 아니면 제거
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
    //잠시후에 실행 0.5초
    setTimeout(() => {
      //.nav-comment-img가 is-on클래스를 이미 가지고 있으면 통과
      if ($('.nav-comment-img').hasClass('is-on'))
        return
      //.nav-comment-img에 is-on클래스를 추가
      $('.nav-comment-img').addClass('is-on')

      //2초 이후에 실행(2초 동안 보여주고 사라짐)
      setTimeout(() => {
        //.nav-comment-img에 is-on클래스를 제거
        $('.nav-comment-img').removeClass('is-on')
        //_commentAni를 초기화
        _commentAni = null;
      }, 2000);
    }, 500);
  }
  /////////////////////////////////////

  //////////////스와이프 따라 스크롤 이동///////////////////////////////
  $(".swiper-slide").each(e => {
    //스와이프 갯수만큼 스크롤 위치 세팅
    $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
  });

  $(".product-swiper").on("touchmove touchend", function () {
    //스와이프를 터치하고 움직이는 동안과 터치가 끝난 순간 스크롤 위치 세팅
    $(".product-mini-scroll").each(e => {
      $(".product-mini-scroll").eq(e).offset({ left: $(".swiper-slide").eq(e).offset().left });
    });
  });
  //////////////////////////////////////

  /// #상품 리스트 
  $(".label-txt-scroll span").each(e => {
    $(".label-txt-scroll span").eq(e).click(function () {
      //.label-txt-scroll span의 select클래스 전부 제거
      $(".label-txt-scroll span").removeClass("select");
      //클릭한 .label-txt-scroll span의 select클래스 추가
      $(".label-txt-scroll span").eq(e).addClass("select");
    })
  })
  ///
  typing();
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
      $('.phone-select-popup').css('height', '350px');
      $('.phone-select-popup').css('bottom', '-105px');
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
            $('.phone-select-popup').css('bottom', '-190px');
            resize_height = window.innerHeight
          }
          else {
            $('.scroll-control').css('height', window.innerHeight + 'px');
            $('.phone-select-popup').css('bottom', '-105px');
            resize_height = window.innerHeight
          }
        }
        //IOS overflow-y 이슈 방지
        //.scroll-control의 height를 사용중인 모바일의 화면 높이로 설정
        $('.scroll-control').css('height', window.innerHeight + 'px');
        //컨텐츠의 부모인 .scroll-control를 overflow hidden 속성 추가
        $('.scroll-control').css('overflow', 'hidden');
        if (IorA.indexOf("iphone") !== -1) {
          $('.phone-select-popup').css('bottom', '-105px');
        }
      }, 100);
    }
  });

  // 휴대폰 리스트 뷰 비활성화 panel
  $('.popup-panel').click(function () {
    //.phone-select-popup가 is-on클래스가 있지 않으면
    if ($('.phone-select-popup').hasClass('is-on')) {
      $('.phone-select-popup').removeClass('is-on');
      $('.phone-select-popup').css('height', '0px');
      $('body').css('overflow-y', '');
      $(this).css('display', 'none');
      //컨텐츠의 부모인 .scroll-control를 overflow hidden 속성 제거 
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

  //휴대폰 선택
  $(".btn-phone-select").each(e => {
    $(".btn-phone-select").eq(e).click(function () {
      //클릭된 .btn-phone-select의 src와 alt를 변수에 세팅
      let src = $(".btn-phone-select").eq(e).prop('src');
      //alt에는 선택한 휴대폰 이름 세팅
      let alt = $(".btn-phone-select").eq(e).prop('alt');
      //콘텐츠를 문자열로 저장하며 세팅한 src를 기입
      let content = `<img class="selecting-phone" src=` + src + ` alt="">
      <div class="speech-bubble">휴대폰을 선택해보세요</div>`

      //타겟의 부모의 html에 세팅한 콘텐츠와 이름을 세팅한 alt 변수 기입
      $('.selecting-phone').parent().html(content + alt)

      //리스트뷰 종료
      if ($('.phone-select-popup').hasClass('is-on')) {
        $('.phone-select-popup').removeClass('is-on');
        $('.phone-select-popup').css('height', '0px');
        $('body').css('overflow-y', '');
        $('.popup-panel').css('display', 'none');
        $('.scroll-control').css('overflow', "");
        $('.scroll-control').css('height', "");
      }
    })
  });

  //초기화 버튼
  $('.phone-select-reset').click(function () {
    //초기화시 본 컨텐츠 다시 추가
    let content = `<img class="selecting-phone" src="../../resources/mobile/images/visual_content_01.png" alt="">휴대폰<div class="speech-bubble">휴대폰을 선택해보세요</div>`
    $('.selecting-phone').parent().html(content);
  });
}

//현제 시간
function plusZero(time) {
  (time < 10) ? time = "0" + time : time;
  return time;
}

//타이핑 함수
function typing() {
  //타이핑 클래스 담긴 제이쿼리 객체
  let $this = $(".typing");

  //전체 갯수
  $this.get().forEach(e => {
    //타겟의 html 가져옴
    let typingTxt = $(e).html();
    //넣어줄 문자 인덱스
    let typingCount = 0;
    //<br>이 있으면 임시로 /로 변환 인덱스로 읽어서 내려주기 위해
    typingTxt = typingTxt.replaceAll("<br>", "/");
    typingTxt = typingTxt.split("");
    //타겟을 비우고 타이핑 애니메이션 추가
    $(e).html("<span class='is-on'></span>");

    //끝날때까지 반복
    let tyMethods = setInterval(function () {
      //문자 길이만큼
      if (typingCount < typingTxt.length) {
        //<br> 임시로 변환한거 사용 줄내려줌

        if (typingTxt[typingCount] === "/") {
          $(e).find(".is-on").before("<br/>");
          typingCount++;
          //문자 인덱스 단위로 넣어줌 타이핑 효과
          $(e).find(".is-on").before(typingTxt[typingCount]);
        }
        else {
          //문자 인덱스 단위로 넣어줌 타이핑 효과
          $(e).find(".is-on").before(typingTxt[typingCount]);
          typingCount++;
        }
      }
      else {
        //끝나면 반복 함수 제거
        clearInterval(tyMethods);
        //타이핑 효과 제거
        $(e).find(".is-on").remove();
        tyMethods = null;
      }
    }, 100);
  });
}