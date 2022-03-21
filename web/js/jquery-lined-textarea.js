/**
 * jQuery Lined Textarea Plugin
 *
 *
 * Copyright (c) 2013 jongsang han
 *
 * Version:
 *    $Id: 1.0
 *
 * Usage:
 *    Displays a line number count column to the left of the textarea
 *    textarea 왼쪽에 라인번호와 함께 출력해준다.
 *
 * ps:
 *    need jquery library
 *    jquery 라이브러리 필요로 함
 *
 * example:
 *  html code
 *    <textarea class="lined">
 *
 *  script code
 *    create
 *    생성
 *    $(".lined").linedtextarea({
 *  		width:'100%', 
 *  		height:"350px",
 *   		selectedLine: 10,
 *   	});
 *
 *    select lineNum
 *    the number which u wirte set color red and scroll is moved at the row
 *    라이번호 선택
 *    해당하는 번호가 선택(빨간색으로)되고 스크롤이 해당 열로 이동한다.
 *    $(".lined").selectLineNum(27);
 *
 * History:
 *   2013.05.22 release
 *   2013.05.22 최초 배포
 *   2013.05.22 selectLineNum 완성함. ie9, 8 버그 수정함.
 *
 * support browser:
 *  크롬, 익스8, 익스9 , 파폭
 *  chrome, ie8, ie9, firefox
 *
 *
 */

