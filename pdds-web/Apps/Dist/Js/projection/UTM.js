/**
 * Created by wangtao on 2017/10/17.
 */


//http://home.hiwaay.net/~taylorc/toolbox/geography/geoutm.html

var pi = 3.14159265358979;

/* Ellipsoid model constants (actual values here are for WGS84) */
var sm_a = 6378137.0;
var sm_b = 6356752.314;
var sm_EccSquared = 6.69437999013e-03;

var UTMScaleFactor = 0.9996;


/*
 * DegToRad
 *
 * Converts degrees to radians.
 *
 */
function DegToRad (deg)
{
    return (deg / 180.0 * pi)
}




/*
 * RadToDeg
 *
 * Converts radians to degrees.
 *
 */
function RadToDeg (rad)
{
    return (rad / pi * 180.0)
}




/*
 * ArcLengthOfMeridian
 *
 * Computes the ellipsoidal distance from the equator to a point at a
 * given latitude.
 *
 * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
 * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
 *
 * Inputs:
 *     phi - Latitude of the point, in radians.
 *
 * Globals:
 *     sm_a - Ellipsoid model major axis.
 *     sm_b - Ellipsoid model minor axis.
 *
 * Returns:
 *     The ellipsoidal distance of the point from the equator, in meters.
 *
 */
function ArcLengthOfMeridian (phi)
{
    var alpha, beta, gamma, delta, epsilon, n;
    var result;

    /* Precalculate n */
    n = (sm_a - sm_b) / (sm_a + sm_b);

    /* Precalculate alpha */
    alpha = ((sm_a + sm_b) / 2.0)
        * (1.0 + (Math.pow (n, 2.0) / 4.0) + (Math.pow (n, 4.0) / 64.0));

    /* Precalculate beta */
    beta = (-3.0 * n / 2.0) + (9.0 * Math.pow (n, 3.0) / 16.0)
        + (-3.0 * Math.pow (n, 5.0) / 32.0);

    /* Precalculate gamma */
    gamma = (15.0 * Math.pow (n, 2.0) / 16.0)
        + (-15.0 * Math.pow (n, 4.0) / 32.0);

    /* Precalculate delta */
    delta = (-35.0 * Math.pow (n, 3.0) / 48.0)
        + (105.0 * Math.pow (n, 5.0) / 256.0);

    /* Precalculate epsilon */
    epsilon = (315.0 * Math.pow (n, 4.0) / 512.0);

    /* Now calculate the sum of the series and return */
    result = alpha
        * (phi + (beta * Math.sin (2.0 * phi))
        + (gamma * Math.sin (4.0 * phi))
        + (delta * Math.sin (6.0 * phi))
        + (epsilon * Math.sin (8.0 * phi)));

    return result;
}



/*
 * UTMCentralMeridian
 *
 * Determines the central meridian for the given UTM zone.
 *
 * Inputs:
 *     zone - An integer value designating the UTM zone, range [1,60].
 *
 * Returns:
 *   The central meridian for the given UTM zone, in radians, or zero
 *   if the UTM zone parameter is outside the range [1,60].
 *   Range of the central meridian is the radian equivalent of [-177,+177].
 *
 */
function UTMCentralMeridian (zone)
{
    var cmeridian;

    cmeridian = DegToRad (-183.0 + (zone * 6.0));

    return cmeridian;
}



/*
 * FootpointLatitude
 *
 * Computes the footpoint latitude for use in converting transverse
 * Mercator coordinates to ellipsoidal coordinates.
 *
 * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
 *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
 *
 * Inputs:
 *   y - The UTM northing coordinate, in meters.
 *
 * Returns:
 *   The footpoint latitude, in radians.
 *
 */
