import { IMetricsFilterAddon } from ".";

/**
 * @desc 
 * @summary 
 * @requires clientsdk library on installed on client application to use this patterns.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
 **/
export const DeviceVendor: IMetricsFilterAddon[] =
    [{ label: "Device Acer", pattern: "{$.payload.userAgent.device.vendor = \"Acer\"}", id: "device:acer" },
    { label: "Device Alcatel", pattern: "{$.payload.userAgent.device.vendor = \"Alcatel\"}", id: "device:alcatel" },
    { label: "Device Amazon", pattern: "{$.payload.userAgent.device.vendor = \"Amazon\"}", id: "device:amazon" },
    { label: "Device Apple", pattern: "{$.payload.userAgent.device.vendor = \"Apple\"}", id: "device:apple" },
    { label: "Device Archos", pattern: "{$.payload.userAgent.device.vendor = \"Archos\"}", id: "device:archos" },
    { label: "Device Asus", pattern: "{$.payload.userAgent.device.vendor = \"Asus\"}", id: "device:asus" },
    { label: "Device BenQ", pattern: "{$.payload.userAgent.device.vendor = \"BenQ\"}", id: "device:benq" },
    { label: "Device BlackBerry", pattern: "{$.payload.userAgent.device.vendor = \"BlackBerry\"}", id: "device:blackberry" },
    { label: "Device Dell", pattern: "{$.payload.userAgent.device.vendor = \"Dell\"}", id: "device:dell" },
    { label: "Device GeeksPhone", pattern: "{$.payload.userAgent.device.vendor = \"GeeksPhone\"}", id: "device:geeksphone" },
    { label: "Device Google", pattern: "{$.payload.userAgent.device.vendor = \"Google\"}", id: "device:google" },
    { label: "Device HP", pattern: "{$.payload.userAgent.device.vendor = \"HP\"}", id: "device:hp" },
    { label: "Device HTC", pattern: "{$.payload.userAgent.device.vendor = \"HTC\"}", id: "device:htc" },
    { label: "Device Huawei", pattern: "{$.payload.userAgent.device.vendor = \"Huawei\"}", id: "device:huawei" },
    { label: "Device Jolla", pattern: "{$.payload.userAgent.device.vendor = \"Jolla\"}", id: "device:jolla" },
    { label: "Device Lenovo", pattern: "{$.payload.userAgent.device.vendor = \"Lenovo\"}", id: "device:lenovo" },
    { label: "Device LG", pattern: "{$.payload.userAgent.device.vendor = \"LG\"}", id: "device:lg" },
    { label: "Device Meizu", pattern: "{$.payload.userAgent.device.vendor = \"Meizu\"}", id: "device:meizu" },
    { label: "Device Microsoft", pattern: "{$.payload.userAgent.device.vendor = \"Microsoft\"}", id: "device:microsoft" },
    { label: "Device Motorola", pattern: "{$.payload.userAgent.device.vendor = \"Motorola\"}", id: "device:motorola" },
    { label: "Device Nexian", pattern: "{$.payload.userAgent.device.vendor = \"Nexian\"}", id: "device:nexian" },
    { label: "Device Nintendo", pattern: "{$.payload.userAgent.device.vendor = \"Nintendo\"}", id: "device:nintendo" },
    { label: "Device Nokia", pattern: "{$.payload.userAgent.device.vendor = \"Nokia\"}", id: "device:nokia" },
    { label: "Device Nvidia", pattern: "{$.payload.userAgent.device.vendor = \"Nvidia\"}", id: "device:nvidia" },
    { label: "Device OnePlus", pattern: "{$.payload.userAgent.device.vendor = \"OnePlus\"}", id: "device:oneplus" },
    { label: "Device Ouya", pattern: "{$.payload.userAgent.device.vendor = \"Ouya\"}", id: "device:ouya" },
    { label: "Device Palm", pattern: "{$.payload.userAgent.device.vendor = \"Palm\"}", id: "device:palm" },
    { label: "Device Panasonic", pattern: "{$.payload.userAgent.device.vendor = \"Panasonic\"}", id: "device:panasonic" },
    { label: "Device Pebble", pattern: "{$.payload.userAgent.device.vendor = \"Pebble\"}", id: "device:pebble" },
    { label: "Device Polytron", pattern: "{$.payload.userAgent.device.vendor = \"Polytron\"}", id: "device:polytron" },
    { label: "Device RIM", pattern: "{$.payload.userAgent.device.vendor = \"RIM\"}", id: "device:rim" },
    { label: "Device Samsung", pattern: "{$.payload.userAgent.device.vendor = \"Samsung\"}", id: "device:samsung" },
    { label: "Device Sharp", pattern: "{$.payload.userAgent.device.vendor = \"Sharp\"}", id: "device:sharp" },
    { label: "Device Siemens", pattern: "{$.payload.userAgent.device.vendor = \"Siemens\"}", id: "device:siemens" },
    { label: "Device Sony[Ericsson]", pattern: "{$.payload.userAgent.device.vendor = \"Sony[Ericsson]\"}", id: "device:sony[ericsson]" },
    { label: "Device Sprint", pattern: "{$.payload.userAgent.device.vendor = \"Sprint\"}", id: "device:sprint" },
    { label: "Device Xbox", pattern: "{$.payload.userAgent.device.vendor = \"Xbox\"}", id: "device:xbox" },
    { label: "Device Xiaomi", pattern: "{$.payload.userAgent.device.vendor = \"Xiaomi\"}", id: "device:xiaomi" },
    { label: "Device ZTE", pattern: "{$.payload.userAgent.device.vendor = \"ZTE\"}", id: "device:zte" }]