(function ($) {
  $.fn.linedtextarea = function (options) {
    /* private */
    var browser = navigator.userAgent;

    // constants
    var IE8 = "trident/4.0";
    var IE = "MSIE";
    var A = 65;
    var TAB = 9;
    var BACKSPACE = 8;

    // merge options
    var opts = $.extend({}, $.fn.linedtextarea.defaults, options);
    //width 값이 option 으로 들어 왓는지? 20130520 hjs
    //var isSetWidth = opts.width == null || opts.width == typeof(opts.width) != 'undefined' ? false : true;*/

    //css var
    var fontSize = opts.fontSize;
    var lineHeight = opts.lineHeight;
    var lineBackground = opts.lineBackground;
    var border = opts.border;
    var fontColor = opts.fontColor;
    var width = opts.width;
    var height = opts.height;
    var isResize = opts.width.indexOf('%') > -1 ? true : false;
    var isTabUse = opts.isTabUse;	//use tab?
    //basic tag
    var basicLinedTags =
        "<table class='linedTable' cellpadding='0' cellspacing='0'>" +
        "<tr>" +
        "<td class='linedTableTd1' valign='top' align='right' width='30px'>" +
        "<div class='linedLineNum'>" +
        "<div class='linedLineNumInner'>" +
        "<input type='hidden' class='selectedLineIndex'/>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td class='linedTableTd2' valign='top'>" +
        "<div class='linedTextarea'></div>" +
        "</td>" +
        "</tr>" +
        "</table>";

    /*
     * Helper function to make sure the line numbers are always
     * kept up to the current system
     */
    var fillOutLines = function (codeLines, h, lineNo) {
      var lineNoTag;
      var setFontColor;
      var selectedLineIndex = codeLines.find(".selectedLineIndex").val();
      while ((codeLines.height() - h) <= 0) {
        if (lineNo == selectedLineIndex) {
          codeLines.append(
              "<div class='lineno lineselect'>" + lineNo + "</div>");
          setFontColor = "red";
        } else {
          codeLines.append("<div class='lineno'>" + lineNo + "</div>");
          setFontColor = fontColor;
        }
        /*set css*/
        lineNoTag = codeLines.children().last();
        lineNoTag.css("font-size", fontSize);
        lineNoTag.css("color", setFontColor);
        lineNoTag.css("line-height", lineHeight);

        lineNo++;
      }
      return lineNo;
    };

    var insertAtCursor = function (myField, myValue) {
      //IE support
      if (document.selection) {

        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;

        /*
        var temp;
        temp = sel.text.length;
        sel.text = myValue;
        if (myValue.length == 0) {
          sel.moveStart('character', myValue.length);
          sel.moveEnd('character', myValue.length);
        } else {
          sel.moveStart('character', -myValue.length + temp);
        }
        sel.select();
        sel.move('character',1);*/

      }
      //MOZILLA/NETSCAPE support
      else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos) + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
      } else {
        myField.value += myValue;
      }
    };

    var scrollEvent = function (obj, linedLineNumInner, lineNo) {
      var domTextArea = $(obj)[0];
      var scrollTop = domTextArea.scrollTop;
      var clientHeight = domTextArea.clientHeight;
      linedLineNumInner.css({'margin-top': (-1 * scrollTop) + "px"});
      return fillOutLines(linedLineNumInner, scrollTop + clientHeight, lineNo);
    };

    /*
     * Iterate through each of the elements are to be applied to
     */
    return this.each(function () {
      var lineNo = 1;
      var textarea = $(this);

      /*rendering Tag 태그 그리기*/
      var root;
      var linedTable;
      var linedLineNum;
      var linedLineNumInner;
      var linedTextarea;
      textarea.wrap("<div class='linedDiv'></div>");
      root = textarea.parent();
      root.append(basicLinedTags);
      /*get Tag 태그 가지고 오기*/
      linedTable = root.find(".linedTable");
      linedLineNum = root.find(".linedLineNum");
      linedLineNumInner = root.find(".linedLineNumInner");
      linedTextarea = root.find(".linedTextarea");
      /*move textarea 이동*/
      linedTextarea.prepend(textarea);

      /*draw LineNum*/
      //apply css
      root.css("padding", "5px 5px 5px 5px");
      root.css("border", border);
      root.css("background", "white");
      //is not dynamic width
      if (!isResize) {
        root.css("width", width);
      }

      linedTable.css("width", width);
      textarea.css("border", "none");
      textarea.css("padding-left", "2px");
      /*textarea.css("padding-top"	, "1px");*/
      textarea.css("font-size", fontSize);
      textarea.css("line-height", lineHeight);

      textarea.css("width", "100%");
      textarea.css("height", height);
      textarea.attr("rows", "200");
      textarea.attr("cols", "200");
      textarea.attr("wrap", "hard");

      //textarea.attr("onkeydown","linedtextarea_onkeydown(this)");
      /* Turn off the wrapping of as we don't want to screw up the line numbers */
      /*난중에 수정할거임..*/
      textarea.css("resize", "none");

      linedLineNum.css("border-right", border);
      linedLineNum.css("margin-right", "5px");
      linedLineNum.css("margin-top", "2px");
      linedLineNum.css("padding-right", "2px");
      linedLineNum.css("height", height);
      linedLineNum.css("overflow", "hidden");

      lineNo = fillOutLines(linedLineNumInner, textarea.height(), 1);

      /* Move the textarea to the selected line */
      $.fn.selectLineNum(opts.selectedLine);

      //ie에서 backspace 일때 버그 스크롤 이벤트 안타는거
      //keydown 에서 스크롤위치값을 저장함
      if (browser.indexOf(IE) != -1) {
        var blockKeydown = false;
        var currentScrollTop = 0;
        textarea.keydown(function (e) {
          if (e.which == BACKSPACE) {
            if (blockKeydown) {
              return;
            }
            //첫번째값 한번만 저장함. 백스페이스를 계속 누를시에.
            currentScrollTop = $(this)[0].scrollTop;
            blockKeydown = true;
          }
        });
        textarea.keyup(function (e) {
          if (e.which == BACKSPACE) {
            var scrollTop = $(this)[0].scrollTop;
            //현재 스크롤과 다르면~!
            if (currentScrollTop != scrollTop) {
              lineNo = scrollEvent(this, linedLineNumInner, lineNo);
              blockKeydown = false;
            }
          }
        });

        //ie8 ctrl+a bug fix 20130520 hjs
        if (browser.indexOf(IE8) != -1) {
          textarea.keydown(function (e) {
            if (e.which == A && e.ctrlKey) {
              var domTextArea = $(this)[0];
              domTextArea.scrollTop = 0;
            }
          });
        }

      }
      /* React to the scroll event */
      //IE8 마우스로 스크롤 드래그 할경우 스크롤 깨짐 현상
      if (browser.indexOf(IE8) != -1) {
        textarea.bind("scrollstop", function () {
          lineNo = scrollEvent(this, linedLineNumInner, lineNo);
          console.log(this.scrollTop);
        });
      } else {
        textarea.scroll(function (tn) {
          lineNo = scrollEvent(this, linedLineNumInner, lineNo);
          console.log(this.scrollTop);
        });
      }

      /* allow tab in textarea */
      if (isTabUse) {
        textarea.keydown(function (e) {
          if (!e && event.keyCode == TAB) {
            event.returnValue = false;
            insertAtCursor(this, "\t");
          } else if (e.keyCode == TAB) {
            e.preventDefault();
            insertAtCursor(this, "\t");
          }

          /*if (e.which == TAB){

            // prevent the focus lose
                e.preventDefault();

                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                // set textarea value to: text before caret + tab + text after caret
                $this.val(value.substring(0, start)
                            + "\t"
                            + value.substring(end));

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

          }*/
        });
      }
    });
  };
  $.fn.selectLineNum = function (selectedLine) {
    if (selectedLine != -1 && !isNaN(selectedLine)) {
      var textarea = $(this);

      /* get line num */
      var text = textarea.val();
      var lines = text.split(/\r|\r\n|\n/);
      var maxLineNum = lines.length;

      //if(selectedLine>maxLineNum)	return false;
      var lines = textarea.closest(".linedTable").find(
          ".linedLineNumInner").children();
      var lineHeight = (lines.last().height()) * selectedLine;
      var textareaHeight = textarea.height();
      if (textareaHeight < lineHeight) {
        textarea[0].scrollTop = lineHeight - (textareaHeight / 2);
      }

      //console.log(lineNo);
      /*
      var lines = textarea.closest(".linedTable").find(".linedLineNumInner").children();
      var lineNoLast = lines.last();
      lineNo = parseInt(lineNoLast.html());*/
      //var tempHeight = parseInt( textarea.height() / (lineNo) );
      //var position  = parseInt( (tempHeight+2) * selectedLine ) - (textarea.height()/2);
      //textarea[0].scrollTop = 100;
      /* css */
      var selectedLineTag = textarea.closest(".linedTable").find(
          ".selectedLineIndex");
      selectedLineTag.val(selectedLine);
      /* 이미 그려진 tag에는 직접 넣어 준다.*/
      var lines = textarea.closest(".linedTable").find(
          ".linedLineNumInner").children();
      if (lines.length >= selectedLine) {
        lines.each(function (index) {
          if (index == selectedLine) {
            $(this).css("color", "red");
            $(this).addClass("lineselect");
            return;
          } else {
            $(this).css("color", "#828790");
          }
        });
      }
    }
  };

  // default options
  $.fn.linedtextarea.defaults = {
    selectedLine: -1,
    selectedClass: 'lineselect',
    width: '350px',
    height: '350px',
    fontSize: '11px',
    lineHeight: '15px',
    lineWidth: 30,
    lineBackground: '#f2f3f4',
    border: '1px solid #828790',
    fontColor: '#828790',
    isTabUse: true
  };
})(jQuery);

