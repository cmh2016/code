/*
 * @Author: cmh
 * @Date:   2016-08-15 16:45:20
 * @Last Modified by:  cmh
 * @Last Modified time: 2016-08-15 18:46:10
 */


$(document).ready(function() {
  //格式化
  $("#account").bankInput();
  //数据双向绑定
  new Vue({
    el: '#bank',
    data: {
      message: ''
    }
  });
  //bank info
  function bankInfo() {
    var inputValue = $("#account").val();
    var InputValue = inputValue.replace(/\s/g, "");
    console.log(InputValue);
    var tipiofo = $(".tipiofo");

    if (InputValue == "") {
      alert("银行卡号不能为空！");
      $("#account").focus();
    } else {
      $.getJSON("data/bankData.json", function(data) {
        for (var num in data) { //遍历json数组
          if (InputValue.substring(0, 4) == data[num].bin || InputValue.substring(0, 6) == data[num].bin || InputValue.substring(0, 7) == data[num].bin || InputValue.substring(0, 8) == data[num].bin || InputValue.substring(0, 5) == data[num].bin || InputValue.substring(0, 9) == data[num].bin) {
            tipiofo.text(data[num].bankName);
          }
        }

      });
    }
    if (tipiofo.text() == "") {

      tipiofo.text("其他银行");
    }


  }
  $("#action").focus(function() {
    $(".tipiofo").text("");
    bankInfo()
  })
});
