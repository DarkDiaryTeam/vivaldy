/*
 * Россыпь вспомогательных функций.
 */

function get_user_name(elem) {
  return $(elem).siblings("a[href $= '/profile']").attr("href").replace("/users/","").replace("/profile","");
};

function get_user_id(elem) {
  return $(elem).siblings(".messengerButton").attr("href").replace("/messaging/messenger?to_uid=","");
};

function get_post_id(elem, action) {
  if (action == 'show') {
    return $(elem).parent().attr('class').split(' ')[2];
  }
  return $(elem).parent().parent().parent().parent().parent().attr('class').split(' ')[2];
};

function trimSpaces(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");
  return s;
};
