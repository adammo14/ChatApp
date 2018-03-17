var me = {};
me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

var you = {};
you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function insertChat(who, text, time){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());

    if (who == "me"){
        control = '<li class="me" style="width:50%;list-style-type:none;float:right;margin-right:40px;margin-top:10px;">' +
                        '<div class="macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';
    }else{
        control = '<li class="them" style="width:50%;list-style-type:none;float:left;margin-top:10px;">' +
                        '<div class="macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>'
                  '</li>';
    }
    setTimeout(
        function(){
            $(".chat-msg").append(control).scrollTop($(".chat-msg").prop('scrollHeight'));
        }, time);

}

function resetChat(){
    $(".chat-msg").empty();
}

$(".mytext").on("keydown", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("me", text);
            $(this).val('');
        }
    }
});
//7 > button
$('body > div > div > div > div > button').click(function(){
    $(".mytext").trigger({type: 'keydown', which: 13, keyCode: 13});
})

//-- Clear Chat
//resetChat();

//-- Print Messages
insertChat("you", "HEEEY!!!", 1500);

var box = document.getElementById("box");
var button = document.getElementById("show-more");

button.onClick = function(){
  if(box.style.display == 'none'){
    box.style.display = 'block';
  }
  else {
    box.style.display = 'none';
  }
}

$('.like, .dislike').on('click', function() {
    event.preventDefault();
    $('.active').removeClass('active');
    $(this).addClass('active');
});