function FootpointLatitude (y)
{
    var y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
    var result;

    /* Precalculate n (Eq. 10.18) */
    n = (sm_a - sm_b) / (sm_a + sm_b);

    /* Precalculate alpha_ (Eq. 10.22) */
    /* (Same as alpha in Eq. 10.17) */
    alpha_ = ((sm_a + sm_b) / 2.0)
        * (1 + (Math.pow (n, 2.0) / 4) + (Math.pow (n, 4.0) / 64));

    /* Precalculate y_ (Eq. 10.23) */
    y_ = y / alpha_;

    /* Precalculate beta_ (Eq. 10.22) */
    beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow (n, 3.0) / 32.0)
        + (269.0 * Math.pow (n, 5.0) / 512.0);

    /* Precalculate gamma_ (Eq. 10.22) */
    gamma_ = (21.0 * Math.pow (n, 2.0) / 16.0)
        + (-55.0 * Math.pow (n, 4.0) / 32.0);

    /* Precalculate delta_ (Eq. 10.22) */
    delta_ = (151.0 * Math.pow (n, 3.0) / 96.0)
        + (-417.0 * Math.pow (n, 5.0) / 128.0);

    /* Precalculate epsilon_ (Eq. 10.22) */
    epsilon_ = (1097.0 * Math.pow (n, 4.0) / 512.0);

    /* Now calculate the sum of the series (Eq. 10.21) */
    result = y_ + (beta_ * Math.sin (2.0 * y_))
        + (gamma_ * Math.sin (4.0 * y_))
        + (delta_ * Math.sin (6.0 * y_))
        + (epsilon_ * Math.sin (8.0 * y_));

    return result;
}



/*
 * MapLatLonToXY
 *
 * Converts a latitude/longitude pair to x and y coordinates in the
 * Transverse Mercator projection.  Note that Transverse Mercator is not
 * the same as UTM; a scale factor is required to convert between them.
 *
 * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
 * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
 *
 * Inputs:
 *    phi - Latitude of the point, in radians.
 *    lambda - Longitude of the point, in radians.
 *    lambda0 - Longitude of the central meridian to be used, in radians.
 *
 * Outputs:
 *    xy - A 2-element array containing the x and y coordinates
 *         of the computed point.
 *
 * Returns:
 *    The function does not return a value.
 *
 */
function MapLatLonToXY (phi, lambda, lambda0, xy)
{
    var N, nu2, ep2, t, t2, l;
    var l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
    var tmp;

    /* Precalculate ep2 */
    ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0)) / Math.pow (sm_b, 2.0);

    /* Precalculate nu2 */
    nu2 = ep2 * Math.pow (Math.cos (phi), 2.0);

    /* Precalculate N */
    N = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nu2));

    /* Precalculate t */
    t = Math.tan (phi);
    t2 = t * t;
    tmp = (t2 * t2 * t2) - Math.pow (t, 6.0);

    /* Precalculate l */
    l = lambda - lambda0;

    /* Precalculate coefficients for l**n in the equations below
     so a normal human being can read the expressions for easting
     and northing
     -- l**1 and l**2 have coefficients of 1.0 */
    l3coef = 1.0 - t2 + nu2;

    l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);

    l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2
        - 58.0 * t2 * nu2;

    l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2
        - 330.0 * t2 * nu2;

    l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);

    l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);

    /* Calculate easting (x) */
    xy[0] = N * Math.cos (phi) * l
        + (N / 6.0 * Math.pow (Math.cos (phi), 3.0) * l3coef * Math.pow (l, 3.0))
        + (N / 120.0 * Math.pow (Math.cos (phi), 5.0) * l5coef * Math.pow (l, 5.0))
        + (N / 5040.0 * Math.pow (Math.cos (phi), 7.0) * l7coef * Math.pow (l, 7.0));

    /* Calculate northing (y) */
    xy[1] = ArcLengthOfMeridian (phi)
        + (t / 2.0 * N * Math.pow (Math.cos (phi), 2.0) * Math.pow (l, 2.0))
        + (t / 24.0 * N * Math.pow (Math.cos (phi), 4.0) * l4coef * Math.pow (l, 4.0))
        + (t / 720.0 * N * Math.pow (Math.cos (phi), 6.0) * l6coef * Math.pow (l, 6.0))
        + (t / 40320.0 * N * Math.pow (Math.cos (phi), 8.0) * l8coef * Math.pow (l, 8.0));

    return;
}



