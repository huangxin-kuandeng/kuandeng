/**
 * Created by wangtao on 2017/10/17.
 */


//http://home.hiwaay.net/~taylorc/toolbox/geography/geoutm.html

var pi = 3.14159265358979310;

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
// function lonlatToUTM (lon,lat)
// {
//     var xy = new Array(2);

//     zone = Math.floor ((lon + 180.0) / 6) + 1;

//     zone = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zone, xy);
//     return {x:xy[0],y:xy[1],zone}
// }


/**
 * UTM坐标转换成经纬度坐标
 * @param x
 * @param y
 * @param UTMZone
 * @returns {*}
 * @constructor
 */
// function UTMToLonLat (x,y,UTMZone)
// {
//     var latlon = new Array(2);

//     if ((UTMZone < 1) || (60 < UTMZone)) {
//         alert ("The UTM zone you entered is out of range.  " +
//             "Please enter a number in the range [1, 60].");
//         return false;
//     }

//     let southhemi = false;

//     UTMXYToLatLon (x, y, zone, southhemi, latlon);

//     return [ RadToDeg (latlon[1]),RadToDeg (latlon[0])];
// }

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

function LLtoUTM_pre(Long,Lat) {
    //converts lat/long to UTM coords.  Equations from USGS Bulletin 1532
    //East Longitudes are positive, West longitudes are negative.
    //North latitudes are positive, South latitudes are negative
    //Lat and Long are in decimal degrees
    //Written by Chuck Gantz- chuck.gantz@globalstar.com

    var a = 6378137;
    var eccSquared =sm_EccSquared //0.00669438;
    var k0 = 0.9996;
     var pi = 3.14159265358979310;//3.14159265;
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

function UTMtoLL_pre(UTMEasting,UTMNorthing, ZoneNumber,designator) {
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






//#region benxing_version
const MGRS = {
    tile_: 100000,            // Size MGRS blocks
    minutmcol_: 1,
    maxutmcol_: 9,
    minutmSrow_: 10,
    maxutmSrow_: 100,         // Also used for UTM S false northing
    minutmNrow_: 0,           // Also used for UTM N false northing
    maxutmNrow_: 95,
    minupsSind_: 8,           // These 4 ind's apply to easting and northing
    maxupsSind_: 32,
    minupsNind_: 13,
    maxupsNind_: 27,
    upseasting_: 20,          // Also used for UPS false northing
    utmeasting_: 5,           // UTM false easting
    // Difference between S hemisphere northing and N hemisphere northing
    utmNshift_: 0
  }
  MGRS.utmNshift_ = (MGRS.maxutmSrow_ - MGRS.minutmNrow_) * MGRS.tile_;
  let ConstantsSet = {
    TransMercator :{
      WGS84_a:6378137 *1,// equatorial radius (meters).
      WGS84_f: 1 / ( 298257223563 / 1000000000 ),//flattening of ellipsoid.
      UTM_k0:9996 / 10000 // central scale factor
     }
  }
  let a = ConstantsSet.TransMercator.WGS84_a,
  f = ConstantsSet.TransMercator.WGS84_f,
  k0 =ConstantsSet.TransMercator.UTM_k0;
  let  maxpow_= Number(6),maxpow_1 = maxpow_  + 1,numit_ = 5;
  let  _a, _f, _k0, _e2, _es, _e2m,  _c, _n;
  let _a1, _b1;
  let _alp = [], _bet =[]; // length = maxpow_1 = 7
  
      _a = a;
      _f = (f <= 1 ? f : 1/f);
      _k0= k0;
      _e2 =(_f * (2 - _f));
      _es = ((f < 0 ? -1 : 1) * Math.sqrt(Math.abs(_e2)));
      _e2m = (1 - _e2);
        // _c = sqrt( pow(1 + _e, 1 + _e) * pow(1 - _e, 1 - _e) ) )
        // See, for example, Lee (1976), p 100.
      _c = ( Math.sqrt(_e2m) * Math.exp(eatanhe(parseFloat(1), _es)) );
      _n = (_f / (2 - _f));
  // _alp[0] and _bet[0] unused 
  
  // GEOGRAPHICLIB_TRANSVERSEMERCATOR_ORDER 取值判断(2 == 2 ? 6 : (2 == 1 ? 4 : 8))  
  // 以下取结果为6的情况
  let alpcoeff = [
    // alp[1]/n^1, polynomial in n of order 5
    31564, -66675, 34440, 47250, -100800, 75600, 151200,
    // alp[2]/n^2, polynomial in n of order 4
    -1983433, 863232, 748608, -1161216, 524160, 1935360,
    // alp[3]/n^3, polynomial in n of order 3
    670412, 406647, -533952, 184464, 725760,
    // alp[4]/n^4, polynomial in n of order 2
    6601661, -7732800, 2230245, 7257600,
    // alp[5]/n^5, polynomial in n of order 1
    -13675556, 3438171, 7983360,
    // alp[6]/n^6, polynomial in n of order 0
    212378941, 319334400,
  ],
  betcoeff = [
    // bet[1]/n^1, polynomial in n of order 5
    384796, -382725, -6720, 932400, -1612800, 1209600, 2419200,
    // bet[2]/n^2, polynomial in n of order 4
    -1118711, 1695744, -1174656, 258048, 80640, 3870720,
    // bet[3]/n^3, polynomial in n of order 3
    22276, -16929, -15984, 12852, 362880,
    // bet[4]/n^4, polynomial in n of order 2
    -830251, -158400, 197865, 7257600,
    // bet[5]/n^5, polynomial in n of order 1
    -435388, 453717, 15966720,
    // bet[6]/n^6, polynomial in n of order 0
    20648693, 638668800,
  ];
  // 没有匹配系数数组b1 alp bet的大小
  let b1coeff = [
    // b1*(n+1), polynomial in n2 of order 3
    1, 4, 64, 256, 256
  ]
  let m = maxpow_/2;
  _b1 = polyval(m, b1coeff, sq_(_n)) / (b1coeff[m + 1] * (1+_n));
  // _a1 is the equivalent radius for computing the circumference of
  // ellipse.
  _a1 = _b1 * _a;
  let o = 0;
  let d = _n;
  for (let l = 1; l <= maxpow_; ++l) {
      m = maxpow_ - l;
      //keng
      let tem_alpcoeff_o = alpcoeff.slice(o);
      let tem_betcoeff_o= betcoeff.slice(o);
  
      _alp[l] = d * polyval(m, tem_alpcoeff_o, _n) / alpcoeff[o + m + 1];
      _bet[l] = d * polyval(m, tem_betcoeff_o, _n) / betcoeff[o + m + 1];
      //默认不移位
      // _alp[l] = d * polyval(m, alpcoeff, _n) / alpcoeff[o + m + 1];
      // _bet[l] = d * polyval(m, betcoeff, _n) / betcoeff[o + m + 1];
      o += m + 2;
      d *= _n;
    }
  const falseeasting_ =
    [
      MGRS.upseasting_ * MGRS.tile_,
      MGRS.upseasting_ * MGRS.tile_,
      MGRS.utmeasting_ * MGRS.tile_,
      MGRS.utmeasting_ * MGRS.tile_
    ];
  const falsenorthing_ =
    [
      MGRS.upseasting_ * MGRS.tile_,
      MGRS.upseasting_ * MGRS.tile_,
      MGRS.maxutmSrow_ * MGRS.tile_,
      MGRS.minutmNrow_ * MGRS.tile_
    ]; 
    
  /**原c++代码  
   * template<typename T> static inline T polyval(int N, const T p[], T x)
  { T y = N < 0 ? 0 : *p++; while (--N >= 0) y = y * x + *p++; return y; }*/   
  
  
  function polyval_fail (N, p, x) {
  let  y = N < 0 ? 0: p[0];
    for(let i = 1;i <= N; i++){  
      y = y * x + p[i]; 
    }
    return y;
  }
  function polyval(N, p, x, s = 0) {
    var y = N < 0 ? 0 : p[s++];
    while (--N >= 0) y = y * x + p[s++];
    return y;
  };
  
  function CheckLatLon(lat, lon) {
    if (90 < lat || lat < -90 || lon < -540 || lon >= 540)
      console.error('经纬度数据输入有误');
    return;
  }
  function CentralMeridian(zone) {
    { return parseInt(6 * zone - 183); }
  }
  
  
  function LLtoUTM( lon_,lat_, setzone = null) {
    let zone1;
    let mgrslimits = false;
    let INVALID = -4;// for tempuse
    let lat = parseFloat(lat_),lon = parseFloat(lon_)
    CheckLatLon(lat, lon);
    let x1 = 0, y1 = 0, gamma1 = 0, k1 = 0;
    let northp1 = (lat > 0 ? true : false);
    if(setzone && !isNaN(setzone)){ /**1.使用传入带号 */
        zone1 = Number(setzone);
    } else { /**2.根据lon计算带号 */
        zone1 = standardZone(lat, lon);
    }
    if (zone1 == INVALID) {
      return;//keng 无提示
    }
    /**默认不考虑ups keng*/
    let utmp = true;
    // if (utmp) {
      let lon0 = CentralMeridian(zone1);
      // let  dlon = lon - lon0;
      // dlon = Math.abs(dlon - 360 * floor((dlon + 180) / 360));
      // if (!(dlon <= 60))
      // alert('获取xy出错');
    let obj_xyk = TransverseMercatorForward(lon0, lat, lon);  
    x1 = obj_xyk.x;y1 = obj_xyk.y;k1 = obj_xyk.k;gamma1 = obj_xyk.gamma;
    let ind = (utmp ? 2 : 0) + (northp1 ? 1 : 0);//int
    x1 += Number(falseeasting_[ind]);
    y1 += Number(falsenorthing_[ind]);
  
    let res = {
      zone: zone1,
      northp: northp1,
      x: x1,
      y: y1,
      gamma: gamma1,
      k: k1
    }

    let Designator = UTMLetterDesignator(lat_);
    let res_ = {
        x: x1,
        y: y1,
        zoneNumber:zone1,
        designator: Designator
    }

    return res_;
  }
  function CheckCoords(utmp, northp, x, y,
    mgrslimits, throwp) {
  
  }
  
  function standardZone(lat, lon) {
    let ilon = parseInt(lon);// int 
    if (ilon >= 180)
      ilon -= 360;
    else if (ilon < -180)
      ilon += 360;
    let zone = parseInt((ilon + 186) / 6); //int
    let band = LatitudeBand(lat);//int
    if (band == 7 && zone == 31 && ilon >= 3)
      zone = 32;
    else if (band == 9 && ilon >= 0 && ilon < 42)
      zone = 2 * ((ilon + 183) / 12) + 1;
    return zone;
  }
  
  function LatitudeBand(lat) {
    let ilat = parseInt(lat);
    let _ilat = parseInt((ilat + 80) / 8 - 10);
    let res = (_ilat > 9 ? 9 : (_ilat > -10 ? _ilat : -10));
    return res;
  }
  
  function taupf(tau, es) {
    let tau1 = Math.hypot(1, tau),
      sig = Math.sinh( eatanhe(tau / tau1, es ) );
    return Math.hypot(1, sig) * tau - sig * tau1;
  }
  function eatanhe(x,  es)  {
    return es > 0 ? es * Math.atanh(es * x) : -es * Math.atan(es * x);
  }
  //测量xy
  function TransverseMercatorForward(lon0, lat, lon){
    let x, y, gamma, k;
   lon = (AngDiff_(lon0, lon)).s;
  let latsign = lat < 0 ? -1 : 1,
   lonsign = lon < 0 ? -1 : 1;
  lon *= lonsign;
  lat *= latsign;
  let backside = (lon > 90? true: false);
  if (backside) {
      if (lat == 0)
        latsign = -1;
      lon = 180 - lon;
    }
  
   let phi = lat * (Math.PI/180),
    lam = lon * (Math.PI/180);
    let  etap, xip;
    if (lat != 90) {
   let  c = Math.max(parseFloat(0), Math.cos(lam)), // cos(pi/2) might be negative
        tau = Math.tan(phi),
        taup = taupf(tau, _es);
      xip = Math.atan2(taup, c);
      // Used to be
      //   etap = Math::atanh(sin(lam) / cosh(psi));
      etap = Math.asinh(Math.sin(lam) / Math.hypot(taup, c));
      // convergence and scale for Gauss-Schreiber TM (xip, etap) -- gamma0 =
      // atan(tan(xip) * tanh(etap)) = atan(tan(lam) * sin(phi'));
      // sin(phi') = tau'/sqrt(1 + tau'^2)
      gamma = Math.atan(tand_(lon) *
                   taup / Math.hypot(parseFloat(1), taup)); // Krueger p 22 (44)
      // k0 = sqrt(1 - _e2 * sin(phi)^2) * (cos(phi') / cos(phi)) * cosh(etap)
      // Note 1/cos(phi) = cosh(psip);
      // and cos(phi') * cosh(etap) = 1/hypot(sinh(psi), cos(lam))
      //
      // This form has cancelling errors.  This property is lost if cosh(psip)
      // is replaced by 1/cos(phi), even though it's using "primary" data (phi
      // instead of psip).
      k = Math.sqrt(_e2m + _e2 * sq_(Math.cos(phi))) * Math.hypot(parseFloat(1), tau)
        / Math.hypot(taup, c);
    } else {
      xip = Math.PI/2;
      etap = 0;
      gamma = lam;
      k = _c;
    }
  //---
  let  c0 = Math.cos(2 * xip), ch0 = Math.cosh(2 * etap),
    s0 = Math.sin(2 * xip), sh0 = Math.sinh(2 * etap),
    ar = 2 * c0 * ch0, ai = -2 * s0 * sh0; // 2 * cos(2*zeta')
    
  let n = maxpow_;
  let
    xi0 = (n & 1 ? _alp[n] : 0), eta0 = 0,
    xi1 = 0, eta1 = 0;
  let                        // Accumulators for dzeta/dzeta'
    yr0 = (n & 1 ? 2 * maxpow_ * _alp[n--] : 0), yi0 = 0,
    yr1 = 0, yi1 = 0;
  while (n) {
    xi1  = ar * xi0 - ai * eta0 - xi1 + _alp[n];
    eta1 = ai * xi0 + ar * eta0 - eta1;
    yr1 = ar * yr0 - ai * yi0 - yr1 + 2 * n * _alp[n];
    yi1 = ai * yr0 + ar * yi0 - yi1;
    --n;
    xi0  = ar * xi1 - ai * eta1 - xi0 + _alp[n];
    eta0 = ai * xi1 + ar * eta1 - eta0;
    yr0 = ar * yr1 - ai * yi1 - yr0 + 2 * n * _alp[n];
    yi0 = ai * yr1 + ar * yi1 - yi0;
    --n;
  }
  ar /= 2; ai /= 2;           // cos(2*zeta')
  yr1 = 1 - yr1 + ar * yr0 - ai * yi0;
  yi1 =   - yi1 + ai * yr0 + ar * yi0;
  ar = s0 * ch0; ai = c0 * sh0; // sin(2*zeta')
  let
    xi  = xip  + ar * xi0 - ai * eta0,
    eta = etap + ai * xi0 + ar * eta0;
  // Fold in change in convergence and scale for Gauss-Schreiber TM to
  // Gauss-Krueger TM.
  gamma -= Math.atan2(yi1, yr1);
  k *= _b1 * Math.hypot(yr1, yi1);
  gamma /=  (Math.PI/180);
  y = _a1 * _k0 * (backside ? Math.PI - xi : xi) * latsign;
  x = _a1 * _k0 * eta * lonsign;
  if (backside)
    {gamma = 180 - gamma;}
  gamma *= latsign * lonsign;
  k *= _k0;
  
  let res_ = {
    x: x,
    y: y,
    gamma: gamma,
    k: k
  }
  return res_;
  }
  function AngNormalize(x){
     return x >= 180 ? x - 360 : (x < -180 ? x + 360 : x);
  }
  function AngNormalize_(x)
  {
  x = remainder_(x, 360);
  return x == -180 ? 180 : x;
  }
  function remainder_(x, y) {
    x = x % y;
    return x < -y/2 ? x + y : (x < y/2 ? x : x - y);
  };
  function AngDiff(x,y) {
    let t=0, d = sumFn(-x, y);
    if ((d - 180) + t > 0) // y - x > 180
      d -= 360;            // exact
    else if ((d + 180) + t <= 0) // y - x <= -180
      d += 360;            // exact
    return d + t;
  }
  function AngDiff_(x, y) {
    // Compute y - x and reduce to [-180,180] accurately.
    var r = sum_(AngNormalize_(-x), AngNormalize_(y)),
        d =AngNormalize_(r.s),
        t = r.t;
    return sum_(d === 180 && t > 0 ? -180 : d, t);
  };
  function sumFn(a,b) {
   return Number(a)+Number(b)
  }
  function sum_(u, v) {
      var s = u + v,
          up = s - v,
          vpp = s - up,
          t;
      up -= u;
      vpp -= v;
      t = -(up + vpp);
      // u + v =       s      + t
      //       = round(u + v) + t
      return {s: s, t: t};
   
  }
  function sq_(x){
    return Number(x)*Number(x)
  }
  function tand_(x) {
     const  overflow = 1 / sq_(Math.pow(0.5, 53 - 1)); //双精度
    return Math.abs(x) != 90 ? Math.tan(x * (Math.PI/180)) : (x < 0 ? -overflow : overflow);
  }
  /**utm转经纬度 */
  function UTMtoLL(x_,  y_, zone_) {
    let northp = true,  mgrslimits = false;
    let zone = parseFloat(zone_),  x = parseFloat(x_),  y = parseFloat(y_)
    let INVALID = -4,// for tempuse
    MINZONE = 0,
    MAXZONE = 60;
    if (zone == INVALID || isNaN(x) || isNaN(y)) {
      lat = lon = gamma = k = 'isNaN';
      return;
    }
    if (!(zone >= MINZONE && zone <= MAXZONE)) {
      console.error('zone 取值范围有误')
    }   
    let utmp = true;
    // CheckCoords(utmp, northp, x, y, mgrslimits);
    let ind = (utmp ? 2 : 0) + (northp ? 1 : 0);
    x -= falseeasting_[ind];
    y -= falsenorthing_[ind];
    let zone0 = CentralMeridian(zone);
    let res;
    if (utmp){
      res = TransverseMercatorReverse(zone0, x, y);//gamma k取值没有限制
    }
    return res; 
   
  }
  function TransverseMercatorReverse(lon0,  x,  y,gamma =0, k=0)
   {
      // This undoes the steps in Forward.  The wrinkles are: (1) Use of the
      // reverted series to express zeta' in terms of zeta. (2) Newton's method
      // to solve for phi in terms of tan(phi).
      let //real
        xi = y / (_a1 * _k0),
        eta = x / (_a1 * _k0);
      // Explicitly enforce the parity
      let //int
        xisign = xi < 0 ? -1 : 1,
        etasign = eta < 0 ? -1 : 1;
      xi *= xisign;
      eta *= etasign;
      let backside = xi > Math.PI/2; //bool
      if (backside)
        xi = (Math.PI/180) - xi;
      let //real
        c0 = Math.cos(2 * xi), ch0 = Math.cosh(2 * eta),
        s0 = Math.sin(2 * xi), sh0 = Math.sinh(2 * eta),
        ar = 2 * c0 * ch0, ai = -2 * s0 * sh0; // 2 * cos(2*zeta)
      let n = maxpow_; //int
      let //real                        // Accumulators for zeta'
        xip0 = (n & 1 ? -_bet[n] : 0), etap0 = 0,
        xip1 = 0, etap1 = 0;
      let //real                     
        yr0 = (n & 1 ? - 2 * maxpow_ * _bet[n--] : 0), yi0 = 0,
        yr1 = 0, yi1 = 0;
      while (n) {
        xip1  = ar * xip0 - ai * etap0 - xip1 - _bet[n];
        etap1 = ai * xip0 + ar * etap0 - etap1;
        yr1 = ar * yr0 - ai * yi0 - yr1 - 2 * n * _bet[n];
        yi1 = ai * yr0 + ar * yi0 - yi1;
        --n;
        xip0  = ar * xip1 - ai * etap1 - xip0 - _bet[n];
        etap0 = ai * xip1 + ar * etap1 - etap0;
        yr0 = ar * yr1 - ai * yi1 - yr0 - 2 * n * _bet[n];
        yi0 = ai * yr1 + ar * yi1 - yi0;
        --n;
      }
      ar /= 2; ai /= 2;           // cos(2*zeta')
      yr1 = 1 - yr1 + ar * yr0 - ai * yi0;
      yi1 =   - yi1 + ai * yr0 + ar * yi0;
      ar = s0 * ch0; ai = c0 * sh0; // sin(2*zeta)
      let //real
        xip  = xi  + ar * xip0 - ai * etap0,
        etap = eta + ai * xip0 + ar * etap0;
      // Convergence and scale for Gauss-Schreiber TM to Gauss-Krueger TM.
      gamma = Math.atan2(yi1, yr1);
      k = _b1 / Math.hypot(yr1, yi1);
      // JHS 154 has
      //
      //   phi' = asin(sin(xi') / cosh(eta')) (Krueger p 17 (25))
      //   lam = asin(tanh(eta') / cos(phi')
      //   psi = asinh(tan(phi'))
      let //real 
      lam, phi;
      let //real
        s = Math.sinh(etap),
        c = Math.max(parseFloat(0), Math.cos(xip)), // cos(pi/2) might be negative
        r = Math.hypot(s, c);
      if (r != 0) {
        lam = Math.atan2(s, c);        // Krueger p 17 (25)
        // Use Newton's method to solve for tau
       let// real
          sxip = Math.sin(xip),
          tau = tauf(sxip/r, _es);
        gamma += Math.atan2(sxip * Math.tanh(etap), c); // Krueger p 19 (31)
        phi = Math.atan(tau);
        // Note cos(phi') * cosh(eta') = r
        k *= Math.sqrt(_e2m + _e2 * sq_(Math.cos(phi))) *
          Math.hypot(parseFloat(1), tau) * r;
      } else {
        phi = Math.PI/2;
        lam = 0;
        k *= _c;
      }
      lat = phi / (Math.PI/180) * xisign;
      lon = lam / (Math.PI/180);
      if (backside)
        lon = 180 - lon;
      lon *= etasign;
      lon = AngNormalize_(lon + AngNormalize_(lon0));
      gamma /=(Math.PI/180);
      if (backside)
        gamma = 180 - gamma;
      gamma *= xisign * etasign;
      k *= _k0;
  
      let res = {
        lon: lon, lat:lat, gamma:gamma ,k: k
      }
      let res_ = [lon,lat];
      return res_
    }
  function tauf(taup,es) {
    const numit = 5;
    const  tol = Math.sqrt( Math.pow(0.5, 53 - 1)) / parseFloat(10);
    let e2m = parseFloat(1) - sq_(es),
      // To lowest order in e^2, taup = (1 - e^2) * tau = _e2m * tau; so use
      // tau = taup/_e2m as a starting guess.  (This starting guess is the
      // geocentric latitude which, to first order in the flattening, is equal
      // to the conformal latitude.)  Only 1 iteration is needed for |lat| <
      // 3.35 deg, otherwise 2 iterations are needed.  If, instead, tau = taup
      // is used the mean number of iterations increases to 1.99 (2 iterations
      // are needed except near tau = 0).
      tau = taup/e2m,
      stol = tol * Math.max(parseFloat(1), Math.abs(taup));
    // min iterations = 1, max iterations = 2; mean = 1.94
    for (let i = 0; i < numit; ++i) {
      // for (let i = 0; i < numit || GEOGRAPHICLIB_PANIC; ++i) {  keng GEOGRAPHICLIB_PANIC: false
      let taupa = taupf(tau, es),
        dtau = (taup - taupa) * (1 + e2m * sq_(tau)) /
        ( e2m * Math.hypot(parseFloat(1), tau) * Math.hypot(parseFloat(1), taupa) );
      tau += dtau;
      if (!(Math.abs(dtau) >= stol))
        break;
    }
    return tau;
  }
  //#endregion