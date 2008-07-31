if (!("AirGrowl" in window)) {
    AirGrowl = {};
    MBX = AirGrowl;
}

AirGrowl.log = function (txt) {
    air.Introspector.Console.log(txt);
}
