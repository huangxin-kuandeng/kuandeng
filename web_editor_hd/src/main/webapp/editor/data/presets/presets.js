iD.data.presets.presets = {
    "address": {
        "fields": [
            "address"
        ],
        "geometry": [
            "point"
        ],
        "tags": {
            "addr:housenumber": "*"
        },
        "addTags": {},
        "removeTags": {},
        "matchScore": 0.2,
        "name": "Address"
    },
    "aerialway": {
        "fields": [
            "aerialway"
        ],
        "geometry": [
            "point",
            "vertex",
            "line"
        ],
        "tags": {
            "aerialway": "*"
        },
        "terms": [
            "ski lift",
            "funifor",
            "funitel"
        ],
        "name": "Aerialway"
    },
    "aerialway/cable_car": {
        "geometry": [
            "line"
        ],
        "terms": [
            "tramway",
            "ropeway"
        ],
        "fields": [
            "aerialway/occupancy",
            "aerialway/capacity",
            "aerialway/duration",
            "aerialway/heating"
        ],
        "tags": {
            "aerialway": "cable_car"
        },
        "name": "Cable Car"
    },
    "aerialway/chair_lift": {
        "geometry": [
            "line"
        ],
        "fields": [
            "aerialway/occupancy",
            "aerialway/capacity",
            "aerialway/duration",
            "aerialway/bubble",
            "aerialway/heating"
        ],
        "tags": {
            "aerialway": "chair_lift"
        },
        "name": "Chair Lift"
    },
    "aerialway/gondola": {
        "geometry": [
            "line"
        ],
        "fields": [
            "aerialway/occupancy",
            "aerialway/capacity",
            "aerialway/duration",
            "aerialway/bubble",
            "aerialway/heating"
        ],
        "tags": {
            "aerialway": "gondola"
        },
        "name": "Gondola"
    },
    "aerialway/magic_carpet": {
        "geometry": [
            "line"
        ],
        "fields": [
            "aerialway/capacity",
            "aerialway/duration",
            "aerialway/heating"
        ],
        "tags": {
            "aerialway": "magic_carpet"
        },
        "name": "Magic Carpet Lift"
    },
    "aerialway/platter": {
        "geometry": [
            "line"
        ],
        "terms": [
            "button lift",
            "poma lift"
        ],
        "fields": [
            "aerialway/capacity",
            "aerialway/duration"
        ],
        "tags": {
            "aerialway": "platter"
        },
        "name": "Platter Lift"
    },
    "aerialway/pylon": {
        "geometry": [
            "point",
            "vertex"
        ],
        "fields": [
            "ref"
        ],
        "tags": {
            "aerialway": "pylon"
        },
        "name": "Aerialway Pylon"
    },
    "aerialway/rope_tow": {
        "geometry": [
            "line"
        ],
        "terms": [
            "handle tow",
            "bugel lift"
        ],
        "fields": [
            "aerialway/capacity",
            "aerialway/duration"
        ],
        "tags": {
            "aerialway": "rope_tow"
        },
        "name": "Rope Tow Lift"
    },
    "aerialway/station": {
        "geometry": [
            "point",
            "vertex"
        ],
        "fields": [
            "aerialway/access",
            "aerialway/summer/access",
            "elevation"
        ],
        "tags": {
            "aerialway": "station"
        },
        "name": "Aerialway Station"
    },
    "aerialway/t-bar": {
        "geometry": [
            "line"
        ],
        "fields": [
            "aerialway/capacity",
            "aerialway/duration"
        ],
        "tags": {
            "aerialway": "t-bar"
        },
        "name": "T-bar Lift"
    },
    "aeroway": {
        "icon": "airport",
        "fields": [
            "aeroway"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "aeroway": "*"
        },
        "name": "Aeroway"
    },
    "aeroway/aerodrome": {
        "icon": "airport",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "airplane",
            "airport",
            "aerodrome"
        ],
        "fields": [
            "ref",
            "iata",
            "icao",
            "operator"
        ],
        "tags": {
            "aeroway": "aerodrome"
        },
        "name": "Airport"
    },
    "aeroway/apron": {
        "icon": "airport",
        "geometry": [
            "area"
        ],
        "terms": [
            "ramp"
        ],
        "fields": [
            "ref",
            "surface"
        ],
        "tags": {
            "aeroway": "apron"
        },
        "name": "Apron"
    },
    "aeroway/gate": {
        "icon": "airport",
        "geometry": [
            "point"
        ],
        "fields": [
            "ref"
        ],
        "tags": {
            "aeroway": "gate"
        },
        "name": "Airport gate"
    },
    "aeroway/hangar": {
        "geometry": [
            "area"
        ],
        "fields": [
            "building_area"
        ],
        "tags": {
            "aeroway": "hangar"
        },
        "name": "Hangar"
    },
    "aeroway/helipad": {
        "icon": "heliport",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "helicopter",
            "helipad",
            "heliport"
        ],
        "tags": {
            "aeroway": "helipad"
        },
        "name": "Helipad"
    },
    "aeroway/runway": {
        "geometry": [
            "line",
            "area"
        ],
        "terms": [
            "landing strip"
        ],
        "fields": [
            "ref",
            "surface",
            "length",
            "width"
        ],
        "tags": {
            "aeroway": "runway"
        },
        "name": "Runway"
    },
    "aeroway/taxiway": {
        "geometry": [
            "line"
        ],
        "fields": [
            "ref",
            "surface"
        ],
        "tags": {
            "aeroway": "taxiway"
        },
        "name": "Taxiway"
    },
    "aeroway/terminal": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "airport",
            "aerodrome"
        ],
        "fields": [
            "operator",
            "building_area"
        ],
        "tags": {
            "aeroway": "terminal"
        },
        "name": "Airport terminal"
    },
    "amenity": {
        "fields": [
            "amenity"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "*"
        },
        "name": "Amenity"
    },
    "amenity/arts_centre": {
        "name": "Arts Center",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "arts",
            "arts centre"
        ],
        "tags": {
            "amenity": "arts_centre"
        },
        "icon": "theatre",
        "fields": [
            "building_area",
            "address"
        ]
    },
    "amenity/atm": {
        "icon": "bank",
        "fields": [
            "operator"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "amenity": "atm"
        },
        "name": "ATM"
    },
    "amenity/bank": {
        "icon": "bank",
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "coffer",
            "countinghouse",
            "credit union",
            "depository",
            "exchequer",
            "fund",
            "hoard",
            "investment firm",
            "repository",
            "reserve",
            "reservoir",
            "safe",
            "savings",
            "stock",
            "stockpile",
            "store",
            "storehouse",
            "thrift",
            "treasury",
            "trust company",
            "vault"
        ],
        "tags": {
            "amenity": "bank"
        },
        "name": "Bank"
    },
    "amenity/bar": {
        "icon": "bar",
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "bar"
        },
        "terms": [],
        "name": "Bar"
    },
    "amenity/bbq": {
        "geometry": [
            "point"
        ],
        "tags": {
            "amenity": "bbq"
        },
        "fields": [
            "covered",
            "fuel"
        ],
        "terms": [
            "barbecue",
            "bbq",
            "grill"
        ],
        "name": "Barbecue/Grill"
    },
    "amenity/bench": {
        "geometry": [
            "point",
            "vertex",
            "line"
        ],
        "tags": {
            "amenity": "bench"
        },
        "fields": [
            "backrest"
        ],
        "name": "Bench"
    },
    "amenity/bicycle_parking": {
        "icon": "bicycle",
        "fields": [
            "bicycle_parking",
            "capacity",
            "operator",
            "covered",
            "access_simple"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "bicycle_parking"
        },
        "name": "Bicycle Parking"
    },
    "amenity/bicycle_rental": {
        "icon": "bicycle",
        "fields": [
            "capacity",
            "network",
            "operator"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "bicycle_rental"
        },
        "name": "Bicycle Rental"
    },
    "amenity/boat_rental": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "boat_rental"
        },
        "fields": [
            "operator"
        ],
        "name": "Boat Rental"
    },
    "amenity/bus_station": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "bus_station"
        },
        "fields": [
            "operator"
        ],
        "name": "Bus Station"
    },
    "amenity/cafe": {
        "icon": "cafe",
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "coffee",
            "tea",
            "coffee shop"
        ],
        "tags": {
            "amenity": "cafe"
        },
        "name": "Cafe"
    },
    "amenity/car_rental": {
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "car_rental"
        },
        "fields": [
            "operator"
        ],
        "name": "Car Rental"
    },
    "amenity/car_sharing": {
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "car_sharing"
        },
        "fields": [
            "operator",
            "capacity"
        ],
        "name": "Car Sharing"
    },
    "amenity/car_wash": {
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "car_wash"
        },
        "fields": [
            "building_area"
        ],
        "name": "Car Wash"
    },
    "amenity/charging_station": {
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "charging_station"
        },
        "fields": [
            "operator"
        ],
        "terms": [
            "EV",
            "Electric Vehicle",
            "Supercharger"
        ],
        "name": "Charging Station"
    },
    "amenity/childcare": {
        "icon": "school",
        "fields": [
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "nursery",
            "orphanage",
            "playgroup"
        ],
        "tags": {
            "amenity": "childcare"
        },
        "name": "Childcare"
    },
    "amenity/cinema": {
        "icon": "cinema",
        "fields": [
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "big screen",
            "bijou",
            "cine",
            "drive-in",
            "film",
            "flicks",
            "motion pictures",
            "movie house",
            "movie theater",
            "moving pictures",
            "nabes",
            "photoplay",
            "picture show",
            "pictures",
            "playhouse",
            "show",
            "silver screen"
        ],
        "tags": {
            "amenity": "cinema"
        },
        "name": "Cinema"
    },
    "amenity/clinic": {
        "name": "Clinic",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "clinic",
            "medical clinic"
        ],
        "tags": {
            "amenity": "clinic"
        },
        "icon": "hospital",
        "fields": [
            "building_area",
            "address",
            "opening_hours"
        ]
    },
    "amenity/clock": {
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "amenity": "clock"
        },
        "name": "Clock"
    },
    "amenity/college": {
        "icon": "college",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "college"
        },
        "terms": [],
        "name": "College"
    },
    "amenity/compressed_air": {
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "compressed_air"
        },
        "name": "Compressed Air"
    },
    "amenity/courthouse": {
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "courthouse"
        },
        "name": "Courthouse"
    },
    "amenity/dentist": {
        "name": "Dentist",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "dentist",
            "dentist's office"
        ],
        "tags": {
            "amenity": "dentist"
        },
        "icon": "hospital",
        "fields": [
            "building_area",
            "address",
            "opening_hours"
        ]
    },
    "amenity/doctor": {
        "name": "Doctor",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "doctor",
            "doctor's office"
        ],
        "tags": {
            "amenity": "doctors"
        },
        "icon": "hospital",
        "fields": [
            "building_area",
            "address",
            "opening_hours"
        ]
    },
    "amenity/dojo": {
        "icon": "pitch",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "martial arts",
            "dojo",
            "dojang"
        ],
        "tags": {
            "amenity": "dojo"
        },
        "fields": [
            "address",
            "sport"
        ],
        "name": "Dojo / Martial Arts Academy"
    },
    "amenity/drinking_water": {
        "icon": "water",
        "geometry": [
            "point"
        ],
        "tags": {
            "amenity": "drinking_water"
        },
        "terms": [
            "water fountain",
            "potable water"
        ],
        "name": "Drinking Water"
    },
    "amenity/embassy": {
        "geometry": [
            "area",
            "point"
        ],
        "tags": {
            "amenity": "embassy"
        },
        "fields": [
            "country",
            "building_area"
        ],
        "icon": "embassy",
        "name": "Embassy"
    },
    "amenity/fast_food": {
        "icon": "fast-food",
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "fast_food"
        },
        "terms": [],
        "name": "Fast Food"
    },
    "amenity/fire_station": {
        "icon": "fire-station",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "fire_station"
        },
        "terms": [],
        "name": "Fire Station"
    },
    "amenity/fountain": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "amenity": "fountain"
        },
        "name": "Fountain"
    },
    "amenity/fuel": {
        "icon": "fuel",
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "petrol",
            "fuel",
            "propane",
            "diesel",
            "lng",
            "cng",
            "biodiesel"
        ],
        "tags": {
            "amenity": "fuel"
        },
        "name": "Gas Station"
    },
    "amenity/grave_yard": {
        "icon": "cemetery",
        "fields": [
            "religion",
            "denomination"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "grave_yard"
        },
        "name": "Graveyard"
    },
    "amenity/hospital": {
        "icon": "hospital",
        "fields": [
            "emergency",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "clinic",
            "emergency room",
            "health service",
            "hospice",
            "infirmary",
            "institution",
            "nursing home",
            "rest home",
            "sanatorium",
            "sanitarium",
            "sick bay",
            "surgery",
            "ward"
        ],
        "tags": {
            "amenity": "hospital"
        },
        "name": "Hospital Grounds"
    },
    "amenity/kindergarten": {
        "icon": "school",
        "fields": [
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "nursery",
            "preschool"
        ],
        "tags": {
            "amenity": "kindergarten"
        },
        "name": "Kindergarten Grounds"
    },
    "amenity/library": {
        "icon": "library",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "library"
        },
        "terms": [],
        "name": "Library"
    },
    "amenity/marketplace": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "marketplace"
        },
        "fields": [
            "building_area"
        ],
        "name": "Marketplace"
    },
    "amenity/nightclub": {
        "icon": "bar",
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "nightclub"
        },
        "terms": [
            "disco*",
            "night club",
            "dancing",
            "dance club"
        ],
        "name": "Nightclub"
    },
    "amenity/parking": {
        "icon": "parking",
        "fields": [
            "parking",
            "capacity",
            "fee",
            "access_simple",
            "supervised",
            "park_ride",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "parking"
        },
        "terms": [],
        "name": "Car Parking"
    },
    "amenity/parking_entrance": {
        "icon": "entrance",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "amenity": "parking_entrance"
        },
        "fields": [
            "access_simple",
            "ref"
        ],
        "name": "Parking Garage Entrance/Exit"
    },
    "amenity/pharmacy": {
        "icon": "pharmacy",
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "pharmacy"
        },
        "terms": [],
        "name": "Pharmacy"
    },
    "amenity/place_of_worship": {
        "icon": "place-of-worship",
        "fields": [
            "religion",
            "denomination",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "abbey",
            "basilica",
            "bethel",
            "cathedral",
            "chancel",
            "chantry",
            "chapel",
            "church",
            "fold",
            "house of God",
            "house of prayer",
            "house of worship",
            "minster",
            "mission",
            "mosque",
            "oratory",
            "parish",
            "sacellum",
            "sanctuary",
            "shrine",
            "synagogue",
            "tabernacle",
            "temple"
        ],
        "tags": {
            "amenity": "place_of_worship"
        },
        "name": "Place of Worship"
    },
    "amenity/place_of_worship/buddhist": {
        "icon": "place-of-worship",
        "fields": [
            "denomination",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "stupa",
            "vihara",
            "monastery",
            "temple",
            "pagoda",
            "zendo",
            "dojo"
        ],
        "tags": {
            "amenity": "place_of_worship",
            "religion": "buddhist"
        },
        "name": "Buddhist Temple"
    },
    "amenity/place_of_worship/christian": {
        "icon": "religious-christian",
        "fields": [
            "denomination",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "christian",
            "abbey",
            "basilica",
            "bethel",
            "cathedral",
            "chancel",
            "chantry",
            "chapel",
            "church",
            "fold",
            "house of God",
            "house of prayer",
            "house of worship",
            "minster",
            "mission",
            "oratory",
            "parish",
            "sacellum",
            "sanctuary",
            "shrine",
            "tabernacle",
            "temple"
        ],
        "tags": {
            "amenity": "place_of_worship",
            "religion": "christian"
        },
        "name": "Church"
    },
    "amenity/place_of_worship/jewish": {
        "icon": "religious-jewish",
        "fields": [
            "denomination",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "jewish",
            "synagogue"
        ],
        "tags": {
            "amenity": "place_of_worship",
            "religion": "jewish"
        },
        "name": "Synagogue"
    },
    "amenity/place_of_worship/muslim": {
        "icon": "religious-muslim",
        "fields": [
            "denomination",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "muslim",
            "mosque"
        ],
        "tags": {
            "amenity": "place_of_worship",
            "religion": "muslim"
        },
        "name": "Mosque"
    },
    "amenity/police": {
        "icon": "police",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "badge",
            "bear",
            "blue",
            "bluecoat",
            "bobby",
            "boy scout",
            "bull",
            "constable",
            "constabulary",
            "cop",
            "copper",
            "corps",
            "county mounty",
            "detective",
            "fed",
            "flatfoot",
            "force",
            "fuzz",
            "gendarme",
            "gumshoe",
            "heat",
            "law",
            "law enforcement",
            "man",
            "narc",
            "officers",
            "patrolman",
            "police"
        ],
        "tags": {
            "amenity": "police"
        },
        "name": "Police"
    },
    "amenity/post_box": {
        "icon": "post",
        "fields": [
            "operator",
            "collection_times"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "amenity": "post_box"
        },
        "terms": [
            "letter drop",
            "letterbox",
            "mail drop",
            "mailbox",
            "pillar box",
            "postbox"
        ],
        "name": "Mailbox"
    },
    "amenity/post_office": {
        "icon": "post",
        "fields": [
            "operator",
            "collection_times",
            "building_area"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "post_office"
        },
        "name": "Post Office"
    },
    "amenity/pub": {
        "icon": "beer",
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "pub"
        },
        "terms": [],
        "name": "Pub"
    },
    "amenity/ranger_station": {
        "fields": [
            "building_area",
            "opening_hours",
            "operator",
            "phone"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "visitor center",
            "visitor centre",
            "permit center",
            "permit centre",
            "backcountry office",
            "warden office",
            "warden center"
        ],
        "tags": {
            "amenity": "ranger_station"
        },
        "name": "Ranger Station"
    },
    "amenity/recycling": {
        "icon": "recycling",
        "fields": [
            "recycling/cans",
            "recycling/glass",
            "recycling/paper",
            "recycling/clothes"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [],
        "tags": {
            "amenity": "recycling"
        },
        "name": "Recycling"
    },
    "amenity/restaurant": {
        "icon": "restaurant",
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "bar",
            "cafeteria",
            "caf??",
            "canteen",
            "chophouse",
            "coffee shop",
            "diner",
            "dining room",
            "dive*",
            "doughtnut shop",
            "drive-in",
            "eatery",
            "eating house",
            "eating place",
            "fast-food place",
            "fish and chips",
            "greasy spoon",
            "grill",
            "hamburger stand",
            "hashery",
            "hideaway",
            "hotdog stand",
            "inn",
            "joint*",
            "luncheonette",
            "lunchroom",
            "night club",
            "outlet*",
            "pizzeria",
            "saloon",
            "soda fountain",
            "watering hole"
        ],
        "tags": {
            "amenity": "restaurant"
        },
        "name": "Restaurant"
    },
    "amenity/school": {
        "icon": "school",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "academy",
            "alma mater",
            "blackboard",
            "college",
            "department",
            "discipline",
            "establishment",
            "faculty",
            "hall",
            "halls of ivy",
            "institute",
            "institution",
            "jail*",
            "schoolhouse",
            "seminary",
            "university"
        ],
        "tags": {
            "amenity": "school"
        },
        "name": "School Grounds"
    },
    "amenity/shelter": {
        "fields": [
            "shelter_type"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "shelter"
        },
        "terms": [
            "lean-to"
        ],
        "name": "Shelter"
    },
    "amenity/social_facility": {
        "name": "Social Facility",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "amenity": "social_facility"
        },
        "fields": [
            "social_facility_for",
            "address",
            "phone",
            "opening_hours",
            "wheelchair",
            "operator"
        ]
    },
    "amenity/social_facility/food_bank": {
        "name": "Food Bank",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "amenity": "social_facility",
            "social_facility": "food_bank"
        },
        "fields": [
            "social_facility_for",
            "address",
            "phone",
            "opening_hours",
            "wheelchair",
            "operator"
        ]
    },
    "amenity/social_facility/group_home": {
        "name": "Group Home",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "elderly",
            "old",
            "senior living"
        ],
        "tags": {
            "amenity": "social_facility",
            "social_facility": "group_home",
            "social_facility_for": "senior"
        },
        "fields": [
            "social_facility_for",
            "address",
            "phone",
            "opening_hours",
            "wheelchair",
            "operator"
        ]
    },
    "amenity/social_facility/homeless_shelter": {
        "name": "Homeless Shelter",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "houseless",
            "unhoused",
            "displaced"
        ],
        "tags": {
            "amenity": "social_facility",
            "social_facility": "shelter",
            "social_facility:for": "homeless"
        },
        "fields": [
            "social_facility_for",
            "address",
            "phone",
            "opening_hours",
            "wheelchair",
            "operator"
        ]
    },
    "amenity/studio": {
        "name": "Studio",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "recording studio",
            "studio",
            "radio",
            "radio studio",
            "television",
            "television studio"
        ],
        "tags": {
            "amenity": "studio"
        },
        "icon": "music",
        "fields": [
            "building_area",
            "studio_type",
            "address"
        ]
    },
    "amenity/swimming_pool": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "swimming_pool"
        },
        "icon": "swimming",
        "searchable": false,
        "name": "Swimming Pool"
    },
    "amenity/taxi": {
        "fields": [
            "operator",
            "capacity"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "cab"
        ],
        "tags": {
            "amenity": "taxi"
        },
        "name": "Taxi Stand"
    },
    "amenity/telephone": {
        "icon": "telephone",
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "amenity": "telephone"
        },
        "terms": [
            "phone"
        ],
        "name": "Telephone"
    },
    "amenity/theatre": {
        "icon": "theatre",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "theatre",
            "performance",
            "play",
            "musical"
        ],
        "tags": {
            "amenity": "theatre"
        },
        "name": "Theater"
    },
    "amenity/toilets": {
        "fields": [
            "toilets/disposal",
            "operator",
            "building_area",
            "access_toilets"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "bathroom",
            "restroom",
            "outhouse",
            "privy",
            "head",
            "lavatory",
            "latrine",
            "water closet",
            "WC",
            "W.C."
        ],
        "tags": {
            "amenity": "toilets"
        },
        "icon": "toilets",
        "name": "Toilets"
    },
    "amenity/townhall": {
        "icon": "town-hall",
        "fields": [
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "village hall",
            "city government",
            "courthouse",
            "municipal building",
            "municipal center",
            "municipal centre"
        ],
        "tags": {
            "amenity": "townhall"
        },
        "name": "Town Hall"
    },
    "amenity/university": {
        "icon": "college",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "amenity": "university"
        },
        "terms": [
            "college"
        ],
        "name": "University"
    },
    "amenity/vending_machine": {
        "fields": [
            "vending",
            "operator"
        ],
        "geometry": [
            "point"
        ],
        "tags": {
            "amenity": "vending_machine"
        },
        "name": "Vending Machine"
    },
    "amenity/veterinary": {
        "fields": [],
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "pet clinic",
            "veterinarian",
            "animal hospital",
            "pet doctor"
        ],
        "tags": {
            "amenity": "veterinary"
        },
        "name": "Veterinary"
    },
    "amenity/waste_basket": {
        "icon": "waste-basket",
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "amenity": "waste_basket"
        },
        "terms": [
            "rubbish bin",
            "litter bin",
            "trash can",
            "garbage can"
        ],
        "name": "Waste Basket"
    },
    "area": {
        "name": "Area",
        "tags": {
            "area": "yes"
        },
        "geometry": [
            "area"
        ],
        "matchScore": 0.1
    },
    "barrier": {
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "barrier": "*"
        },
        "fields": [
            "barrier"
        ],
        "name": "Barrier"
    },
    "barrier/block": {
        "fields": [
            "access"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "barrier": "block"
        },
        "name": "Block"
    },
    "barrier/bollard": {
        "fields": [
            "access"
        ],
        "geometry": [
            "point",
            "vertex",
            "line"
        ],
        "tags": {
            "barrier": "bollard"
        },
        "name": "Bollard"
    },
    "barrier/cattle_grid": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "barrier": "cattle_grid"
        },
        "name": "Cattle Grid"
    },
    "barrier/city_wall": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "barrier": "city_wall"
        },
        "name": "City Wall"
    },
    "barrier/cycle_barrier": {
        "fields": [
            "access"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "barrier": "cycle_barrier"
        },
        "name": "Cycle Barrier"
    },
    "barrier/ditch": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "barrier": "ditch"
        },
        "name": "Ditch"
    },
    "barrier/entrance": {
        "icon": "entrance",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "barrier": "entrance"
        },
        "name": "Entrance",
        "searchable": false
    },
    "barrier/fence": {
        "geometry": [
            "line"
        ],
        "tags": {
            "barrier": "fence"
        },
        "name": "Fence"
    },
    "barrier/gate": {
        "fields": [
            "access"
        ],
        "geometry": [
            "point",
            "vertex",
            "line"
        ],
        "tags": {
            "barrier": "gate"
        },
        "name": "Gate"
    },
    "barrier/hedge": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "barrier": "hedge"
        },
        "name": "Hedge"
    },
    "barrier/kissing_gate": {
        "fields": [
            "access"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "barrier": "kissing_gate"
        },
        "name": "Kissing Gate"
    },
    "barrier/lift_gate": {
        "fields": [
            "access"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "barrier": "lift_gate"
        },
        "name": "Lift Gate"
    },
    "barrier/retaining_wall": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "barrier": "retaining_wall"
        },
        "name": "Retaining Wall"
    },
    "barrier/stile": {
        "fields": [
            "access"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "barrier": "stile"
        },
        "name": "Stile"
    },
    "barrier/toll_booth": {
        "fields": [
            "access"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "barrier": "toll_booth"
        },
        "name": "Toll Booth"
    },
    "barrier/wall": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "barrier": "wall"
        },
        "name": "Wall"
    },
    "boundary/administrative": {
        "name": "Administrative Boundary",
        "geometry": [
            "line"
        ],
        "tags": {
            "boundary": "administrative"
        },
        "fields": [
            "admin_level"
        ]
    },
    "building": {
        "icon": "building",
        "fields": [
            "building",
            "levels",
            "address"
        ],
        "geometry": [
            "area"
        ],
        "tags": {
            "building": "*"
        },
        "terms": [],
        "name": "Building"
    },
    "building/apartments": {
        "icon": "commercial",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "apartments"
        },
        "name": "Apartments"
    },
    "building/barn": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "barn"
        },
        "name": "Barn"
    },
    "building/bunker": {
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "bunker"
        },
        "name": "Bunker",
        "searchable": false
    },
    "building/cabin": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "cabin"
        },
        "name": "Cabin"
    },
    "building/cathedral": {
        "icon": "place-of-worship",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "cathedral"
        },
        "name": "Cathedral"
    },
    "building/chapel": {
        "icon": "place-of-worship",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "chapel"
        },
        "name": "Chapel"
    },
    "building/church": {
        "icon": "place-of-worship",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "church"
        },
        "name": "Church"
    },
    "building/commercial": {
        "icon": "commercial",
        "fields": [
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "commercial"
        },
        "name": "Commercial Building"
    },
    "building/construction": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "construction"
        },
        "name": "Building Under Construction"
    },
    "building/detached": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "detached"
        },
        "name": "Detached Home"
    },
    "building/dormitory": {
        "icon": "building",
        "fields": [
            "address",
            "levels",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "dormitory"
        },
        "name": "Dormitory"
    },
    "building/entrance": {
        "icon": "entrance",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "building": "entrance"
        },
        "name": "Entrance/Exit",
        "searchable": false
    },
    "building/garage": {
        "fields": [
            "capacity"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "garage"
        },
        "name": "Garage",
        "icon": "warehouse"
    },
    "building/garages": {
        "icon": "warehouse",
        "fields": [
            "capacity"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "garages"
        },
        "name": "Garages"
    },
    "building/greenhouse": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "greenhouse"
        },
        "name": "Greenhouse"
    },
    "building/hospital": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "hospital"
        },
        "name": "Hospital Building"
    },
    "building/hotel": {
        "icon": "building",
        "fields": [
            "address",
            "levels",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "hotel"
        },
        "name": "Hotel Building"
    },
    "building/house": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "building": "house"
        },
        "name": "House"
    },
    "building/hut": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "hut"
        },
        "name": "Hut"
    },
    "building/industrial": {
        "icon": "industrial",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "industrial"
        },
        "name": "Industrial Building"
    },
    "building/public": {
        "icon": "building",
        "fields": [
            "address",
            "levels",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "public"
        },
        "name": "Public Building"
    },
    "building/residential": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "residential"
        },
        "name": "Residential Building"
    },
    "building/retail": {
        "icon": "building",
        "fields": [
            "address",
            "levels",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "retail"
        },
        "name": "Retail Building"
    },
    "building/roof": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "roof"
        },
        "name": "Roof"
    },
    "building/school": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "school"
        },
        "name": "School Building"
    },
    "building/shed": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "shed"
        },
        "name": "Shed"
    },
    "building/stable": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "stable"
        },
        "name": "Stable"
    },
    "building/static_caravan": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "static_caravan"
        },
        "name": "Static Mobile Home"
    },
    "building/terrace": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "terrace"
        },
        "name": "Row Houses"
    },
    "building/train_station": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "train_station"
        },
        "name": "Train Station",
        "searchable": false
    },
    "building/university": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "university"
        },
        "name": "University Building"
    },
    "building/warehouse": {
        "icon": "building",
        "fields": [
            "address",
            "levels"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "building": "warehouse"
        },
        "name": "Warehouse"
    },
    "craft/basket_maker": {
        "name": "Basket Maker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "basket",
            "basketry",
            "basket maker",
            "basket weaver"
        ],
        "tags": {
            "craft": "basket_maker"
        },
        "icon": "art-gallery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/beekeeper": {
        "name": "Beekeeper",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "bees",
            "beekeeper",
            "bee box"
        ],
        "tags": {
            "craft": "beekeeper"
        },
        "icon": "farm",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/blacksmith": {
        "name": "Blacksmith",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "blacksmith"
        ],
        "tags": {
            "craft": "blacksmith"
        },
        "icon": "farm",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/boatbuilder": {
        "name": "Boat Builder",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "boat builder"
        ],
        "tags": {
            "craft": "boatbuilder"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/bookbinder": {
        "name": "Bookbinder",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "bookbinder",
            "book repair"
        ],
        "tags": {
            "craft": "bookbinder"
        },
        "icon": "library",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/brewery": {
        "name": "Brewery",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "brewery"
        ],
        "tags": {
            "craft": "brewery"
        },
        "icon": "beer",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/carpenter": {
        "name": "Carpenter",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "carpenter",
            "woodworker"
        ],
        "tags": {
            "craft": "carpenter"
        },
        "icon": "logging",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/carpet_layer": {
        "name": "Carpet Layer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "carpet layer"
        ],
        "tags": {
            "craft": "carpet_layer"
        },
        "icon": "square",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/caterer": {
        "name": "Caterer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "Caterer",
            "Catering"
        ],
        "tags": {
            "craft": "caterer"
        },
        "icon": "bakery",
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/clockmaker": {
        "name": "Clockmaker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "clock",
            "clockmaker",
            "clock repair"
        ],
        "tags": {
            "craft": "clockmaker"
        },
        "icon": "circle-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/confectionary": {
        "name": "Confectionary",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "confectionary",
            "sweets",
            "candy"
        ],
        "tags": {
            "craft": "confectionary"
        },
        "icon": "bakery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/dressmaker": {
        "name": "Dressmaker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "dress",
            "dressmaker"
        ],
        "tags": {
            "craft": "dressmaker"
        },
        "icon": "clothing-store",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/electrician": {
        "name": "Electrician",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "electrician"
        ],
        "tags": {
            "craft": "electrician"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/gardener": {
        "name": "Gardener",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "gardener",
            "landscaper",
            "grounds keeper"
        ],
        "tags": {
            "craft": "gardener"
        },
        "icon": "garden",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/glaziery": {
        "name": "Glaziery",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "glass",
            "glass foundry",
            "stained-glass",
            "window"
        ],
        "tags": {
            "craft": "glaziery"
        },
        "icon": "fire-station",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/handicraft": {
        "name": "Handicraft",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "handicraft"
        ],
        "tags": {
            "craft": "handicraft"
        },
        "icon": "art-gallery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/hvac": {
        "name": "HVAC",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "heating",
            "ventilating",
            "air-conditioning",
            "air conditioning"
        ],
        "tags": {
            "craft": "hvac"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/insulator": {
        "name": "Insulator",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "insulation",
            "insulator"
        ],
        "tags": {
            "craft": "insulation"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/jeweler": {
        "name": "Jeweler",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "jeweler",
            "gem",
            "diamond"
        ],
        "tags": {
            "craft": "jeweler"
        },
        "icon": "marker-stroked",
        "searchable": false,
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/key_cutter": {
        "name": "Key Cutter",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "key",
            "key cutter"
        ],
        "tags": {
            "craft": "key_cutter"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/locksmith": {
        "name": "Locksmith",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "locksmith",
            "lock"
        ],
        "tags": {
            "craft": "locksmith"
        },
        "icon": "marker-stroked",
        "searchable": false,
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/metal_construction": {
        "name": "Metal Construction",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "metal construction"
        ],
        "tags": {
            "craft": "metal_construction"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/optician": {
        "name": "Optician",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "glasses",
            "optician"
        ],
        "tags": {
            "craft": "optician"
        },
        "icon": "marker-stroked",
        "searchable": false,
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/painter": {
        "name": "Painter",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "painter"
        ],
        "tags": {
            "craft": "painter"
        },
        "icon": "art-gallery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/photographer": {
        "name": "Photographer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "photographer"
        ],
        "tags": {
            "craft": "photographer"
        },
        "icon": "camera",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/photographic_laboratory": {
        "name": "Photographic Laboratory",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "photographic laboratory",
            "film developer"
        ],
        "tags": {
            "craft": "photographic_laboratory"
        },
        "icon": "camera",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/plasterer": {
        "name": "Plasterer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "plasterer"
        ],
        "tags": {
            "craft": "plasterer"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/plumber": {
        "name": "Plumber",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "pumber"
        ],
        "tags": {
            "craft": "plumber"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/pottery": {
        "name": "Pottery",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "pottery",
            "potter"
        ],
        "tags": {
            "craft": "pottery"
        },
        "icon": "art-gallery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/rigger": {
        "name": "Rigger",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "rigger"
        ],
        "tags": {
            "craft": "rigger"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/roofer": {
        "name": "Roofer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "roofer"
        ],
        "tags": {
            "craft": "roofer"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/saddler": {
        "name": "Saddler",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "saddler"
        ],
        "tags": {
            "craft": "saddler"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/sailmaker": {
        "name": "Sailmaker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "sailmaker"
        ],
        "tags": {
            "craft": "sailmaker"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/sawmill": {
        "name": "Sawmill",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "sawmill",
            "lumber"
        ],
        "tags": {
            "craft": "sawmill"
        },
        "icon": "park",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/scaffolder": {
        "name": "Scaffolder",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "scaffolder"
        ],
        "tags": {
            "craft": "scaffolder"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/sculpter": {
        "name": "Sculpter",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "sculpter"
        ],
        "tags": {
            "craft": "sculpter"
        },
        "icon": "art-gallery",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/shoemaker": {
        "name": "Shoemaker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "shoe repair",
            "shoemaker"
        ],
        "tags": {
            "craft": "shoemaker"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/stonemason": {
        "name": "Stonemason",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "stonemason",
            "masonry"
        ],
        "tags": {
            "craft": "stonemason"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/sweep": {
        "name": "Chimney Sweep",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "sweep",
            "chimney sweep"
        ],
        "tags": {
            "craft": "sweep"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/tailor": {
        "name": "Tailor",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "tailor",
            "clothes"
        ],
        "tags": {
            "craft": "tailor"
        },
        "icon": "clothing-store",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ],
        "searchable": false
    },
    "craft/tiler": {
        "name": "Tiler",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "tiler"
        ],
        "tags": {
            "craft": "tiler"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/tinsmith": {
        "name": "Tinsmith",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "tinsmith"
        ],
        "tags": {
            "craft": "tinsmith"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/upholsterer": {
        "name": "Upholsterer",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "upholsterer"
        ],
        "tags": {
            "craft": "upholsterer"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/watchmaker": {
        "name": "Watchmaker",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "watch",
            "watchmaker",
            "watch repair"
        ],
        "tags": {
            "craft": "watchmaker"
        },
        "icon": "circle-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "craft/window_construction": {
        "name": "Window Construction",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "window",
            "window maker",
            "window construction"
        ],
        "tags": {
            "craft": "window_construction"
        },
        "icon": "marker-stroked",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "embankment": {
        "geometry": [
            "line"
        ],
        "tags": {
            "embankment": "yes"
        },
        "name": "Embankment",
        "matchScore": 0.2
    },
    "emergency/ambulance_station": {
        "fields": [
            "operator"
        ],
        "geometry": [
            "area",
            "point",
            "vertex"
        ],
        "tags": {
            "emergency": "ambulance_station"
        },
        "name": "Ambulance Station"
    },
    "emergency/fire_hydrant": {
        "fields": [
            "fire_hydrant/type"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "emergency": "fire_hydrant"
        },
        "name": "Fire Hydrant"
    },
    "emergency/phone": {
        "icon": "emergency-telephone",
        "fields": [
            "operator"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "emergency": "phone"
        },
        "name": "Emergency Phone"
    },
    "entrance": {
        "icon": "entrance",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "entrance": "*"
        },
        "fields": [
            "entrance",
            "access_simple",
            "address"
        ],
        "name": "Entrance/Exit"
    },
    "footway/crossing": {
        "fields": [
            "crossing",
            "access",
            "surface",
            "sloped_curb",
            "tactile_paving"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "footway",
            "footway": "crossing"
        },
        "terms": [],
        "name": "Crossing"
    },
    "footway/crosswalk": {
        "fields": [
            "crossing",
            "access",
            "surface",
            "sloped_curb",
            "tactile_paving"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "footway",
            "footway": "crossing",
            "crossing": "zebra"
        },
        "terms": [
            "crosswalk",
            "zebra crossing"
        ],
        "name": "Crosswalk"
    },
    "footway/sidewalk": {
        "fields": [
            "surface",
            "lit",
            "width",
            "structure",
            "access"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "footway",
            "footway": "sidewalk"
        },
        "terms": [],
        "name": "Sidewalk"
    },
    "ford": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "ford": "yes"
        },
        "name": "Ford"
    },
    "golf/bunker": {
        "icon": "golf",
        "geometry": [
            "area"
        ],
        "tags": {
            "golf": "bunker",
            "natural": "sand"
        },
        "terms": [
            "hazard",
            "bunker"
        ],
        "name": "Sand Trap"
    },
    "golf/fairway": {
        "icon": "golf",
        "geometry": [
            "area"
        ],
        "tags": {
            "golf": "fairway",
            "landuse": "grass"
        },
        "name": "Fairway"
    },
    "golf/green": {
        "icon": "golf",
        "geometry": [
            "area"
        ],
        "tags": {
            "golf": "green",
            "landuse": "grass",
            "leisure": "pitch",
            "sport": "golf"
        },
        "terms": [
            "putting green"
        ],
        "name": "Putting Green"
    },
    "golf/hole": {
        "icon": "golf",
        "fields": [
            "golf_hole",
            "par",
            "handicap"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "golf": "hole"
        },
        "name": "Golf Hole"
    },
    "golf/lateral_water_hazard": {
        "icon": "golf",
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "golf": "lateral_water_hazard",
            "natural": "water"
        },
        "name": "Lateral Water Hazard"
    },
    "golf/rough": {
        "icon": "golf",
        "geometry": [
            "area"
        ],
        "tags": {
            "golf": "rough",
            "landuse": "grass"
        },
        "name": "Rough"
    },
    "golf/tee": {
        "icon": "golf",
        "geometry": [
            "area"
        ],
        "tags": {
            "golf": "tee",
            "landuse": "grass"
        },
        "terms": [
            "teeing ground"
        ],
        "name": "Tee Box"
    },
    "golf/water_hazard": {
        "icon": "golf",
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "golf": "water_hazard",
            "natural": "water"
        },
        "name": "Water Hazard"
    },
    "highway": {
        "fields": [
            "highway"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "highway": "*"
        },
        "name": "Highway"
    },
    "highway/bridleway": {
        "fields": [
            "surface",
            "width",
            "structure",
            "access"
        ],
        "icon": "highway-bridleway",
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "bridleway"
        },
        "terms": [
            "bridleway",
            "equestrian trail",
            "horse riding path",
            "bridle road",
            "horse trail"
        ],
        "name": "Bridle Path"
    },
    "highway/bus_stop": {
        "icon": "bus",
        "fields": [
            "operator",
            "shelter"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "highway": "bus_stop"
        },
        "terms": [],
        "name": "Bus Stop"
    },
    "highway/crossing": {
        "fields": [
            "crossing",
            "sloped_curb",
            "tactile_paving"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "crossing"
        },
        "terms": [],
        "name": "Crossing"
    },
    "highway/crosswalk": {
        "fields": [
            "crossing",
            "sloped_curb",
            "tactile_paving"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "crossing",
            "crossing": "zebra"
        },
        "terms": [
            "crosswalk",
            "zebra crossing"
        ],
        "name": "Crosswalk"
    },
    "highway/cycleway": {
        "icon": "highway-cycleway",
        "fields": [
            "surface",
            "lit",
            "width",
            "oneway",
            "structure",
            "access"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "cycleway"
        },
        "terms": [],
        "name": "Cycle Path"
    },
    "highway/footway": {
        "icon": "highway-footway",
        "fields": [
            "surface",
            "lit",
            "width",
            "structure",
            "access"
        ],
        "geometry": [
            "line",
            "area"
        ],
        "terms": [
            "beaten path",
            "boulevard",
            "clearing",
            "course",
            "cut*",
            "drag*",
            "footpath",
            "highway",
            "lane",
            "line",
            "orbit",
            "passage",
            "pathway",
            "rail",
            "rails",
            "road",
            "roadway",
            "route",
            "street",
            "thoroughfare",
            "trackway",
            "trail",
            "trajectory",
            "walk"
        ],
        "tags": {
            "highway": "footway"
        },
        "name": "Foot Path"
    },
    "highway/living_street": {
        "icon": "highway-living-street",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "living_street"
        },
        "name": "Living Street"
    },
    "highway/mini_roundabout": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "mini_roundabout"
        },
        "fields": [
            "clock_direction"
        ],
        "name": "Mini-Roundabout"
    },
    "highway/motorway": {
        "icon": "highway-motorway",
        "fields": [
            "oneway_yes",
            "maxspeed",
            "structure",
            "access",
            "lanes",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "motorway"
        },
        "terms": [],
        "name": "Motorway"
    },
    "highway/motorway_junction": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "motorway_junction"
        },
        "fields": [
            "ref"
        ],
        "name": "Motorway Junction / Exit"
    },
    "highway/motorway_link": {
        "icon": "highway-motorway-link",
        "fields": [
            "oneway_yes",
            "maxspeed",
            "structure",
            "access",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "motorway_link"
        },
        "terms": [
            "ramp",
            "on ramp",
            "off ramp"
        ],
        "name": "Motorway Link"
    },
    "highway/path": {
        "icon": "highway-path",
        "fields": [
            "surface",
            "width",
            "structure",
            "access",
            "incline",
            "sac_scale",
            "trail_visibility",
            "mtb/scale",
            "mtb/scale/uphill",
            "mtb/scale/imba",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "path"
        },
        "terms": [],
        "name": "Path"
    },
    "highway/pedestrian": {
        "fields": [
            "surface",
            "lit",
            "width",
            "oneway",
            "structure",
            "access"
        ],
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "highway": "pedestrian"
        },
        "terms": [],
        "name": "Pedestrian"
    },
    "highway/primary": {
        "icon": "highway-primary",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "lanes",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "primary"
        },
        "terms": [],
        "name": "Primary Road"
    },
    "highway/primary_link": {
        "icon": "highway-primary-link",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "primary_link"
        },
        "terms": [
            "ramp",
            "on ramp",
            "off ramp"
        ],
        "name": "Primary Link"
    },
    "highway/residential": {
        "icon": "highway-residential",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "residential"
        },
        "terms": [],
        "name": "Residential Road"
    },
    "highway/rest_area": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "highway": "rest_area"
        },
        "terms": [
            "rest stop",
            "turnout",
            "lay-by"
        ],
        "name": "Rest Area"
    },
    "highway/road": {
        "icon": "highway-road",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "road"
        },
        "terms": [],
        "name": "Unknown Road"
    },
    "highway/secondary": {
        "icon": "highway-secondary",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "lanes",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "secondary"
        },
        "terms": [],
        "name": "Secondary Road"
    },
    "highway/secondary_link": {
        "icon": "highway-secondary-link",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "secondary_link"
        },
        "terms": [
            "ramp",
            "on ramp",
            "off ramp"
        ],
        "name": "Secondary Link"
    },
    "highway/service": {
        "icon": "highway-service",
        "fields": [
            "service",
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service"
        },
        "terms": [],
        "name": "Service Road"
    },
    "highway/service/alley": {
        "icon": "highway-service",
        "fields": [
            "oneway",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service",
            "service": "alley"
        },
        "name": "Alley"
    },
    "highway/service/drive-through": {
        "icon": "highway-service",
        "fields": [
            "oneway",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service",
            "service": "drive-through"
        },
        "name": "Drive-Through"
    },
    "highway/service/driveway": {
        "icon": "highway-service",
        "fields": [
            "oneway",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service",
            "service": "driveway"
        },
        "name": "Driveway"
    },
    "highway/service/emergency_access": {
        "icon": "highway-service",
        "fields": [
            "oneway",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service",
            "service": "emergency_access"
        },
        "name": "Emergency Access"
    },
    "highway/service/parking_aisle": {
        "icon": "highway-service",
        "fields": [
            "oneway",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "service",
            "service": "parking_aisle"
        },
        "name": "Parking Aisle"
    },
    "highway/services": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "highway": "services"
        },
        "terms": [
            "services",
            "travel plaza",
            "service station"
        ],
        "name": "Service Area"
    },
    "highway/steps": {
        "fields": [
            "surface",
            "lit",
            "width",
            "access"
        ],
        "icon": "highway-steps",
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "steps"
        },
        "terms": [
            "stairs",
            "staircase"
        ],
        "name": "Steps"
    },
    "highway/stop": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "stop"
        },
        "terms": [
            "stop sign"
        ],
        "name": "Stop Sign"
    },
    "highway/street_lamp": {
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "highway": "street_lamp"
        },
        "fields": [
            "lamp_type",
            "ref"
        ],
        "terms": [
            "streetlight",
            "street light",
            "lamp",
            "light",
            "gaslight"
        ],
        "name": "Street Lamp"
    },
    "highway/tertiary": {
        "icon": "highway-tertiary",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "lanes",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "tertiary"
        },
        "terms": [],
        "name": "Tertiary Road"
    },
    "highway/tertiary_link": {
        "icon": "highway-tertiary-link",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "tertiary_link"
        },
        "terms": [
            "ramp",
            "on ramp",
            "off ramp"
        ],
        "name": "Tertiary Link"
    },
    "highway/track": {
        "icon": "highway-track",
        "fields": [
            "surface",
            "width",
            "structure",
            "access",
            "incline",
            "tracktype",
            "smoothness",
            "mtb/scale",
            "mtb/scale/uphill",
            "mtb/scale/imba"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "track"
        },
        "terms": [],
        "name": "Track"
    },
    "highway/traffic_signals": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "traffic_signals"
        },
        "terms": [
            "light",
            "stoplight",
            "traffic light"
        ],
        "name": "Traffic Signals"
    },
    "highway/trunk": {
        "icon": "highway-trunk",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "lanes",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "trunk"
        },
        "terms": [],
        "name": "Trunk Road"
    },
    "highway/trunk_link": {
        "icon": "highway-trunk-link",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface",
            "ref"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "trunk_link"
        },
        "terms": [
            "ramp",
            "on ramp",
            "off ramp"
        ],
        "name": "Trunk Link"
    },
    "highway/turning_circle": {
        "icon": "circle",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "highway": "turning_circle"
        },
        "terms": [],
        "name": "Turning Circle"
    },
    "highway/unclassified": {
        "icon": "highway-unclassified",
        "fields": [
            "oneway",
            "maxspeed",
            "structure",
            "access",
            "surface"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "highway": "unclassified"
        },
        "terms": [],
        "name": "Unclassified Road"
    },
    "historic": {
        "fields": [
            "historic"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "*"
        },
        "name": "Historic Site"
    },
    "historic/archaeological_site": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "archaeological_site"
        },
        "name": "Archaeological Site"
    },
    "historic/boundary_stone": {
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "historic": "boundary_stone"
        },
        "name": "Boundary Stone"
    },
    "historic/castle": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "castle"
        },
        "name": "Castle"
    },
    "historic/memorial": {
        "icon": "monument",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "memorial"
        },
        "name": "Memorial"
    },
    "historic/monument": {
        "icon": "monument",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "monument"
        },
        "name": "Monument"
    },
    "historic/ruins": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "ruins"
        },
        "name": "Ruins"
    },
    "historic/wayside_cross": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "wayside_cross"
        },
        "name": "Wayside Cross"
    },
    "historic/wayside_shrine": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "historic": "wayside_shrine"
        },
        "name": "Wayside Shrine"
    },
    "landuse": {
        "fields": [
            "landuse"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "landuse": "*"
        },
        "name": "Landuse"
    },
    "landuse/allotments": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "allotments"
        },
        "terms": [],
        "name": "Allotments"
    },
    "landuse/basin": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "basin"
        },
        "terms": [],
        "name": "Basin"
    },
    "landuse/cemetery": {
        "icon": "cemetery",
        "fields": [
            "religion",
            "denomination"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "landuse": "cemetery"
        },
        "terms": [],
        "name": "Cemetery"
    },
    "landuse/churchyard": {
        "fields": [
            "religion",
            "denomination"
        ],
        "geometry": [
            "area"
        ],
        "tags": {
            "landuse": "churchyard"
        },
        "terms": [],
        "name": "Churchyard"
    },
    "landuse/commercial": {
        "icon": "commercial",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "commercial"
        },
        "terms": [],
        "name": "Commercial"
    },
    "landuse/construction": {
        "fields": [
            "construction",
            "operator"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "construction"
        },
        "terms": [],
        "name": "Construction"
    },
    "landuse/farm": {
        "fields": [
            "crop"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "farm"
        },
        "terms": [],
        "name": "Farm",
        "icon": "farm"
    },
    "landuse/farmland": {
        "fields": [
            "crop"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "farmland"
        },
        "terms": [],
        "name": "Farmland",
        "icon": "farm",
        "searchable": false
    },
    "landuse/farmyard": {
        "fields": [
            "crop"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "farmyard"
        },
        "terms": [],
        "name": "Farmyard",
        "icon": "farm"
    },
    "landuse/forest": {
        "fields": [
            "wood"
        ],
        "icon": "park2",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "forest"
        },
        "terms": [],
        "name": "Forest"
    },
    "landuse/grass": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "grass"
        },
        "terms": [],
        "name": "Grass"
    },
    "landuse/industrial": {
        "icon": "industrial",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "industrial"
        },
        "terms": [],
        "name": "Industrial"
    },
    "landuse/landfill": {
        "geometry": [
            "area"
        ],
        "tags": {
            "landuse": "landfill"
        },
        "terms": [
            "dump"
        ],
        "name": "Landfill"
    },
    "landuse/meadow": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "meadow"
        },
        "terms": [],
        "name": "Meadow"
    },
    "landuse/military": {
        "geometry": [
            "area"
        ],
        "tags": {
            "landuse": "military"
        },
        "terms": [],
        "name": "Military"
    },
    "landuse/orchard": {
        "fields": [
            "trees"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "orchard"
        },
        "terms": [],
        "name": "Orchard",
        "icon": "park2"
    },
    "landuse/quarry": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "quarry"
        },
        "terms": [],
        "name": "Quarry"
    },
    "landuse/residential": {
        "icon": "building",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "residential"
        },
        "terms": [],
        "name": "Residential"
    },
    "landuse/retail": {
        "icon": "shop",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "retail"
        },
        "name": "Retail"
    },
    "landuse/vineyard": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "landuse": "vineyard"
        },
        "terms": [],
        "name": "Vineyard"
    },
    "leisure": {
        "fields": [
            "leisure"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "leisure": "*"
        },
        "name": "Leisure"
    },
    "leisure/common": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "open space"
        ],
        "tags": {
            "leisure": "common"
        },
        "name": "Common"
    },
    "leisure/dog_park": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "leisure": "dog_park"
        },
        "name": "Dog Park",
        "icon": "dog-park"
    },
    "leisure/firepit": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "firepit"
        },
        "terms": [
            "fireplace",
            "campfire"
        ],
        "name": "Firepit"
    },
    "leisure/garden": {
        "icon": "garden",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "leisure": "garden"
        },
        "name": "Garden"
    },
    "leisure/golf_course": {
        "icon": "golf",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "golf_course"
        },
        "terms": [
            "links"
        ],
        "name": "Golf Course"
    },
    "leisure/ice_rink": {
        "icon": "pitch",
        "fields": [
            "building_area",
            "seasonal",
            "sport_ice"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "hockey",
            "skating",
            "curling"
        ],
        "tags": {
            "leisure": "ice_rink"
        },
        "name": "Ice Rink"
    },
    "leisure/marina": {
        "icon": "harbor",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "leisure": "marina"
        },
        "name": "Marina"
    },
    "leisure/park": {
        "icon": "park",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "esplanade",
            "estate",
            "forest",
            "garden",
            "grass",
            "green",
            "grounds",
            "lawn",
            "lot",
            "meadow",
            "parkland",
            "place",
            "playground",
            "plaza",
            "pleasure garden",
            "recreation area",
            "square",
            "tract",
            "village green",
            "woodland"
        ],
        "tags": {
            "leisure": "park"
        },
        "name": "Park"
    },
    "leisure/picnic_table": {
        "geometry": [
            "point"
        ],
        "tags": {
            "leisure": "picnic_table"
        },
        "terms": [
            "bench",
            "table"
        ],
        "name": "Picnic Table"
    },
    "leisure/pitch": {
        "icon": "pitch",
        "fields": [
            "sport",
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch"
        },
        "terms": [],
        "name": "Sport Pitch"
    },
    "leisure/pitch/american_football": {
        "icon": "america-football",
        "fields": [
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "american_football"
        },
        "terms": [],
        "name": "American Football Field"
    },
    "leisure/pitch/baseball": {
        "icon": "baseball",
        "fields": [
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "baseball"
        },
        "terms": [],
        "name": "Baseball Diamond"
    },
    "leisure/pitch/basketball": {
        "icon": "basketball",
        "fields": [
            "surface",
            "hoops",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "basketball"
        },
        "terms": [],
        "name": "Basketball Court"
    },
    "leisure/pitch/skateboard": {
        "icon": "pitch",
        "fields": [
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "skateboard"
        },
        "terms": [],
        "name": "Skate Park"
    },
    "leisure/pitch/soccer": {
        "icon": "soccer",
        "fields": [
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "soccer"
        },
        "terms": [],
        "name": "Soccer Field"
    },
    "leisure/pitch/tennis": {
        "icon": "tennis",
        "fields": [
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "tennis"
        },
        "terms": [],
        "name": "Tennis Court"
    },
    "leisure/pitch/volleyball": {
        "icon": "pitch",
        "fields": [
            "surface",
            "lit"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "pitch",
            "sport": "volleyball"
        },
        "terms": [],
        "name": "Volleyball Court"
    },
    "leisure/playground": {
        "icon": "playground",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "playground"
        },
        "name": "Playground",
        "terms": [
            "jungle gym",
            "play area"
        ]
    },
    "leisure/slipway": {
        "geometry": [
            "point",
            "line"
        ],
        "tags": {
            "leisure": "slipway"
        },
        "name": "Slipway"
    },
    "leisure/sports_center": {
        "icon": "pitch",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "sports_centre"
        },
        "terms": [
            "gym"
        ],
        "fields": [
            "sport"
        ],
        "name": "Sports Center / Gym"
    },
    "leisure/stadium": {
        "icon": "pitch",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "leisure": "stadium"
        },
        "fields": [
            "sport"
        ],
        "name": "Stadium"
    },
    "leisure/swimming_pool": {
        "fields": [
            "access_simple"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "leisure": "swimming_pool"
        },
        "icon": "swimming",
        "name": "Swimming Pool"
    },
    "leisure/track": {
        "icon": "pitch",
        "fields": [
            "surface",
            "lit",
            "width"
        ],
        "geometry": [
            "point",
            "line",
            "area"
        ],
        "tags": {
            "leisure": "track"
        },
        "name": "Race Track"
    },
    "line": {
        "name": "Line",
        "tags": {},
        "geometry": [
            "line"
        ],
        "matchScore": 0.1
    },
    "man_made": {
        "fields": [
            "man_made"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "man_made": "*"
        },
        "name": "Man Made"
    },
    "man_made/breakwater": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "man_made": "breakwater"
        },
        "name": "Breakwater"
    },
    "man_made/cutline": {
        "geometry": [
            "line"
        ],
        "tags": {
            "man_made": "cutline"
        },
        "name": "Cut line"
    },
    "man_made/embankment": {
        "geometry": [
            "line"
        ],
        "tags": {
            "man_made": "embankment"
        },
        "name": "Embankment",
        "searchable": false
    },
    "man_made/flagpole": {
        "geometry": [
            "point"
        ],
        "tags": {
            "man_made": "flagpole"
        },
        "name": "Flagpole",
        "icon": "embassy"
    },
    "man_made/lighthouse": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "lighthouse"
        },
        "name": "Lighthouse",
        "icon": "lighthouse"
    },
    "man_made/observation": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "lookout tower",
            "fire tower"
        ],
        "tags": {
            "man_made": "tower",
            "tower:type": "observation"
        },
        "name": "Observation Tower"
    },
    "man_made/pier": {
        "geometry": [
            "line",
            "area"
        ],
        "tags": {
            "man_made": "pier"
        },
        "name": "Pier"
    },
    "man_made/pipeline": {
        "geometry": [
            "line"
        ],
        "tags": {
            "man_made": "pipeline"
        },
        "fields": [
            "location",
            "operator"
        ],
        "name": "Pipeline",
        "icon": "pipeline"
    },
    "man_made/survey_point": {
        "icon": "monument",
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "man_made": "survey_point"
        },
        "fields": [
            "ref"
        ],
        "name": "Survey Point"
    },
    "man_made/tower": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "tower"
        },
        "fields": [
            "towertype"
        ],
        "name": "Tower"
    },
    "man_made/wastewater_plant": {
        "icon": "water",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "wastewater_plant"
        },
        "name": "Wastewater Plant",
        "terms": [
            "sewage works",
            "sewage treatment plant",
            "water treatment plant",
            "reclamation plant"
        ]
    },
    "man_made/water_tower": {
        "icon": "water",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "water_tower"
        },
        "name": "Water Tower"
    },
    "man_made/water_well": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "water_well"
        },
        "name": "Water well"
    },
    "man_made/water_works": {
        "icon": "water",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "man_made": "water_works"
        },
        "name": "Water Works"
    },
    "military/airfield": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "military": "airfield"
        },
        "terms": [],
        "name": "Airfield",
        "icon": "airfield"
    },
    "military/barracks": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "military": "barracks"
        },
        "terms": [],
        "name": "Barracks"
    },
    "military/bunker": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "military": "bunker"
        },
        "terms": [],
        "name": "Bunker"
    },
    "military/range": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "military": "range"
        },
        "terms": [],
        "name": "Military Range"
    },
    "natural": {
        "fields": [
            "natural"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "natural": "*"
        },
        "name": "Natural"
    },
    "natural/bay": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "bay"
        },
        "name": "Bay"
    },
    "natural/beach": {
        "fields": [
            "surface"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "beach"
        },
        "name": "Beach"
    },
    "natural/cliff": {
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "cliff"
        },
        "name": "Cliff"
    },
    "natural/coastline": {
        "geometry": [
            "line"
        ],
        "terms": [
            "shore"
        ],
        "tags": {
            "natural": "coastline"
        },
        "name": "Coastline"
    },
    "natural/fell": {
        "geometry": [
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "fell"
        },
        "name": "Fell"
    },
    "natural/glacier": {
        "geometry": [
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "glacier"
        },
        "name": "Glacier"
    },
    "natural/grassland": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "grassland"
        },
        "name": "Grassland"
    },
    "natural/heath": {
        "geometry": [
            "area"
        ],
        "terms": [],
        "tags": {
            "natural": "heath"
        },
        "name": "Heath"
    },
    "natural/peak": {
        "icon": "triangle",
        "fields": [
            "elevation"
        ],
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "natural": "peak"
        },
        "terms": [
            "acme",
            "aiguille",
            "alp",
            "climax",
            "crest",
            "crown",
            "hill",
            "mount",
            "mountain",
            "pinnacle",
            "summit",
            "tip",
            "top"
        ],
        "name": "Peak"
    },
    "natural/scree": {
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "scree"
        },
        "terms": [
            "loose rocks"
        ],
        "name": "Scree"
    },
    "natural/scrub": {
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "scrub"
        },
        "terms": [],
        "name": "Scrub"
    },
    "natural/spring": {
        "geometry": [
            "point",
            "vertex"
        ],
        "terms": [],
        "tags": {
            "natural": "spring"
        },
        "name": "Spring"
    },
    "natural/tree": {
        "fields": [
            "tree_type",
            "denotation"
        ],
        "icon": "park",
        "geometry": [
            "point",
            "vertex"
        ],
        "terms": [],
        "tags": {
            "natural": "tree"
        },
        "name": "Tree"
    },
    "natural/water": {
        "fields": [
            "water"
        ],
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "water"
        },
        "icon": "water",
        "name": "Water"
    },
    "natural/water/lake": {
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "water",
            "water": "lake"
        },
        "terms": [
            "lakelet",
            "loch",
            "mere"
        ],
        "icon": "water",
        "name": "Lake"
    },
    "natural/water/pond": {
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "water",
            "water": "pond"
        },
        "terms": [
            "lakelet",
            "millpond",
            "tarn",
            "pool",
            "mere"
        ],
        "icon": "water",
        "name": "Pond"
    },
    "natural/water/reservoir": {
        "geometry": [
            "area"
        ],
        "tags": {
            "natural": "water",
            "water": "reservoir"
        },
        "icon": "water",
        "name": "Reservoir"
    },
    "natural/wetland": {
        "icon": "wetland",
        "fields": [
            "wetland"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "natural": "wetland"
        },
        "terms": [],
        "name": "Wetland"
    },
    "natural/wood": {
        "fields": [
            "wood"
        ],
        "icon": "park2",
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "natural": "wood"
        },
        "terms": [],
        "name": "Wood"
    },
    "office": {
        "icon": "commercial",
        "fields": [
            "office",
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "*"
        },
        "terms": [],
        "name": "Office"
    },
    "office/accountant": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "accountant"
        },
        "terms": [],
        "name": "Accountant"
    },
    "office/administrative": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "administrative"
        },
        "terms": [],
        "name": "Administrative Office"
    },
    "office/architect": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "architect"
        },
        "terms": [],
        "name": "Architect"
    },
    "office/company": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "company"
        },
        "terms": [],
        "name": "Company Office"
    },
    "office/educational_institution": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "educational_institution"
        },
        "terms": [],
        "name": "Educational Institution"
    },
    "office/employment_agency": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "employment_agency"
        },
        "terms": [],
        "name": "Employment Agency"
    },
    "office/estate_agent": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "estate_agent"
        },
        "terms": [],
        "name": "Real Estate Office"
    },
    "office/financial": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "financial"
        },
        "terms": [],
        "name": "Financial Office"
    },
    "office/government": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "government"
        },
        "terms": [],
        "name": "Government Office"
    },
    "office/insurance": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "insurance"
        },
        "terms": [],
        "name": "Insurance Office"
    },
    "office/it": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "it"
        },
        "terms": [],
        "name": "IT Office"
    },
    "office/lawyer": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "lawyer"
        },
        "terms": [],
        "name": "Law Office"
    },
    "office/newspaper": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "newspaper"
        },
        "terms": [],
        "name": "Newspaper"
    },
    "office/ngo": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "ngo"
        },
        "terms": [],
        "name": "NGO Office"
    },
    "office/physician": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "physician"
        },
        "terms": [],
        "name": "Physician"
    },
    "office/political_party": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "political_party"
        },
        "terms": [],
        "name": "Political Party"
    },
    "office/research": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "research"
        },
        "terms": [],
        "name": "Research Office"
    },
    "office/telecommunication": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "telecommunication"
        },
        "terms": [],
        "name": "Telecom Office"
    },
    "office/therapist": {
        "icon": "commercial",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "therapist"
        },
        "terms": [],
        "name": "Therapist"
    },
    "office/travel_agent": {
        "icon": "suitcase",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "office": "travel_agent"
        },
        "terms": [],
        "name": "Travel Agency",
        "searchable": false
    },
    "piste": {
        "icon": "skiing",
        "fields": [
            "piste/type",
            "piste/difficulty",
            "piste/grooming",
            "oneway",
            "lit"
        ],
        "geometry": [
            "point",
            "line",
            "area"
        ],
        "terms": [
            "ski",
            "sled",
            "sleigh",
            "snowboard",
            "nordic",
            "downhill",
            "snowmobile"
        ],
        "tags": {
            "piste:type": "*"
        },
        "name": "Piste/Ski Trail"
    },
    "place": {
        "fields": [
            "place"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "place": "*"
        },
        "name": "Place"
    },
    "place/city": {
        "icon": "city",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "city"
        },
        "name": "City"
    },
    "place/hamlet": {
        "icon": "triangle-stroked",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "hamlet"
        },
        "name": "Hamlet"
    },
    "place/island": {
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "archipelago",
            "atoll",
            "bar",
            "cay",
            "isle",
            "islet",
            "key",
            "reef"
        ],
        "tags": {
            "place": "island"
        },
        "name": "Island"
    },
    "place/isolated_dwelling": {
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "isolated_dwelling"
        },
        "name": "Isolated Dwelling"
    },
    "place/locality": {
        "icon": "marker",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "locality"
        },
        "name": "Locality"
    },
    "place/neighbourhood": {
        "icon": "triangle-stroked",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "neighbourhood"
        },
        "terms": [
            "neighbourhood"
        ],
        "name": "Neighborhood"
    },
    "place/suburb": {
        "icon": "triangle-stroked",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "suburb"
        },
        "terms": [
            "Boro",
            "Quarter"
        ],
        "name": "Borough"
    },
    "place/town": {
        "icon": "town",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "town"
        },
        "name": "Town"
    },
    "place/village": {
        "icon": "village",
        "fields": [
            "population"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "place": "village"
        },
        "name": "Village"
    },
    "point": {
        "name": "Point",
        "tags": {},
        "geometry": [
            "point"
        ],
        "matchScore": 0.1
    },
    "power": {
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "power": "*"
        },
        "fields": [
            "power"
        ],
        "name": "Power"
    },
    "power/generator": {
        "name": "Power Generator",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "power": "generator"
        },
        "fields": [
            "generator/source",
            "generator/method",
            "generator/type"
        ]
    },
    "power/line": {
        "geometry": [
            "line"
        ],
        "tags": {
            "power": "line"
        },
        "name": "Power Line",
        "icon": "power-line"
    },
    "power/minor_line": {
        "geometry": [
            "line"
        ],
        "tags": {
            "power": "minor_line"
        },
        "name": "Minor Power Line",
        "icon": "power-line"
    },
    "power/pole": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "power": "pole"
        },
        "name": "Power Pole"
    },
    "power/sub_station": {
        "fields": [
            "operator",
            "building"
        ],
        "geometry": [
            "point",
            "area"
        ],
        "tags": {
            "power": "sub_station"
        },
        "name": "Substation"
    },
    "power/tower": {
        "geometry": [
            "vertex"
        ],
        "tags": {
            "power": "tower"
        },
        "name": "High-Voltage Tower"
    },
    "power/transformer": {
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "power": "transformer"
        },
        "name": "Transformer"
    },
    "public_transport/platform": {
        "fields": [
            "ref",
            "operator",
            "network",
            "shelter"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "public_transport": "platform"
        },
        "name": "Platform"
    },
    "public_transport/stop_position": {
        "icon": "bus",
        "fields": [
            "ref",
            "operator",
            "network"
        ],
        "geometry": [
            "vertex"
        ],
        "tags": {
            "public_transport": "stop_position"
        },
        "name": "Stop Position"
    },
    "railway": {
        "fields": [
            "railway"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "railway": "*"
        },
        "name": "Railway"
    },
    "railway/abandoned": {
        "icon": "railway-abandoned",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "abandoned"
        },
        "fields": [
            "structure"
        ],
        "terms": [],
        "name": "Abandoned Railway"
    },
    "railway/disused": {
        "icon": "railway-disused",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "disused"
        },
        "fields": [
            "structure"
        ],
        "terms": [],
        "name": "Disused Railway"
    },
    "railway/funicular": {
        "geometry": [
            "line"
        ],
        "terms": [
            "venicular",
            "cliff railway",
            "cable car",
            "cable railway",
            "funicular railway"
        ],
        "fields": [
            "structure",
            "gauge"
        ],
        "tags": {
            "railway": "funicular"
        },
        "icon": "railway-rail",
        "name": "Funicular"
    },
    "railway/halt": {
        "icon": "rail",
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "railway": "halt"
        },
        "name": "Railway Halt",
        "terms": [
            "break",
            "interrupt",
            "rest",
            "wait",
            "interruption"
        ]
    },
    "railway/level_crossing": {
        "icon": "cross",
        "geometry": [
            "vertex"
        ],
        "tags": {
            "railway": "level_crossing"
        },
        "terms": [
            "crossing",
            "railroad crossing",
            "railway crossing",
            "grade crossing",
            "road through railroad",
            "train crossing"
        ],
        "name": "Level Crossing"
    },
    "railway/monorail": {
        "icon": "railway-monorail",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "monorail"
        },
        "fields": [
            "structure",
            "electrified"
        ],
        "terms": [],
        "name": "Monorail"
    },
    "railway/narrow_gauge": {
        "icon": "railway-rail",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "narrow_gauge"
        },
        "fields": [
            "structure",
            "gauge",
            "electrified"
        ],
        "terms": [
            "narrow gauge railway",
            "narrow gauge railroad"
        ],
        "name": "Narrow Gauge Rail"
    },
    "railway/platform": {
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "railway": "platform"
        },
        "name": "Railway Platform"
    },
    "railway/rail": {
        "icon": "railway-rail",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "rail"
        },
        "fields": [
            "structure",
            "gauge",
            "electrified"
        ],
        "terms": [],
        "name": "Rail"
    },
    "railway/station": {
        "icon": "rail",
        "fields": [
            "building_area"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "railway": "station"
        },
        "terms": [
            "train station",
            "station"
        ],
        "name": "Railway Station"
    },
    "railway/subway": {
        "icon": "railway-subway",
        "fields": [
            "structure",
            "gauge",
            "electrified"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "subway"
        },
        "terms": [],
        "name": "Subway"
    },
    "railway/subway_entrance": {
        "icon": "rail-metro",
        "geometry": [
            "point"
        ],
        "tags": {
            "railway": "subway_entrance"
        },
        "terms": [],
        "name": "Subway Entrance"
    },
    "railway/tram": {
        "icon": "railway-light-rail",
        "geometry": [
            "line"
        ],
        "tags": {
            "railway": "tram"
        },
        "fields": [
            "structure",
            "gauge",
            "electrified"
        ],
        "terms": [
            "streetcar"
        ],
        "name": "Tram"
    },
    "relation": {
        "name": "Relation",
        "icon": "relation",
        "tags": {},
        "geometry": [
            "relation"
        ],
        "fields": [
            "relation"
        ]
    },
    "route/ferry": {
        "icon": "ferry",
        "geometry": [
            "line"
        ],
        "tags": {
            "route": "ferry"
        },
        "name": "Ferry Route"
    },
    "shop": {
        "icon": "shop",
        "fields": [
            "shop",
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "*"
        },
        "terms": [],
        "name": "Shop"
    },
    "shop/alcohol": {
        "icon": "alcohol-shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "alcohol"
        },
        "terms": [
            "alcohol"
        ],
        "name": "Liquor Store"
    },
    "shop/art": {
        "icon": "art-gallery",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "art store",
            "art gallery"
        ],
        "tags": {
            "shop": "art"
        },
        "name": "Art Shop"
    },
    "shop/bakery": {
        "icon": "bakery",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "bakery"
        },
        "name": "Bakery"
    },
    "shop/beauty": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "nail spa",
            "spa",
            "salon",
            "tanning"
        ],
        "tags": {
            "shop": "beauty"
        },
        "name": "Beauty Shop"
    },
    "shop/beverages": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "beverages"
        },
        "name": "Beverage Store"
    },
    "shop/bicycle": {
        "icon": "bicycle",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "bicycle"
        },
        "name": "Bicycle Shop"
    },
    "shop/bookmaker": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "bookmaker"
        },
        "name": "Bookmaker"
    },
    "shop/books": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "books"
        },
        "name": "Bookstore"
    },
    "shop/boutique": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "boutique"
        },
        "name": "Boutique"
    },
    "shop/butcher": {
        "icon": "slaughterhouse",
        "fields": [
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [],
        "tags": {
            "shop": "butcher"
        },
        "name": "Butcher"
    },
    "shop/car": {
        "icon": "car",
        "fields": [
            "address",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "car"
        },
        "name": "Car Dealership"
    },
    "shop/car_parts": {
        "icon": "car",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "car_parts"
        },
        "name": "Car Parts Store"
    },
    "shop/car_repair": {
        "icon": "car",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "car_repair"
        },
        "name": "Car Repair Shop"
    },
    "shop/chemist": {
        "icon": "chemist",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "chemist"
        },
        "name": "Chemist"
    },
    "shop/clothes": {
        "icon": "clothing-store",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "clothes"
        },
        "name": "Clothing Store"
    },
    "shop/computer": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "computer"
        },
        "name": "Computer Store"
    },
    "shop/confectionery": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "confectionery"
        },
        "name": "Confectionery"
    },
    "shop/convenience": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "convenience"
        },
        "name": "Convenience Store"
    },
    "shop/deli": {
        "icon": "restaurant",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "deli"
        },
        "name": "Deli"
    },
    "shop/department_store": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "department_store"
        },
        "name": "Department Store"
    },
    "shop/doityourself": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "doityourself"
        },
        "name": "DIY Store"
    },
    "shop/dry_cleaning": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "dry_cleaning"
        },
        "name": "Dry Cleaners"
    },
    "shop/electronics": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "electronics"
        },
        "name": "Electronics Store"
    },
    "shop/farm": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "farm"
        },
        "terms": [
            "farm shop",
            "farm stand"
        ],
        "name": "Produce Stand"
    },
    "shop/fishmonger": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "fishmonger"
        },
        "name": "Fishmonger",
        "searchable": false
    },
    "shop/florist": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "florist"
        },
        "name": "Florist"
    },
    "shop/funeral_directors": {
        "icon": "cemetery",
        "fields": [
            "address",
            "building_area",
            "religion",
            "denomination"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "funeral_directors"
        },
        "terms": [
            "undertaker",
            "funeral parlour",
            "funeral parlor",
            "memorial home"
        ],
        "name": "Funeral Home"
    },
    "shop/furniture": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "furniture"
        },
        "name": "Furniture Store"
    },
    "shop/garden_centre": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "garden centre"
        ],
        "tags": {
            "shop": "garden_centre"
        },
        "name": "Garden Center"
    },
    "shop/gift": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "gift"
        },
        "name": "Gift Shop"
    },
    "shop/greengrocer": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "greengrocer"
        },
        "name": "Greengrocer"
    },
    "shop/hairdresser": {
        "icon": "hairdresser",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "hairdresser"
        },
        "name": "Hairdresser"
    },
    "shop/hardware": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "hardware"
        },
        "name": "Hardware Store"
    },
    "shop/hifi": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "hifi"
        },
        "name": "Hifi Store"
    },
    "shop/jewelry": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "jewelry"
        },
        "name": "Jeweler"
    },
    "shop/kiosk": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "kiosk"
        },
        "name": "Kiosk"
    },
    "shop/laundry": {
        "icon": "laundry",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "laundry"
        },
        "name": "Laundry"
    },
    "shop/locksmith": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "keys"
        ],
        "tags": {
            "shop": "locksmith"
        },
        "name": "Locksmith"
    },
    "shop/lottery": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "lottery"
        },
        "name": "Lottery Shop"
    },
    "shop/mall": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "mall"
        },
        "name": "Mall"
    },
    "shop/mobile_phone": {
        "icon": "mobilephone",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "mobile_phone"
        },
        "name": "Mobile Phone Store"
    },
    "shop/motorcycle": {
        "icon": "scooter",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "motorcycle"
        },
        "name": "Motorcycle Dealership"
    },
    "shop/music": {
        "icon": "music",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "music"
        },
        "name": "Music Store"
    },
    "shop/newsagent": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "newsagent"
        },
        "name": "Newsagent"
    },
    "shop/optician": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "optician"
        },
        "name": "Optician"
    },
    "shop/outdoor": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "outdoor"
        },
        "name": "Outdoor Store"
    },
    "shop/pet": {
        "icon": "dog-park",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "pet"
        },
        "name": "Pet Store"
    },
    "shop/photo": {
        "icon": "camera",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "photo"
        },
        "name": "Photography Store"
    },
    "shop/seafood": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "seafood"
        },
        "terms": [
            "fishmonger"
        ],
        "name": "Seafood Shop"
    },
    "shop/shoes": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "shoes"
        },
        "name": "Shoe Store"
    },
    "shop/sports": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "sports"
        },
        "name": "Sporting Goods Store"
    },
    "shop/stationery": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "stationery"
        },
        "name": "Stationery Store"
    },
    "shop/supermarket": {
        "icon": "grocery",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "bazaar",
            "boutique",
            "chain",
            "co-op",
            "cut-rate store",
            "discount store",
            "five-and-dime",
            "flea market",
            "galleria",
            "grocery store",
            "mall",
            "mart",
            "outlet",
            "outlet store",
            "shop",
            "shopping center",
            "shopping centre",
            "shopping plaza",
            "stand",
            "store",
            "supermarket",
            "thrift shop"
        ],
        "tags": {
            "shop": "supermarket"
        },
        "name": "Supermarket"
    },
    "shop/tailor": {
        "name": "Tailor",
        "geometry": [
            "point",
            "area"
        ],
        "terms": [
            "tailor",
            "clothes"
        ],
        "tags": {
            "shop": "tailor"
        },
        "icon": "clothing-store",
        "fields": [
            "building_area",
            "address",
            "operator",
            "opening_hours"
        ]
    },
    "shop/toys": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "toys"
        },
        "name": "Toy Store"
    },
    "shop/travel_agency": {
        "icon": "suitcase",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "travel_agency"
        },
        "name": "Travel Agency"
    },
    "shop/tyres": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "tyres"
        },
        "name": "Tire Store"
    },
    "shop/vacant": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "vacant"
        },
        "name": "Vacant Shop"
    },
    "shop/variety_store": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "variety_store"
        },
        "name": "Variety Store"
    },
    "shop/video": {
        "icon": "shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "video"
        },
        "name": "Video Store"
    },
    "shop/wine": {
        "icon": "alcohol-shop",
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "shop": "wine"
        },
        "terms": [
            "winery"
        ],
        "name": "Wine Shop"
    },
    "tourism": {
        "fields": [
            "tourism"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "*"
        },
        "name": "Tourism"
    },
    "tourism/alpine_hut": {
        "icon": "lodging",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "alpine_hut"
        },
        "name": "Alpine Hut"
    },
    "tourism/artwork": {
        "fields": [
            "artwork_type",
            "artist"
        ],
        "icon": "art-gallery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "artwork"
        },
        "terms": [
            "mural",
            "sculpture",
            "statue"
        ],
        "name": "Artwork"
    },
    "tourism/attraction": {
        "icon": "monument",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "attraction"
        },
        "name": "Tourist Attraction"
    },
    "tourism/camp_site": {
        "icon": "campsite",
        "fields": [
            "operator",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "camping"
        ],
        "tags": {
            "tourism": "camp_site"
        },
        "name": "Camp Site"
    },
    "tourism/caravan_site": {
        "fields": [
            "operator",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "caravan_site"
        },
        "name": "RV Park"
    },
    "tourism/chalet": {
        "icon": "lodging",
        "fields": [
            "operator",
            "building_area",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "chalet"
        },
        "name": "Chalet"
    },
    "tourism/guest_house": {
        "icon": "lodging",
        "fields": [
            "operator",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "guest_house"
        },
        "terms": [
            "B&B",
            "Bed & Breakfast",
            "Bed and Breakfast"
        ],
        "name": "Guest House"
    },
    "tourism/hostel": {
        "icon": "lodging",
        "fields": [
            "operator",
            "building_area",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "hostel"
        },
        "name": "Hostel"
    },
    "tourism/hotel": {
        "icon": "lodging",
        "fields": [
            "operator",
            "building_area",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [],
        "tags": {
            "tourism": "hotel"
        },
        "name": "Hotel"
    },
    "tourism/information": {
        "fields": [
            "information",
            "building_area",
            "address",
            "operator"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "information"
        },
        "name": "Information"
    },
    "tourism/motel": {
        "icon": "lodging",
        "fields": [
            "operator",
            "building_area",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "motel"
        },
        "name": "Motel"
    },
    "tourism/museum": {
        "icon": "museum",
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [
            "exhibition",
            "exhibits archive",
            "foundation",
            "gallery",
            "hall",
            "institution",
            "library",
            "menagerie",
            "repository",
            "salon",
            "storehouse",
            "treasury",
            "vault"
        ],
        "tags": {
            "tourism": "museum"
        },
        "name": "Museum"
    },
    "tourism/picnic_site": {
        "icon": "park",
        "fields": [
            "operator",
            "address",
            "smoking"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "terms": [],
        "tags": {
            "tourism": "picnic_site"
        },
        "name": "Picnic Site"
    },
    "tourism/theme_park": {
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "theme_park"
        },
        "name": "Theme Park"
    },
    "tourism/viewpoint": {
        "geometry": [
            "point",
            "vertex"
        ],
        "tags": {
            "tourism": "viewpoint"
        },
        "name": "Viewpoint"
    },
    "tourism/zoo": {
        "icon": "zoo",
        "fields": [
            "operator",
            "address"
        ],
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "tags": {
            "tourism": "zoo"
        },
        "name": "Zoo"
    },
    "type/boundary": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "boundary"
        },
        "name": "Boundary",
        "icon": "boundary",
        "fields": [
            "boundary"
        ]
    },
    "type/boundary/administrative": {
        "name": "Administrative Boundary",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "boundary",
            "boundary": "administrative"
        },
        "fields": [
            "admin_level"
        ],
        "icon": "boundary"
    },
    "type/multipolygon": {
        "geometry": [
            "area",
            "relation"
        ],
        "tags": {
            "type": "multipolygon"
        },
        "removeTags": {},
        "name": "Multipolygon",
        "icon": "multipolygon",
        "searchable": false,
        "matchScore": 0.1
    },
    "type/restriction": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction"
        },
        "name": "Restriction",
        "icon": "restriction",
        "fields": [
            "restriction",
            "except"
        ]
    },
    "type/restriction/no_left_turn": {
        "name": "No Left Turn",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "no_left_turn"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-no-left-turn"
    },
    "type/restriction/no_right_turn": {
        "name": "No Right Turn",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "no_right_turn"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-no-right-turn"
    },
    "type/restriction/no_straight_on": {
        "name": "No Straight On",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "no_straight_on"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-no-straight-on"
    },
    "type/restriction/no_u_turn": {
        "name": "No U-turn",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "no_u_turn"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-no-u-turn"
    },
    "type/restriction/only_left_turn": {
        "name": "Left Turn Only",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "only_left_turn"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-only-left-turn"
    },
    "type/restriction/only_right_turn": {
        "name": "Right Turn Only",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "only_right_turn"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-only-right-turn"
    },
    "type/restriction/only_straight_on": {
        "name": "No Turns",
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "restriction",
            "restriction": "only_straight_on"
        },
        "fields": [
            "except"
        ],
        "icon": "restriction-only-straight-on"
    },
    "type/route": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route"
        },
        "name": "Route",
        "icon": "route",
        "fields": [
            "route",
            "ref"
        ]
    },
    "type/route/bicycle": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "bicycle"
        },
        "name": "Cycle Route",
        "icon": "route-bicycle",
        "fields": [
            "ref",
            "network"
        ]
    },
    "type/route/bus": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "bus"
        },
        "name": "Bus Route",
        "icon": "route-bus",
        "fields": [
            "ref",
            "operator",
            "network"
        ]
    },
    "type/route/detour": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "detour"
        },
        "name": "Detour Route",
        "icon": "route-detour",
        "fields": [
            "ref"
        ]
    },
    "type/route/ferry": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "ferry"
        },
        "name": "Ferry Route",
        "icon": "route-ferry",
        "fields": [
            "ref",
            "operator",
            "network"
        ]
    },
    "type/route/foot": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "foot"
        },
        "name": "Foot Route",
        "icon": "route-foot",
        "fields": [
            "ref",
            "operator",
            "network"
        ]
    },
    "type/route/hiking": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "hiking"
        },
        "name": "Hiking Route",
        "icon": "route-foot",
        "fields": [
            "ref",
            "operator",
            "network"
        ]
    },
    "type/route/pipeline": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "pipeline"
        },
        "name": "Pipeline Route",
        "icon": "route-pipeline",
        "fields": [
            "ref",
            "operator"
        ]
    },
    "type/route/power": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "power"
        },
        "name": "Power Route",
        "icon": "route-power",
        "fields": [
            "ref",
            "operator"
        ]
    },
    "type/route/road": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "road"
        },
        "name": "Road Route",
        "icon": "route-road",
        "fields": [
            "ref"
        ]
    },
    "type/route/train": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "train"
        },
        "name": "Train Route",
        "icon": "route-train",
        "fields": [
            "ref",
            "operator"
        ]
    },
    "type/route/tram": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route",
            "route": "tram"
        },
        "name": "Tram Route",
        "icon": "route-tram",
        "fields": [
            "ref",
            "operator"
        ]
    },
    "type/route_master": {
        "geometry": [
            "relation"
        ],
        "tags": {
            "type": "route_master"
        },
        "name": "Route Master",
        "icon": "route-master",
        "fields": [
            "route_master",
            "ref",
            "operator",
            "network"
        ]
    },
    "vertex": {
        "name": "Other",
        "tags": {},
        "geometry": [
            "vertex"
        ],
        "matchScore": 0.1
    },
    "waterway": {
        "fields": [
            "waterway"
        ],
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "waterway": "*"
        },
        "name": "Waterway"
    },
    "waterway/canal": {
        "icon": "waterway-canal",
        "fields": [
            "width"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "waterway": "canal"
        },
        "name": "Canal"
    },
    "waterway/dam": {
        "icon": "dam",
        "geometry": [
            "point",
            "vertex",
            "line",
            "area"
        ],
        "tags": {
            "waterway": "dam"
        },
        "name": "Dam"
    },
    "waterway/ditch": {
        "icon": "waterway-ditch",
        "fields": [
            "tunnel"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "waterway": "ditch"
        },
        "name": "Ditch"
    },
    "waterway/drain": {
        "icon": "waterway-stream",
        "fields": [
            "tunnel"
        ],
        "geometry": [
            "line"
        ],
        "tags": {
            "waterway": "drain"
        },
        "name": "Drain"
    },
    "waterway/river": {
        "icon": "waterway-river",
        "fields": [
            "tunnel",
            "width"
        ],
        "geometry": [
            "line"
        ],
        "terms": [
            "beck",
            "branch",
            "brook",
            "course",
            "creek",
            "estuary",
            "rill",
            "rivulet",
            "run",
            "runnel",
            "stream",
            "tributary",
            "watercourse"
        ],
        "tags": {
            "waterway": "river"
        },
        "name": "River"
    },
    "waterway/riverbank": {
        "icon": "water",
        "geometry": [
            "area"
        ],
        "tags": {
            "waterway": "riverbank"
        },
        "name": "Riverbank"
    },
    "waterway/stream": {
        "icon": "waterway-stream",
        "fields": [
            "tunnel",
            "width"
        ],
        "geometry": [
            "line"
        ],
        "terms": [
            "beck",
            "branch",
            "brook",
            "burn",
            "course",
            "creek",
            "current",
            "drift",
            "flood",
            "flow",
            "freshet",
            "race",
            "rill",
            "rindle",
            "rivulet",
            "run",
            "runnel",
            "rush",
            "spate",
            "spritz",
            "surge",
            "tide",
            "torrent",
            "tributary",
            "watercourse"
        ],
        "tags": {
            "waterway": "stream"
        },
        "name": "Stream"
    },
    "waterway/weir": {
        "icon": "dam",
        "geometry": [
            "vertex",
            "line"
        ],
        "tags": {
            "waterway": "weir"
        },
        "name": "Weir"
    },
    "amenity/fuel/76": {
        "tags": {
            "name": "76",
            "amenity": "fuel"
        },
        "name": "76",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Neste": {
        "tags": {
            "name": "Neste",
            "amenity": "fuel"
        },
        "name": "Neste",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/BP": {
        "tags": {
            "name": "BP",
            "amenity": "fuel"
        },
        "name": "BP",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Shell": {
        "tags": {
            "name": "Shell",
            "amenity": "fuel"
        },
        "name": "Shell",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Agip": {
        "tags": {
            "name": "Agip",
            "amenity": "fuel"
        },
        "name": "Agip",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Migrol": {
        "tags": {
            "name": "Migrol",
            "amenity": "fuel"
        },
        "name": "Migrol",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Avia": {
        "tags": {
            "name": "Avia",
            "amenity": "fuel"
        },
        "name": "Avia",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Texaco": {
        "tags": {
            "name": "Texaco",
            "amenity": "fuel"
        },
        "name": "Texaco",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Total": {
        "tags": {
            "name": "Total",
            "amenity": "fuel"
        },
        "name": "Total",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Statoil": {
        "tags": {
            "name": "Statoil",
            "amenity": "fuel"
        },
        "name": "Statoil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Esso": {
        "tags": {
            "name": "Esso",
            "amenity": "fuel"
        },
        "name": "Esso",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Jet": {
        "tags": {
            "name": "Jet",
            "amenity": "fuel"
        },
        "name": "Jet",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Avanti": {
        "tags": {
            "name": "Avanti",
            "amenity": "fuel"
        },
        "name": "Avanti",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/OMV": {
        "tags": {
            "name": "OMV",
            "amenity": "fuel"
        },
        "name": "OMV",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Aral": {
        "tags": {
            "name": "Aral",
            "amenity": "fuel"
        },
        "name": "Aral",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/JET": {
        "tags": {
            "name": "JET",
            "amenity": "fuel"
        },
        "name": "JET",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/United": {
        "tags": {
            "name": "United",
            "amenity": "fuel"
        },
        "name": "United",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Mobil": {
        "tags": {
            "name": "Mobil",
            "amenity": "fuel"
        },
        "name": "Mobil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Caltex": {
        "tags": {
            "name": "Caltex",
            "amenity": "fuel"
        },
        "name": "Caltex",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Sunoco": {
        "tags": {
            "name": "Sunoco",
            "amenity": "fuel"
        },
        "name": "Sunoco",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Q8": {
        "tags": {
            "name": "Q8",
            "amenity": "fuel"
        },
        "name": "Q8",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/ARAL": {
        "tags": {
            "name": "ARAL",
            "amenity": "fuel"
        },
        "name": "ARAL",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/CEPSA": {
        "tags": {
            "name": "CEPSA",
            "amenity": "fuel"
        },
        "name": "CEPSA",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/BFT": {
        "tags": {
            "name": "BFT",
            "amenity": "fuel"
        },
        "name": "BFT",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petron": {
        "tags": {
            "name": "Petron",
            "amenity": "fuel"
        },
        "name": "Petron",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Total Access": {
        "tags": {
            "name": "Total Access",
            "amenity": "fuel"
        },
        "name": "Total Access",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Elf": {
        "tags": {
            "name": "Elf",
            "amenity": "fuel"
        },
        "name": "Elf",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Station Service E. Leclerc": {
        "tags": {
            "name": "Station Service E. Leclerc",
            "amenity": "fuel"
        },
        "name": "Station Service E. Leclerc",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Shell Express": {
        "tags": {
            "name": "Shell Express",
            "amenity": "fuel"
        },
        "name": "Shell Express",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Hess": {
        "tags": {
            "name": "Hess",
            "amenity": "fuel"
        },
        "name": "Hess",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Flying V": {
        "tags": {
            "name": "Flying V",
            "amenity": "fuel"
        },
        "name": "Flying V",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/bft": {
        "tags": {
            "name": "bft",
            "amenity": "fuel"
        },
        "name": "bft",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Gulf": {
        "tags": {
            "name": "Gulf",
            "amenity": "fuel"
        },
        "name": "Gulf",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/PTT": {
        "tags": {
            "name": "PTT",
            "amenity": "fuel"
        },
        "name": "PTT",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/St1": {
        "tags": {
            "name": "St1",
            "amenity": "fuel"
        },
        "name": "St1",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Teboil": {
        "tags": {
            "name": "Teboil",
            "amenity": "fuel"
        },
        "name": "Teboil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/HEM": {
        "tags": {
            "name": "HEM",
            "amenity": "fuel"
        },
        "name": "HEM",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/GALP": {
        "tags": {
            "name": "GALP",
            "amenity": "fuel"
        },
        "name": "GALP",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/OK": {
        "tags": {
            "name": "OK",
            "amenity": "fuel"
        },
        "name": "OK",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??MV": {
        "tags": {
            "name": "??MV",
            "amenity": "fuel"
        },
        "name": "??MV",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Tinq": {
        "tags": {
            "name": "Tinq",
            "amenity": "fuel"
        },
        "name": "Tinq",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/OKQ8": {
        "tags": {
            "name": "OKQ8",
            "amenity": "fuel"
        },
        "name": "OKQ8",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Repsol": {
        "tags": {
            "name": "Repsol",
            "amenity": "fuel"
        },
        "name": "Repsol",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Westfalen": {
        "tags": {
            "name": "Westfalen",
            "amenity": "fuel"
        },
        "name": "Westfalen",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Esso Express": {
        "tags": {
            "name": "Esso Express",
            "amenity": "fuel"
        },
        "name": "Esso Express",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Tamoil": {
        "tags": {
            "name": "Tamoil",
            "amenity": "fuel"
        },
        "name": "Tamoil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Engen": {
        "tags": {
            "name": "Engen",
            "amenity": "fuel"
        },
        "name": "Engen",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Sasol": {
        "tags": {
            "name": "Sasol",
            "amenity": "fuel"
        },
        "name": "Sasol",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Topaz": {
        "tags": {
            "name": "Topaz",
            "amenity": "fuel"
        },
        "name": "Topaz",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/LPG": {
        "tags": {
            "name": "LPG",
            "amenity": "fuel"
        },
        "name": "LPG",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Orlen": {
        "tags": {
            "name": "Orlen",
            "amenity": "fuel"
        },
        "name": "Orlen",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Oilibya": {
        "tags": {
            "name": "Oilibya",
            "amenity": "fuel"
        },
        "name": "Oilibya",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Tango": {
        "tags": {
            "name": "Tango",
            "amenity": "fuel"
        },
        "name": "Tango",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Star": {
        "tags": {
            "name": "Star",
            "amenity": "fuel"
        },
        "name": "Star",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "fuel"
        },
        "name": "????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Cepsa": {
        "tags": {
            "name": "Cepsa",
            "amenity": "fuel"
        },
        "name": "Cepsa",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/OIL!": {
        "tags": {
            "name": "OIL!",
            "amenity": "fuel"
        },
        "name": "OIL!",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Ultramar": {
        "tags": {
            "name": "Ultramar",
            "amenity": "fuel"
        },
        "name": "Ultramar",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Irving": {
        "tags": {
            "name": "Irving",
            "amenity": "fuel"
        },
        "name": "Irving",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Lukoil": {
        "tags": {
            "name": "Lukoil",
            "amenity": "fuel"
        },
        "name": "Lukoil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petro-Canada": {
        "tags": {
            "name": "Petro-Canada",
            "amenity": "fuel"
        },
        "name": "Petro-Canada",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Agrola": {
        "tags": {
            "name": "Agrola",
            "amenity": "fuel"
        },
        "name": "Agrola",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Husky": {
        "tags": {
            "name": "Husky",
            "amenity": "fuel"
        },
        "name": "Husky",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Slovnaft": {
        "tags": {
            "name": "Slovnaft",
            "amenity": "fuel"
        },
        "name": "Slovnaft",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Sheetz": {
        "tags": {
            "name": "Sheetz",
            "amenity": "fuel"
        },
        "name": "Sheetz",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Mol": {
        "tags": {
            "name": "Mol",
            "amenity": "fuel"
        },
        "name": "Mol",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petronas": {
        "tags": {
            "name": "Petronas",
            "amenity": "fuel"
        },
        "name": "Petronas",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????????????": {
        "tags": {
            "name": "????????????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "fuel"
        },
        "name": "????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Elan": {
        "tags": {
            "name": "Elan",
            "amenity": "fuel"
        },
        "name": "Elan",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Turm??l": {
        "tags": {
            "name": "Turm??l",
            "amenity": "fuel"
        },
        "name": "Turm??l",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Neste A24": {
        "tags": {
            "name": "Neste A24",
            "amenity": "fuel"
        },
        "name": "Neste A24",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Marathon": {
        "tags": {
            "name": "Marathon",
            "amenity": "fuel"
        },
        "name": "Marathon",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Valero": {
        "tags": {
            "name": "Valero",
            "amenity": "fuel"
        },
        "name": "Valero",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Eni": {
        "tags": {
            "name": "Eni",
            "amenity": "fuel"
        },
        "name": "Eni",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Chevron": {
        "tags": {
            "name": "Chevron",
            "amenity": "fuel"
        },
        "name": "Chevron",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????": {
        "tags": {
            "name": "??????",
            "amenity": "fuel"
        },
        "name": "??????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/REPSOL": {
        "tags": {
            "name": "REPSOL",
            "amenity": "fuel"
        },
        "name": "REPSOL",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/MOL": {
        "tags": {
            "name": "MOL",
            "amenity": "fuel"
        },
        "name": "MOL",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Bliska": {
        "tags": {
            "name": "Bliska",
            "amenity": "fuel"
        },
        "name": "Bliska",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Api": {
        "tags": {
            "name": "Api",
            "amenity": "fuel"
        },
        "name": "Api",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Arco": {
        "tags": {
            "name": "Arco",
            "amenity": "fuel"
        },
        "name": "Arco",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Pemex": {
        "tags": {
            "name": "Pemex",
            "amenity": "fuel"
        },
        "name": "Pemex",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Exxon": {
        "tags": {
            "name": "Exxon",
            "amenity": "fuel"
        },
        "name": "Exxon",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Coles Express": {
        "tags": {
            "name": "Coles Express",
            "amenity": "fuel"
        },
        "name": "Coles Express",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petrom": {
        "tags": {
            "name": "Petrom",
            "amenity": "fuel"
        },
        "name": "Petrom",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/PETRONOR": {
        "tags": {
            "name": "PETRONOR",
            "amenity": "fuel"
        },
        "name": "PETRONOR",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Rompetrol": {
        "tags": {
            "name": "Rompetrol",
            "amenity": "fuel"
        },
        "name": "Rompetrol",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Lotos": {
        "tags": {
            "name": "Lotos",
            "amenity": "fuel"
        },
        "name": "Lotos",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????": {
        "tags": {
            "name": "??????",
            "amenity": "fuel"
        },
        "name": "??????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/BR": {
        "tags": {
            "name": "BR",
            "amenity": "fuel"
        },
        "name": "BR",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Copec": {
        "tags": {
            "name": "Copec",
            "amenity": "fuel"
        },
        "name": "Copec",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petrobras": {
        "tags": {
            "name": "Petrobras",
            "amenity": "fuel"
        },
        "name": "Petrobras",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Liberty": {
        "tags": {
            "name": "Liberty",
            "amenity": "fuel"
        },
        "name": "Liberty",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/IP": {
        "tags": {
            "name": "IP",
            "amenity": "fuel"
        },
        "name": "IP",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Erg": {
        "tags": {
            "name": "Erg",
            "amenity": "fuel"
        },
        "name": "Erg",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Eneos": {
        "tags": {
            "name": "Eneos",
            "amenity": "fuel"
        },
        "name": "Eneos",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Citgo": {
        "tags": {
            "name": "Citgo",
            "amenity": "fuel"
        },
        "name": "Citgo",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Metano": {
        "tags": {
            "name": "Metano",
            "amenity": "fuel"
        },
        "name": "Metano",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????????????????": {
        "tags": {
            "name": "????????????????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/EKO": {
        "tags": {
            "name": "EKO",
            "amenity": "fuel"
        },
        "name": "EKO",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Eko": {
        "tags": {
            "name": "Eko",
            "amenity": "fuel"
        },
        "name": "Eko",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Indipend.": {
        "tags": {
            "name": "Indipend.",
            "amenity": "fuel"
        },
        "name": "Indipend.",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/IES": {
        "tags": {
            "name": "IES",
            "amenity": "fuel"
        },
        "name": "IES",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/TotalErg": {
        "tags": {
            "name": "TotalErg",
            "amenity": "fuel"
        },
        "name": "TotalErg",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Cenex": {
        "tags": {
            "name": "Cenex",
            "amenity": "fuel"
        },
        "name": "Cenex",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????": {
        "tags": {
            "name": "??????",
            "amenity": "fuel"
        },
        "name": "??????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/HP": {
        "tags": {
            "name": "HP",
            "amenity": "fuel"
        },
        "name": "HP",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Phillips 66": {
        "tags": {
            "name": "Phillips 66",
            "amenity": "fuel"
        },
        "name": "Phillips 66",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/CARREFOUR": {
        "tags": {
            "name": "CARREFOUR",
            "amenity": "fuel"
        },
        "name": "CARREFOUR",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/ERG": {
        "tags": {
            "name": "ERG",
            "amenity": "fuel"
        },
        "name": "ERG",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Speedway": {
        "tags": {
            "name": "Speedway",
            "amenity": "fuel"
        },
        "name": "Speedway",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Benzina": {
        "tags": {
            "name": "Benzina",
            "amenity": "fuel"
        },
        "name": "Benzina",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Terpel": {
        "tags": {
            "name": "Terpel",
            "amenity": "fuel"
        },
        "name": "Terpel",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/WOG": {
        "tags": {
            "name": "WOG",
            "amenity": "fuel"
        },
        "name": "WOG",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Seaoil": {
        "tags": {
            "name": "Seaoil",
            "amenity": "fuel"
        },
        "name": "Seaoil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????": {
        "tags": {
            "name": "??????",
            "amenity": "fuel"
        },
        "name": "??????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Kwik Trip": {
        "tags": {
            "name": "Kwik Trip",
            "amenity": "fuel"
        },
        "name": "Kwik Trip",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Pertamina": {
        "tags": {
            "name": "Pertamina",
            "amenity": "fuel"
        },
        "name": "Pertamina",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/COSMO": {
        "tags": {
            "name": "COSMO",
            "amenity": "fuel"
        },
        "name": "COSMO",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Z": {
        "tags": {
            "name": "Z",
            "amenity": "fuel"
        },
        "name": "Z",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Indian Oil": {
        "tags": {
            "name": "Indian Oil",
            "amenity": "fuel"
        },
        "name": "Indian Oil",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????": {
        "tags": {
            "name": "????????",
            "amenity": "fuel"
        },
        "name": "????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/INA": {
        "tags": {
            "name": "INA",
            "amenity": "fuel"
        },
        "name": "INA",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/JOMO": {
        "tags": {
            "name": "JOMO",
            "amenity": "fuel"
        },
        "name": "JOMO",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Holiday": {
        "tags": {
            "name": "Holiday",
            "amenity": "fuel"
        },
        "name": "Holiday",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/YPF": {
        "tags": {
            "name": "YPF",
            "amenity": "fuel"
        },
        "name": "YPF",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/IDEMITSU": {
        "tags": {
            "name": "IDEMITSU",
            "amenity": "fuel"
        },
        "name": "IDEMITSU",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/ENEOS": {
        "tags": {
            "name": "ENEOS",
            "amenity": "fuel"
        },
        "name": "ENEOS",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Stacja paliw": {
        "tags": {
            "name": "Stacja paliw",
            "amenity": "fuel"
        },
        "name": "Stacja paliw",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Bharat Petroleum": {
        "tags": {
            "name": "Bharat Petroleum",
            "amenity": "fuel"
        },
        "name": "Bharat Petroleum",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/CAMPSA": {
        "tags": {
            "name": "CAMPSA",
            "amenity": "fuel"
        },
        "name": "CAMPSA",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Casey's General Store": {
        "tags": {
            "name": "Casey's General Store",
            "amenity": "fuel"
        },
        "name": "Casey's General Store",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Kangaroo": {
        "tags": {
            "name": "Kangaroo",
            "amenity": "fuel"
        },
        "name": "Kangaroo",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????????????? (COSMO)": {
        "tags": {
            "name": "??????????????? (COSMO)",
            "amenity": "fuel"
        },
        "name": "??????????????? (COSMO)",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/MEROIL": {
        "tags": {
            "name": "MEROIL",
            "amenity": "fuel"
        },
        "name": "MEROIL",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/1-2-3": {
        "tags": {
            "name": "1-2-3",
            "amenity": "fuel"
        },
        "name": "1-2-3",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????": {
        "tags": {
            "name": "??????",
            "name:en": "IDEMITSU",
            "amenity": "fuel"
        },
        "name": "??????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/???? ????????????": {
        "tags": {
            "name": "???? ????????????",
            "amenity": "fuel"
        },
        "name": "???? ????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Sinclair": {
        "tags": {
            "name": "Sinclair",
            "amenity": "fuel"
        },
        "name": "Sinclair",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Conoco": {
        "tags": {
            "name": "Conoco",
            "amenity": "fuel"
        },
        "name": "Conoco",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/SPBU": {
        "tags": {
            "name": "SPBU",
            "amenity": "fuel"
        },
        "name": "SPBU",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "fuel"
        },
        "name": "??????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Posto Ipiranga": {
        "tags": {
            "name": "Posto Ipiranga",
            "amenity": "fuel"
        },
        "name": "Posto Ipiranga",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Posto Shell": {
        "tags": {
            "name": "Posto Shell",
            "amenity": "fuel"
        },
        "name": "Posto Shell",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Phoenix": {
        "tags": {
            "name": "Phoenix",
            "amenity": "fuel"
        },
        "name": "Phoenix",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Ipiranga": {
        "tags": {
            "name": "Ipiranga",
            "amenity": "fuel"
        },
        "name": "Ipiranga",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/OKKO": {
        "tags": {
            "name": "OKKO",
            "amenity": "fuel"
        },
        "name": "OKKO",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????": {
        "tags": {
            "name": "????????",
            "amenity": "fuel"
        },
        "name": "????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "fuel"
        },
        "name": "??????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/QuikTrip": {
        "tags": {
            "name": "QuikTrip",
            "amenity": "fuel"
        },
        "name": "QuikTrip",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Posto BR": {
        "tags": {
            "name": "Posto BR",
            "amenity": "fuel"
        },
        "name": "Posto BR",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??? ??? ???": {
        "tags": {
            "name": "??? ??? ???",
            "amenity": "fuel"
        },
        "name": "??? ??? ???",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/?????????": {
        "tags": {
            "name": "?????????",
            "amenity": "fuel"
        },
        "name": "?????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/ANP": {
        "tags": {
            "name": "ANP",
            "amenity": "fuel"
        },
        "name": "ANP",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Kum & Go": {
        "tags": {
            "name": "Kum & Go",
            "amenity": "fuel"
        },
        "name": "Kum & Go",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Petrolimex": {
        "tags": {
            "name": "Petrolimex",
            "amenity": "fuel"
        },
        "name": "Petrolimex",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Sokimex": {
        "tags": {
            "name": "Sokimex",
            "amenity": "fuel"
        },
        "name": "Sokimex",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Tela": {
        "tags": {
            "name": "Tela",
            "amenity": "fuel"
        },
        "name": "Tela",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Posto": {
        "tags": {
            "name": "Posto",
            "amenity": "fuel"
        },
        "name": "Posto",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "fuel"
        },
        "name": "????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????????????????????????????": {
        "tags": {
            "name": "??????????????????????????????",
            "amenity": "fuel"
        },
        "name": "??????????????????????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Afriquia": {
        "tags": {
            "name": "Afriquia",
            "amenity": "fuel"
        },
        "name": "Afriquia",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/Murphy USA": {
        "tags": {
            "name": "Murphy USA",
            "amenity": "fuel"
        },
        "name": "Murphy USA",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/??????????????? (Showa-shell)": {
        "tags": {
            "name": "??????????????? (Showa-shell)",
            "amenity": "fuel"
        },
        "name": "??????????????? (Showa-shell)",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "fuel"
        },
        "name": "????????????",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/fuel/CNG": {
        "tags": {
            "name": "CNG",
            "amenity": "fuel"
        },
        "name": "CNG",
        "icon": "fuel",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "address",
            "building_area"
        ],
        "suggestion": true
    },
    "amenity/pub/Kings Arms": {
        "tags": {
            "name": "Kings Arms",
            "amenity": "pub"
        },
        "name": "Kings Arms",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Ship": {
        "tags": {
            "name": "The Ship",
            "amenity": "pub"
        },
        "name": "The Ship",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The White Horse": {
        "tags": {
            "name": "The White Horse",
            "amenity": "pub"
        },
        "name": "The White Horse",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The White Hart": {
        "tags": {
            "name": "The White Hart",
            "amenity": "pub"
        },
        "name": "The White Hart",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Royal Oak": {
        "tags": {
            "name": "Royal Oak",
            "amenity": "pub"
        },
        "name": "Royal Oak",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Red Lion": {
        "tags": {
            "name": "The Red Lion",
            "amenity": "pub"
        },
        "name": "The Red Lion",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Kings Arms": {
        "tags": {
            "name": "The Kings Arms",
            "amenity": "pub"
        },
        "name": "The Kings Arms",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Star": {
        "tags": {
            "name": "The Star",
            "amenity": "pub"
        },
        "name": "The Star",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Anchor": {
        "tags": {
            "name": "The Anchor",
            "amenity": "pub"
        },
        "name": "The Anchor",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Cross Keys": {
        "tags": {
            "name": "The Cross Keys",
            "amenity": "pub"
        },
        "name": "The Cross Keys",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Wheatsheaf": {
        "tags": {
            "name": "The Wheatsheaf",
            "amenity": "pub"
        },
        "name": "The Wheatsheaf",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Crown Inn": {
        "tags": {
            "name": "The Crown Inn",
            "amenity": "pub"
        },
        "name": "The Crown Inn",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Kings Head": {
        "tags": {
            "name": "The Kings Head",
            "amenity": "pub"
        },
        "name": "The Kings Head",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Castle": {
        "tags": {
            "name": "The Castle",
            "amenity": "pub"
        },
        "name": "The Castle",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Railway": {
        "tags": {
            "name": "The Railway",
            "amenity": "pub"
        },
        "name": "The Railway",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The White Lion": {
        "tags": {
            "name": "The White Lion",
            "amenity": "pub"
        },
        "name": "The White Lion",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Bell": {
        "tags": {
            "name": "The Bell",
            "amenity": "pub"
        },
        "name": "The Bell",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Bull": {
        "tags": {
            "name": "The Bull",
            "amenity": "pub"
        },
        "name": "The Bull",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Plough": {
        "tags": {
            "name": "The Plough",
            "amenity": "pub"
        },
        "name": "The Plough",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The George": {
        "tags": {
            "name": "The George",
            "amenity": "pub"
        },
        "name": "The George",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Royal Oak": {
        "tags": {
            "name": "The Royal Oak",
            "amenity": "pub"
        },
        "name": "The Royal Oak",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Fox": {
        "tags": {
            "name": "The Fox",
            "amenity": "pub"
        },
        "name": "The Fox",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Prince of Wales": {
        "tags": {
            "name": "Prince of Wales",
            "amenity": "pub"
        },
        "name": "Prince of Wales",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Rising Sun": {
        "tags": {
            "name": "The Rising Sun",
            "amenity": "pub"
        },
        "name": "The Rising Sun",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Prince of Wales": {
        "tags": {
            "name": "The Prince of Wales",
            "amenity": "pub"
        },
        "name": "The Prince of Wales",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Crown": {
        "tags": {
            "name": "The Crown",
            "amenity": "pub"
        },
        "name": "The Crown",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Chequers": {
        "tags": {
            "name": "The Chequers",
            "amenity": "pub"
        },
        "name": "The Chequers",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Swan": {
        "tags": {
            "name": "The Swan",
            "amenity": "pub"
        },
        "name": "The Swan",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Rose and Crown": {
        "tags": {
            "name": "Rose and Crown",
            "amenity": "pub"
        },
        "name": "Rose and Crown",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Victoria": {
        "tags": {
            "name": "The Victoria",
            "amenity": "pub"
        },
        "name": "The Victoria",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/New Inn": {
        "tags": {
            "name": "New Inn",
            "amenity": "pub"
        },
        "name": "New Inn",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Royal Hotel": {
        "tags": {
            "name": "Royal Hotel",
            "amenity": "pub"
        },
        "name": "Royal Hotel",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Red Lion": {
        "tags": {
            "name": "Red Lion",
            "amenity": "pub"
        },
        "name": "Red Lion",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Cross Keys": {
        "tags": {
            "name": "Cross Keys",
            "amenity": "pub"
        },
        "name": "Cross Keys",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Greyhound": {
        "tags": {
            "name": "The Greyhound",
            "amenity": "pub"
        },
        "name": "The Greyhound",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Black Horse": {
        "tags": {
            "name": "The Black Horse",
            "amenity": "pub"
        },
        "name": "The Black Horse",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The New Inn": {
        "tags": {
            "name": "The New Inn",
            "amenity": "pub"
        },
        "name": "The New Inn",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Kings Head": {
        "tags": {
            "name": "Kings Head",
            "amenity": "pub"
        },
        "name": "Kings Head",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Albion": {
        "tags": {
            "name": "The Albion",
            "amenity": "pub"
        },
        "name": "The Albion",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Angel": {
        "tags": {
            "name": "The Angel",
            "amenity": "pub"
        },
        "name": "The Angel",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Queens Head": {
        "tags": {
            "name": "The Queens Head",
            "amenity": "pub"
        },
        "name": "The Queens Head",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/The Ship Inn": {
        "tags": {
            "name": "The Ship Inn",
            "amenity": "pub"
        },
        "name": "The Ship Inn",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Rose & Crown": {
        "tags": {
            "name": "Rose & Crown",
            "amenity": "pub"
        },
        "name": "Rose & Crown",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Queens Head": {
        "tags": {
            "name": "Queens Head",
            "amenity": "pub"
        },
        "name": "Queens Head",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/pub/Irish Pub": {
        "tags": {
            "name": "Irish Pub",
            "amenity": "pub"
        },
        "name": "Irish Pub",
        "icon": "beer",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Quick": {
        "tags": {
            "name": "Quick",
            "amenity": "fast_food"
        },
        "name": "Quick",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/McDonald's": {
        "tags": {
            "name": "McDonald's",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "McDonald's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Subway": {
        "tags": {
            "name": "Subway",
            "cuisine": "sandwich",
            "amenity": "fast_food"
        },
        "name": "Subway",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Burger King": {
        "tags": {
            "name": "Burger King",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Burger King",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Ali Baba": {
        "tags": {
            "name": "Ali Baba",
            "amenity": "fast_food"
        },
        "name": "Ali Baba",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Hungry Jacks": {
        "tags": {
            "name": "Hungry Jacks",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Hungry Jacks",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Red Rooster": {
        "tags": {
            "name": "Red Rooster",
            "amenity": "fast_food"
        },
        "name": "Red Rooster",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/KFC": {
        "tags": {
            "name": "KFC",
            "cuisine": "chicken",
            "amenity": "fast_food"
        },
        "name": "KFC",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Domino's Pizza": {
        "tags": {
            "name": "Domino's Pizza",
            "cuisine": "pizza",
            "amenity": "fast_food"
        },
        "name": "Domino's Pizza",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Chowking": {
        "tags": {
            "name": "Chowking",
            "amenity": "fast_food"
        },
        "name": "Chowking",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Jollibee": {
        "tags": {
            "name": "Jollibee",
            "amenity": "fast_food"
        },
        "name": "Jollibee",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Hesburger": {
        "tags": {
            "name": "Hesburger",
            "amenity": "fast_food"
        },
        "name": "Hesburger",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????": {
        "tags": {
            "name": "?????????",
            "amenity": "fast_food"
        },
        "name": "?????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Wendy's": {
        "tags": {
            "name": "Wendy's",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Wendy's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Tim Hortons": {
        "tags": {
            "name": "Tim Hortons",
            "amenity": "fast_food"
        },
        "name": "Tim Hortons",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Steers": {
        "tags": {
            "name": "Steers",
            "amenity": "fast_food"
        },
        "name": "Steers",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Hardee's": {
        "tags": {
            "name": "Hardee's",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Hardee's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Arby's": {
        "tags": {
            "name": "Arby's",
            "amenity": "fast_food"
        },
        "name": "Arby's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/A&W": {
        "tags": {
            "name": "A&W",
            "amenity": "fast_food"
        },
        "name": "A&W",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Dairy Queen": {
        "tags": {
            "name": "Dairy Queen",
            "amenity": "fast_food"
        },
        "name": "Dairy Queen",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Hallo Pizza": {
        "tags": {
            "name": "Hallo Pizza",
            "amenity": "fast_food"
        },
        "name": "Hallo Pizza",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Fish & Chips": {
        "tags": {
            "name": "Fish & Chips",
            "amenity": "fast_food"
        },
        "name": "Fish & Chips",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Harvey's": {
        "tags": {
            "name": "Harvey's",
            "amenity": "fast_food"
        },
        "name": "Harvey's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????": {
        "tags": {
            "name": "?????????",
            "amenity": "fast_food"
        },
        "name": "?????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Pizza Pizza": {
        "tags": {
            "name": "Pizza Pizza",
            "amenity": "fast_food"
        },
        "name": "Pizza Pizza",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Kotipizza": {
        "tags": {
            "name": "Kotipizza",
            "amenity": "fast_food"
        },
        "name": "Kotipizza",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Jack in the Box": {
        "tags": {
            "name": "Jack in the Box",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Jack in the Box",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Istanbul": {
        "tags": {
            "name": "Istanbul",
            "amenity": "fast_food"
        },
        "name": "Istanbul",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Kochl??ffel": {
        "tags": {
            "name": "Kochl??ffel",
            "amenity": "fast_food"
        },
        "name": "Kochl??ffel",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/D??ner": {
        "tags": {
            "name": "D??ner",
            "amenity": "fast_food"
        },
        "name": "D??ner",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Telepizza": {
        "tags": {
            "name": "Telepizza",
            "amenity": "fast_food"
        },
        "name": "Telepizza",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Sibylla": {
        "tags": {
            "name": "Sibylla",
            "amenity": "fast_food"
        },
        "name": "Sibylla",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Carl's Jr.": {
        "tags": {
            "name": "Carl's Jr.",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Carl's Jr.",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Quiznos": {
        "tags": {
            "name": "Quiznos",
            "cuisine": "sandwich",
            "amenity": "fast_food"
        },
        "name": "Quiznos",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Wimpy": {
        "tags": {
            "name": "Wimpy",
            "amenity": "fast_food"
        },
        "name": "Wimpy",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Sonic": {
        "tags": {
            "name": "Sonic",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "Sonic",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Taco Bell": {
        "tags": {
            "name": "Taco Bell",
            "amenity": "fast_food"
        },
        "name": "Taco Bell",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Pizza Nova": {
        "tags": {
            "name": "Pizza Nova",
            "amenity": "fast_food"
        },
        "name": "Pizza Nova",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Papa John's": {
        "tags": {
            "name": "Papa John's",
            "cuisine": "pizza",
            "amenity": "fast_food"
        },
        "name": "Papa John's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Nordsee": {
        "tags": {
            "name": "Nordsee",
            "amenity": "fast_food"
        },
        "name": "Nordsee",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Mr. Sub": {
        "tags": {
            "name": "Mr. Sub",
            "amenity": "fast_food"
        },
        "name": "Mr. Sub",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Kebab": {
        "tags": {
            "name": "Kebab",
            "amenity": "fast_food"
        },
        "name": "Kebab",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "name:en": "McDonald's",
            "amenity": "fast_food"
        },
        "name": "????????????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Asia Imbiss": {
        "tags": {
            "name": "Asia Imbiss",
            "amenity": "fast_food"
        },
        "name": "Asia Imbiss",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Imbiss": {
        "tags": {
            "name": "Imbiss",
            "amenity": "fast_food"
        },
        "name": "Imbiss",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Chipotle": {
        "tags": {
            "name": "Chipotle",
            "cuisine": "mexican",
            "amenity": "fast_food"
        },
        "name": "Chipotle",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "name:en": "McDonald's",
            "cuisine": "burger",
            "amenity": "fast_food"
        },
        "name": "??????????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/In-N-Out Burger": {
        "tags": {
            "name": "In-N-Out Burger",
            "amenity": "fast_food"
        },
        "name": "In-N-Out Burger",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Jimmy John's": {
        "tags": {
            "name": "Jimmy John's",
            "amenity": "fast_food"
        },
        "name": "Jimmy John's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Jamba Juice": {
        "tags": {
            "name": "Jamba Juice",
            "amenity": "fast_food"
        },
        "name": "Jamba Juice",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????? ????????????": {
        "tags": {
            "name": "?????????? ????????????",
            "amenity": "fast_food"
        },
        "name": "?????????? ????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Baskin Robbins": {
        "tags": {
            "name": "Baskin Robbins",
            "amenity": "fast_food"
        },
        "name": "Baskin Robbins",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/???????????????????????????????????????": {
        "tags": {
            "name": "???????????????????????????????????????",
            "name:en": "KFC",
            "cuisine": "chicken",
            "amenity": "fast_food"
        },
        "name": "???????????????????????????????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????": {
        "tags": {
            "name": "?????????",
            "amenity": "fast_food"
        },
        "name": "?????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Taco Time": {
        "tags": {
            "name": "Taco Time",
            "amenity": "fast_food"
        },
        "name": "Taco Time",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/??????": {
        "tags": {
            "name": "??????",
            "name:en": "Matsuya",
            "amenity": "fast_food"
        },
        "name": "??????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Little Caesars": {
        "tags": {
            "name": "Little Caesars",
            "amenity": "fast_food"
        },
        "name": "Little Caesars",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/El Pollo Loco": {
        "tags": {
            "name": "El Pollo Loco",
            "amenity": "fast_food"
        },
        "name": "El Pollo Loco",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Del Taco": {
        "tags": {
            "name": "Del Taco",
            "amenity": "fast_food"
        },
        "name": "Del Taco",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/White Castle": {
        "tags": {
            "name": "White Castle",
            "amenity": "fast_food"
        },
        "name": "White Castle",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Boston Market": {
        "tags": {
            "name": "Boston Market",
            "amenity": "fast_food"
        },
        "name": "Boston Market",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Chick-fil-A": {
        "tags": {
            "name": "Chick-fil-A",
            "cuisine": "chicken",
            "amenity": "fast_food"
        },
        "name": "Chick-fil-A",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Panda Express": {
        "tags": {
            "name": "Panda Express",
            "amenity": "fast_food"
        },
        "name": "Panda Express",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Whataburger": {
        "tags": {
            "name": "Whataburger",
            "amenity": "fast_food"
        },
        "name": "Whataburger",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Taco John's": {
        "tags": {
            "name": "Taco John's",
            "amenity": "fast_food"
        },
        "name": "Taco John's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/??????????????": {
        "tags": {
            "name": "??????????????",
            "amenity": "fast_food"
        },
        "name": "??????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Culver's": {
        "tags": {
            "name": "Culver's",
            "amenity": "fast_food"
        },
        "name": "Culver's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Five Guys": {
        "tags": {
            "name": "Five Guys",
            "amenity": "fast_food"
        },
        "name": "Five Guys",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Church's Chicken": {
        "tags": {
            "name": "Church's Chicken",
            "amenity": "fast_food"
        },
        "name": "Church's Chicken",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Popeye's": {
        "tags": {
            "name": "Popeye's",
            "cuisine": "chicken",
            "amenity": "fast_food"
        },
        "name": "Popeye's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Long John Silver's": {
        "tags": {
            "name": "Long John Silver's",
            "amenity": "fast_food"
        },
        "name": "Long John Silver's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Pollo Campero": {
        "tags": {
            "name": "Pollo Campero",
            "amenity": "fast_food"
        },
        "name": "Pollo Campero",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/Zaxby's": {
        "tags": {
            "name": "Zaxby's",
            "amenity": "fast_food"
        },
        "name": "Zaxby's",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????": {
        "tags": {
            "name": "?????????",
            "name:en": "SUKIYA",
            "amenity": "fast_food"
        },
        "name": "?????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "name:en": "MOS BURGER",
            "amenity": "fast_food"
        },
        "name": "??????????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????????? ??????????????": {
        "tags": {
            "name": "?????????????? ??????????????",
            "amenity": "fast_food"
        },
        "name": "?????????????? ??????????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/fast_food/?????????": {
        "tags": {
            "name": "?????????",
            "amenity": "fast_food"
        },
        "name": "?????????",
        "icon": "fast-food",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Pizza Hut": {
        "tags": {
            "name": "Pizza Hut",
            "amenity": "restaurant"
        },
        "name": "Pizza Hut",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Little Chef": {
        "tags": {
            "name": "Little Chef",
            "amenity": "restaurant"
        },
        "name": "Little Chef",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Adler": {
        "tags": {
            "name": "Adler",
            "amenity": "restaurant"
        },
        "name": "Adler",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zur Krone": {
        "tags": {
            "name": "Zur Krone",
            "amenity": "restaurant"
        },
        "name": "Zur Krone",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Deutsches Haus": {
        "tags": {
            "name": "Deutsches Haus",
            "amenity": "restaurant"
        },
        "name": "Deutsches Haus",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Krone": {
        "tags": {
            "name": "Krone",
            "amenity": "restaurant"
        },
        "name": "Krone",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Akropolis": {
        "tags": {
            "name": "Akropolis",
            "amenity": "restaurant"
        },
        "name": "Akropolis",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sch??tzenhaus": {
        "tags": {
            "name": "Sch??tzenhaus",
            "amenity": "restaurant"
        },
        "name": "Sch??tzenhaus",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Kreuz": {
        "tags": {
            "name": "Kreuz",
            "amenity": "restaurant"
        },
        "name": "Kreuz",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Waldsch??nke": {
        "tags": {
            "name": "Waldsch??nke",
            "amenity": "restaurant"
        },
        "name": "Waldsch??nke",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Piazza": {
        "tags": {
            "name": "La Piazza",
            "amenity": "restaurant"
        },
        "name": "La Piazza",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Lamm": {
        "tags": {
            "name": "Lamm",
            "amenity": "restaurant"
        },
        "name": "Lamm",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zur Sonne": {
        "tags": {
            "name": "Zur Sonne",
            "amenity": "restaurant"
        },
        "name": "Zur Sonne",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zur Linde": {
        "tags": {
            "name": "Zur Linde",
            "amenity": "restaurant"
        },
        "name": "Zur Linde",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Poseidon": {
        "tags": {
            "name": "Poseidon",
            "amenity": "restaurant"
        },
        "name": "Poseidon",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Shanghai": {
        "tags": {
            "name": "Shanghai",
            "amenity": "restaurant"
        },
        "name": "Shanghai",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Red Lobster": {
        "tags": {
            "name": "Red Lobster",
            "amenity": "restaurant"
        },
        "name": "Red Lobster",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zum L??wen": {
        "tags": {
            "name": "Zum L??wen",
            "amenity": "restaurant"
        },
        "name": "Zum L??wen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Swiss Chalet": {
        "tags": {
            "name": "Swiss Chalet",
            "amenity": "restaurant"
        },
        "name": "Swiss Chalet",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Olympia": {
        "tags": {
            "name": "Olympia",
            "amenity": "restaurant"
        },
        "name": "Olympia",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Wagamama": {
        "tags": {
            "name": "Wagamama",
            "amenity": "restaurant"
        },
        "name": "Wagamama",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Frankie & Benny's": {
        "tags": {
            "name": "Frankie & Benny's",
            "amenity": "restaurant"
        },
        "name": "Frankie & Benny's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hooters": {
        "tags": {
            "name": "Hooters",
            "amenity": "restaurant"
        },
        "name": "Hooters",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sternen": {
        "tags": {
            "name": "Sternen",
            "amenity": "restaurant"
        },
        "name": "Sternen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hirschen": {
        "tags": {
            "name": "Hirschen",
            "amenity": "restaurant"
        },
        "name": "Hirschen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Denny's": {
        "tags": {
            "name": "Denny's",
            "amenity": "restaurant"
        },
        "name": "Denny's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Athen": {
        "tags": {
            "name": "Athen",
            "amenity": "restaurant"
        },
        "name": "Athen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sonne": {
        "tags": {
            "name": "Sonne",
            "amenity": "restaurant"
        },
        "name": "Sonne",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hirsch": {
        "tags": {
            "name": "Hirsch",
            "amenity": "restaurant"
        },
        "name": "Hirsch",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Ratskeller": {
        "tags": {
            "name": "Ratskeller",
            "amenity": "restaurant"
        },
        "name": "Ratskeller",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Cantina": {
        "tags": {
            "name": "La Cantina",
            "amenity": "restaurant"
        },
        "name": "La Cantina",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Gasthaus Krone": {
        "tags": {
            "name": "Gasthaus Krone",
            "amenity": "restaurant"
        },
        "name": "Gasthaus Krone",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/El Greco": {
        "tags": {
            "name": "El Greco",
            "amenity": "restaurant"
        },
        "name": "El Greco",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Gasthof zur Post": {
        "tags": {
            "name": "Gasthof zur Post",
            "amenity": "restaurant"
        },
        "name": "Gasthof zur Post",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Nando's": {
        "tags": {
            "name": "Nando's",
            "amenity": "restaurant"
        },
        "name": "Nando's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/L??wen": {
        "tags": {
            "name": "L??wen",
            "amenity": "restaurant"
        },
        "name": "L??wen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Pataterie": {
        "tags": {
            "name": "La Pataterie",
            "amenity": "restaurant"
        },
        "name": "La Pataterie",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Bella Napoli": {
        "tags": {
            "name": "Bella Napoli",
            "amenity": "restaurant"
        },
        "name": "Bella Napoli",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Pizza Express": {
        "tags": {
            "name": "Pizza Express",
            "amenity": "restaurant"
        },
        "name": "Pizza Express",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Mandarin": {
        "tags": {
            "name": "Mandarin",
            "amenity": "restaurant"
        },
        "name": "Mandarin",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hong Kong": {
        "tags": {
            "name": "Hong Kong",
            "amenity": "restaurant"
        },
        "name": "Hong Kong",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zizzi": {
        "tags": {
            "name": "Zizzi",
            "amenity": "restaurant"
        },
        "name": "Zizzi",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Cracker Barrel": {
        "tags": {
            "name": "Cracker Barrel",
            "amenity": "restaurant"
        },
        "name": "Cracker Barrel",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Rhodos": {
        "tags": {
            "name": "Rhodos",
            "amenity": "restaurant"
        },
        "name": "Rhodos",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Lindenhof": {
        "tags": {
            "name": "Lindenhof",
            "amenity": "restaurant"
        },
        "name": "Lindenhof",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Milano": {
        "tags": {
            "name": "Milano",
            "amenity": "restaurant"
        },
        "name": "Milano",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Dolce Vita": {
        "tags": {
            "name": "Dolce Vita",
            "amenity": "restaurant"
        },
        "name": "Dolce Vita",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Kirchenwirt": {
        "tags": {
            "name": "Kirchenwirt",
            "amenity": "restaurant"
        },
        "name": "Kirchenwirt",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Kantine": {
        "tags": {
            "name": "Kantine",
            "amenity": "restaurant"
        },
        "name": "Kantine",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Ochsen": {
        "tags": {
            "name": "Ochsen",
            "amenity": "restaurant"
        },
        "name": "Ochsen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Spur": {
        "tags": {
            "name": "Spur",
            "amenity": "restaurant"
        },
        "name": "Spur",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Mykonos": {
        "tags": {
            "name": "Mykonos",
            "amenity": "restaurant"
        },
        "name": "Mykonos",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Lotus": {
        "tags": {
            "name": "Lotus",
            "amenity": "restaurant"
        },
        "name": "Lotus",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Applebee's": {
        "tags": {
            "name": "Applebee's",
            "amenity": "restaurant"
        },
        "name": "Applebee's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Flunch": {
        "tags": {
            "name": "Flunch",
            "amenity": "restaurant"
        },
        "name": "Flunch",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Zur Post": {
        "tags": {
            "name": "Zur Post",
            "amenity": "restaurant"
        },
        "name": "Zur Post",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/China Town": {
        "tags": {
            "name": "China Town",
            "amenity": "restaurant"
        },
        "name": "China Town",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Dolce Vita": {
        "tags": {
            "name": "La Dolce Vita",
            "amenity": "restaurant"
        },
        "name": "La Dolce Vita",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Waffle House": {
        "tags": {
            "name": "Waffle House",
            "amenity": "restaurant"
        },
        "name": "Waffle House",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Delphi": {
        "tags": {
            "name": "Delphi",
            "amenity": "restaurant"
        },
        "name": "Delphi",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Linde": {
        "tags": {
            "name": "Linde",
            "amenity": "restaurant"
        },
        "name": "Linde",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Outback Steakhouse": {
        "tags": {
            "name": "Outback Steakhouse",
            "amenity": "restaurant"
        },
        "name": "Outback Steakhouse",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Dionysos": {
        "tags": {
            "name": "Dionysos",
            "amenity": "restaurant"
        },
        "name": "Dionysos",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Kelsey's": {
        "tags": {
            "name": "Kelsey's",
            "amenity": "restaurant"
        },
        "name": "Kelsey's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Boston Pizza": {
        "tags": {
            "name": "Boston Pizza",
            "amenity": "restaurant"
        },
        "name": "Boston Pizza",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Bella Italia": {
        "tags": {
            "name": "Bella Italia",
            "amenity": "restaurant"
        },
        "name": "Bella Italia",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sizzler": {
        "tags": {
            "name": "Sizzler",
            "amenity": "restaurant"
        },
        "name": "Sizzler",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Gr??ner Baum": {
        "tags": {
            "name": "Gr??ner Baum",
            "amenity": "restaurant"
        },
        "name": "Gr??ner Baum",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Taj Mahal": {
        "tags": {
            "name": "Taj Mahal",
            "amenity": "restaurant"
        },
        "name": "Taj Mahal",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/R??ssli": {
        "tags": {
            "name": "R??ssli",
            "amenity": "restaurant"
        },
        "name": "R??ssli",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Traube": {
        "tags": {
            "name": "Traube",
            "amenity": "restaurant"
        },
        "name": "Traube",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Adria": {
        "tags": {
            "name": "Adria",
            "amenity": "restaurant"
        },
        "name": "Adria",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Red Robin": {
        "tags": {
            "name": "Red Robin",
            "amenity": "restaurant"
        },
        "name": "Red Robin",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Roma": {
        "tags": {
            "name": "Roma",
            "amenity": "restaurant"
        },
        "name": "Roma",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/San Marco": {
        "tags": {
            "name": "San Marco",
            "amenity": "restaurant"
        },
        "name": "San Marco",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hellas": {
        "tags": {
            "name": "Hellas",
            "amenity": "restaurant"
        },
        "name": "Hellas",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Perla": {
        "tags": {
            "name": "La Perla",
            "amenity": "restaurant"
        },
        "name": "La Perla",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Vips": {
        "tags": {
            "name": "Vips",
            "amenity": "restaurant"
        },
        "name": "Vips",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Panera Bread": {
        "tags": {
            "name": "Panera Bread",
            "amenity": "restaurant"
        },
        "name": "Panera Bread",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Da Vinci": {
        "tags": {
            "name": "Da Vinci",
            "amenity": "restaurant"
        },
        "name": "Da Vinci",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hippopotamus": {
        "tags": {
            "name": "Hippopotamus",
            "amenity": "restaurant"
        },
        "name": "Hippopotamus",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Prezzo": {
        "tags": {
            "name": "Prezzo",
            "amenity": "restaurant"
        },
        "name": "Prezzo",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Courtepaille": {
        "tags": {
            "name": "Courtepaille",
            "amenity": "restaurant"
        },
        "name": "Courtepaille",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Hard Rock Cafe": {
        "tags": {
            "name": "Hard Rock Cafe",
            "amenity": "restaurant"
        },
        "name": "Hard Rock Cafe",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Panorama": {
        "tags": {
            "name": "Panorama",
            "amenity": "restaurant"
        },
        "name": "Panorama",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "restaurant"
        },
        "name": "????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sportheim": {
        "tags": {
            "name": "Sportheim",
            "amenity": "restaurant"
        },
        "name": "Sportheim",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/???????????????": {
        "tags": {
            "name": "???????????????",
            "amenity": "restaurant"
        },
        "name": "???????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/B??ren": {
        "tags": {
            "name": "B??ren",
            "amenity": "restaurant"
        },
        "name": "B??ren",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Alte Post": {
        "tags": {
            "name": "Alte Post",
            "amenity": "restaurant"
        },
        "name": "Alte Post",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Pizzeria Roma": {
        "tags": {
            "name": "Pizzeria Roma",
            "amenity": "restaurant"
        },
        "name": "Pizzeria Roma",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/China Garden": {
        "tags": {
            "name": "China Garden",
            "amenity": "restaurant"
        },
        "name": "China Garden",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Vapiano": {
        "tags": {
            "name": "Vapiano",
            "amenity": "restaurant"
        },
        "name": "Vapiano",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Mamma Mia": {
        "tags": {
            "name": "Mamma Mia",
            "amenity": "restaurant"
        },
        "name": "Mamma Mia",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Schwarzer Adler": {
        "tags": {
            "name": "Schwarzer Adler",
            "amenity": "restaurant"
        },
        "name": "Schwarzer Adler",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/IHOP": {
        "tags": {
            "name": "IHOP",
            "amenity": "restaurant"
        },
        "name": "IHOP",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Chili's": {
        "tags": {
            "name": "Chili's",
            "amenity": "restaurant"
        },
        "name": "Chili's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Asia": {
        "tags": {
            "name": "Asia",
            "amenity": "restaurant"
        },
        "name": "Asia",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Olive Garden": {
        "tags": {
            "name": "Olive Garden",
            "amenity": "restaurant"
        },
        "name": "Olive Garden",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/TGI Friday's": {
        "tags": {
            "name": "TGI Friday's",
            "amenity": "restaurant"
        },
        "name": "TGI Friday's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Friendly's": {
        "tags": {
            "name": "Friendly's",
            "amenity": "restaurant"
        },
        "name": "Friendly's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Buffalo Grill": {
        "tags": {
            "name": "Buffalo Grill",
            "amenity": "restaurant"
        },
        "name": "Buffalo Grill",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Texas Roadhouse": {
        "tags": {
            "name": "Texas Roadhouse",
            "amenity": "restaurant"
        },
        "name": "Texas Roadhouse",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/?????????": {
        "tags": {
            "name": "?????????",
            "name:en": "Gusto",
            "amenity": "restaurant"
        },
        "name": "?????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Sakura": {
        "tags": {
            "name": "Sakura",
            "amenity": "restaurant"
        },
        "name": "Sakura",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Mensa": {
        "tags": {
            "name": "Mensa",
            "amenity": "restaurant"
        },
        "name": "Mensa",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/The Keg": {
        "tags": {
            "name": "The Keg",
            "amenity": "restaurant"
        },
        "name": "The Keg",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/???????????????": {
        "tags": {
            "name": "???????????????",
            "amenity": "restaurant"
        },
        "name": "???????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/La Strada": {
        "tags": {
            "name": "La Strada",
            "amenity": "restaurant"
        },
        "name": "La Strada",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Village Inn": {
        "tags": {
            "name": "Village Inn",
            "amenity": "restaurant"
        },
        "name": "Village Inn",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Buffalo Wild Wings": {
        "tags": {
            "name": "Buffalo Wild Wings",
            "amenity": "restaurant"
        },
        "name": "Buffalo Wild Wings",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Peking": {
        "tags": {
            "name": "Peking",
            "amenity": "restaurant"
        },
        "name": "Peking",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Round Table Pizza": {
        "tags": {
            "name": "Round Table Pizza",
            "amenity": "restaurant"
        },
        "name": "Round Table Pizza",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/California Pizza Kitchen": {
        "tags": {
            "name": "California Pizza Kitchen",
            "amenity": "restaurant"
        },
        "name": "California Pizza Kitchen",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "restaurant"
        },
        "name": "????????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Golden Corral": {
        "tags": {
            "name": "Golden Corral",
            "amenity": "restaurant"
        },
        "name": "Golden Corral",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Perkins": {
        "tags": {
            "name": "Perkins",
            "amenity": "restaurant"
        },
        "name": "Perkins",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Ruby Tuesday": {
        "tags": {
            "name": "Ruby Tuesday",
            "amenity": "restaurant"
        },
        "name": "Ruby Tuesday",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Shari's": {
        "tags": {
            "name": "Shari's",
            "amenity": "restaurant"
        },
        "name": "Shari's",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Bob Evans": {
        "tags": {
            "name": "Bob Evans",
            "amenity": "restaurant"
        },
        "name": "Bob Evans",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/???????????? (Bada Fish Restaurant)": {
        "tags": {
            "name": "???????????? (Bada Fish Restaurant)",
            "amenity": "restaurant"
        },
        "name": "???????????? (Bada Fish Restaurant)",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Mang Inasal": {
        "tags": {
            "name": "Mang Inasal",
            "amenity": "restaurant"
        },
        "name": "Mang Inasal",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/??????????????": {
        "tags": {
            "name": "??????????????",
            "amenity": "restaurant"
        },
        "name": "??????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/???????????????": {
        "tags": {
            "name": "???????????????",
            "amenity": "restaurant"
        },
        "name": "???????????????",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/restaurant/Longhorn Steakhouse": {
        "tags": {
            "name": "Longhorn Steakhouse",
            "amenity": "restaurant"
        },
        "name": "Longhorn Steakhouse",
        "icon": "restaurant",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "building_area",
            "address",
            "opening_hours",
            "capacity",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/bank/Chase": {
        "tags": {
            "name": "Chase",
            "amenity": "bank"
        },
        "name": "Chase",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Commonwealth Bank": {
        "tags": {
            "name": "Commonwealth Bank",
            "amenity": "bank"
        },
        "name": "Commonwealth Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Citibank": {
        "tags": {
            "name": "Citibank",
            "amenity": "bank"
        },
        "name": "Citibank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/HSBC": {
        "tags": {
            "name": "HSBC",
            "amenity": "bank"
        },
        "name": "HSBC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Barclays": {
        "tags": {
            "name": "Barclays",
            "amenity": "bank"
        },
        "name": "Barclays",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Westpac": {
        "tags": {
            "name": "Westpac",
            "amenity": "bank"
        },
        "name": "Westpac",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/NAB": {
        "tags": {
            "name": "NAB",
            "amenity": "bank"
        },
        "name": "NAB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ANZ": {
        "tags": {
            "name": "ANZ",
            "amenity": "bank"
        },
        "name": "ANZ",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Lloyds Bank": {
        "tags": {
            "name": "Lloyds Bank",
            "amenity": "bank"
        },
        "name": "Lloyds Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Landbank": {
        "tags": {
            "name": "Landbank",
            "amenity": "bank"
        },
        "name": "Landbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Sparkasse": {
        "tags": {
            "name": "Sparkasse",
            "amenity": "bank"
        },
        "name": "Sparkasse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/UCPB": {
        "tags": {
            "name": "UCPB",
            "amenity": "bank"
        },
        "name": "UCPB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/PNB": {
        "tags": {
            "name": "PNB",
            "amenity": "bank"
        },
        "name": "PNB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Metrobank": {
        "tags": {
            "name": "Metrobank",
            "amenity": "bank"
        },
        "name": "Metrobank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BDO": {
        "tags": {
            "name": "BDO",
            "amenity": "bank"
        },
        "name": "BDO",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Volksbank": {
        "tags": {
            "name": "Volksbank",
            "amenity": "bank"
        },
        "name": "Volksbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BPI": {
        "tags": {
            "name": "BPI",
            "amenity": "bank"
        },
        "name": "BPI",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Postbank": {
        "tags": {
            "name": "Postbank",
            "amenity": "bank"
        },
        "name": "Postbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/NatWest": {
        "tags": {
            "name": "NatWest",
            "amenity": "bank"
        },
        "name": "NatWest",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Raiffeisenbank": {
        "tags": {
            "name": "Raiffeisenbank",
            "amenity": "bank"
        },
        "name": "Raiffeisenbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Yorkshire Bank": {
        "tags": {
            "name": "Yorkshire Bank",
            "amenity": "bank"
        },
        "name": "Yorkshire Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ABSA": {
        "tags": {
            "name": "ABSA",
            "amenity": "bank"
        },
        "name": "ABSA",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Standard Bank": {
        "tags": {
            "name": "Standard Bank",
            "amenity": "bank"
        },
        "name": "Standard Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/FNB": {
        "tags": {
            "name": "FNB",
            "amenity": "bank"
        },
        "name": "FNB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Deutsche Bank": {
        "tags": {
            "name": "Deutsche Bank",
            "amenity": "bank"
        },
        "name": "Deutsche Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/SEB": {
        "tags": {
            "name": "SEB",
            "amenity": "bank"
        },
        "name": "SEB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Commerzbank": {
        "tags": {
            "name": "Commerzbank",
            "amenity": "bank"
        },
        "name": "Commerzbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Targobank": {
        "tags": {
            "name": "Targobank",
            "amenity": "bank"
        },
        "name": "Targobank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ABN AMRO": {
        "tags": {
            "name": "ABN AMRO",
            "amenity": "bank"
        },
        "name": "ABN AMRO",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Handelsbanken": {
        "tags": {
            "name": "Handelsbanken",
            "amenity": "bank"
        },
        "name": "Handelsbanken",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Swedbank": {
        "tags": {
            "name": "Swedbank",
            "amenity": "bank"
        },
        "name": "Swedbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Kreissparkasse": {
        "tags": {
            "name": "Kreissparkasse",
            "amenity": "bank"
        },
        "name": "Kreissparkasse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/UniCredit Bank": {
        "tags": {
            "name": "UniCredit Bank",
            "amenity": "bank"
        },
        "name": "UniCredit Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Monte dei Paschi di Siena": {
        "tags": {
            "name": "Monte dei Paschi di Siena",
            "amenity": "bank"
        },
        "name": "Monte dei Paschi di Siena",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caja Rural": {
        "tags": {
            "name": "Caja Rural",
            "amenity": "bank"
        },
        "name": "Caja Rural",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Dresdner Bank": {
        "tags": {
            "name": "Dresdner Bank",
            "amenity": "bank"
        },
        "name": "Dresdner Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Sparda-Bank": {
        "tags": {
            "name": "Sparda-Bank",
            "amenity": "bank"
        },
        "name": "Sparda-Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/V??B": {
        "tags": {
            "name": "V??B",
            "amenity": "bank"
        },
        "name": "V??B",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Slovensk?? sporite????a": {
        "tags": {
            "name": "Slovensk?? sporite????a",
            "amenity": "bank"
        },
        "name": "Slovensk?? sporite????a",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank of Montreal": {
        "tags": {
            "name": "Bank of Montreal",
            "amenity": "bank"
        },
        "name": "Bank of Montreal",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/KBC": {
        "tags": {
            "name": "KBC",
            "amenity": "bank"
        },
        "name": "KBC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Royal Bank of Scotland": {
        "tags": {
            "name": "Royal Bank of Scotland",
            "amenity": "bank"
        },
        "name": "Royal Bank of Scotland",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/TSB": {
        "tags": {
            "name": "TSB",
            "amenity": "bank"
        },
        "name": "TSB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/US Bank": {
        "tags": {
            "name": "US Bank",
            "amenity": "bank"
        },
        "name": "US Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/HypoVereinsbank": {
        "tags": {
            "name": "HypoVereinsbank",
            "amenity": "bank"
        },
        "name": "HypoVereinsbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank Austria": {
        "tags": {
            "name": "Bank Austria",
            "amenity": "bank"
        },
        "name": "Bank Austria",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ING": {
        "tags": {
            "name": "ING",
            "amenity": "bank"
        },
        "name": "ING",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Erste Bank": {
        "tags": {
            "name": "Erste Bank",
            "amenity": "bank"
        },
        "name": "Erste Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/CIBC": {
        "tags": {
            "name": "CIBC",
            "amenity": "bank"
        },
        "name": "CIBC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Scotiabank": {
        "tags": {
            "name": "Scotiabank",
            "amenity": "bank"
        },
        "name": "Scotiabank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caisse d'??pargne": {
        "tags": {
            "name": "Caisse d'??pargne",
            "amenity": "bank"
        },
        "name": "Caisse d'??pargne",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Santander": {
        "tags": {
            "name": "Santander",
            "amenity": "bank"
        },
        "name": "Santander",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank of Scotland": {
        "tags": {
            "name": "Bank of Scotland",
            "amenity": "bank"
        },
        "name": "Bank of Scotland",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/TD Canada Trust": {
        "tags": {
            "name": "TD Canada Trust",
            "amenity": "bank"
        },
        "name": "TD Canada Trust",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BMO": {
        "tags": {
            "name": "BMO",
            "amenity": "bank"
        },
        "name": "BMO",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Danske Bank": {
        "tags": {
            "name": "Danske Bank",
            "amenity": "bank"
        },
        "name": "Danske Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/OTP": {
        "tags": {
            "name": "OTP",
            "amenity": "bank"
        },
        "name": "OTP",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cr??dit Agricole": {
        "tags": {
            "name": "Cr??dit Agricole",
            "amenity": "bank"
        },
        "name": "Cr??dit Agricole",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/LCL": {
        "tags": {
            "name": "LCL",
            "amenity": "bank"
        },
        "name": "LCL",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/VR-Bank": {
        "tags": {
            "name": "VR-Bank",
            "amenity": "bank"
        },
        "name": "VR-Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??SOB": {
        "tags": {
            "name": "??SOB",
            "amenity": "bank"
        },
        "name": "??SOB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??esk?? spo??itelna": {
        "tags": {
            "name": "??esk?? spo??itelna",
            "amenity": "bank"
        },
        "name": "??esk?? spo??itelna",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BNP": {
        "tags": {
            "name": "BNP",
            "amenity": "bank"
        },
        "name": "BNP",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Royal Bank": {
        "tags": {
            "name": "Royal Bank",
            "amenity": "bank"
        },
        "name": "Royal Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Nationwide": {
        "tags": {
            "name": "Nationwide",
            "amenity": "bank"
        },
        "name": "Nationwide",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Halifax": {
        "tags": {
            "name": "Halifax",
            "amenity": "bank"
        },
        "name": "Halifax",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BAWAG PSK": {
        "tags": {
            "name": "BAWAG PSK",
            "amenity": "bank"
        },
        "name": "BAWAG PSK",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/National Bank": {
        "tags": {
            "name": "National Bank",
            "amenity": "bank"
        },
        "name": "National Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Nedbank": {
        "tags": {
            "name": "Nedbank",
            "amenity": "bank"
        },
        "name": "Nedbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/First National Bank": {
        "tags": {
            "name": "First National Bank",
            "amenity": "bank"
        },
        "name": "First National Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Nordea": {
        "tags": {
            "name": "Nordea",
            "amenity": "bank"
        },
        "name": "Nordea",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Rabobank": {
        "tags": {
            "name": "Rabobank",
            "amenity": "bank"
        },
        "name": "Rabobank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Sparkasse K??lnBonn": {
        "tags": {
            "name": "Sparkasse K??lnBonn",
            "amenity": "bank"
        },
        "name": "Sparkasse K??lnBonn",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Tatra banka": {
        "tags": {
            "name": "Tatra banka",
            "amenity": "bank"
        },
        "name": "Tatra banka",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Berliner Sparkasse": {
        "tags": {
            "name": "Berliner Sparkasse",
            "amenity": "bank"
        },
        "name": "Berliner Sparkasse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Berliner Volksbank": {
        "tags": {
            "name": "Berliner Volksbank",
            "amenity": "bank"
        },
        "name": "Berliner Volksbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Wells Fargo": {
        "tags": {
            "name": "Wells Fargo",
            "amenity": "bank"
        },
        "name": "Wells Fargo",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Credit Suisse": {
        "tags": {
            "name": "Credit Suisse",
            "amenity": "bank"
        },
        "name": "Credit Suisse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Soci??t?? G??n??rale": {
        "tags": {
            "name": "Soci??t?? G??n??rale",
            "amenity": "bank"
        },
        "name": "Soci??t?? G??n??rale",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Osuuspankki": {
        "tags": {
            "name": "Osuuspankki",
            "amenity": "bank"
        },
        "name": "Osuuspankki",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Sparkasse Aachen": {
        "tags": {
            "name": "Sparkasse Aachen",
            "amenity": "bank"
        },
        "name": "Sparkasse Aachen",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Hamburger Sparkasse": {
        "tags": {
            "name": "Hamburger Sparkasse",
            "amenity": "bank"
        },
        "name": "Hamburger Sparkasse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cassa di Risparmio del Veneto": {
        "tags": {
            "name": "Cassa di Risparmio del Veneto",
            "amenity": "bank"
        },
        "name": "Cassa di Risparmio del Veneto",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BNP Paribas": {
        "tags": {
            "name": "BNP Paribas",
            "amenity": "bank"
        },
        "name": "BNP Paribas",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banque Populaire": {
        "tags": {
            "name": "Banque Populaire",
            "amenity": "bank"
        },
        "name": "Banque Populaire",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BNP Paribas Fortis": {
        "tags": {
            "name": "BNP Paribas Fortis",
            "amenity": "bank"
        },
        "name": "BNP Paribas Fortis",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Popular": {
        "tags": {
            "name": "Banco Popular",
            "amenity": "bank"
        },
        "name": "Banco Popular",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bancaja": {
        "tags": {
            "name": "Bancaja",
            "amenity": "bank"
        },
        "name": "Bancaja",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banesto": {
        "tags": {
            "name": "Banesto",
            "amenity": "bank"
        },
        "name": "Banesto",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/La Caixa": {
        "tags": {
            "name": "La Caixa",
            "amenity": "bank"
        },
        "name": "La Caixa",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Santander Consumer Bank": {
        "tags": {
            "name": "Santander Consumer Bank",
            "amenity": "bank"
        },
        "name": "Santander Consumer Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BRD": {
        "tags": {
            "name": "BRD",
            "amenity": "bank"
        },
        "name": "BRD",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BCR": {
        "tags": {
            "name": "BCR",
            "amenity": "bank"
        },
        "name": "BCR",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banca Transilvania": {
        "tags": {
            "name": "Banca Transilvania",
            "amenity": "bank"
        },
        "name": "Banca Transilvania",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BW-Bank": {
        "tags": {
            "name": "BW-Bank",
            "amenity": "bank"
        },
        "name": "BW-Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Komer??n?? banka": {
        "tags": {
            "name": "Komer??n?? banka",
            "amenity": "bank"
        },
        "name": "Komer??n?? banka",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Pastor": {
        "tags": {
            "name": "Banco Pastor",
            "amenity": "bank"
        },
        "name": "Banco Pastor",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Stadtsparkasse": {
        "tags": {
            "name": "Stadtsparkasse",
            "amenity": "bank"
        },
        "name": "Stadtsparkasse",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Ulster Bank": {
        "tags": {
            "name": "Ulster Bank",
            "amenity": "bank"
        },
        "name": "Ulster Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Sberbank": {
        "tags": {
            "name": "Sberbank",
            "amenity": "bank"
        },
        "name": "Sberbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/CIC": {
        "tags": {
            "name": "CIC",
            "amenity": "bank"
        },
        "name": "CIC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bancpost": {
        "tags": {
            "name": "Bancpost",
            "amenity": "bank"
        },
        "name": "Bancpost",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caja Madrid": {
        "tags": {
            "name": "Caja Madrid",
            "amenity": "bank"
        },
        "name": "Caja Madrid",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Maybank": {
        "tags": {
            "name": "Maybank",
            "amenity": "bank"
        },
        "name": "Maybank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Unicredit Banca": {
        "tags": {
            "name": "Unicredit Banca",
            "amenity": "bank"
        },
        "name": "Unicredit Banca",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cr??dit Mutuel": {
        "tags": {
            "name": "Cr??dit Mutuel",
            "amenity": "bank"
        },
        "name": "Cr??dit Mutuel",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BBVA": {
        "tags": {
            "name": "BBVA",
            "amenity": "bank"
        },
        "name": "BBVA",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Intesa San Paolo": {
        "tags": {
            "name": "Intesa San Paolo",
            "amenity": "bank"
        },
        "name": "Intesa San Paolo",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/TD Bank": {
        "tags": {
            "name": "TD Bank",
            "amenity": "bank"
        },
        "name": "TD Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Belfius": {
        "tags": {
            "name": "Belfius",
            "amenity": "bank"
        },
        "name": "Belfius",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank of America": {
        "tags": {
            "name": "Bank of America",
            "amenity": "bank"
        },
        "name": "Bank of America",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/RBC": {
        "tags": {
            "name": "RBC",
            "amenity": "bank"
        },
        "name": "RBC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Alpha Bank": {
        "tags": {
            "name": "Alpha Bank",
            "amenity": "bank"
        },
        "name": "Alpha Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "bank"
        },
        "name": "????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????????????????": {
        "tags": {
            "name": "????????????????????????????",
            "amenity": "bank"
        },
        "name": "????????????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cr??dit du Nord": {
        "tags": {
            "name": "Cr??dit du Nord",
            "amenity": "bank"
        },
        "name": "Cr??dit du Nord",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BancoEstado": {
        "tags": {
            "name": "BancoEstado",
            "amenity": "bank"
        },
        "name": "BancoEstado",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Millennium Bank": {
        "tags": {
            "name": "Millennium Bank",
            "amenity": "bank"
        },
        "name": "Millennium Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/State Bank of India": {
        "tags": {
            "name": "State Bank of India",
            "amenity": "bank"
        },
        "name": "State Bank of India",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ING Bank ??l??ski": {
        "tags": {
            "name": "ING Bank ??l??ski",
            "amenity": "bank"
        },
        "name": "ING Bank ??l??ski",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caixa Geral de Dep??sitos": {
        "tags": {
            "name": "Caixa Geral de Dep??sitos",
            "amenity": "bank"
        },
        "name": "Caixa Geral de Dep??sitos",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Kreissparkasse K??ln": {
        "tags": {
            "name": "Kreissparkasse K??ln",
            "amenity": "bank"
        },
        "name": "Kreissparkasse K??ln",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco BCI": {
        "tags": {
            "name": "Banco BCI",
            "amenity": "bank"
        },
        "name": "Banco BCI",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco de Chile": {
        "tags": {
            "name": "Banco de Chile",
            "amenity": "bank"
        },
        "name": "Banco de Chile",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????24": {
        "tags": {
            "name": "??????24",
            "amenity": "bank"
        },
        "name": "??????24",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/UBS": {
        "tags": {
            "name": "UBS",
            "amenity": "bank"
        },
        "name": "UBS",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/PKO BP": {
        "tags": {
            "name": "PKO BP",
            "amenity": "bank"
        },
        "name": "PKO BP",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Chinabank": {
        "tags": {
            "name": "Chinabank",
            "amenity": "bank"
        },
        "name": "Chinabank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/PSBank": {
        "tags": {
            "name": "PSBank",
            "amenity": "bank"
        },
        "name": "PSBank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Union Bank": {
        "tags": {
            "name": "Union Bank",
            "amenity": "bank"
        },
        "name": "Union Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/China Bank": {
        "tags": {
            "name": "China Bank",
            "amenity": "bank"
        },
        "name": "China Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/RCBC": {
        "tags": {
            "name": "RCBC",
            "amenity": "bank"
        },
        "name": "RCBC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Unicaja": {
        "tags": {
            "name": "Unicaja",
            "amenity": "bank"
        },
        "name": "Unicaja",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BBK": {
        "tags": {
            "name": "BBK",
            "amenity": "bank"
        },
        "name": "BBK",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Ibercaja": {
        "tags": {
            "name": "Ibercaja",
            "amenity": "bank"
        },
        "name": "Ibercaja",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/RBS": {
        "tags": {
            "name": "RBS",
            "amenity": "bank"
        },
        "name": "RBS",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Commercial Bank of Ceylon PLC": {
        "tags": {
            "name": "Commercial Bank of Ceylon PLC",
            "amenity": "bank"
        },
        "name": "Commercial Bank of Ceylon PLC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank of Ireland": {
        "tags": {
            "name": "Bank of Ireland",
            "amenity": "bank"
        },
        "name": "Bank of Ireland",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BNL": {
        "tags": {
            "name": "BNL",
            "amenity": "bank"
        },
        "name": "BNL",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Santander": {
        "tags": {
            "name": "Banco Santander",
            "amenity": "bank"
        },
        "name": "Banco Santander",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Ita??": {
        "tags": {
            "name": "Banco Ita??",
            "amenity": "bank"
        },
        "name": "Banco Ita??",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/AIB": {
        "tags": {
            "name": "AIB",
            "amenity": "bank"
        },
        "name": "AIB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BZ WBK": {
        "tags": {
            "name": "BZ WBK",
            "amenity": "bank"
        },
        "name": "BZ WBK",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco do Brasil": {
        "tags": {
            "name": "Banco do Brasil",
            "amenity": "bank"
        },
        "name": "Banco do Brasil",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caixa Econ??mica Federal": {
        "tags": {
            "name": "Caixa Econ??mica Federal",
            "amenity": "bank"
        },
        "name": "Caixa Econ??mica Federal",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Fifth Third Bank": {
        "tags": {
            "name": "Fifth Third Bank",
            "amenity": "bank"
        },
        "name": "Fifth Third Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banca Popolare di Vicenza": {
        "tags": {
            "name": "Banca Popolare di Vicenza",
            "amenity": "bank"
        },
        "name": "Banca Popolare di Vicenza",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Wachovia": {
        "tags": {
            "name": "Wachovia",
            "amenity": "bank"
        },
        "name": "Wachovia",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/OLB": {
        "tags": {
            "name": "OLB",
            "amenity": "bank"
        },
        "name": "OLB",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/???????????????": {
        "tags": {
            "name": "???????????????",
            "amenity": "bank"
        },
        "name": "???????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BES": {
        "tags": {
            "name": "BES",
            "amenity": "bank"
        },
        "name": "BES",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/ICICI Bank": {
        "tags": {
            "name": "ICICI Bank",
            "amenity": "bank"
        },
        "name": "ICICI Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/HDFC Bank": {
        "tags": {
            "name": "HDFC Bank",
            "amenity": "bank"
        },
        "name": "HDFC Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/La Banque Postale": {
        "tags": {
            "name": "La Banque Postale",
            "amenity": "bank"
        },
        "name": "La Banque Postale",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Pekao SA": {
        "tags": {
            "name": "Pekao SA",
            "amenity": "bank"
        },
        "name": "Pekao SA",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Oberbank": {
        "tags": {
            "name": "Oberbank",
            "amenity": "bank"
        },
        "name": "Oberbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bradesco": {
        "tags": {
            "name": "Bradesco",
            "amenity": "bank"
        },
        "name": "Bradesco",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Oldenburgische Landesbank": {
        "tags": {
            "name": "Oldenburgische Landesbank",
            "amenity": "bank"
        },
        "name": "Oldenburgische Landesbank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bendigo Bank": {
        "tags": {
            "name": "Bendigo Bank",
            "amenity": "bank"
        },
        "name": "Bendigo Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Argenta": {
        "tags": {
            "name": "Argenta",
            "amenity": "bank"
        },
        "name": "Argenta",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/AXA": {
        "tags": {
            "name": "AXA",
            "amenity": "bank"
        },
        "name": "AXA",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Axis Bank": {
        "tags": {
            "name": "Axis Bank",
            "amenity": "bank"
        },
        "name": "Axis Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Naci??n": {
        "tags": {
            "name": "Banco Naci??n",
            "amenity": "bank"
        },
        "name": "Banco Naci??n",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/GE Money Bank": {
        "tags": {
            "name": "GE Money Bank",
            "amenity": "bank"
        },
        "name": "GE Money Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????-????????": {
        "tags": {
            "name": "??????????-????????",
            "amenity": "bank"
        },
        "name": "??????????-????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????????????????": {
        "tags": {
            "name": "??????????????????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caja C??rculo": {
        "tags": {
            "name": "Caja C??rculo",
            "amenity": "bank"
        },
        "name": "Caja C??rculo",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Galicia": {
        "tags": {
            "name": "Banco Galicia",
            "amenity": "bank"
        },
        "name": "Banco Galicia",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Eurobank": {
        "tags": {
            "name": "Eurobank",
            "amenity": "bank"
        },
        "name": "Eurobank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banca Intesa": {
        "tags": {
            "name": "Banca Intesa",
            "amenity": "bank"
        },
        "name": "Banca Intesa",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Canara Bank": {
        "tags": {
            "name": "Canara Bank",
            "amenity": "bank"
        },
        "name": "Canara Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cajamar": {
        "tags": {
            "name": "Cajamar",
            "amenity": "bank"
        },
        "name": "Cajamar",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banamex": {
        "tags": {
            "name": "Banamex",
            "amenity": "bank"
        },
        "name": "Banamex",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cr??dit Mutuel de Bretagne": {
        "tags": {
            "name": "Cr??dit Mutuel de Bretagne",
            "amenity": "bank"
        },
        "name": "Cr??dit Mutuel de Bretagne",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Davivienda": {
        "tags": {
            "name": "Davivienda",
            "amenity": "bank"
        },
        "name": "Davivienda",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank Sp????dzielczy": {
        "tags": {
            "name": "Bank Sp????dzielczy",
            "amenity": "bank"
        },
        "name": "Bank Sp????dzielczy",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Credit Agricole": {
        "tags": {
            "name": "Credit Agricole",
            "amenity": "bank"
        },
        "name": "Credit Agricole",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bankinter": {
        "tags": {
            "name": "Bankinter",
            "amenity": "bank"
        },
        "name": "Bankinter",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banque Nationale": {
        "tags": {
            "name": "Banque Nationale",
            "amenity": "bank"
        },
        "name": "Banque Nationale",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank of the West": {
        "tags": {
            "name": "Bank of the West",
            "amenity": "bank"
        },
        "name": "Bank of the West",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Key Bank": {
        "tags": {
            "name": "Key Bank",
            "amenity": "bank"
        },
        "name": "Key Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Western Union": {
        "tags": {
            "name": "Western Union",
            "amenity": "bank"
        },
        "name": "Western Union",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Citizens Bank": {
        "tags": {
            "name": "Citizens Bank",
            "amenity": "bank"
        },
        "name": "Citizens Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "amenity": "bank"
        },
        "name": "????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Security Bank": {
        "tags": {
            "name": "Security Bank",
            "amenity": "bank"
        },
        "name": "Security Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Millenium Bank": {
        "tags": {
            "name": "Millenium Bank",
            "amenity": "bank"
        },
        "name": "Millenium Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bankia": {
        "tags": {
            "name": "Bankia",
            "amenity": "bank"
        },
        "name": "Bankia",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????UFJ??????": {
        "tags": {
            "name": "????????????UFJ??????",
            "amenity": "bank"
        },
        "name": "????????????UFJ??????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caixa": {
        "tags": {
            "name": "Caixa",
            "amenity": "bank"
        },
        "name": "Caixa",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco de Costa Rica": {
        "tags": {
            "name": "Banco de Costa Rica",
            "amenity": "bank"
        },
        "name": "Banco de Costa Rica",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/SunTrust Bank": {
        "tags": {
            "name": "SunTrust Bank",
            "amenity": "bank"
        },
        "name": "SunTrust Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Ita??": {
        "tags": {
            "name": "Ita??",
            "amenity": "bank"
        },
        "name": "Ita??",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/PBZ": {
        "tags": {
            "name": "PBZ",
            "amenity": "bank"
        },
        "name": "PBZ",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bancolombia": {
        "tags": {
            "name": "Bancolombia",
            "amenity": "bank"
        },
        "name": "Bancolombia",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/???????????????????? ???????? ??????????": {
        "tags": {
            "name": "???????????????????? ???????? ??????????",
            "amenity": "bank"
        },
        "name": "???????????????????? ???????? ??????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bancomer": {
        "tags": {
            "name": "Bancomer",
            "amenity": "bank"
        },
        "name": "Bancomer",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banorte": {
        "tags": {
            "name": "Banorte",
            "amenity": "bank"
        },
        "name": "Banorte",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Alior Bank": {
        "tags": {
            "name": "Alior Bank",
            "amenity": "bank"
        },
        "name": "Alior Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BOC": {
        "tags": {
            "name": "BOC",
            "amenity": "bank"
        },
        "name": "BOC",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/???????? ????????????": {
        "tags": {
            "name": "???????? ????????????",
            "amenity": "bank"
        },
        "name": "???????? ????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????": {
        "tags": {
            "name": "??????",
            "amenity": "bank"
        },
        "name": "??????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Getin Bank": {
        "tags": {
            "name": "Getin Bank",
            "amenity": "bank"
        },
        "name": "Getin Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caja Duero": {
        "tags": {
            "name": "Caja Duero",
            "amenity": "bank"
        },
        "name": "Caja Duero",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Regions Bank": {
        "tags": {
            "name": "Regions Bank",
            "amenity": "bank"
        },
        "name": "Regions Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????": {
        "tags": {
            "name": "??????????????",
            "amenity": "bank"
        },
        "name": "??????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Estado": {
        "tags": {
            "name": "Banco Estado",
            "amenity": "bank"
        },
        "name": "Banco Estado",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BCI": {
        "tags": {
            "name": "BCI",
            "amenity": "bank"
        },
        "name": "BCI",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/SunTrust": {
        "tags": {
            "name": "SunTrust",
            "amenity": "bank"
        },
        "name": "SunTrust",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/PNC Bank": {
        "tags": {
            "name": "PNC Bank",
            "amenity": "bank"
        },
        "name": "PNC Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "Sinhan Bank",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "Uri Bank",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "Gungmin Bank",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "name:en": "Industrial Bank of Korea",
            "amenity": "bank"
        },
        "name": "??????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "Gwangju Bank",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/M&T Bank": {
        "tags": {
            "name": "M&T Bank",
            "amenity": "bank"
        },
        "name": "M&T Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Caja de Burgos": {
        "tags": {
            "name": "Caja de Burgos",
            "amenity": "bank"
        },
        "name": "Caja de Burgos",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Santander Totta": {
        "tags": {
            "name": "Santander Totta",
            "amenity": "bank"
        },
        "name": "Santander Totta",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "amenity": "bank"
        },
        "name": "????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "bank"
        },
        "name": "????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????": {
        "tags": {
            "name": "??????????????",
            "amenity": "bank"
        },
        "name": "??????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/???????????????": {
        "tags": {
            "name": "???????????????",
            "name:en": "Mizuho Bank",
            "amenity": "bank"
        },
        "name": "???????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Ecobank": {
        "tags": {
            "name": "Ecobank",
            "amenity": "bank"
        },
        "name": "Ecobank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Cajero Automatico Bancared": {
        "tags": {
            "name": "Cajero Automatico Bancared",
            "amenity": "bank"
        },
        "name": "Cajero Automatico Bancared",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????????????": {
        "tags": {
            "name": "??????????????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Provincia": {
        "tags": {
            "name": "Banco Provincia",
            "amenity": "bank"
        },
        "name": "Banco Provincia",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/BB&T": {
        "tags": {
            "name": "BB&T",
            "amenity": "bank"
        },
        "name": "BB&T",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "amenity": "bank"
        },
        "name": "??????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Capital One": {
        "tags": {
            "name": "Capital One",
            "amenity": "bank"
        },
        "name": "Capital One",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank Mandiri": {
        "tags": {
            "name": "Bank Mandiri",
            "amenity": "bank"
        },
        "name": "Bank Mandiri",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco de la Naci??n": {
        "tags": {
            "name": "Banco de la Naci??n",
            "amenity": "bank"
        },
        "name": "Banco de la Naci??n",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco G&T Continental": {
        "tags": {
            "name": "Banco G&T Continental",
            "amenity": "bank"
        },
        "name": "Banco G&T Continental",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Peoples Bank": {
        "tags": {
            "name": "Peoples Bank",
            "amenity": "bank"
        },
        "name": "Peoples Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "amenity": "bank"
        },
        "name": "????????????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Provincial": {
        "tags": {
            "name": "Provincial",
            "amenity": "bank"
        },
        "name": "Provincial",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco de Desarrollo Banrural": {
        "tags": {
            "name": "Banco de Desarrollo Banrural",
            "amenity": "bank"
        },
        "name": "Banco de Desarrollo Banrural",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banco Bradesco": {
        "tags": {
            "name": "Banco Bradesco",
            "amenity": "bank"
        },
        "name": "Banco Bradesco",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bicentenario": {
        "tags": {
            "name": "Bicentenario",
            "amenity": "bank"
        },
        "name": "Bicentenario",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????????????? ???????????????": {
        "tags": {
            "name": "????????????????????? ???????????????",
            "name:en": "Liberty Bank",
            "amenity": "bank"
        },
        "name": "????????????????????? ???????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Banesco": {
        "tags": {
            "name": "Banesco",
            "amenity": "bank"
        },
        "name": "Banesco",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Mercantil": {
        "tags": {
            "name": "Mercantil",
            "amenity": "bank"
        },
        "name": "Mercantil",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Bank BRI": {
        "tags": {
            "name": "Bank BRI",
            "amenity": "bank"
        },
        "name": "Bank BRI",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/Del Tesoro": {
        "tags": {
            "name": "Del Tesoro",
            "amenity": "bank"
        },
        "name": "Del Tesoro",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "bank"
        },
        "name": "????????????",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/CityCommerce Bank": {
        "tags": {
            "name": "CityCommerce Bank",
            "amenity": "bank"
        },
        "name": "CityCommerce Bank",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/bank/De Venezuela": {
        "tags": {
            "name": "De Venezuela",
            "amenity": "bank"
        },
        "name": "De Venezuela",
        "icon": "bank",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "atm",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Europcar": {
        "tags": {
            "name": "Europcar",
            "amenity": "car_rental"
        },
        "name": "Europcar",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Budget": {
        "tags": {
            "name": "Budget",
            "amenity": "car_rental"
        },
        "name": "Budget",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Sixt": {
        "tags": {
            "name": "Sixt",
            "amenity": "car_rental"
        },
        "name": "Sixt",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Avis": {
        "tags": {
            "name": "Avis",
            "amenity": "car_rental"
        },
        "name": "Avis",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Hertz": {
        "tags": {
            "name": "Hertz",
            "amenity": "car_rental"
        },
        "name": "Hertz",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/Enterprise": {
        "tags": {
            "name": "Enterprise",
            "amenity": "car_rental"
        },
        "name": "Enterprise",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/car_rental/stadtmobil CarSharing-Station": {
        "tags": {
            "name": "stadtmobil CarSharing-Station",
            "amenity": "car_rental"
        },
        "name": "stadtmobil CarSharing-Station",
        "icon": "car",
        "geometry": [
            "point",
            "area"
        ],
        "fields": [
            "operator"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Rowlands Pharmacy": {
        "tags": {
            "name": "Rowlands Pharmacy",
            "amenity": "pharmacy"
        },
        "name": "Rowlands Pharmacy",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Boots": {
        "tags": {
            "name": "Boots",
            "amenity": "pharmacy"
        },
        "name": "Boots",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Marien-Apotheke": {
        "tags": {
            "name": "Marien-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Marien-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Mercury Drug": {
        "tags": {
            "name": "Mercury Drug",
            "amenity": "pharmacy"
        },
        "name": "Mercury Drug",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/L??wen-Apotheke": {
        "tags": {
            "name": "L??wen-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "L??wen-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Superdrug": {
        "tags": {
            "name": "Superdrug",
            "amenity": "pharmacy"
        },
        "name": "Superdrug",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Sonnen-Apotheke": {
        "tags": {
            "name": "Sonnen-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Sonnen-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Rathaus-Apotheke": {
        "tags": {
            "name": "Rathaus-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Rathaus-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Engel-Apotheke": {
        "tags": {
            "name": "Engel-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Engel-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Hirsch-Apotheke": {
        "tags": {
            "name": "Hirsch-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Hirsch-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Stern-Apotheke": {
        "tags": {
            "name": "Stern-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Stern-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Lloyds Pharmacy": {
        "tags": {
            "name": "Lloyds Pharmacy",
            "amenity": "pharmacy"
        },
        "name": "Lloyds Pharmacy",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Rosen-Apotheke": {
        "tags": {
            "name": "Rosen-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Rosen-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Stadt-Apotheke": {
        "tags": {
            "name": "Stadt-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Stadt-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Markt-Apotheke": {
        "tags": {
            "name": "Markt-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Markt-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Pharmasave": {
        "tags": {
            "name": "Pharmasave",
            "amenity": "pharmacy"
        },
        "name": "Pharmasave",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Brunnen-Apotheke": {
        "tags": {
            "name": "Brunnen-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Brunnen-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Shoppers Drug Mart": {
        "tags": {
            "name": "Shoppers Drug Mart",
            "amenity": "pharmacy"
        },
        "name": "Shoppers Drug Mart",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Apotheke am Markt": {
        "tags": {
            "name": "Apotheke am Markt",
            "amenity": "pharmacy"
        },
        "name": "Apotheke am Markt",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Alte Apotheke": {
        "tags": {
            "name": "Alte Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Alte Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Neue Apotheke": {
        "tags": {
            "name": "Neue Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Neue Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Gintarin?? vaistin??": {
        "tags": {
            "name": "Gintarin?? vaistin??",
            "amenity": "pharmacy"
        },
        "name": "Gintarin?? vaistin??",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Rats-Apotheke": {
        "tags": {
            "name": "Rats-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Rats-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Adler Apotheke": {
        "tags": {
            "name": "Adler Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Adler Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Pharmacie Centrale": {
        "tags": {
            "name": "Pharmacie Centrale",
            "amenity": "pharmacy"
        },
        "name": "Pharmacie Centrale",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Walgreens": {
        "tags": {
            "name": "Walgreens",
            "amenity": "pharmacy"
        },
        "name": "Walgreens",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Rite Aid": {
        "tags": {
            "name": "Rite Aid",
            "amenity": "pharmacy"
        },
        "name": "Rite Aid",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Apotheke": {
        "tags": {
            "name": "Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Linden-Apotheke": {
        "tags": {
            "name": "Linden-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Linden-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Bahnhof-Apotheke": {
        "tags": {
            "name": "Bahnhof-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Bahnhof-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Burg-Apotheke": {
        "tags": {
            "name": "Burg-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Burg-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Jean Coutu": {
        "tags": {
            "name": "Jean Coutu",
            "amenity": "pharmacy"
        },
        "name": "Jean Coutu",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Pharmaprix": {
        "tags": {
            "name": "Pharmaprix",
            "amenity": "pharmacy"
        },
        "name": "Pharmaprix",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmacias Ahumada": {
        "tags": {
            "name": "Farmacias Ahumada",
            "amenity": "pharmacy"
        },
        "name": "Farmacias Ahumada",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmacia Comunale": {
        "tags": {
            "name": "Farmacia Comunale",
            "amenity": "pharmacy"
        },
        "name": "Farmacia Comunale",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmacias Cruz Verde": {
        "tags": {
            "name": "Farmacias Cruz Verde",
            "amenity": "pharmacy"
        },
        "name": "Farmacias Cruz Verde",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Cruz Verde": {
        "tags": {
            "name": "Cruz Verde",
            "amenity": "pharmacy"
        },
        "name": "Cruz Verde",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Hubertus Apotheke": {
        "tags": {
            "name": "Hubertus Apotheke",
            "amenity": "pharmacy"
        },
        "name": "Hubertus Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/CVS": {
        "tags": {
            "name": "CVS",
            "amenity": "pharmacy"
        },
        "name": "CVS",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmacias SalcoBrand": {
        "tags": {
            "name": "Farmacias SalcoBrand",
            "amenity": "pharmacy"
        },
        "name": "Farmacias SalcoBrand",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/B??ren-Apotheke": {
        "tags": {
            "name": "B??ren-Apotheke",
            "amenity": "pharmacy"
        },
        "name": "B??ren-Apotheke",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Clicks": {
        "tags": {
            "name": "Clicks",
            "amenity": "pharmacy"
        },
        "name": "Clicks",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/???????????????": {
        "tags": {
            "name": "???????????????",
            "amenity": "pharmacy"
        },
        "name": "???????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/?????????????????????": {
        "tags": {
            "name": "?????????????????????",
            "amenity": "pharmacy"
        },
        "name": "?????????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Dr. Max": {
        "tags": {
            "name": "Dr. Max",
            "amenity": "pharmacy"
        },
        "name": "Dr. Max",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????": {
        "tags": {
            "name": "????????",
            "amenity": "pharmacy"
        },
        "name": "????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "pharmacy"
        },
        "name": "??????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Apteka": {
        "tags": {
            "name": "Apteka",
            "amenity": "pharmacy"
        },
        "name": "Apteka",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/???????????? ????????????": {
        "tags": {
            "name": "???????????? ????????????",
            "amenity": "pharmacy"
        },
        "name": "???????????? ????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/??????????": {
        "tags": {
            "name": "??????????",
            "amenity": "pharmacy"
        },
        "name": "??????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Kinney Drugs": {
        "tags": {
            "name": "Kinney Drugs",
            "amenity": "pharmacy"
        },
        "name": "Kinney Drugs",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Ljekarna": {
        "tags": {
            "name": "Ljekarna",
            "amenity": "pharmacy"
        },
        "name": "Ljekarna",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/SalcoBrand": {
        "tags": {
            "name": "SalcoBrand",
            "amenity": "pharmacy"
        },
        "name": "SalcoBrand",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/???????????? 36,6": {
        "tags": {
            "name": "???????????? 36,6",
            "amenity": "pharmacy"
        },
        "name": "???????????? 36,6",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/???????????????? ??????????": {
        "tags": {
            "name": "???????????????? ??????????",
            "amenity": "pharmacy"
        },
        "name": "???????????????? ??????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/??????????": {
        "tags": {
            "name": "??????????",
            "amenity": "pharmacy"
        },
        "name": "??????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????? (Tomod's)": {
        "tags": {
            "name": "????????? (Tomod's)",
            "amenity": "pharmacy"
        },
        "name": "????????? (Tomod's)",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Eurovaistin??": {
        "tags": {
            "name": "Eurovaistin??",
            "amenity": "pharmacy"
        },
        "name": "Eurovaistin??",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmacity": {
        "tags": {
            "name": "Farmacity",
            "amenity": "pharmacy"
        },
        "name": "Farmacity",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/The Generics Pharmacy": {
        "tags": {
            "name": "The Generics Pharmacy",
            "amenity": "pharmacy"
        },
        "name": "The Generics Pharmacy",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmatodo": {
        "tags": {
            "name": "Farmatodo",
            "amenity": "pharmacy"
        },
        "name": "Farmatodo",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Duane Reade": {
        "tags": {
            "name": "Duane Reade",
            "amenity": "pharmacy"
        },
        "name": "Duane Reade",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/???????????????????????? (Drug Terashima)": {
        "tags": {
            "name": "???????????????????????? (Drug Terashima)",
            "amenity": "pharmacy"
        },
        "name": "???????????????????????? (Drug Terashima)",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/????????????": {
        "tags": {
            "name": "????????????",
            "amenity": "pharmacy"
        },
        "name": "????????????",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/?????????????????? (Aversi)": {
        "tags": {
            "name": "?????????????????? (Aversi)",
            "amenity": "pharmacy"
        },
        "name": "?????????????????? (Aversi)",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/pharmacy/Farmahorro": {
        "tags": {
            "name": "Farmahorro",
            "amenity": "pharmacy"
        },
        "name": "Farmahorro",
        "icon": "pharmacy",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "amenity/cafe/Starbucks": {
        "tags": {
            "name": "Starbucks",
            "cuisine": "coffee_shop",
            "amenity": "cafe"
        },
        "name": "Starbucks",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Cafeteria": {
        "tags": {
            "name": "Cafeteria",
            "amenity": "cafe"
        },
        "name": "Cafeteria",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Costa": {
        "tags": {
            "name": "Costa",
            "amenity": "cafe"
        },
        "name": "Costa",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Caff?? Nero": {
        "tags": {
            "name": "Caff?? Nero",
            "amenity": "cafe"
        },
        "name": "Caff?? Nero",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/????????": {
        "tags": {
            "name": "????????",
            "amenity": "cafe"
        },
        "name": "????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Caf?? Central": {
        "tags": {
            "name": "Caf?? Central",
            "amenity": "cafe"
        },
        "name": "Caf?? Central",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Second Cup": {
        "tags": {
            "name": "Second Cup",
            "amenity": "cafe"
        },
        "name": "Second Cup",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Eisdiele": {
        "tags": {
            "name": "Eisdiele",
            "amenity": "cafe"
        },
        "name": "Eisdiele",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Dunkin Donuts": {
        "tags": {
            "name": "Dunkin Donuts",
            "cuisine": "donut",
            "amenity": "cafe"
        },
        "name": "Dunkin Donuts",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Espresso House": {
        "tags": {
            "name": "Espresso House",
            "amenity": "cafe"
        },
        "name": "Espresso House",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Segafredo": {
        "tags": {
            "name": "Segafredo",
            "amenity": "cafe"
        },
        "name": "Segafredo",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Coffee Time": {
        "tags": {
            "name": "Coffee Time",
            "amenity": "cafe"
        },
        "name": "Coffee Time",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Cafe Coffee Day": {
        "tags": {
            "name": "Cafe Coffee Day",
            "amenity": "cafe"
        },
        "name": "Cafe Coffee Day",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Eiscafe Venezia": {
        "tags": {
            "name": "Eiscafe Venezia",
            "amenity": "cafe"
        },
        "name": "Eiscafe Venezia",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/?????????????????????": {
        "tags": {
            "name": "?????????????????????",
            "name:en": "Starbucks",
            "amenity": "cafe"
        },
        "name": "?????????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "amenity": "cafe"
        },
        "name": "??????????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Pret A Manger": {
        "tags": {
            "name": "Pret A Manger",
            "amenity": "cafe"
        },
        "name": "Pret A Manger",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/????????????????": {
        "tags": {
            "name": "????????????????",
            "amenity": "cafe"
        },
        "name": "????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "DOUTOR",
            "amenity": "cafe"
        },
        "name": "????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Tchibo": {
        "tags": {
            "name": "Tchibo",
            "amenity": "cafe"
        },
        "name": "Tchibo",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/???????? ????????": {
        "tags": {
            "name": "???????? ????????",
            "amenity": "cafe"
        },
        "name": "???????? ????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Caribou Coffee": {
        "tags": {
            "name": "Caribou Coffee",
            "amenity": "cafe"
        },
        "name": "Caribou Coffee",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/??????": {
        "tags": {
            "name": "??????",
            "amenity": "cafe"
        },
        "name": "??????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "amenity": "cafe"
        },
        "name": "??????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/??????????????? ??????????????????": {
        "tags": {
            "name": "??????????????? ??????????????????",
            "amenity": "cafe"
        },
        "name": "??????????????? ??????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Traveler's Coffee": {
        "tags": {
            "name": "Traveler's Coffee",
            "amenity": "cafe"
        },
        "name": "Traveler's Coffee",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/???????????????????????????": {
        "tags": {
            "name": "???????????????????????????",
            "name:en": "Cafe de CRIE",
            "amenity": "cafe"
        },
        "name": "???????????????????????????",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "amenity/cafe/Cafe Amazon": {
        "tags": {
            "name": "Cafe Amazon",
            "amenity": "cafe"
        },
        "name": "Cafe Amazon",
        "icon": "cafe",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "cuisine",
            "internet_access",
            "building_area",
            "address",
            "opening_hours",
            "smoking"
        ],
        "suggestion": true
    },
    "shop/supermarket/Budgens": {
        "tags": {
            "name": "Budgens",
            "shop": "supermarket"
        },
        "name": "Budgens",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Morrisons": {
        "tags": {
            "name": "Morrisons",
            "shop": "supermarket"
        },
        "name": "Morrisons",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Interspar": {
        "tags": {
            "name": "Interspar",
            "shop": "supermarket"
        },
        "name": "Interspar",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Merkur": {
        "tags": {
            "name": "Merkur",
            "shop": "supermarket"
        },
        "name": "Merkur",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Sainsbury's": {
        "tags": {
            "name": "Sainsbury's",
            "shop": "supermarket"
        },
        "name": "Sainsbury's",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Lidl": {
        "tags": {
            "name": "Lidl",
            "shop": "supermarket"
        },
        "name": "Lidl",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/EDEKA": {
        "tags": {
            "name": "EDEKA",
            "shop": "supermarket"
        },
        "name": "EDEKA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Coles": {
        "tags": {
            "name": "Coles",
            "shop": "supermarket"
        },
        "name": "Coles",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Iceland": {
        "tags": {
            "name": "Iceland",
            "shop": "supermarket"
        },
        "name": "Iceland",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Coop": {
        "tags": {
            "name": "Coop",
            "shop": "supermarket"
        },
        "name": "Coop",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Tesco": {
        "tags": {
            "name": "Tesco",
            "shop": "supermarket"
        },
        "name": "Tesco",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Woolworths": {
        "tags": {
            "name": "Woolworths",
            "shop": "supermarket"
        },
        "name": "Woolworths",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Zielpunkt": {
        "tags": {
            "name": "Zielpunkt",
            "shop": "supermarket"
        },
        "name": "Zielpunkt",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Nahkauf": {
        "tags": {
            "name": "Nahkauf",
            "shop": "supermarket"
        },
        "name": "Nahkauf",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Billa": {
        "tags": {
            "name": "Billa",
            "shop": "supermarket"
        },
        "name": "Billa",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kaufland": {
        "tags": {
            "name": "Kaufland",
            "shop": "supermarket"
        },
        "name": "Kaufland",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Plus": {
        "tags": {
            "name": "Plus",
            "shop": "supermarket"
        },
        "name": "Plus",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ALDI": {
        "tags": {
            "name": "ALDI",
            "shop": "supermarket"
        },
        "name": "ALDI",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Checkers": {
        "tags": {
            "name": "Checkers",
            "shop": "supermarket"
        },
        "name": "Checkers",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Tesco Metro": {
        "tags": {
            "name": "Tesco Metro",
            "shop": "supermarket"
        },
        "name": "Tesco Metro",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/NP": {
        "tags": {
            "name": "NP",
            "shop": "supermarket"
        },
        "name": "NP",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Penny": {
        "tags": {
            "name": "Penny",
            "shop": "supermarket"
        },
        "name": "Penny",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Norma": {
        "tags": {
            "name": "Norma",
            "shop": "supermarket"
        },
        "name": "Norma",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Asda": {
        "tags": {
            "name": "Asda",
            "shop": "supermarket"
        },
        "name": "Asda",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Netto": {
        "tags": {
            "name": "Netto",
            "shop": "supermarket"
        },
        "name": "Netto",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/REWE": {
        "tags": {
            "name": "REWE",
            "shop": "supermarket"
        },
        "name": "REWE",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Rewe": {
        "tags": {
            "name": "Rewe",
            "shop": "supermarket"
        },
        "name": "Rewe",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Aldi S??d": {
        "tags": {
            "name": "Aldi S??d",
            "shop": "supermarket"
        },
        "name": "Aldi S??d",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Real": {
        "tags": {
            "name": "Real",
            "shop": "supermarket"
        },
        "name": "Real",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/King Soopers": {
        "tags": {
            "name": "King Soopers",
            "shop": "supermarket"
        },
        "name": "King Soopers",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kiwi": {
        "tags": {
            "name": "Kiwi",
            "shop": "supermarket"
        },
        "name": "Kiwi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Edeka": {
        "tags": {
            "name": "Edeka",
            "shop": "supermarket"
        },
        "name": "Edeka",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Pick n Pay": {
        "tags": {
            "name": "Pick n Pay",
            "shop": "supermarket"
        },
        "name": "Pick n Pay",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ICA": {
        "tags": {
            "name": "ICA",
            "shop": "supermarket"
        },
        "name": "ICA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Tengelmann": {
        "tags": {
            "name": "Tengelmann",
            "shop": "supermarket"
        },
        "name": "Tengelmann",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Carrefour": {
        "tags": {
            "name": "Carrefour",
            "shop": "supermarket"
        },
        "name": "Carrefour",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Waitrose": {
        "tags": {
            "name": "Waitrose",
            "shop": "supermarket"
        },
        "name": "Waitrose",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Spar": {
        "tags": {
            "name": "Spar",
            "shop": "supermarket"
        },
        "name": "Spar",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Hofer": {
        "tags": {
            "name": "Hofer",
            "shop": "supermarket"
        },
        "name": "Hofer",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/M-Preis": {
        "tags": {
            "name": "M-Preis",
            "shop": "supermarket"
        },
        "name": "M-Preis",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/LIDL": {
        "tags": {
            "name": "LIDL",
            "shop": "supermarket"
        },
        "name": "LIDL",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/tegut": {
        "tags": {
            "name": "tegut",
            "shop": "supermarket"
        },
        "name": "tegut",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Sainsbury's Local": {
        "tags": {
            "name": "Sainsbury's Local",
            "shop": "supermarket"
        },
        "name": "Sainsbury's Local",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/E-Center": {
        "tags": {
            "name": "E-Center",
            "shop": "supermarket"
        },
        "name": "E-Center",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Aldi Nord": {
        "tags": {
            "name": "Aldi Nord",
            "shop": "supermarket"
        },
        "name": "Aldi Nord",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/nahkauf": {
        "tags": {
            "name": "nahkauf",
            "shop": "supermarket"
        },
        "name": "nahkauf",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Meijer": {
        "tags": {
            "name": "Meijer",
            "shop": "supermarket"
        },
        "name": "Meijer",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Safeway": {
        "tags": {
            "name": "Safeway",
            "shop": "supermarket"
        },
        "name": "Safeway",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Costco": {
        "tags": {
            "name": "Costco",
            "shop": "supermarket"
        },
        "name": "Costco",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Albert": {
        "tags": {
            "name": "Albert",
            "shop": "supermarket"
        },
        "name": "Albert",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Jumbo": {
        "tags": {
            "name": "Jumbo",
            "shop": "supermarket"
        },
        "name": "Jumbo",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Shoprite": {
        "tags": {
            "name": "Shoprite",
            "shop": "supermarket"
        },
        "name": "Shoprite",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/MPreis": {
        "tags": {
            "name": "MPreis",
            "shop": "supermarket"
        },
        "name": "MPreis",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Penny Market": {
        "tags": {
            "name": "Penny Market",
            "shop": "supermarket"
        },
        "name": "Penny Market",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Tesco Extra": {
        "tags": {
            "name": "Tesco Extra",
            "shop": "supermarket"
        },
        "name": "Tesco Extra",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Albert Heijn": {
        "tags": {
            "name": "Albert Heijn",
            "shop": "supermarket"
        },
        "name": "Albert Heijn",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/IGA": {
        "tags": {
            "name": "IGA",
            "shop": "supermarket"
        },
        "name": "IGA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Super U": {
        "tags": {
            "name": "Super U",
            "shop": "supermarket"
        },
        "name": "Super U",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Metro": {
        "tags": {
            "name": "Metro",
            "shop": "supermarket"
        },
        "name": "Metro",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Neukauf": {
        "tags": {
            "name": "Neukauf",
            "shop": "supermarket"
        },
        "name": "Neukauf",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Migros": {
        "tags": {
            "name": "Migros",
            "shop": "supermarket"
        },
        "name": "Migros",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Marktkauf": {
        "tags": {
            "name": "Marktkauf",
            "shop": "supermarket"
        },
        "name": "Marktkauf",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Delikatesy Centrum": {
        "tags": {
            "name": "Delikatesy Centrum",
            "shop": "supermarket"
        },
        "name": "Delikatesy Centrum",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/C1000": {
        "tags": {
            "name": "C1000",
            "shop": "supermarket"
        },
        "name": "C1000",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Hoogvliet": {
        "tags": {
            "name": "Hoogvliet",
            "shop": "supermarket"
        },
        "name": "Hoogvliet",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/COOP": {
        "tags": {
            "name": "COOP",
            "shop": "supermarket"
        },
        "name": "COOP",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Food Basics": {
        "tags": {
            "name": "Food Basics",
            "shop": "supermarket"
        },
        "name": "Food Basics",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Casino": {
        "tags": {
            "name": "Casino",
            "shop": "supermarket"
        },
        "name": "Casino",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Penny Markt": {
        "tags": {
            "name": "Penny Markt",
            "shop": "supermarket"
        },
        "name": "Penny Markt",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Giant": {
        "tags": {
            "name": "Giant",
            "shop": "supermarket"
        },
        "name": "Giant",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Rema 1000": {
        "tags": {
            "name": "Rema 1000",
            "shop": "supermarket"
        },
        "name": "Rema 1000",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kaufpark": {
        "tags": {
            "name": "Kaufpark",
            "shop": "supermarket"
        },
        "name": "Kaufpark",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ALDI S??D": {
        "tags": {
            "name": "ALDI S??D",
            "shop": "supermarket"
        },
        "name": "ALDI S??D",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Simply Market": {
        "tags": {
            "name": "Simply Market",
            "shop": "supermarket"
        },
        "name": "Simply Market",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Konzum": {
        "tags": {
            "name": "Konzum",
            "shop": "supermarket"
        },
        "name": "Konzum",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Carrefour Express": {
        "tags": {
            "name": "Carrefour Express",
            "shop": "supermarket"
        },
        "name": "Carrefour Express",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Eurospar": {
        "tags": {
            "name": "Eurospar",
            "shop": "supermarket"
        },
        "name": "Eurospar",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Mercator": {
        "tags": {
            "name": "Mercator",
            "shop": "supermarket"
        },
        "name": "Mercator",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Famila": {
        "tags": {
            "name": "Famila",
            "shop": "supermarket"
        },
        "name": "Famila",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Hemk??p": {
        "tags": {
            "name": "Hemk??p",
            "shop": "supermarket"
        },
        "name": "Hemk??p",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/real,-": {
        "tags": {
            "name": "real,-",
            "shop": "supermarket"
        },
        "name": "real,-",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Markant": {
        "tags": {
            "name": "Markant",
            "shop": "supermarket"
        },
        "name": "Markant",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Volg": {
        "tags": {
            "name": "Volg",
            "shop": "supermarket"
        },
        "name": "Volg",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Leader Price": {
        "tags": {
            "name": "Leader Price",
            "shop": "supermarket"
        },
        "name": "Leader Price",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Treff 3000": {
        "tags": {
            "name": "Treff 3000",
            "shop": "supermarket"
        },
        "name": "Treff 3000",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/SuperBrugsen": {
        "tags": {
            "name": "SuperBrugsen",
            "shop": "supermarket"
        },
        "name": "SuperBrugsen",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kaiser's": {
        "tags": {
            "name": "Kaiser's",
            "shop": "supermarket"
        },
        "name": "Kaiser's",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/K+K": {
        "tags": {
            "name": "K+K",
            "shop": "supermarket"
        },
        "name": "K+K",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Unimarkt": {
        "tags": {
            "name": "Unimarkt",
            "shop": "supermarket"
        },
        "name": "Unimarkt",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Carrefour City": {
        "tags": {
            "name": "Carrefour City",
            "shop": "supermarket"
        },
        "name": "Carrefour City",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Sobeys": {
        "tags": {
            "name": "Sobeys",
            "shop": "supermarket"
        },
        "name": "Sobeys",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/S-Market": {
        "tags": {
            "name": "S-Market",
            "shop": "supermarket"
        },
        "name": "S-Market",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Combi": {
        "tags": {
            "name": "Combi",
            "shop": "supermarket"
        },
        "name": "Combi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Denner": {
        "tags": {
            "name": "Denner",
            "shop": "supermarket"
        },
        "name": "Denner",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Konsum": {
        "tags": {
            "name": "Konsum",
            "shop": "supermarket"
        },
        "name": "Konsum",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Franprix": {
        "tags": {
            "name": "Franprix",
            "shop": "supermarket"
        },
        "name": "Franprix",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Monoprix": {
        "tags": {
            "name": "Monoprix",
            "shop": "supermarket"
        },
        "name": "Monoprix",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Diska": {
        "tags": {
            "name": "Diska",
            "shop": "supermarket"
        },
        "name": "Diska",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/PENNY": {
        "tags": {
            "name": "PENNY",
            "shop": "supermarket"
        },
        "name": "PENNY",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Dia": {
        "tags": {
            "name": "Dia",
            "shop": "supermarket"
        },
        "name": "Dia",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Giant Eagle": {
        "tags": {
            "name": "Giant Eagle",
            "shop": "supermarket"
        },
        "name": "Giant Eagle",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/NORMA": {
        "tags": {
            "name": "NORMA",
            "shop": "supermarket"
        },
        "name": "NORMA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/AD Delhaize": {
        "tags": {
            "name": "AD Delhaize",
            "shop": "supermarket"
        },
        "name": "AD Delhaize",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Auchan": {
        "tags": {
            "name": "Auchan",
            "shop": "supermarket"
        },
        "name": "Auchan",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Mercadona": {
        "tags": {
            "name": "Mercadona",
            "shop": "supermarket"
        },
        "name": "Mercadona",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Consum": {
        "tags": {
            "name": "Consum",
            "shop": "supermarket"
        },
        "name": "Consum",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Carrefour Market": {
        "tags": {
            "name": "Carrefour Market",
            "shop": "supermarket"
        },
        "name": "Carrefour Market",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Whole Foods": {
        "tags": {
            "name": "Whole Foods",
            "shop": "supermarket"
        },
        "name": "Whole Foods",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Pam": {
        "tags": {
            "name": "Pam",
            "shop": "supermarket"
        },
        "name": "Pam",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/sky": {
        "tags": {
            "name": "sky",
            "shop": "supermarket"
        },
        "name": "sky",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Despar": {
        "tags": {
            "name": "Despar",
            "shop": "supermarket"
        },
        "name": "Despar",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Eroski": {
        "tags": {
            "name": "Eroski",
            "shop": "supermarket"
        },
        "name": "Eroski",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Maxi": {
        "tags": {
            "name": "Maxi",
            "shop": "supermarket"
        },
        "name": "Maxi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Colruyt": {
        "tags": {
            "name": "Colruyt",
            "shop": "supermarket"
        },
        "name": "Colruyt",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/The Co-operative": {
        "tags": {
            "name": "The Co-operative",
            "shop": "supermarket"
        },
        "name": "The Co-operative",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Intermarch??": {
        "tags": {
            "name": "Intermarch??",
            "shop": "supermarket"
        },
        "name": "Intermarch??",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Delhaize": {
        "tags": {
            "name": "Delhaize",
            "shop": "supermarket"
        },
        "name": "Delhaize",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/CBA": {
        "tags": {
            "name": "CBA",
            "shop": "supermarket"
        },
        "name": "CBA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Shopi": {
        "tags": {
            "name": "Shopi",
            "shop": "supermarket"
        },
        "name": "Shopi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Walmart": {
        "tags": {
            "name": "Walmart",
            "shop": "supermarket"
        },
        "name": "Walmart",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kroger": {
        "tags": {
            "name": "Kroger",
            "shop": "supermarket"
        },
        "name": "Kroger",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Albertsons": {
        "tags": {
            "name": "Albertsons",
            "shop": "supermarket"
        },
        "name": "Albertsons",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Trader Joe's": {
        "tags": {
            "name": "Trader Joe's",
            "shop": "supermarket"
        },
        "name": "Trader Joe's",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Feneberg": {
        "tags": {
            "name": "Feneberg",
            "shop": "supermarket"
        },
        "name": "Feneberg",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/denn's Biomarkt": {
        "tags": {
            "name": "denn's Biomarkt",
            "shop": "supermarket"
        },
        "name": "denn's Biomarkt",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Kvickly": {
        "tags": {
            "name": "Kvickly",
            "shop": "supermarket"
        },
        "name": "Kvickly",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Makro": {
        "tags": {
            "name": "Makro",
            "shop": "supermarket"
        },
        "name": "Makro",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Dico": {
        "tags": {
            "name": "Dico",
            "shop": "supermarket"
        },
        "name": "Dico",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Nah & Frisch": {
        "tags": {
            "name": "Nah & Frisch",
            "shop": "supermarket"
        },
        "name": "Nah & Frisch",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Champion": {
        "tags": {
            "name": "Champion",
            "shop": "supermarket"
        },
        "name": "Champion",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ICA Supermarket": {
        "tags": {
            "name": "ICA Supermarket",
            "shop": "supermarket"
        },
        "name": "ICA Supermarket",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Fakta": {
        "tags": {
            "name": "Fakta",
            "shop": "supermarket"
        },
        "name": "Fakta",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "supermarket"
        },
        "name": "????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Caprabo": {
        "tags": {
            "name": "Caprabo",
            "shop": "supermarket"
        },
        "name": "Caprabo",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Famiglia Cooperativa": {
        "tags": {
            "name": "Famiglia Cooperativa",
            "shop": "supermarket"
        },
        "name": "Famiglia Cooperativa",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/???????????????? 7?? ??????????": {
        "tags": {
            "name": "???????????????? 7?? ??????????",
            "shop": "supermarket"
        },
        "name": "???????????????? 7?? ??????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Esselunga": {
        "tags": {
            "name": "Esselunga",
            "shop": "supermarket"
        },
        "name": "Esselunga",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Maxima": {
        "tags": {
            "name": "Maxima",
            "shop": "supermarket"
        },
        "name": "Maxima",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Wasgau": {
        "tags": {
            "name": "Wasgau",
            "shop": "supermarket"
        },
        "name": "Wasgau",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Pingo Doce": {
        "tags": {
            "name": "Pingo Doce",
            "shop": "supermarket"
        },
        "name": "Pingo Doce",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Match": {
        "tags": {
            "name": "Match",
            "shop": "supermarket"
        },
        "name": "Match",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Profi": {
        "tags": {
            "name": "Profi",
            "shop": "supermarket"
        },
        "name": "Profi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Lider": {
        "tags": {
            "name": "Lider",
            "shop": "supermarket"
        },
        "name": "Lider",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Unimarc": {
        "tags": {
            "name": "Unimarc",
            "shop": "supermarket"
        },
        "name": "Unimarc",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Co-operative Food": {
        "tags": {
            "name": "Co-operative Food",
            "shop": "supermarket"
        },
        "name": "Co-operative Food",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Santa Isabel": {
        "tags": {
            "name": "Santa Isabel",
            "shop": "supermarket"
        },
        "name": "Santa Isabel",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/?????????????? ??????????????????": {
        "tags": {
            "name": "?????????????? ??????????????????",
            "shop": "supermarket"
        },
        "name": "?????????????? ??????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/HIT": {
        "tags": {
            "name": "HIT",
            "shop": "supermarket"
        },
        "name": "HIT",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Rimi": {
        "tags": {
            "name": "Rimi",
            "shop": "supermarket"
        },
        "name": "Rimi",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Conad": {
        "tags": {
            "name": "Conad",
            "shop": "supermarket"
        },
        "name": "Conad",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "supermarket"
        },
        "name": "????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Willys": {
        "tags": {
            "name": "Willys",
            "shop": "supermarket"
        },
        "name": "Willys",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Farmfoods": {
        "tags": {
            "name": "Farmfoods",
            "shop": "supermarket"
        },
        "name": "Farmfoods",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/U Express": {
        "tags": {
            "name": "U Express",
            "shop": "supermarket"
        },
        "name": "U Express",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????": {
        "tags": {
            "name": "????????",
            "shop": "supermarket"
        },
        "name": "????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Dunnes Stores": {
        "tags": {
            "name": "Dunnes Stores",
            "shop": "supermarket"
        },
        "name": "Dunnes Stores",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "supermarket"
        },
        "name": "????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "supermarket"
        },
        "name": "????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Piggly Wiggly": {
        "tags": {
            "name": "Piggly Wiggly",
            "shop": "supermarket"
        },
        "name": "Piggly Wiggly",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Crai": {
        "tags": {
            "name": "Crai",
            "shop": "supermarket"
        },
        "name": "Crai",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/El ??rbol": {
        "tags": {
            "name": "El ??rbol",
            "shop": "supermarket"
        },
        "name": "El ??rbol",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Centre Commercial E. Leclerc": {
        "tags": {
            "name": "Centre Commercial E. Leclerc",
            "shop": "supermarket"
        },
        "name": "Centre Commercial E. Leclerc",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Foodland": {
        "tags": {
            "name": "Foodland",
            "shop": "supermarket"
        },
        "name": "Foodland",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Super Brugsen": {
        "tags": {
            "name": "Super Brugsen",
            "shop": "supermarket"
        },
        "name": "Super Brugsen",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "supermarket"
        },
        "name": "??????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "supermarket"
        },
        "name": "??????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Publix": {
        "tags": {
            "name": "Publix",
            "shop": "supermarket"
        },
        "name": "Publix",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/F??tex": {
        "tags": {
            "name": "F??tex",
            "shop": "supermarket"
        },
        "name": "F??tex",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/coop": {
        "tags": {
            "name": "coop",
            "shop": "supermarket"
        },
        "name": "coop",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Coop Konsum": {
        "tags": {
            "name": "Coop Konsum",
            "shop": "supermarket"
        },
        "name": "Coop Konsum",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Carrefour Contact": {
        "tags": {
            "name": "Carrefour Contact",
            "shop": "supermarket"
        },
        "name": "Carrefour Contact",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/SPAR": {
        "tags": {
            "name": "SPAR",
            "shop": "supermarket"
        },
        "name": "SPAR",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/No Frills": {
        "tags": {
            "name": "No Frills",
            "shop": "supermarket"
        },
        "name": "No Frills",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Plodine": {
        "tags": {
            "name": "Plodine",
            "shop": "supermarket"
        },
        "name": "Plodine",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ADEG": {
        "tags": {
            "name": "ADEG",
            "shop": "supermarket"
        },
        "name": "ADEG",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Minipre??o": {
        "tags": {
            "name": "Minipre??o",
            "shop": "supermarket"
        },
        "name": "Minipre??o",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Biedronka": {
        "tags": {
            "name": "Biedronka",
            "shop": "supermarket"
        },
        "name": "Biedronka",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/The Co-operative Food": {
        "tags": {
            "name": "The Co-operative Food",
            "shop": "supermarket"
        },
        "name": "The Co-operative Food",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Eurospin": {
        "tags": {
            "name": "Eurospin",
            "shop": "supermarket"
        },
        "name": "Eurospin",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "supermarket"
        },
        "name": "??????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Gadis": {
        "tags": {
            "name": "Gadis",
            "shop": "supermarket"
        },
        "name": "Gadis",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "supermarket"
        },
        "name": "??????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "supermarket"
        },
        "name": "??????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/New World": {
        "tags": {
            "name": "New World",
            "shop": "supermarket"
        },
        "name": "New World",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Countdown": {
        "tags": {
            "name": "Countdown",
            "shop": "supermarket"
        },
        "name": "Countdown",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Reliance Fresh": {
        "tags": {
            "name": "Reliance Fresh",
            "shop": "supermarket"
        },
        "name": "Reliance Fresh",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Stokrotka": {
        "tags": {
            "name": "Stokrotka",
            "shop": "supermarket"
        },
        "name": "Stokrotka",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Coop Jednota": {
        "tags": {
            "name": "Coop Jednota",
            "shop": "supermarket"
        },
        "name": "Coop Jednota",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Fred Meyer": {
        "tags": {
            "name": "Fred Meyer",
            "shop": "supermarket"
        },
        "name": "Fred Meyer",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Irma": {
        "tags": {
            "name": "Irma",
            "shop": "supermarket"
        },
        "name": "Irma",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Continente": {
        "tags": {
            "name": "Continente",
            "shop": "supermarket"
        },
        "name": "Continente",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Price Chopper": {
        "tags": {
            "name": "Price Chopper",
            "shop": "supermarket"
        },
        "name": "Price Chopper",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Game": {
        "tags": {
            "name": "Game",
            "shop": "supermarket"
        },
        "name": "Game",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Soriana": {
        "tags": {
            "name": "Soriana",
            "shop": "supermarket"
        },
        "name": "Soriana",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Alimerka": {
        "tags": {
            "name": "Alimerka",
            "shop": "supermarket"
        },
        "name": "Alimerka",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Piotr i Pawe??": {
        "tags": {
            "name": "Piotr i Pawe??",
            "shop": "supermarket"
        },
        "name": "Piotr i Pawe??",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "shop": "supermarket"
        },
        "name": "??????????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Maxima X": {
        "tags": {
            "name": "Maxima X",
            "shop": "supermarket"
        },
        "name": "Maxima X",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "supermarket"
        },
        "name": "????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ALDI Nord": {
        "tags": {
            "name": "ALDI Nord",
            "shop": "supermarket"
        },
        "name": "ALDI Nord",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Condis": {
        "tags": {
            "name": "Condis",
            "shop": "supermarket"
        },
        "name": "Condis",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Sam's Club": {
        "tags": {
            "name": "Sam's Club",
            "shop": "supermarket"
        },
        "name": "Sam's Club",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "supermarket"
        },
        "name": "??????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/G??ant Casino": {
        "tags": {
            "name": "G??ant Casino",
            "shop": "supermarket"
        },
        "name": "G??ant Casino",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/ASDA": {
        "tags": {
            "name": "ASDA",
            "shop": "supermarket"
        },
        "name": "ASDA",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Intermarche": {
        "tags": {
            "name": "Intermarche",
            "shop": "supermarket"
        },
        "name": "Intermarche",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Stop & Shop": {
        "tags": {
            "name": "Stop & Shop",
            "shop": "supermarket"
        },
        "name": "Stop & Shop",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Food Lion": {
        "tags": {
            "name": "Food Lion",
            "shop": "supermarket"
        },
        "name": "Food Lion",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Harris Teeter": {
        "tags": {
            "name": "Harris Teeter",
            "shop": "supermarket"
        },
        "name": "Harris Teeter",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Foodworks": {
        "tags": {
            "name": "Foodworks",
            "shop": "supermarket"
        },
        "name": "Foodworks",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Polo Market": {
        "tags": {
            "name": "Polo Market",
            "shop": "supermarket"
        },
        "name": "Polo Market",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "supermarket"
        },
        "name": "??????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/?????? (SEIYU)": {
        "tags": {
            "name": "?????? (SEIYU)",
            "shop": "supermarket"
        },
        "name": "?????? (SEIYU)",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/H-E-B": {
        "tags": {
            "name": "H-E-B",
            "shop": "supermarket"
        },
        "name": "H-E-B",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????": {
        "tags": {
            "name": "????????",
            "shop": "supermarket"
        },
        "name": "????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "supermarket"
        },
        "name": "??????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Extra": {
        "tags": {
            "name": "Extra",
            "shop": "supermarket"
        },
        "name": "Extra",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Sigma": {
        "tags": {
            "name": "Sigma",
            "shop": "supermarket"
        },
        "name": "Sigma",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????": {
        "tags": {
            "name": "??????",
            "shop": "supermarket"
        },
        "name": "??????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Bodega Aurrera": {
        "tags": {
            "name": "Bodega Aurrera",
            "shop": "supermarket"
        },
        "name": "Bodega Aurrera",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Tesco Lotus": {
        "tags": {
            "name": "Tesco Lotus",
            "shop": "supermarket"
        },
        "name": "Tesco Lotus",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????-????": {
        "tags": {
            "name": "??????????-????",
            "shop": "supermarket"
        },
        "name": "??????????-????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "supermarket"
        },
        "name": "????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "supermarket"
        },
        "name": "??????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Hy-Vee": {
        "tags": {
            "name": "Hy-Vee",
            "shop": "supermarket"
        },
        "name": "Hy-Vee",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Walmart Supercenter": {
        "tags": {
            "name": "Walmart Supercenter",
            "shop": "supermarket"
        },
        "name": "Walmart Supercenter",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Hannaford": {
        "tags": {
            "name": "Hannaford",
            "shop": "supermarket"
        },
        "name": "Hannaford",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Wegmans": {
        "tags": {
            "name": "Wegmans",
            "shop": "supermarket"
        },
        "name": "Wegmans",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "supermarket"
        },
        "name": "??????????????????",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Norfa XL": {
        "tags": {
            "name": "Norfa XL",
            "shop": "supermarket"
        },
        "name": "Norfa XL",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/?????????????????? (YorkMart)": {
        "tags": {
            "name": "?????????????????? (YorkMart)",
            "shop": "supermarket"
        },
        "name": "?????????????????? (YorkMart)",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/supermarket/Leclerc Drive": {
        "tags": {
            "name": "Leclerc Drive",
            "shop": "supermarket"
        },
        "name": "Leclerc Drive",
        "icon": "grocery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "operator",
            "building_area",
            "address"
        ],
        "suggestion": true
    },
    "shop/electronics/Media Markt": {
        "tags": {
            "name": "Media Markt",
            "shop": "electronics"
        },
        "name": "Media Markt",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Maplin": {
        "tags": {
            "name": "Maplin",
            "shop": "electronics"
        },
        "name": "Maplin",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Best Buy": {
        "tags": {
            "name": "Best Buy",
            "shop": "electronics"
        },
        "name": "Best Buy",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Future Shop": {
        "tags": {
            "name": "Future Shop",
            "shop": "electronics"
        },
        "name": "Future Shop",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Saturn": {
        "tags": {
            "name": "Saturn",
            "shop": "electronics"
        },
        "name": "Saturn",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Currys": {
        "tags": {
            "name": "Currys",
            "shop": "electronics"
        },
        "name": "Currys",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Radio Shack": {
        "tags": {
            "name": "Radio Shack",
            "shop": "electronics"
        },
        "name": "Radio Shack",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Euronics": {
        "tags": {
            "name": "Euronics",
            "shop": "electronics"
        },
        "name": "Euronics",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Expert": {
        "tags": {
            "name": "Expert",
            "shop": "electronics"
        },
        "name": "Expert",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "electronics"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/Darty": {
        "tags": {
            "name": "Darty",
            "shop": "electronics"
        },
        "name": "Darty",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/??.??????????": {
        "tags": {
            "name": "??.??????????",
            "shop": "electronics"
        },
        "name": "??.??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/electronics/???????????????": {
        "tags": {
            "name": "???????????????",
            "shop": "electronics"
        },
        "name": "???????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/McColl's": {
        "tags": {
            "name": "McColl's",
            "shop": "convenience"
        },
        "name": "McColl's",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Tesco Express": {
        "tags": {
            "name": "Tesco Express",
            "shop": "convenience"
        },
        "name": "Tesco Express",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/One Stop": {
        "tags": {
            "name": "One Stop",
            "shop": "convenience"
        },
        "name": "One Stop",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Londis": {
        "tags": {
            "name": "Londis",
            "shop": "convenience"
        },
        "name": "Londis",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/7-Eleven": {
        "tags": {
            "name": "7-Eleven",
            "shop": "convenience"
        },
        "name": "7-Eleven",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Sale": {
        "tags": {
            "name": "Sale",
            "shop": "convenience"
        },
        "name": "Sale",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Siwa": {
        "tags": {
            "name": "Siwa",
            "shop": "convenience"
        },
        "name": "Siwa",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/COOP Jednota": {
        "tags": {
            "name": "COOP Jednota",
            "shop": "convenience"
        },
        "name": "COOP Jednota",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Mac's": {
        "tags": {
            "name": "Mac's",
            "shop": "convenience"
        },
        "name": "Mac's",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Alepa": {
        "tags": {
            "name": "Alepa",
            "shop": "convenience"
        },
        "name": "Alepa",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Hasty Market": {
        "tags": {
            "name": "Hasty Market",
            "shop": "convenience"
        },
        "name": "Hasty Market",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/K-Market": {
        "tags": {
            "name": "K-Market",
            "shop": "convenience"
        },
        "name": "K-Market",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Costcutter": {
        "tags": {
            "name": "Costcutter",
            "shop": "convenience"
        },
        "name": "Costcutter",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Valintatalo": {
        "tags": {
            "name": "Valintatalo",
            "shop": "convenience"
        },
        "name": "Valintatalo",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Circle K": {
        "tags": {
            "name": "Circle K",
            "shop": "convenience"
        },
        "name": "Circle K",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????": {
        "tags": {
            "name": "?????????????????????",
            "name:en": "7-Eleven",
            "shop": "convenience"
        },
        "name": "?????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "LAWSON",
            "shop": "convenience"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Petit Casino": {
        "tags": {
            "name": "Petit Casino",
            "shop": "convenience"
        },
        "name": "Petit Casino",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Mace": {
        "tags": {
            "name": "Mace",
            "shop": "convenience"
        },
        "name": "Mace",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Mini Market": {
        "tags": {
            "name": "Mini Market",
            "shop": "convenience"
        },
        "name": "Mini Market",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Nisa Local": {
        "tags": {
            "name": "Nisa Local",
            "shop": "convenience"
        },
        "name": "Nisa Local",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Dorfladen": {
        "tags": {
            "name": "Dorfladen",
            "shop": "convenience"
        },
        "name": "Dorfladen",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "convenience"
        },
        "name": "????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Mini Stop": {
        "tags": {
            "name": "Mini Stop",
            "shop": "convenience"
        },
        "name": "Mini Stop",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/LAWSON": {
        "tags": {
            "name": "LAWSON",
            "shop": "convenience"
        },
        "name": "LAWSON",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????????????": {
        "tags": {
            "name": "????????????????????????",
            "shop": "convenience"
        },
        "name": "????????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Nisa": {
        "tags": {
            "name": "Nisa",
            "shop": "convenience"
        },
        "name": "Nisa",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Premier": {
        "tags": {
            "name": "Premier",
            "shop": "convenience"
        },
        "name": "Premier",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/ABC": {
        "tags": {
            "name": "ABC",
            "shop": "convenience"
        },
        "name": "ABC",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "name:en": "MINISTOP",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????": {
        "tags": {
            "name": "????????????",
            "name:en": "sunkus",
            "shop": "convenience"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/???????????????": {
        "tags": {
            "name": "???????????????",
            "shop": "convenience"
        },
        "name": "???????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/8 ?? Huit": {
        "tags": {
            "name": "8 ?? Huit",
            "shop": "convenience"
        },
        "name": "8 ?? Huit",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??abka": {
        "tags": {
            "name": "??abka",
            "shop": "convenience"
        },
        "name": "??abka",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Almacen": {
        "tags": {
            "name": "Almacen",
            "shop": "convenience"
        },
        "name": "Almacen",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Vival": {
        "tags": {
            "name": "Vival",
            "shop": "convenience"
        },
        "name": "Vival",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/FamilyMart": {
        "tags": {
            "name": "FamilyMart",
            "shop": "convenience"
        },
        "name": "FamilyMart",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????????????": {
        "tags": {
            "name": "????????????????????????",
            "name:en": "FamilyMart",
            "shop": "convenience"
        },
        "name": "????????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Sunkus": {
        "tags": {
            "name": "Sunkus",
            "shop": "convenience"
        },
        "name": "Sunkus",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????(Seven-Eleven)": {
        "tags": {
            "name": "?????????????????????(Seven-Eleven)",
            "shop": "convenience"
        },
        "name": "?????????????????????(Seven-Eleven)",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Jednota": {
        "tags": {
            "name": "Jednota",
            "shop": "convenience"
        },
        "name": "Jednota",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Sklep spo??ywczy": {
        "tags": {
            "name": "Sklep spo??ywczy",
            "shop": "convenience"
        },
        "name": "Sklep spo??ywczy",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Centra": {
        "tags": {
            "name": "Centra",
            "shop": "convenience"
        },
        "name": "Centra",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????K": {
        "tags": {
            "name": "????????????K",
            "name:en": "Circle K",
            "shop": "convenience"
        },
        "name": "????????????K",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Wawa": {
        "tags": {
            "name": "Wawa",
            "shop": "convenience"
        },
        "name": "Wawa",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Proxi": {
        "tags": {
            "name": "Proxi",
            "shop": "convenience"
        },
        "name": "Proxi",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Groszek": {
        "tags": {
            "name": "Groszek",
            "shop": "convenience"
        },
        "name": "Groszek",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Select": {
        "tags": {
            "name": "Select",
            "shop": "convenience"
        },
        "name": "Select",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Ve??erka": {
        "tags": {
            "name": "Ve??erka",
            "shop": "convenience"
        },
        "name": "Ve??erka",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Potraviny": {
        "tags": {
            "name": "Potraviny",
            "shop": "convenience"
        },
        "name": "Potraviny",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????": {
        "tags": {
            "name": "????????",
            "shop": "convenience"
        },
        "name": "????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "convenience"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Spo??em": {
        "tags": {
            "name": "Spo??em",
            "shop": "convenience"
        },
        "name": "Spo??em",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Cumberland Farms": {
        "tags": {
            "name": "Cumberland Farms",
            "shop": "convenience"
        },
        "name": "Cumberland Farms",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Tesco Lotus Express": {
        "tags": {
            "name": "Tesco Lotus Express",
            "shop": "convenience"
        },
        "name": "Tesco Lotus Express",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Kiosk": {
        "tags": {
            "name": "Kiosk",
            "shop": "convenience"
        },
        "name": "Kiosk",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/24 ????????": {
        "tags": {
            "name": "24 ????????",
            "shop": "convenience"
        },
        "name": "24 ????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "convenience"
        },
        "name": "????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Oxxo": {
        "tags": {
            "name": "Oxxo",
            "shop": "convenience"
        },
        "name": "Oxxo",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/abc": {
        "tags": {
            "name": "abc",
            "shop": "convenience"
        },
        "name": "abc",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/7/11": {
        "tags": {
            "name": "7/11",
            "shop": "convenience"
        },
        "name": "7/11",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Stewart's": {
        "tags": {
            "name": "Stewart's",
            "shop": "convenience"
        },
        "name": "Stewart's",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "convenience"
        },
        "name": "????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????100 (LAWSON STORE 100)": {
        "tags": {
            "name": "?????????????????????100 (LAWSON STORE 100)",
            "shop": "convenience"
        },
        "name": "?????????????????????100 (LAWSON STORE 100)",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "convenience"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????100": {
        "tags": {
            "name": "?????????????????????100",
            "shop": "convenience"
        },
        "name": "?????????????????????100",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????????????????????????????": {
        "tags": {
            "name": "?????????????????????????????????????????????",
            "shop": "convenience"
        },
        "name": "?????????????????????????????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Spo??ywczy": {
        "tags": {
            "name": "Spo??ywczy",
            "shop": "convenience"
        },
        "name": "Spo??ywczy",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Picard": {
        "tags": {
            "name": "Picard",
            "shop": "convenience"
        },
        "name": "Picard",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Four Square": {
        "tags": {
            "name": "Four Square",
            "shop": "convenience"
        },
        "name": "Four Square",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "convenience"
        },
        "name": "??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Dollar General": {
        "tags": {
            "name": "Dollar General",
            "shop": "convenience"
        },
        "name": "Dollar General",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Studenac": {
        "tags": {
            "name": "Studenac",
            "shop": "convenience"
        },
        "name": "Studenac",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Central Convenience Store": {
        "tags": {
            "name": "Central Convenience Store",
            "shop": "convenience"
        },
        "name": "Central Convenience Store",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "convenience"
        },
        "name": "????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????": {
        "tags": {
            "name": "??????",
            "shop": "convenience"
        },
        "name": "??????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "convenience"
        },
        "name": "??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Epicerie": {
        "tags": {
            "name": "Epicerie",
            "shop": "convenience"
        },
        "name": "Epicerie",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Food Mart": {
        "tags": {
            "name": "Food Mart",
            "shop": "convenience"
        },
        "name": "Food Mart",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Delikatesy": {
        "tags": {
            "name": "Delikatesy",
            "shop": "convenience"
        },
        "name": "Delikatesy",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????": {
        "tags": {
            "name": "?????????",
            "shop": "convenience"
        },
        "name": "?????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Lewiatan": {
        "tags": {
            "name": "Lewiatan",
            "shop": "convenience"
        },
        "name": "Lewiatan",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/?????????????????????? ??????????????": {
        "tags": {
            "name": "?????????????????????? ??????????????",
            "shop": "convenience"
        },
        "name": "?????????????????????? ??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????????? (Seicomart)": {
        "tags": {
            "name": "????????????????????? (Seicomart)",
            "shop": "convenience"
        },
        "name": "????????????????????? (Seicomart)",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "convenience"
        },
        "name": "????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "convenience"
        },
        "name": "??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Mini Market Non-Stop": {
        "tags": {
            "name": "Mini Market Non-Stop",
            "shop": "convenience"
        },
        "name": "Mini Market Non-Stop",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "convenience"
        },
        "name": "????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Royal Farms": {
        "tags": {
            "name": "Royal Farms",
            "shop": "convenience"
        },
        "name": "Royal Farms",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Alfamart": {
        "tags": {
            "name": "Alfamart",
            "shop": "convenience"
        },
        "name": "Alfamart",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Indomaret": {
        "tags": {
            "name": "Indomaret",
            "shop": "convenience"
        },
        "name": "Indomaret",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "convenience"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "convenience"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Boutique": {
        "tags": {
            "name": "Boutique",
            "shop": "convenience"
        },
        "name": "Boutique",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/????????????????????? (Market)": {
        "tags": {
            "name": "????????????????????? (Market)",
            "shop": "convenience"
        },
        "name": "????????????????????? (Market)",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/convenience/Stores": {
        "tags": {
            "name": "Stores",
            "shop": "convenience"
        },
        "name": "Stores",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/dm": {
        "tags": {
            "name": "dm",
            "shop": "chemist"
        },
        "name": "dm",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/M??ller": {
        "tags": {
            "name": "M??ller",
            "shop": "chemist"
        },
        "name": "M??ller",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Schlecker": {
        "tags": {
            "name": "Schlecker",
            "shop": "chemist"
        },
        "name": "Schlecker",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Etos": {
        "tags": {
            "name": "Etos",
            "shop": "chemist"
        },
        "name": "Etos",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Bipa": {
        "tags": {
            "name": "Bipa",
            "shop": "chemist"
        },
        "name": "Bipa",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Rossmann": {
        "tags": {
            "name": "Rossmann",
            "shop": "chemist"
        },
        "name": "Rossmann",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/DM Drogeriemarkt": {
        "tags": {
            "name": "DM Drogeriemarkt",
            "shop": "chemist"
        },
        "name": "DM Drogeriemarkt",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Ihr Platz": {
        "tags": {
            "name": "Ihr Platz",
            "shop": "chemist"
        },
        "name": "Ihr Platz",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Douglas": {
        "tags": {
            "name": "Douglas",
            "shop": "chemist"
        },
        "name": "Douglas",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/chemist/Kruidvat": {
        "tags": {
            "name": "Kruidvat",
            "shop": "chemist"
        },
        "name": "Kruidvat",
        "icon": "chemist",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Kwik Fit": {
        "tags": {
            "name": "Kwik Fit",
            "shop": "car_repair"
        },
        "name": "Kwik Fit",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/ATU": {
        "tags": {
            "name": "ATU",
            "shop": "car_repair"
        },
        "name": "ATU",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Kwik-Fit": {
        "tags": {
            "name": "Kwik-Fit",
            "shop": "car_repair"
        },
        "name": "Kwik-Fit",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Midas": {
        "tags": {
            "name": "Midas",
            "shop": "car_repair"
        },
        "name": "Midas",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Feu Vert": {
        "tags": {
            "name": "Feu Vert",
            "shop": "car_repair"
        },
        "name": "Feu Vert",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Norauto": {
        "tags": {
            "name": "Norauto",
            "shop": "car_repair"
        },
        "name": "Norauto",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Speedy": {
        "tags": {
            "name": "Speedy",
            "shop": "car_repair"
        },
        "name": "Speedy",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Pit Stop": {
        "tags": {
            "name": "Pit Stop",
            "shop": "car_repair"
        },
        "name": "Pit Stop",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Jiffy Lube": {
        "tags": {
            "name": "Jiffy Lube",
            "shop": "car_repair"
        },
        "name": "Jiffy Lube",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "car_repair"
        },
        "name": "????????????????????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/??????": {
        "tags": {
            "name": "??????",
            "shop": "car_repair"
        },
        "name": "??????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/O'Reilly Auto Parts": {
        "tags": {
            "name": "O'Reilly Auto Parts",
            "shop": "car_repair"
        },
        "name": "O'Reilly Auto Parts",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Carglass": {
        "tags": {
            "name": "Carglass",
            "shop": "car_repair"
        },
        "name": "Carglass",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "car_repair"
        },
        "name": "????????????????????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Euromaster": {
        "tags": {
            "name": "Euromaster",
            "shop": "car_repair"
        },
        "name": "Euromaster",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Firestone": {
        "tags": {
            "name": "Firestone",
            "shop": "car_repair"
        },
        "name": "Firestone",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/AutoZone": {
        "tags": {
            "name": "AutoZone",
            "shop": "car_repair"
        },
        "name": "AutoZone",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "car_repair"
        },
        "name": "????????????????????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Advance Auto Parts": {
        "tags": {
            "name": "Advance Auto Parts",
            "shop": "car_repair"
        },
        "name": "Advance Auto Parts",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car_repair/Roady": {
        "tags": {
            "name": "Roady",
            "shop": "car_repair"
        },
        "name": "Roady",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/IKEA": {
        "tags": {
            "name": "IKEA",
            "shop": "furniture"
        },
        "name": "IKEA",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/Jysk": {
        "tags": {
            "name": "Jysk",
            "shop": "furniture"
        },
        "name": "Jysk",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/Roller": {
        "tags": {
            "name": "Roller",
            "shop": "furniture"
        },
        "name": "Roller",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/D??nisches Bettenlager": {
        "tags": {
            "name": "D??nisches Bettenlager",
            "shop": "furniture"
        },
        "name": "D??nisches Bettenlager",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/Conforama": {
        "tags": {
            "name": "Conforama",
            "shop": "furniture"
        },
        "name": "Conforama",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/Matratzen Concord": {
        "tags": {
            "name": "Matratzen Concord",
            "shop": "furniture"
        },
        "name": "Matratzen Concord",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "furniture"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/furniture/But": {
        "tags": {
            "name": "But",
            "shop": "furniture"
        },
        "name": "But",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Hornbach": {
        "tags": {
            "name": "Hornbach",
            "shop": "doityourself"
        },
        "name": "Hornbach",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/B&Q": {
        "tags": {
            "name": "B&Q",
            "shop": "doityourself"
        },
        "name": "B&Q",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Hubo": {
        "tags": {
            "name": "Hubo",
            "shop": "doityourself"
        },
        "name": "Hubo",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Mr Bricolage": {
        "tags": {
            "name": "Mr Bricolage",
            "shop": "doityourself"
        },
        "name": "Mr Bricolage",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Gamma": {
        "tags": {
            "name": "Gamma",
            "shop": "doityourself"
        },
        "name": "Gamma",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/OBI": {
        "tags": {
            "name": "OBI",
            "shop": "doityourself"
        },
        "name": "OBI",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Lowes": {
        "tags": {
            "name": "Lowes",
            "shop": "doityourself"
        },
        "name": "Lowes",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Wickes": {
        "tags": {
            "name": "Wickes",
            "shop": "doityourself"
        },
        "name": "Wickes",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Hagebau": {
        "tags": {
            "name": "Hagebau",
            "shop": "doityourself"
        },
        "name": "Hagebau",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Max Bahr": {
        "tags": {
            "name": "Max Bahr",
            "shop": "doityourself"
        },
        "name": "Max Bahr",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Castorama": {
        "tags": {
            "name": "Castorama",
            "shop": "doityourself"
        },
        "name": "Castorama",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Rona": {
        "tags": {
            "name": "Rona",
            "shop": "doityourself"
        },
        "name": "Rona",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Home Depot": {
        "tags": {
            "name": "Home Depot",
            "shop": "doityourself"
        },
        "name": "Home Depot",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Toom Baumarkt": {
        "tags": {
            "name": "Toom Baumarkt",
            "shop": "doityourself"
        },
        "name": "Toom Baumarkt",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Homebase": {
        "tags": {
            "name": "Homebase",
            "shop": "doityourself"
        },
        "name": "Homebase",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Baumax": {
        "tags": {
            "name": "Baumax",
            "shop": "doityourself"
        },
        "name": "Baumax",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Lagerhaus": {
        "tags": {
            "name": "Lagerhaus",
            "shop": "doityourself"
        },
        "name": "Lagerhaus",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Bauhaus": {
        "tags": {
            "name": "Bauhaus",
            "shop": "doityourself"
        },
        "name": "Bauhaus",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Canadian Tire": {
        "tags": {
            "name": "Canadian Tire",
            "shop": "doityourself"
        },
        "name": "Canadian Tire",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Leroy Merlin": {
        "tags": {
            "name": "Leroy Merlin",
            "shop": "doityourself"
        },
        "name": "Leroy Merlin",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Hellweg": {
        "tags": {
            "name": "Hellweg",
            "shop": "doityourself"
        },
        "name": "Hellweg",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Brico": {
        "tags": {
            "name": "Brico",
            "shop": "doityourself"
        },
        "name": "Brico",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Bricomarch??": {
        "tags": {
            "name": "Bricomarch??",
            "shop": "doityourself"
        },
        "name": "Bricomarch??",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Toom": {
        "tags": {
            "name": "Toom",
            "shop": "doityourself"
        },
        "name": "Toom",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Hagebaumarkt": {
        "tags": {
            "name": "Hagebaumarkt",
            "shop": "doityourself"
        },
        "name": "Hagebaumarkt",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Praktiker": {
        "tags": {
            "name": "Praktiker",
            "shop": "doityourself"
        },
        "name": "Praktiker",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Menards": {
        "tags": {
            "name": "Menards",
            "shop": "doityourself"
        },
        "name": "Menards",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Weldom": {
        "tags": {
            "name": "Weldom",
            "shop": "doityourself"
        },
        "name": "Weldom",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Bunnings Warehouse": {
        "tags": {
            "name": "Bunnings Warehouse",
            "shop": "doityourself"
        },
        "name": "Bunnings Warehouse",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Ace Hardware": {
        "tags": {
            "name": "Ace Hardware",
            "shop": "doityourself"
        },
        "name": "Ace Hardware",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Home Hardware": {
        "tags": {
            "name": "Home Hardware",
            "shop": "doityourself"
        },
        "name": "Home Hardware",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/????????????????????????????": {
        "tags": {
            "name": "????????????????????????????",
            "shop": "doityourself"
        },
        "name": "????????????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Bricorama": {
        "tags": {
            "name": "Bricorama",
            "shop": "doityourself"
        },
        "name": "Bricorama",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/doityourself/Point P": {
        "tags": {
            "name": "Point P",
            "shop": "doityourself"
        },
        "name": "Point P",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/stationery/Staples": {
        "tags": {
            "name": "Staples",
            "shop": "stationery"
        },
        "name": "Staples",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/stationery/McPaper": {
        "tags": {
            "name": "McPaper",
            "shop": "stationery"
        },
        "name": "McPaper",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/stationery/Office Depot": {
        "tags": {
            "name": "Office Depot",
            "shop": "stationery"
        },
        "name": "Office Depot",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/stationery/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "stationery"
        },
        "name": "????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Skoda": {
        "tags": {
            "name": "Skoda",
            "shop": "car"
        },
        "name": "Skoda",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/BMW": {
        "tags": {
            "name": "BMW",
            "shop": "car"
        },
        "name": "BMW",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Citroen": {
        "tags": {
            "name": "Citroen",
            "shop": "car"
        },
        "name": "Citroen",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Renault": {
        "tags": {
            "name": "Renault",
            "shop": "car"
        },
        "name": "Renault",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Mercedes-Benz": {
        "tags": {
            "name": "Mercedes-Benz",
            "shop": "car"
        },
        "name": "Mercedes-Benz",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Volvo": {
        "tags": {
            "name": "Volvo",
            "shop": "car"
        },
        "name": "Volvo",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Ford": {
        "tags": {
            "name": "Ford",
            "shop": "car"
        },
        "name": "Ford",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Volkswagen": {
        "tags": {
            "name": "Volkswagen",
            "shop": "car"
        },
        "name": "Volkswagen",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Mazda": {
        "tags": {
            "name": "Mazda",
            "shop": "car"
        },
        "name": "Mazda",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Mitsubishi": {
        "tags": {
            "name": "Mitsubishi",
            "shop": "car"
        },
        "name": "Mitsubishi",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Fiat": {
        "tags": {
            "name": "Fiat",
            "shop": "car"
        },
        "name": "Fiat",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/????????????????????????": {
        "tags": {
            "name": "????????????????????????",
            "shop": "car"
        },
        "name": "????????????????????????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Opel": {
        "tags": {
            "name": "Opel",
            "shop": "car"
        },
        "name": "Opel",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Audi": {
        "tags": {
            "name": "Audi",
            "shop": "car"
        },
        "name": "Audi",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Toyota": {
        "tags": {
            "name": "Toyota",
            "shop": "car"
        },
        "name": "Toyota",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Nissan": {
        "tags": {
            "name": "Nissan",
            "shop": "car"
        },
        "name": "Nissan",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Suzuki": {
        "tags": {
            "name": "Suzuki",
            "shop": "car"
        },
        "name": "Suzuki",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Honda": {
        "tags": {
            "name": "Honda",
            "shop": "car"
        },
        "name": "Honda",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Peugeot": {
        "tags": {
            "name": "Peugeot",
            "shop": "car"
        },
        "name": "Peugeot",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Hyundai": {
        "tags": {
            "name": "Hyundai",
            "shop": "car"
        },
        "name": "Hyundai",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Subaru": {
        "tags": {
            "name": "Subaru",
            "shop": "car"
        },
        "name": "Subaru",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/Chevrolet": {
        "tags": {
            "name": "Chevrolet",
            "shop": "car"
        },
        "name": "Chevrolet",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/car/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "shop": "car"
        },
        "name": "??????????????????????",
        "icon": "car",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Matalan": {
        "tags": {
            "name": "Matalan",
            "shop": "clothes"
        },
        "name": "Matalan",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/KiK": {
        "tags": {
            "name": "KiK",
            "shop": "clothes"
        },
        "name": "KiK",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/H&M": {
        "tags": {
            "name": "H&M",
            "shop": "clothes"
        },
        "name": "H&M",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Urban Outfitters": {
        "tags": {
            "name": "Urban Outfitters",
            "shop": "clothes"
        },
        "name": "Urban Outfitters",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/V??gele": {
        "tags": {
            "name": "V??gele",
            "shop": "clothes"
        },
        "name": "V??gele",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Zeeman": {
        "tags": {
            "name": "Zeeman",
            "shop": "clothes"
        },
        "name": "Zeeman",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Takko": {
        "tags": {
            "name": "Takko",
            "shop": "clothes"
        },
        "name": "Takko",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/C&A": {
        "tags": {
            "name": "C&A",
            "shop": "clothes"
        },
        "name": "C&A",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Zara": {
        "tags": {
            "name": "Zara",
            "shop": "clothes"
        },
        "name": "Zara",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Vero Moda": {
        "tags": {
            "name": "Vero Moda",
            "shop": "clothes"
        },
        "name": "Vero Moda",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/NKD": {
        "tags": {
            "name": "NKD",
            "shop": "clothes"
        },
        "name": "NKD",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Ernsting's family": {
        "tags": {
            "name": "Ernsting's family",
            "shop": "clothes"
        },
        "name": "Ernsting's family",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Winners": {
        "tags": {
            "name": "Winners",
            "shop": "clothes"
        },
        "name": "Winners",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/River Island": {
        "tags": {
            "name": "River Island",
            "shop": "clothes"
        },
        "name": "River Island",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Next": {
        "tags": {
            "name": "Next",
            "shop": "clothes"
        },
        "name": "Next",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Gap": {
        "tags": {
            "name": "Gap",
            "shop": "clothes"
        },
        "name": "Gap",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Adidas": {
        "tags": {
            "name": "Adidas",
            "shop": "clothes"
        },
        "name": "Adidas",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Mr Price": {
        "tags": {
            "name": "Mr Price",
            "shop": "clothes"
        },
        "name": "Mr Price",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Pep": {
        "tags": {
            "name": "Pep",
            "shop": "clothes"
        },
        "name": "Pep",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Edgars": {
        "tags": {
            "name": "Edgars",
            "shop": "clothes"
        },
        "name": "Edgars",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Ackermans": {
        "tags": {
            "name": "Ackermans",
            "shop": "clothes"
        },
        "name": "Ackermans",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Truworths": {
        "tags": {
            "name": "Truworths",
            "shop": "clothes"
        },
        "name": "Truworths",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Ross": {
        "tags": {
            "name": "Ross",
            "shop": "clothes"
        },
        "name": "Ross",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Burton": {
        "tags": {
            "name": "Burton",
            "shop": "clothes"
        },
        "name": "Burton",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Dorothy Perkins": {
        "tags": {
            "name": "Dorothy Perkins",
            "shop": "clothes"
        },
        "name": "Dorothy Perkins",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Lindex": {
        "tags": {
            "name": "Lindex",
            "shop": "clothes"
        },
        "name": "Lindex",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/s.Oliver": {
        "tags": {
            "name": "s.Oliver",
            "shop": "clothes"
        },
        "name": "s.Oliver",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Cecil": {
        "tags": {
            "name": "Cecil",
            "shop": "clothes"
        },
        "name": "Cecil",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Dress Barn": {
        "tags": {
            "name": "Dress Barn",
            "shop": "clothes"
        },
        "name": "Dress Barn",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Old Navy": {
        "tags": {
            "name": "Old Navy",
            "shop": "clothes"
        },
        "name": "Old Navy",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Jack & Jones": {
        "tags": {
            "name": "Jack & Jones",
            "shop": "clothes"
        },
        "name": "Jack & Jones",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Pimkie": {
        "tags": {
            "name": "Pimkie",
            "shop": "clothes"
        },
        "name": "Pimkie",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Esprit": {
        "tags": {
            "name": "Esprit",
            "shop": "clothes"
        },
        "name": "Esprit",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Primark": {
        "tags": {
            "name": "Primark",
            "shop": "clothes"
        },
        "name": "Primark",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Bonita": {
        "tags": {
            "name": "Bonita",
            "shop": "clothes"
        },
        "name": "Bonita",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Mexx": {
        "tags": {
            "name": "Mexx",
            "shop": "clothes"
        },
        "name": "Mexx",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Gerry Weber": {
        "tags": {
            "name": "Gerry Weber",
            "shop": "clothes"
        },
        "name": "Gerry Weber",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Tally Weijl": {
        "tags": {
            "name": "Tally Weijl",
            "shop": "clothes"
        },
        "name": "Tally Weijl",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Mango": {
        "tags": {
            "name": "Mango",
            "shop": "clothes"
        },
        "name": "Mango",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/TK Maxx": {
        "tags": {
            "name": "TK Maxx",
            "shop": "clothes"
        },
        "name": "TK Maxx",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Benetton": {
        "tags": {
            "name": "Benetton",
            "shop": "clothes"
        },
        "name": "Benetton",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Ulla Popken": {
        "tags": {
            "name": "Ulla Popken",
            "shop": "clothes"
        },
        "name": "Ulla Popken",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/AWG": {
        "tags": {
            "name": "AWG",
            "shop": "clothes"
        },
        "name": "AWG",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Tommy Hilfiger": {
        "tags": {
            "name": "Tommy Hilfiger",
            "shop": "clothes"
        },
        "name": "Tommy Hilfiger",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/New Yorker": {
        "tags": {
            "name": "New Yorker",
            "shop": "clothes"
        },
        "name": "New Yorker",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Orsay": {
        "tags": {
            "name": "Orsay",
            "shop": "clothes"
        },
        "name": "Orsay",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Jeans Fritz": {
        "tags": {
            "name": "Jeans Fritz",
            "shop": "clothes"
        },
        "name": "Jeans Fritz",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Charles V??gele": {
        "tags": {
            "name": "Charles V??gele",
            "shop": "clothes"
        },
        "name": "Charles V??gele",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/New Look": {
        "tags": {
            "name": "New Look",
            "shop": "clothes"
        },
        "name": "New Look",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Lacoste": {
        "tags": {
            "name": "Lacoste",
            "shop": "clothes"
        },
        "name": "Lacoste",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Etam": {
        "tags": {
            "name": "Etam",
            "shop": "clothes"
        },
        "name": "Etam",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Kiabi": {
        "tags": {
            "name": "Kiabi",
            "shop": "clothes"
        },
        "name": "Kiabi",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Jack Wolfskin": {
        "tags": {
            "name": "Jack Wolfskin",
            "shop": "clothes"
        },
        "name": "Jack Wolfskin",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/American Apparel": {
        "tags": {
            "name": "American Apparel",
            "shop": "clothes"
        },
        "name": "American Apparel",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Men's Wearhouse": {
        "tags": {
            "name": "Men's Wearhouse",
            "shop": "clothes"
        },
        "name": "Men's Wearhouse",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Intimissimi": {
        "tags": {
            "name": "Intimissimi",
            "shop": "clothes"
        },
        "name": "Intimissimi",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/United Colors of Benetton": {
        "tags": {
            "name": "United Colors of Benetton",
            "shop": "clothes"
        },
        "name": "United Colors of Benetton",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Jules": {
        "tags": {
            "name": "Jules",
            "shop": "clothes"
        },
        "name": "Jules",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Second Hand": {
        "tags": {
            "name": "Second Hand",
            "shop": "clothes"
        },
        "name": "Second Hand",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/AOKI": {
        "tags": {
            "name": "AOKI",
            "shop": "clothes"
        },
        "name": "AOKI",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Calzedonia": {
        "tags": {
            "name": "Calzedonia",
            "shop": "clothes"
        },
        "name": "Calzedonia",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/???????????????": {
        "tags": {
            "name": "???????????????",
            "shop": "clothes"
        },
        "name": "???????????????",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Levi's": {
        "tags": {
            "name": "Levi's",
            "shop": "clothes"
        },
        "name": "Levi's",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Celio": {
        "tags": {
            "name": "Celio",
            "shop": "clothes"
        },
        "name": "Celio",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/TJ Maxx": {
        "tags": {
            "name": "TJ Maxx",
            "shop": "clothes"
        },
        "name": "TJ Maxx",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Promod": {
        "tags": {
            "name": "Promod",
            "shop": "clothes"
        },
        "name": "Promod",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Street One": {
        "tags": {
            "name": "Street One",
            "shop": "clothes"
        },
        "name": "Street One",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "clothes"
        },
        "name": "????????????",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Banana Republic": {
        "tags": {
            "name": "Banana Republic",
            "shop": "clothes"
        },
        "name": "Banana Republic",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "clothes"
        },
        "name": "????????????",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Marshalls": {
        "tags": {
            "name": "Marshalls",
            "shop": "clothes"
        },
        "name": "Marshalls",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/La Halle": {
        "tags": {
            "name": "La Halle",
            "shop": "clothes"
        },
        "name": "La Halle",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/Peacocks": {
        "tags": {
            "name": "Peacocks",
            "shop": "clothes"
        },
        "name": "Peacocks",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/clothes/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "clothes"
        },
        "name": "????????????",
        "icon": "clothing-store",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Bruna": {
        "tags": {
            "name": "Bruna",
            "shop": "books"
        },
        "name": "Bruna",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Waterstones": {
        "tags": {
            "name": "Waterstones",
            "shop": "books"
        },
        "name": "Waterstones",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Libro": {
        "tags": {
            "name": "Libro",
            "shop": "books"
        },
        "name": "Libro",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Barnes & Noble": {
        "tags": {
            "name": "Barnes & Noble",
            "shop": "books"
        },
        "name": "Barnes & Noble",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Weltbild": {
        "tags": {
            "name": "Weltbild",
            "shop": "books"
        },
        "name": "Weltbild",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/Thalia": {
        "tags": {
            "name": "Thalia",
            "shop": "books"
        },
        "name": "Thalia",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/books/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "books"
        },
        "name": "??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Debenhams": {
        "tags": {
            "name": "Debenhams",
            "shop": "department_store"
        },
        "name": "Debenhams",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Karstadt": {
        "tags": {
            "name": "Karstadt",
            "shop": "department_store"
        },
        "name": "Karstadt",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Kmart": {
        "tags": {
            "name": "Kmart",
            "shop": "department_store"
        },
        "name": "Kmart",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Target": {
        "tags": {
            "name": "Target",
            "shop": "department_store"
        },
        "name": "Target",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Galeria Kaufhof": {
        "tags": {
            "name": "Galeria Kaufhof",
            "shop": "department_store"
        },
        "name": "Galeria Kaufhof",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Marks & Spencer": {
        "tags": {
            "name": "Marks & Spencer",
            "shop": "department_store"
        },
        "name": "Marks & Spencer",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Big W": {
        "tags": {
            "name": "Big W",
            "shop": "department_store"
        },
        "name": "Big W",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Woolworth": {
        "tags": {
            "name": "Woolworth",
            "shop": "department_store"
        },
        "name": "Woolworth",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "department_store"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Sears": {
        "tags": {
            "name": "Sears",
            "shop": "department_store"
        },
        "name": "Sears",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Kohl's": {
        "tags": {
            "name": "Kohl's",
            "shop": "department_store"
        },
        "name": "Kohl's",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/Macy's": {
        "tags": {
            "name": "Macy's",
            "shop": "department_store"
        },
        "name": "Macy's",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/department_store/JCPenney": {
        "tags": {
            "name": "JCPenney",
            "shop": "department_store"
        },
        "name": "JCPenney",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Alko": {
        "tags": {
            "name": "Alko",
            "shop": "alcohol"
        },
        "name": "Alko",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/The Beer Store": {
        "tags": {
            "name": "The Beer Store",
            "shop": "alcohol"
        },
        "name": "The Beer Store",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Systembolaget": {
        "tags": {
            "name": "Systembolaget",
            "shop": "alcohol"
        },
        "name": "Systembolaget",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/LCBO": {
        "tags": {
            "name": "LCBO",
            "shop": "alcohol"
        },
        "name": "LCBO",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/?????????????????? ??????": {
        "tags": {
            "name": "?????????????????? ??????",
            "shop": "alcohol"
        },
        "name": "?????????????????? ??????",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Bargain Booze": {
        "tags": {
            "name": "Bargain Booze",
            "shop": "alcohol"
        },
        "name": "Bargain Booze",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Nicolas": {
        "tags": {
            "name": "Nicolas",
            "shop": "alcohol"
        },
        "name": "Nicolas",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/BWS": {
        "tags": {
            "name": "BWS",
            "shop": "alcohol"
        },
        "name": "BWS",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Botilleria": {
        "tags": {
            "name": "Botilleria",
            "shop": "alcohol"
        },
        "name": "Botilleria",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/SAQ": {
        "tags": {
            "name": "SAQ",
            "shop": "alcohol"
        },
        "name": "SAQ",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/Gall & Gall": {
        "tags": {
            "name": "Gall & Gall",
            "shop": "alcohol"
        },
        "name": "Gall & Gall",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/alcohol/?????????? ????????": {
        "tags": {
            "name": "?????????? ????????",
            "shop": "alcohol"
        },
        "name": "?????????? ????????",
        "icon": "alcohol-shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Kamps": {
        "tags": {
            "name": "Kamps",
            "shop": "bakery"
        },
        "name": "Kamps",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Banette": {
        "tags": {
            "name": "Banette",
            "shop": "bakery"
        },
        "name": "Banette",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/B??ckerei Schmidt": {
        "tags": {
            "name": "B??ckerei Schmidt",
            "shop": "bakery"
        },
        "name": "B??ckerei Schmidt",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Anker": {
        "tags": {
            "name": "Anker",
            "shop": "bakery"
        },
        "name": "Anker",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Hofpfisterei": {
        "tags": {
            "name": "Hofpfisterei",
            "shop": "bakery"
        },
        "name": "Hofpfisterei",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Greggs": {
        "tags": {
            "name": "Greggs",
            "shop": "bakery"
        },
        "name": "Greggs",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Oebel": {
        "tags": {
            "name": "Oebel",
            "shop": "bakery"
        },
        "name": "Oebel",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Boulangerie": {
        "tags": {
            "name": "Boulangerie",
            "shop": "bakery"
        },
        "name": "Boulangerie",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Stadtb??ckerei": {
        "tags": {
            "name": "Stadtb??ckerei",
            "shop": "bakery"
        },
        "name": "Stadtb??ckerei",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Steinecke": {
        "tags": {
            "name": "Steinecke",
            "shop": "bakery"
        },
        "name": "Steinecke",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Ihle": {
        "tags": {
            "name": "Ihle",
            "shop": "bakery"
        },
        "name": "Ihle",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Goldilocks": {
        "tags": {
            "name": "Goldilocks",
            "shop": "bakery"
        },
        "name": "Goldilocks",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Dat Backhus": {
        "tags": {
            "name": "Dat Backhus",
            "shop": "bakery"
        },
        "name": "Dat Backhus",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/K&U": {
        "tags": {
            "name": "K&U",
            "shop": "bakery"
        },
        "name": "K&U",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Der Beck": {
        "tags": {
            "name": "Der Beck",
            "shop": "bakery"
        },
        "name": "Der Beck",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Th??rmann": {
        "tags": {
            "name": "Th??rmann",
            "shop": "bakery"
        },
        "name": "Th??rmann",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Backwerk": {
        "tags": {
            "name": "Backwerk",
            "shop": "bakery"
        },
        "name": "Backwerk",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/B??cker": {
        "tags": {
            "name": "B??cker",
            "shop": "bakery"
        },
        "name": "B??cker",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Sch??fer's": {
        "tags": {
            "name": "Sch??fer's",
            "shop": "bakery"
        },
        "name": "Sch??fer's",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Panaderia": {
        "tags": {
            "name": "Panaderia",
            "shop": "bakery"
        },
        "name": "Panaderia",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Goeken backen": {
        "tags": {
            "name": "Goeken backen",
            "shop": "bakery"
        },
        "name": "Goeken backen",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Stadtb??ckerei Junge": {
        "tags": {
            "name": "Stadtb??ckerei Junge",
            "shop": "bakery"
        },
        "name": "Stadtb??ckerei Junge",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Boulangerie Patisserie": {
        "tags": {
            "name": "Boulangerie Patisserie",
            "shop": "bakery"
        },
        "name": "Boulangerie Patisserie",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Paul": {
        "tags": {
            "name": "Paul",
            "shop": "bakery"
        },
        "name": "Paul",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/????????": {
        "tags": {
            "name": "????????",
            "shop": "bakery"
        },
        "name": "????????",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/Piekarnia": {
        "tags": {
            "name": "Piekarnia",
            "shop": "bakery"
        },
        "name": "Piekarnia",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "bakery"
        },
        "name": "??????????????",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/bakery/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "bakery"
        },
        "name": "????????????????",
        "icon": "bakery",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Sports Direct": {
        "tags": {
            "name": "Sports Direct",
            "shop": "sports"
        },
        "name": "Sports Direct",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Decathlon": {
        "tags": {
            "name": "Decathlon",
            "shop": "sports"
        },
        "name": "Decathlon",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Intersport": {
        "tags": {
            "name": "Intersport",
            "shop": "sports"
        },
        "name": "Intersport",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Sports Authority": {
        "tags": {
            "name": "Sports Authority",
            "shop": "sports"
        },
        "name": "Sports Authority",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/??????????????????????": {
        "tags": {
            "name": "??????????????????????",
            "shop": "sports"
        },
        "name": "??????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Sport 2000": {
        "tags": {
            "name": "Sport 2000",
            "shop": "sports"
        },
        "name": "Sport 2000",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/sports/Dick's Sporting Goods": {
        "tags": {
            "name": "Dick's Sporting Goods",
            "shop": "sports"
        },
        "name": "Dick's Sporting Goods",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/variety_store/Tedi": {
        "tags": {
            "name": "Tedi",
            "shop": "variety_store"
        },
        "name": "Tedi",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/variety_store/Dollarama": {
        "tags": {
            "name": "Dollarama",
            "shop": "variety_store"
        },
        "name": "Dollarama",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/variety_store/Family Dollar": {
        "tags": {
            "name": "Family Dollar",
            "shop": "variety_store"
        },
        "name": "Family Dollar",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/variety_store/Dollar Tree": {
        "tags": {
            "name": "Dollar Tree",
            "shop": "variety_store"
        },
        "name": "Dollar Tree",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/Fressnapf": {
        "tags": {
            "name": "Fressnapf",
            "shop": "pet"
        },
        "name": "Fressnapf",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/PetSmart": {
        "tags": {
            "name": "PetSmart",
            "shop": "pet"
        },
        "name": "PetSmart",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/Das Futterhaus": {
        "tags": {
            "name": "Das Futterhaus",
            "shop": "pet"
        },
        "name": "Das Futterhaus",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/Pets at Home": {
        "tags": {
            "name": "Pets at Home",
            "shop": "pet"
        },
        "name": "Pets at Home",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/Petco": {
        "tags": {
            "name": "Petco",
            "shop": "pet"
        },
        "name": "Petco",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/pet/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "pet"
        },
        "name": "????????????????????",
        "icon": "dog-park",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Deichmann": {
        "tags": {
            "name": "Deichmann",
            "shop": "shoes"
        },
        "name": "Deichmann",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Reno": {
        "tags": {
            "name": "Reno",
            "shop": "shoes"
        },
        "name": "Reno",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Ecco": {
        "tags": {
            "name": "Ecco",
            "shop": "shoes"
        },
        "name": "Ecco",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Clarks": {
        "tags": {
            "name": "Clarks",
            "shop": "shoes"
        },
        "name": "Clarks",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/La Halle aux Chaussures": {
        "tags": {
            "name": "La Halle aux Chaussures",
            "shop": "shoes"
        },
        "name": "La Halle aux Chaussures",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Brantano": {
        "tags": {
            "name": "Brantano",
            "shop": "shoes"
        },
        "name": "Brantano",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Geox": {
        "tags": {
            "name": "Geox",
            "shop": "shoes"
        },
        "name": "Geox",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Salamander": {
        "tags": {
            "name": "Salamander",
            "shop": "shoes"
        },
        "name": "Salamander",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "shoes"
        },
        "name": "??????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Payless Shoe Source": {
        "tags": {
            "name": "Payless Shoe Source",
            "shop": "shoes"
        },
        "name": "Payless Shoe Source",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Famous Footwear": {
        "tags": {
            "name": "Famous Footwear",
            "shop": "shoes"
        },
        "name": "Famous Footwear",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Quick Schuh": {
        "tags": {
            "name": "Quick Schuh",
            "shop": "shoes"
        },
        "name": "Quick Schuh",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Shoe Zone": {
        "tags": {
            "name": "Shoe Zone",
            "shop": "shoes"
        },
        "name": "Shoe Zone",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Foot Locker": {
        "tags": {
            "name": "Foot Locker",
            "shop": "shoes"
        },
        "name": "Foot Locker",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/Bata": {
        "tags": {
            "name": "Bata",
            "shop": "shoes"
        },
        "name": "Bata",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/shoes/????????????????????": {
        "tags": {
            "name": "????????????????????",
            "shop": "shoes"
        },
        "name": "????????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/toys/La Grande R??cr??": {
        "tags": {
            "name": "La Grande R??cr??",
            "shop": "toys"
        },
        "name": "La Grande R??cr??",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/toys/Toys R Us": {
        "tags": {
            "name": "Toys R Us",
            "shop": "toys"
        },
        "name": "Toys R Us",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/toys/Intertoys": {
        "tags": {
            "name": "Intertoys",
            "shop": "toys"
        },
        "name": "Intertoys",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/toys/?????????????? ??????": {
        "tags": {
            "name": "?????????????? ??????",
            "shop": "toys"
        },
        "name": "?????????????? ??????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/toys/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "toys"
        },
        "name": "??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/travel_agency/Flight Centre": {
        "tags": {
            "name": "Flight Centre",
            "shop": "travel_agency"
        },
        "name": "Flight Centre",
        "icon": "suitcase",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/travel_agency/Thomas Cook": {
        "tags": {
            "name": "Thomas Cook",
            "shop": "travel_agency"
        },
        "name": "Thomas Cook",
        "icon": "suitcase",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/jewelry/Bijou Brigitte": {
        "tags": {
            "name": "Bijou Brigitte",
            "shop": "jewelry"
        },
        "name": "Bijou Brigitte",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/jewelry/Christ": {
        "tags": {
            "name": "Christ",
            "shop": "jewelry"
        },
        "name": "Christ",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/jewelry/Swarovski": {
        "tags": {
            "name": "Swarovski",
            "shop": "jewelry"
        },
        "name": "Swarovski",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Fielmann": {
        "tags": {
            "name": "Fielmann",
            "shop": "optician"
        },
        "name": "Fielmann",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Apollo Optik": {
        "tags": {
            "name": "Apollo Optik",
            "shop": "optician"
        },
        "name": "Apollo Optik",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Vision Express": {
        "tags": {
            "name": "Vision Express",
            "shop": "optician"
        },
        "name": "Vision Express",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "optician"
        },
        "name": "????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Optic 2000": {
        "tags": {
            "name": "Optic 2000",
            "shop": "optician"
        },
        "name": "Optic 2000",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Alain Afflelou": {
        "tags": {
            "name": "Alain Afflelou",
            "shop": "optician"
        },
        "name": "Alain Afflelou",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Specsavers": {
        "tags": {
            "name": "Specsavers",
            "shop": "optician"
        },
        "name": "Specsavers",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Krys": {
        "tags": {
            "name": "Krys",
            "shop": "optician"
        },
        "name": "Krys",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/optician/Atol": {
        "tags": {
            "name": "Atol",
            "shop": "optician"
        },
        "name": "Atol",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/video/Blockbuster": {
        "tags": {
            "name": "Blockbuster",
            "shop": "video"
        },
        "name": "Blockbuster",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/video/World of Video": {
        "tags": {
            "name": "World of Video",
            "shop": "video"
        },
        "name": "World of Video",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/????????????": {
        "tags": {
            "name": "????????????",
            "shop": "mobile_phone"
        },
        "name": "????????????",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/?????????????????????????????? (SoftBank shop)": {
        "tags": {
            "name": "?????????????????????????????? (SoftBank shop)",
            "shop": "mobile_phone"
        },
        "name": "?????????????????????????????? (SoftBank shop)",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Vodafone": {
        "tags": {
            "name": "Vodafone",
            "shop": "mobile_phone"
        },
        "name": "Vodafone",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/O2": {
        "tags": {
            "name": "O2",
            "shop": "mobile_phone"
        },
        "name": "O2",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Carphone Warehouse": {
        "tags": {
            "name": "Carphone Warehouse",
            "shop": "mobile_phone"
        },
        "name": "Carphone Warehouse",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Orange": {
        "tags": {
            "name": "Orange",
            "shop": "mobile_phone"
        },
        "name": "Orange",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Verizon Wireless": {
        "tags": {
            "name": "Verizon Wireless",
            "shop": "mobile_phone"
        },
        "name": "Verizon Wireless",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Sprint": {
        "tags": {
            "name": "Sprint",
            "shop": "mobile_phone"
        },
        "name": "Sprint",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/T-Mobile": {
        "tags": {
            "name": "T-Mobile",
            "shop": "mobile_phone"
        },
        "name": "T-Mobile",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/??????": {
        "tags": {
            "name": "??????",
            "shop": "mobile_phone"
        },
        "name": "??????",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/????????????????": {
        "tags": {
            "name": "????????????????",
            "shop": "mobile_phone"
        },
        "name": "????????????????",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Bell": {
        "tags": {
            "name": "Bell",
            "shop": "mobile_phone"
        },
        "name": "Bell",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/The Phone House": {
        "tags": {
            "name": "The Phone House",
            "shop": "mobile_phone"
        },
        "name": "The Phone House",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/SFR": {
        "tags": {
            "name": "SFR",
            "shop": "mobile_phone"
        },
        "name": "SFR",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "mobile_phone"
        },
        "name": "??????????????",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/??????????????": {
        "tags": {
            "name": "??????????????",
            "shop": "mobile_phone"
        },
        "name": "??????????????",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/AT&T": {
        "tags": {
            "name": "AT&T",
            "shop": "mobile_phone"
        },
        "name": "AT&T",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/????????????????????? (docomo shop)": {
        "tags": {
            "name": "????????????????????? (docomo shop)",
            "shop": "mobile_phone"
        },
        "name": "????????????????????? (docomo shop)",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/au": {
        "tags": {
            "name": "au",
            "shop": "mobile_phone"
        },
        "name": "au",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Movistar": {
        "tags": {
            "name": "Movistar",
            "shop": "mobile_phone"
        },
        "name": "Movistar",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/mobile_phone/Bit??": {
        "tags": {
            "name": "Bit??",
            "shop": "mobile_phone"
        },
        "name": "Bit??",
        "icon": "mobilephone",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/computer/PC World": {
        "tags": {
            "name": "PC World",
            "shop": "computer"
        },
        "name": "PC World",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/computer/DNS": {
        "tags": {
            "name": "DNS",
            "shop": "computer"
        },
        "name": "DNS",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Klier": {
        "tags": {
            "name": "Klier",
            "shop": "hairdresser"
        },
        "name": "Klier",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Supercuts": {
        "tags": {
            "name": "Supercuts",
            "shop": "hairdresser"
        },
        "name": "Supercuts",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Hairkiller": {
        "tags": {
            "name": "Hairkiller",
            "shop": "hairdresser"
        },
        "name": "Hairkiller",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Great Clips": {
        "tags": {
            "name": "Great Clips",
            "shop": "hairdresser"
        },
        "name": "Great Clips",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/????????????????????????????": {
        "tags": {
            "name": "????????????????????????????",
            "shop": "hairdresser"
        },
        "name": "????????????????????????????",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/??????????": {
        "tags": {
            "name": "??????????",
            "shop": "hairdresser"
        },
        "name": "??????????",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Fryzjer": {
        "tags": {
            "name": "Fryzjer",
            "shop": "hairdresser"
        },
        "name": "Fryzjer",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/Franck Provost": {
        "tags": {
            "name": "Franck Provost",
            "shop": "hairdresser"
        },
        "name": "Franck Provost",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hairdresser/?????????? ??????????????": {
        "tags": {
            "name": "?????????? ??????????????",
            "shop": "hairdresser"
        },
        "name": "?????????? ??????????????",
        "icon": "hairdresser",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hardware/1000 ??????????????": {
        "tags": {
            "name": "1000 ??????????????",
            "shop": "hardware"
        },
        "name": "1000 ??????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/hardware/??????????????????": {
        "tags": {
            "name": "??????????????????",
            "shop": "hardware"
        },
        "name": "??????????????????",
        "icon": "shop",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    },
    "shop/motorcycle/Yamaha": {
        "tags": {
            "name": "Yamaha",
            "shop": "motorcycle"
        },
        "name": "Yamaha",
        "icon": "scooter",
        "geometry": [
            "point",
            "vertex",
            "area"
        ],
        "fields": [
            "address",
            "building_area",
            "opening_hours"
        ],
        "suggestion": true
    }
}