var hide_single_post = function(pid) {
  var post = $('.' + pid);
  $(post).children('.leftPane').attr("style", "display:none");
  $(post).children('.rightPane').attr("style", "display:none");
  $(post).append(unblock_single_post_button);
  $('.show-post').bind("click", remove_from_ignore_single_post);
};

var show_single_post = function(pid) {
  var post = $('.' + pid);
  $(post).children('.leftPane').attr("style", "");
  $(post).children('.rightPane').attr("style", "");
  $(post).children('.show-post').remove();
};

var hide_users_posts = function(uid) {
  $('.uid_' + uid).hide(500);
};

var get_user_name = function(elem) {
  return $(elem).siblings("a[href $= '/profile']").attr("href").replace("/users/","").replace("/profile","");
};

var get_user_id = function(elem) {
  return $(elem).siblings(".messengerButton").attr("href").replace("/messaging/messenger?to_uid=","");
};

var get_post_id = function(elem, action) {
  if (action == 'show') {
    return $(elem).parent().attr('class').split(' ')[2];
  }
  return $(elem).parent().parent().parent().parent().parent().attr('class').split(' ')[2];
};

var add_to_ignore_single_post = function(event) {
  var pid = get_post_id(this);
  single_posts = JSON.parse(localStorage.dd_ignore_single_posts);
  single_posts[pid] = true;
  localStorage.dd_ignore_single_posts = JSON.stringify(single_posts);
  hide_single_post(pid);
  //alert("Игнор-лист: \r\n" + GM_getValue("dd_ignore_single_post", " ").split(" ").join("\r\n"));
  event.preventDefault();
};

var remove_from_ignore_single_post = function(event) {
  var pid = get_post_id(this, 'show');
  single_posts = JSON.parse(localStorage.dd_ignore_single_posts);
  delete single_posts[pid];
  localStorage.dd_ignore_single_posts = JSON.stringify(single_posts);
  show_single_post(pid);
  event.preventDefault();
};

var add_to_ignore_users_posts = function(event) {
  var user = get_user_name(this);
  var uid = get_user_id(this);
  users = JSON.parse(localStorage.dd_ignore_users_posts);
  users[user] = uid;
  localStorage.dd_ignore_users_posts = JSON.stringify(users);
  hide_users_posts(uid);
  //alert("Игнор-лист: \r\n" + GM_getValue("dd_ignore_users_posts", " ").split(" ").join("\r\n"));
  event.preventDefault();
};

var remove_from_ignore_users_posts = function(event) {
  var user_class = $(this).attr('class').split(" ")[1];
  var uid = user_class.split("-")[1];
  var user = user_class.split("-")[0];
  users = JSON.parse(localStorage.dd_ignore_users_posts);
  delete users[user];
  localStorage.dd_ignore_users_posts = JSON.stringify(users);
  $(this).remove();
  //alert("Игнор-лист: \r\n" + GM_getValue("dd_ignore_users_posts", " ").split(" ").join("\r\n"));
  event.preventDefault();
};

var add_to_ignore_users_comments = function(event) {
  var user = get_user_name(this);
  event.preventDefault();
};

var trimSpaces = function(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");
  return s;
};

var block_single_post_button = '<a class="hide-post" title="Скрыть псто" href="#">Скрыть псто</a>';
var unblock_single_post_button = '<a class="show-post" title="Показать псто" href="#">Показать псто</a>';
var block_users_posts_button = '<a class="hide-users-posts" title="Зобанеть пидораса" href="#"><img width="13" height="13" border="0" src="/gfx/delete.gif"></a>';
var block_users_comments_button = '<a class="hide-users-comments" title="Развидеть комметы этого мудака" href="#"><img width="13" height="13" border="0" src="/gfx/entry_editor/del.png"></a>';

console.log('local');
if(!localStorage.dd_ignore_single_posts) {
    localStorage.dd_ignore_single_posts = JSON.stringify({});
}
if(!localStorage.dd_ignore_users_posts) {
    localStorage.dd_ignore_users_posts = JSON.stringify({});
}

var ignored_users_posts = JSON.parse(localStorage.getItem('dd_ignore_users_posts'));
console.log(ignored_users_posts);
ignore_list = '<div class="ignore-list"><h1 class="section">Зобаненые мудаки</h1>';
for (var username in ignored_users_posts) {
  var uid = ignored_users_posts[username];
  hide_users_posts(uid);
  ignore_list += '<a class="show-users-posts ' + username + '-' + uid + '" title="Разбанеть няшку" href="#">' + username + '</a><br>';
}
ignore_list += '</div>';
$('.friendManagement').append(ignore_list);

$('div.leftPane  :nth-child(3n)').append(block_users_posts_button);
$('div.rightPane > header.entryList > div.meta > span').append(' | ' + block_single_post_button);
$('.hide-post').bind("click", add_to_ignore_single_post);
$('.show-post').bind("click", remove_from_ignore_single_post);
$('.hide-users-posts').bind("click", add_to_ignore_users_posts);
$('.show-users-posts').bind("click", remove_from_ignore_users_posts);
$('.hide-users-commetns').bind("click", add_to_ignore_users_comments);

var ignored_posts = JSON.parse(localStorage.dd_ignore_single_posts);
for (var post in ignored_posts) {
  hide_single_post(post);
}