//tab
/*var ProcessTab = function(id) {
	// Insert tab character in place of cached selection
	document.all[id].selection.text=String.fromCharCode(9);
	// Set the focus
	document.all[id].focus();
};
*/

(function () {

  var special = jQuery.event.special,
      uid1 = 'D' + (+new Date()),
      uid2 = 'D' + (+new Date() + 1);

  special.scrollstart = {
    setup: function () {

      var timer,
          handler = function (evt) {

            var _self = this,
                _args = arguments;

            if (timer) {
              clearTimeout(timer);
            } else {
              evt.type = 'scrollstart';
              jQuery.event.handle.apply(_self, _args);
            }

            timer = setTimeout(function () {
              timer = null;
            }, special.scrollstop.latency);

          };

      jQuery(this).bind('scroll', handler).data(uid1, handler);

    },
    teardown: function () {
      jQuery(this).unbind('scroll', jQuery(this).data(uid1));
    }
  };

  special.scrollstop = {
    latency: 100,
    setup: function () {

      var timer,
          handler = function (evt) {

            var _self = this,
                _args = arguments;

            if (timer) {
              clearTimeout(timer);
            }

            timer = setTimeout(function () {

              timer = null;
              evt.type = 'scrollstop';
              jQuery.event.handle.apply(_self, _args);

            }, special.scrollstop.latency);

          };

      jQuery(this).bind('scroll', handler).data(uid2, handler);

    },
    teardown: function () {
      jQuery(this).unbind('scroll', jQuery(this).data(uid2));
    }
  };

})();