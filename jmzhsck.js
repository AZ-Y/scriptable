使用声明：⚠️⚠️⚠️此脚本仅供学习与交流，
        请勿转载与贩卖！⚠️⚠️⚠️

[Script]
http-request ^https:\/\/openapi\.jmzawushe\.com\/member\/signRecord script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jmzhs.js, timeout=10, enabled=true, tag=九木杂货社Cookies


[Task]
cron "30 6 * * *" script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jmzhsck.js, timeout=3600, tag=九木杂物社


[MITM]
hostname = openapi.jmzawushe.com
