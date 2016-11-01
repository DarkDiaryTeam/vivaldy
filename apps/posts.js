/*
 * Модуль работы с постами.
 * Тут все как было в старом скрипте угли. Или почти все.
 */

function hide_single_post(pid) {
  var post = $('.' + pid);
  $(post).children('.leftPane').attr("style", "display:none");
  $(post).children('.rightPane').attr("style", "display:none");
  $(post).append(unblock_single_post_button);
  $('.show-post').bind("click", remove_from_ignore_single_post);
};

function show_single_post(pid) {
  var post = $('.' + pid);
  $(post).children('.leftPane').attr("style", "");
  $(post).children('.rightPane').attr("style", "");
  $(post).children('.show-post').remove();
};

function hide_users_posts(uid) {
  $('.uid_' + uid).hide(500);
};

function add_to_ignore_single_post(event) {
  var pid = get_post_id(this);
  var single_posts = JSON.parse(localStorage.dd_ignore_single_posts);
  single_posts[pid] = true;
  localStorage.dd_ignore_single_posts = JSON.stringify(single_posts);
  hide_single_post(pid);
  event.preventDefault();
};

function remove_from_ignore_single_post(event) {
  var pid = get_post_id(this, 'show');
  var single_posts = JSON.parse(localStorage.dd_ignore_single_posts);
  delete single_posts[pid];
  localStorage.dd_ignore_single_posts = JSON.stringify(single_posts);
  show_single_post(pid);
  event.preventDefault();
};

function add_to_ignore_users_posts(event) {
  var user = get_user_name(this);
  var uid = get_user_id(this);
  var users = JSON.parse(localStorage.dd_ignore_users_posts);
  users[user] = uid;
  localStorage.dd_ignore_users_posts = JSON.stringify(users);
  hide_users_posts(uid);
  event.preventDefault();
};

function remove_from_ignore_users_posts(event) {
  var user_class = $(this).attr('class').split(" ")[1];
  var user = user_class.split("-")[0];
  var users = JSON.parse(localStorage.dd_ignore_users_posts);
  delete users[user];
  localStorage.dd_ignore_users_posts = JSON.stringify(users);
  $(this).remove();
  event.preventDefault();
};

var block_single_post_button = '<a class="hide-post" title="Скрыть псто" href="#">Скрыть псто</a>';
var unblock_single_post_button = '<a class="show-post" title="Показать псто" href="#">Показать псто</a>';
var block_users_posts_button = '<a class="hide-users-posts" title="Скрыть все посты пользователя" href="#"><img width="13" height="13" border="0" src="/gfx/delete.gif"></a>';

if(!localStorage.dd_ignore_single_posts) {
  localStorage.dd_ignore_single_posts = JSON.stringify({});
}
if(!localStorage.dd_ignore_users_posts) {
  localStorage.dd_ignore_users_posts = JSON.stringify({});
}

var ignored_users_posts = JSON.parse(localStorage.getItem('dd_ignore_users_posts'));
var ignore_list = '<div class="ignore-list"><h1 class="section">Забаненные пользователи</h1>';
for (var username in ignored_users_posts) {
  var uid = ignored_users_posts[username];
  hide_users_posts(uid);
  ignore_list += '<a class="show-users-posts ' + username + '-' + uid + '" title="Убрать пользователя из бана" href="#">' + username + '</a><br>';
}
ignore_list += '</div>';
$('.friendManagement').append(ignore_list);

$('div.leftPane  :nth-child(3n)').append(block_users_posts_button);
$('div.rightPane > header.entryList > div.meta > span').append(' | ' + block_single_post_button);
$('.hide-post').bind("click", add_to_ignore_single_post);
$('.show-post').bind("click", remove_from_ignore_single_post);
$('.hide-users-posts').bind("click", add_to_ignore_users_posts);
$('.show-users-posts').bind("click", remove_from_ignore_users_posts);

var ignored_posts = JSON.parse(localStorage.dd_ignore_single_posts);
for (var post in ignored_posts) {
  hide_single_post(post);
}
