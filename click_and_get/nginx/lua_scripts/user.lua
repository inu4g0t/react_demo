local cjson = require "cjson"

users = {}
ly = {}
ly.id = 1
ly.author = 'liyou'
ly.text = 'liyou\'s text'
zls = {}
zls.id = 2
zls.author = 'zangliansheng'
zls.text = 'zang zang zang'
users[1] = ly
users[2] = zls
ngx.say(cjson.encode(users))