/*
 * MapXYToLatLon
 *
 * Converts x and y coordinates in the Transverse Mercator projection to
 * a latitude/longitude pair.  Note that Transverse Mercator is not
 * the same as UTM; a scale factor is required to convert between them.
 *
 * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
 *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
 *
 * Inputs:
 *   x - The easting of the point, in meters.
 *   y - The northing of the point, in meters.
 *   lambda0 - Longitude of the central meridian to be used, in radians.
 *
 * Outputs:
 *   philambda - A 2-element containing the latitude and longitude
 *               in radians.
 *
 * Returns:
 *   The function does not return a value.
 *
 * Remarks:
 *   The local variables Nf, nuf2, tf, and tf2 serve the same purpose as
 *   N, nu2, t, and t2 in MapLatLonToXY, but they are computed with respect
 *   to the footpoint latitude phif.
 *
 *   x1frac, x2frac, x2poly, x3poly, etc. are to enhance readability and
 *   to optimize computations.
 *
 */
function MapXYToLatLon (x, y, lambda0, philambda)
{
    var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
    var x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
    var x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;

    /* Get the value of phif, the footpoint latitude. */
    phif = FootpointLatitude (y);

    /* Precalculate ep2 */
    ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0))
        / Math.pow (sm_b, 2.0);

    /* Precalculate cos (phif) */
    cf = Math.cos (phif);

    /* Precalculate nuf2 */
    nuf2 = ep2 * Math.pow (cf, 2.0);

    /* Precalculate Nf and initialize Nfpow */
    Nf = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nuf2));
    Nfpow = Nf;

    /* Precalculate tf */
    tf = Math.tan (phif);
    tf2 = tf * tf;
    tf4 = tf2 * tf2;

    /* Precalculate fractional coefficients for x**n in the equations
     below to simplify the expressions for latitude and longitude. */
    x1frac = 1.0 / (Nfpow * cf);

    Nfpow *= Nf;   /* now equals Nf**2) */
    x2frac = tf / (2.0 * Nfpow);

    Nfpow *= Nf;   /* now equals Nf**3) */
    x3frac = 1.0 / (6.0 * Nfpow * cf);

    Nfpow *= Nf;   /* now equals Nf**4) */
    x4frac = tf / (24.0 * Nfpow);

    Nfpow *= Nf;   /* now equals Nf**5) */
    x5frac = 1.0 / (120.0 * Nfpow * cf);

    Nfpow *= Nf;   /* now equals Nf**6) */
    x6frac = tf / (720.0 * Nfpow);

    Nfpow *= Nf;   /* now equals Nf**7) */
    x7frac = 1.0 / (5040.0 * Nfpow * cf);

    Nfpow *= Nf;   /* now equals Nf**8) */
    x8frac = tf / (40320.0 * Nfpow);

    /* Precalculate polynomial coefficients for x**n.
     -- x**1 does not have a polynomial coefficient. */
    x2poly = -1.0 - nuf2;

    x3poly = -1.0 - 2 * tf2 - nuf2;

    x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2
        - 3.0 * (nuf2 *nuf2) - 9.0 * tf2 * (nuf2 * nuf2);

    x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;

    x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2
        + 162.0 * tf2 * nuf2;

    x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);

    x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);

    /* Calculate latitude */
    philambda[0] = phif + x2frac * x2poly * (x * x)
        + x4frac * x4poly * Math.pow (x, 4.0)
        + x6frac * x6poly * Math.pow (x, 6.0)
        + x8frac * x8poly * Math.pow (x, 8.0);

    /* Calculate longitude */
    philambda[1] = lambda0 + x1frac * x
        + x3frac * x3poly * Math.pow (x, 3.0)
        + x5frac * x5poly * Math.pow (x, 5.0)
        + x7frac * x7poly * Math.pow (x, 7.0);

    return;
}




