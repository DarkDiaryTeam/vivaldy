(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        $.md5 = md5;
    }
}(this));


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
	GM_setValue("dd_ignore_single_post", GM_getValue("dd_ignore_single_post", " ").replace(" " + pid + " ", " ") + pid + " ");
	hide_single_post(pid);
	//alert("Игнор-лист: \r\n" + GM_getValue("dd_ignore_single_post", " ").split(" ").join("\r\n"));
	event.preventDefault();
};

var remove_from_ignore_single_post = function(event) {
	var pid = get_post_id(this, 'show');
	GM_setValue("dd_ignore_single_post", GM_getValue("dd_ignore_single_post", " ").replace(" " + pid + " ", " "));
	show_single_post(pid);
	event.preventDefault();
};

var add_to_ignore_users_posts = function(event) {
	var user = get_user_name(this);
	var uid = get_user_id(this);
	GM_setValue("dd_ignore_users_posts", GM_getValue("dd_ignore_users_posts", " ").replace(" " + user + ":" + uid + " ", " ") + user + ":" + uid + " ");
	hide_users_posts(uid);
	//alert("Игнор-лист: \r\n" + GM_getValue("dd_ignore_users_posts", " ").split(" ").join("\r\n"));
	event.preventDefault();
};

var remove_from_ignore_users_posts = function(event) {
	var user_class = $(this).attr('class').split(" ")[1];
	var uid = user_class.split("-")[1];
	var username = user_class.split("-")[0];
	GM_setValue("dd_ignore_users_posts", GM_getValue("dd_ignore_users_posts", " ").replace(" " + username + ":" + uid + " ", " "));
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

var parse_message = function() {
	var messages = $('.jGrowl-message');
	var shown_messages_list = GM_getValue("dd_messages", " ").split(" ");
	if (messages.length) {
		$(messages).each(function(){
			var message = $(this);
			mid = md5(message);
			if (shown_messages_list.indexOf(mid) == -1){
				if ( $(message).children('p:contains("Вам пишло новое сообщение от пользователя")').length ) {
					var details = {};
					var username = $(message).find('a.messengerButton').text();
					var img = $(message).find('img');
					//details.image = 'http://darkdiary.ru' + $(message).children('img').attr('src');
					details.title = 'Личное сообщение от ' + username;
					details.text = trimSpaces($(message).children('p').last().replace(/(<([^>]+)>)/ig,""));
					details.timeout = 10;
					//GM_notification(details, function(mid){
						//GM_setValue("dd_messages", GM_getValue("dd_messages", " ").replace(" " + mid + " ", " "));
					//});
					GM_setValue("dd_messages", GM_getValue("dd_messages", " ").replace(" " + mid + " ", " ") + mid + " ");
				} else if ( $(message).children('a:contains("Открыть лог событий")').length ) {
					var details = {};
					details.text = trimSpaces($(message).text().replace(/(<([^>]+)>)/ig,""));
					details.title = 'Новый комментарий';
					details.timeout = 10;
					//GM_notification(details, function(mid){
						//GM_setValue("dd_messages", GM_getValue("dd_messages", " ").replace(" " + mid + " ", " "));
					//});
				}
			}
		});
	}
};


var block_single_post_button = '<a class="hide-post" title="Скрыть псто" href="#">Скрыть псто</a>';
var unblock_single_post_button = '<a class="show-post" title="Показать псто" href="#">Показать псто</a>';
var block_users_posts_button = '<a class="hide-users-posts" title="Зобанеть пидораса" href="#"><img width="13" height="13" border="0" src="/gfx/delete.gif"></a>';
var block_users_comments_button = '<a class="hide-users-comments" title="Развидеть комметы этого мудака" href="#"><img width="13" height="13" border="0" src="/gfx/entry_editor/del.png"></a>';

var ignored_users_posts = GM_getValue("dd_ignore_users_posts", " ").split(" ");
ignore_list = '<div class="ignore-list"><h1 class="section">Зобаненые мудаки</h1>';
for (user of ignored_users_posts) {
	var uid = user.split(":")[1];
	var username = user.split(":")[0];
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
//GM_setValue("dd_ignore_users_posts", " ");
//GM_setValue("dd_ignore_single_post", " ");

$("a:contains('_DARK_SKY_')").text("Фохсе");
$("a:contains('dark_one')").text("Лось");
$("img[src $= '/user_data/home/41/81950/avatar.jpg'").attr('src', 'http://fantasyflash.ru/avatar/ava_smesh/image/avsmesh2.jpg');

var ignored_posts = GM_getValue("dd_ignore_single_post", " ").split(" ");
ignored_posts.pop();
ignored_posts.shift();
for (post of ignored_posts) {
	hide_single_post(post);
}

//$().on("change", parse_message);
$(document).ready().bind("DOMNodeInserted", parse_message);

//$("a[href $= '/profile'] + a").after(" <a title='В игнор пидораса!' class = 'ignore' href = '#'><img width='13' height='13' border='0' src='/gfx/delete.gif'></img></a>");
//$(".ignore").bind("click", magic);
//$("td.textBlock:contains('Мой дневник')").parent().parent().parent().parent().parent().after("<tr><td style='padding-bottom:3px'>"+
//"<table cellspacing='0' cellpadding='0' class='tblCommon'><tbody><tr><td class='textBlock'><div style='padding-bottom:4px'><strong>Игнор</strong></div> <div>"+
//"<a id='showIgnoreList' href='#'>Игнор-лист</a><br><a id='toggleNotices' href='#'>" + 
//(noticeStyle == "display:none" ? "Показать оповещения" : "Скрыть оповещения")+"</a></div></td></tr></tbody></table></td></tr>");
//$("#showIgnoreList").bind("click", showIgnore);
//$("#toggleNotices").bind("click", toggleNotices);
//hide(GM_getValue("dd_ignore", " ").split(" "));
//$("a:contains('_Sirion')").text("Сирион");
//$("a:contains('Ioshk')").text("Картман");
//var text = 'ебать да кто то же написал коммент';
//var title = 'АХУЕТЬ';
//var image = 'http://darkdiary.ru/user_data/home/0c/82053/avatar.jpg';
//GM_notification(text, title, image, function(){});