export const DeviceType: IMetricsFilterAddon[] = [
    { id: "device:type:console", label: "console", pattern: "{$.payload.userAgent.device.type = \"console\"}" },
    { id: "device:type:mobile", label: "mobile", pattern: "{$.payload.userAgent.device.type = \"mobile\"}" },
    { id: "device:type:tablet", label: "tablet", pattern: "{$.payload.userAgent.device.type = \"tablet\"}" },
    { id: "device:type:smarttv", label: "smarttv", pattern: "{$.payload.userAgent.device.type = \"smarttv\"}" },
    { id: "device:type:wearable", label: "wearable", pattern: "{$.payload.userAgent.device.type = \"wearable\"}" },
    { id: "device:type:embedded", label: "embedded", pattern: "{$.payload.userAgent.device.type = \"embedded\"}" },
]

export const DeviceOS: IMetricsFilterAddon[] =
    [{ label: "OS AIX", pattern: "{$.payload.userAgent.os.name = \"AIX\"}", id: "os:aix" },
    { label: "OS Amiga OS", pattern: "{$.payload.userAgent.os.name = \"Amiga OS\"}", id: "os:amiga:os" },
    { label: "OS Android", pattern: "{$.payload.userAgent.os.name = \"Android\"}", id: "os:android" },
    { label: "OS Arch", pattern: "{$.payload.userAgent.os.name = \"Arch\"}", id: "os:arch" },
    { label: "OS Bada", pattern: "{$.payload.userAgent.os.name = \"Bada\"}", id: "os:bada" },
    { label: "OS BeOS", pattern: "{$.payload.userAgent.os.name = \"BeOS\"}", id: "os:beos" },
    { label: "OS BlackBerry", pattern: "{$.payload.userAgent.os.name = \"BlackBerry\"}", id: "os:blackberry" },
    { label: "OS CentOS", pattern: "{$.payload.userAgent.os.name = \"CentOS\"}", id: "os:centos" },
    { label: "OS Chromium OS", pattern: "{$.payload.userAgent.os.name = \"Chromium OS\"}", id: "os:chromium:os" },
    { label: "OS Contiki,Fedora", pattern: "{$.payload.userAgent.os.name = \"Contiki,Fedora\"}", id: "os:contiki,fedora" },
    { label: "OS Firefox OS", pattern: "{$.payload.userAgent.os.name = \"Firefox OS\"}", id: "os:firefox:os" },
    { label: "OS FreeBSD", pattern: "{$.payload.userAgent.os.name = \"FreeBSD\"}", id: "os:freebsd" },
    { label: "OS Debian", pattern: "{$.payload.userAgent.os.name = \"Debian\"}", id: "os:debian" },
    { label: "OS DragonFly", pattern: "{$.payload.userAgent.os.name = \"DragonFly\"}", id: "os:dragonfly" },
    { label: "OS Gentoo", pattern: "{$.payload.userAgent.os.name = \"Gentoo\"}", id: "os:gentoo" },
    { label: "OS GNU", pattern: "{$.payload.userAgent.os.name = \"GNU\"}", id: "os:gnu" },
    { label: "OS Haiku", pattern: "{$.payload.userAgent.os.name = \"Haiku\"}", id: "os:haiku" },
    { label: "OS Hurd", pattern: "{$.payload.userAgent.os.name = \"Hurd\"}", id: "os:hurd" },
    { label: "OS iOS", pattern: "{$.payload.userAgent.os.name = \"iOS\"}", id: "os:ios" },
    { label: "OS Joli", pattern: "{$.payload.userAgent.os.name = \"Joli\"}", id: "os:joli" },
    { label: "OS Linpus", pattern: "{$.payload.userAgent.os.name = \"Linpus\"}", id: "os:linpus" },
    { label: "OS Linux", pattern: "{$.payload.userAgent.os.name = \"Linux\"}", id: "os:linux" },
    { label: "OS Mac OS", pattern: "{$.payload.userAgent.os.name = \"Mac OS\"}", id: "os:mac:os" },
    { label: "OS Mageia", pattern: "{$.payload.userAgent.os.name = \"Mageia\"}", id: "os:mageia" },
    { label: "OS Mandriva", pattern: "{$.payload.userAgent.os.name = \"Mandriva\"}", id: "os:mandriva" },
    { label: "OS MeeGo", pattern: "{$.payload.userAgent.os.name = \"MeeGo\"}", id: "os:meego" },
    { label: "OS Minix", pattern: "{$.payload.userAgent.os.name = \"Minix\"}", id: "os:minix" },
    { label: "OS Mint", pattern: "{$.payload.userAgent.os.name = \"Mint\"}", id: "os:mint" },
    { label: "OS Morph OS", pattern: "{$.payload.userAgent.os.name = \"Morph OS\"}", id: "os:morph:os" },
    { label: "OS NetBSD", pattern: "{$.payload.userAgent.os.name = \"NetBSD\"}", id: "os:netbsd" },
    { label: "OS Nintendo", pattern: "{$.payload.userAgent.os.name = \"Nintendo\"}", id: "os:nintendo" },
    { label: "OS OpenBSD", pattern: "{$.payload.userAgent.os.name = \"OpenBSD\"}", id: "os:openbsd" },
    { label: "OS OpenVMS", pattern: "{$.payload.userAgent.os.name = \"OpenVMS\"}", id: "os:openvms" },
    { label: "OS OS/2", pattern: "{$.payload.userAgent.os.name = \"OS/2\"}", id: "os:os/2" },
    { label: "OS Palm", pattern: "{$.payload.userAgent.os.name = \"Palm\"}", id: "os:palm" },
    { label: "OS PC-BSD", pattern: "{$.payload.userAgent.os.name = \"PC-BSD\"}", id: "os:pc-bsd" },
    { label: "OS PCLinuxOS", pattern: "{$.payload.userAgent.os.name = \"PCLinuxOS\"}", id: "os:pclinuxos" },
    { label: "OS Plan9", pattern: "{$.payload.userAgent.os.name = \"Plan9\"}", id: "os:plan9" },
    { label: "OS Playstation", pattern: "{$.payload.userAgent.os.name = \"Playstation\"}", id: "os:playstation" },
    { label: "OS QNX", pattern: "{$.payload.userAgent.os.name = \"QNX\"}", id: "os:qnx" },
    { label: "OS RedHat", pattern: "{$.payload.userAgent.os.name = \"RedHat\"}", id: "os:redhat" },
    { label: "OS RIM Tablet OS", pattern: "{$.payload.userAgent.os.name = \"RIM Tablet OS\"}", id: "os:rim:tablet:os" },
    { label: "OS RISC OS", pattern: "{$.payload.userAgent.os.name = \"RISC OS\"}", id: "os:risc:os" },
    { label: "OS Sailfish", pattern: "{$.payload.userAgent.os.name = \"Sailfish\"}", id: "os:sailfish" },
    { label: "OS Series40", pattern: "{$.payload.userAgent.os.name = \"Series40\"}", id: "os:series40" },
    { label: "OS Slackware", pattern: "{$.payload.userAgent.os.name = \"Slackware\"}", id: "os:slackware" },
    { label: "OS Solaris", pattern: "{$.payload.userAgent.os.name = \"Solaris\"}", id: "os:solaris" },
    { label: "OS SUSE", pattern: "{$.payload.userAgent.os.name = \"SUSE\"}", id: "os:suse" },
    { label: "OS Symbian", pattern: "{$.payload.userAgent.os.name = \"Symbian\"}", id: "os:symbian" },
    { label: "OS Tizen", pattern: "{$.payload.userAgent.os.name = \"Tizen\"}", id: "os:tizen" },
    { label: "OS Ubuntu", pattern: "{$.payload.userAgent.os.name = \"Ubuntu\"}", id: "os:ubuntu" },
    { label: "OS UNIX", pattern: "{$.payload.userAgent.os.name = \"UNIX\"}", id: "os:unix" },
    { label: "OS VectorLinux", pattern: "{$.payload.userAgent.os.name = \"VectorLinux\"}", id: "os:vectorlinux" },
    { label: "OS WebOS", pattern: "{$.payload.userAgent.os.name = \"WebOS\"}", id: "os:webos" },
    { label: "OS Windows [Phone/Mobile]", pattern: "{$.payload.userAgent.os.name = \"Windows [Phone/Mobile]\"}", id: "os:windows:[phone/mobile]" },
    { label: "OS Zenwalk", pattern: "{$.payload.userAgent.os.name = \"Zenwalk\"}", id: "os:zenwalk" }]