/*
 * LatLonToUTMXY
 *
 * Converts a latitude/longitude pair to x and y coordinates in the
 * Universal Transverse Mercator projection.
 *
 * Inputs:
 *   lat - Latitude of the point, in radians.
 *   lon - Longitude of the point, in radians.
 *   zone - UTM zone to be used for calculating values for x and y.
 *          If zone is less than 1 or greater than 60, the routine
 *          will determine the appropriate zone from the value of lon.
 *
 * Outputs:
 *   xy - A 2-element array where the UTM x and y values will be stored.
 *
 * Returns:
 *   The UTM zone used for calculating the values of x and y.
 *
 */
function LatLonToUTMXY (lat, lon, zone, xy)
{
    MapLatLonToXY (lat, lon, UTMCentralMeridian (zone), xy);

    /* Adjust easting and northing for UTM system. */
    xy[0] = xy[0] * UTMScaleFactor + 500000.0;
    xy[1] = xy[1] * UTMScaleFactor;
    if (xy[1] < 0.0)
        xy[1] = xy[1] + 10000000.0;

    return zone;
}



/*
 * UTMXYToLatLon
 *
 * Converts x and y coordinates in the Universal Transverse Mercator
 * projection to a latitude/longitude pair.
 *
 * Inputs:
 *	x - The easting of the point, in meters.
 *	y - The northing of the point, in meters.
 *	zone - The UTM zone in which the point lies.
 *	southhemi - True if the point is in the southern hemisphere;
 *               false otherwise.
 *
 * Outputs:
 *	latlon - A 2-element array containing the latitude and
 *            longitude of the point, in radians.
 *
 * Returns:
 *	The function does not return a value.
 *
 */
function UTMXYToLatLon (x, y, zone, southhemi, latlon)
{
    var cmeridian;

    x -= 500000.0;
    x /= UTMScaleFactor;

    /* If in southern hemisphere, adjust y accordingly. */
    if (southhemi)
        y -= 10000000.0;

    y /= UTMScaleFactor;

    cmeridian = UTMCentralMeridian (zone);
    MapXYToLatLon (x, y, cmeridian, latlon);

    return;
}


/**
 * 经度转换为UTM坐标
 * @param lon
 * @param lat
 * @returns {{x: *, y: *, zone: (*|number)}}
 */
function lonlatToUTM (lon,lat)
{
    var xy = new Array(2);

    zone = Math.floor ((lon + 180.0) / 6) + 1;

    zone = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zone, xy);
    return {x:xy[0],y:xy[1],zone}
}


/**
 * UTM坐标转换成经纬度坐标
 * @param x
 * @param y
 * @param UTMZone
 * @returns {*}
 * @constructor
 */
function UTMToLonLat (x,y,UTMZone)
{
    var latlon = new Array(2);

    if ((UTMZone < 1) || (60 < UTMZone)) {
        alert ("The UTM zone you entered is out of range.  " +
            "Please enter a number in the range [1, 60].");
        return false;
    }

    let southhemi = false;

    UTMXYToLatLon (x, y, zone, southhemi, latlon);

    return [ RadToDeg (latlon[1]),RadToDeg (latlon[0])];
}

