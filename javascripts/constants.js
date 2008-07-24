if (!("AirGrowl" in window)) {
    AirGrowl = {};
    MBX = AirGrowl;
}


AirGrowl.cssNamespace = "air-growl";

AirGrowl.log = function (txt) {
    air.Introspector.Console.log(txt);
}