function UTMLetterDesignator(Lat) {
    //This routine determines the correct UTM letter designator for the given latitude
    //returns 'Z' if latitude is outside the UTM limits of 84N to 80S
    //Written by Chuck Gantz- chuck.gantz@globalstar.com
    var LetterDesignator;

    if ((84 >= Lat) && (Lat >= 72)) LetterDesignator = 'X';
    else if ((72 > Lat) && (Lat >= 64)) LetterDesignator = 'W';
    else if ((64 > Lat) && (Lat >= 56)) LetterDesignator = 'V';
    else if ((56 > Lat) && (Lat >= 48)) LetterDesignator = 'U';
    else if ((48 > Lat) && (Lat >= 40)) LetterDesignator = 'T';
    else if ((40 > Lat) && (Lat >= 32)) LetterDesignator = 'S';
    else if ((32 > Lat) && (Lat >= 24)) LetterDesignator = 'R';
    else if ((24 > Lat) && (Lat >= 16)) LetterDesignator = 'Q';
    else if ((16 > Lat) && (Lat >= 8)) LetterDesignator = 'P';
    else if ((8 > Lat) && (Lat >= 0)) LetterDesignator = 'N';
    else if ((0 > Lat) && (Lat >= -8)) LetterDesignator = 'M';
    else if ((-8 > Lat) && (Lat >= -16)) LetterDesignator = 'L';
    else if ((-16 > Lat) && (Lat >= -24)) LetterDesignator = 'K';
    else if ((-24 > Lat) && (Lat >= -32)) LetterDesignator = 'J';
    else if ((-32 > Lat) && (Lat >= -40)) LetterDesignator = 'H';
    else if ((-40 > Lat) && (Lat >= -48)) LetterDesignator = 'G';
    else if ((-48 > Lat) && (Lat >= -56)) LetterDesignator = 'F';
    else if ((-56 > Lat) && (Lat >= -64)) LetterDesignator = 'E';
    else if ((-64 > Lat) && (Lat >= -72)) LetterDesignator = 'D';
    else if ((-72 > Lat) && (Lat >= -80)) LetterDesignator = 'C';
    else LetterDesignator = 'Z'; //This is here as an error flag to show that the Latitude is outside the UTM limits

    return LetterDesignator;
}

function LLtoUTM(Long,Lat) {
    //converts lat/long to UTM coords.  Equations from USGS Bulletin 1532
    //East Longitudes are positive, West longitudes are negative.
    //North latitudes are positive, South latitudes are negative
    //Lat and Long are in decimal degrees
    //Written by Chuck Gantz- chuck.gantz@globalstar.com

    var a = 6378137;
    var eccSquared = 0.00669438;
    var k0 = 0.9996;
    var pi = 3.14159265;
    var deg2rad = pi / 180;

    var LongOrigin;
    var eccPrimeSquared;
    var N, T, C, A, M;

    //Make sure the longitude is between -180.00 .. 179.9
    var LongTemp = (Long + 180) - parseInt((Long + 180) / 360) * 360 - 180; // -180.00 .. 179.9;

    var LatRad = Lat * deg2rad;
    var LongRad = LongTemp * deg2rad;
    var LongOriginRad;
    var ZoneNumber;
    var Designator = '';

    ZoneNumber = parseInt((LongTemp + 180) / 6) + 1;

    Designator = UTMLetterDesignator(Lat);
    
    if (Lat >= 56.0 && Lat < 64.0 && LongTemp >= 3.0 && LongTemp < 12.0) {
        ZoneNumber = 32;
    }

    // Special zones for Svalbard
    if (Lat >= 72.0 && Lat < 84.0) {
        if (LongTemp >= 0.0 && LongTemp < 9.0) ZoneNumber = 31;
        else if (LongTemp >= 9.0 && LongTemp < 21.0) ZoneNumber = 33;
        else if (LongTemp >= 21.0 && LongTemp < 33.0) ZoneNumber = 35;
        else if (LongTemp >= 33.0 && LongTemp < 42.0) ZoneNumber = 37;
    }
    LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin in middle of zone
    LongOriginRad = LongOrigin * deg2rad;


    eccPrimeSquared = (eccSquared) / (1 - eccSquared);

    N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
    T = Math.tan(LatRad) * Math.tan(LatRad);
    C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
    A = Math.cos(LatRad) * (LongRad - LongOriginRad);

    M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 -
            5 * eccSquared * eccSquared * eccSquared / 256) * LatRad -
        (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 +
            45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) +
        (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) *
        Math.sin(4 * LatRad) -
        (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

    var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6 +
            (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A /
            120) +
        500000.0);

    var UTMNorthing = (k0 *
        (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24 +
            (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) *
            A * A * A * A * A * A / 720)));
    if (Lat < 0)
        UTMNorthing += 10000000.0; //10000000 meter offset for southern hemisphere
    return {
        x: UTMEasting,
        y: UTMNorthing,
        zoneNumber:ZoneNumber,
        designator:Designator
    }
}

function UTMtoLL(UTMEasting,UTMNorthing, ZoneNumber,designator) {
    var k0 = 0.9996;
    var a = 6378137;
    var eccSquared = 0.00669438;
    var eccPrimeSquared;
    var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
    var N1, T1, C1, R1, D, M;
    var LongOrigin;
    var mu, phi1, phi1Rad;
    var x, y;
    var PI = 3.14159265;
    var rad2deg = 180.0 / PI
    // var ZoneNumber;
    // char * ZoneLetter;
    // var NorthernHemisphere; //1 for northern hemispher, 0 for southern

    x = UTMEasting - 500000.0; //remove 500,000 meter offset for longitude
    y = UTMNorthing;

    // ZoneNumber = strtoul(UTMZone, & ZoneLetter, 10);
    if (designator.charCodeAt() - 'N'.charCodeAt()>=0){
        // NorthernHemisphere = 1; //point is in northern hemisphere
    }else {
        // NorthernHemisphere = 0; //point is in southern hemisphere
        y -= 10000000.0; //remove 10,000,000 meter offset used for southern hemisphere
    }

    LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin in middle of zone

    eccPrimeSquared = (eccSquared) / (1 - eccSquared);

    M = y / k0;
    mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 -
        5 * eccSquared * eccSquared * eccSquared / 256));

    phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) +
        (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) +
        (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
    phi1 = phi1Rad * rad2deg;

    N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
    D = x / (N1 * k0);

    Lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) *
        (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 +
            (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D *
            D * D * D * D / 720);
    Lat = Lat * rad2deg;

    Long = (D - (1 + 2 * T1 + C1) * D * D * D / 6 +
        (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) *
        D * D * D * D * D / 120) / Math.cos(phi1Rad);
    Long = LongOrigin + Long * rad2deg;
    return [Long,Lat]
}

function newPointList(p) {
    let new_p = p,
		Cx = 0,
    	Cy = 0,
    	Cz = 0;
    for(let i=0; i<p.length; i++){
		Cx += p[i].C[0][0];
		Cy += p[i].C[1][0];
		Cz += p[i].C[2][0];
    }
	let Cx_average = Cx / p.length,
		Cy_average = Cy / p.length,
		Cz_average = Cz / p.length;
	
	for(let s=0; s<p.length; s++){
		new_p[s].C[0][0] = p[s].C[0][0] - Cx_average;
		new_p[s].C[1][0] = p[s].C[1][0] - Cy_average;
		new_p[s].C[2][0] = p[s].C[2][0] - Cz_average;
		
		new_p[s].T = updatePointT(
			new_p[s]
		)
	}
	
	window.C_0 = [
		Cx_average, Cy_average, Cz_average
	];
	
	console.log(p)
	return new_p;
}

function updatePointT(p) {
    let new_T = matrix.multiply(matrix.scalar(_.cloneDeep(p.R), -1.0), p.C);
	return new_T;
}

function addGeometry(data){
	var new_list = [];
	
	for(let i=0; i<data.length; i++){
		let new_coordinates = [],
			old_coordinates = data[i].geometry.coordinates[0] || [];
		for(let s=0; s<old_coordinates.length; s++){
			let ll = LLtoUTM(
				old_coordinates[s][0],
				old_coordinates[s][1]
			)
			new_coordinates.push([
				ll.x, ll.y, old_coordinates[s][2]
			])
		}
		
		
		new_list.push({
			'geometry': {
				'coordinates': new_coordinates
			},
			'properties': data[i].properties,
			'type': data[i].type
		})
	}
	
	return new_list;
	
}