iD.data.presets.fields = {
    "access": {
        "keys": [
            "access",
            "foot",
            "motor_vehicle",
            "bicycle",
            "horse"
        ],
        "reference": {
            "key": "access"
        },
        "type": "access",
        "label": "Access",
        "placeholder": "Unknown",
        "strings": {
            "types": {
                "access": "General",
                "foot": "Foot",
                "motor_vehicle": "Motor Vehicles",
                "bicycle": "Bicycles",
                "horse": "Horses"
            },
            "options": {
                "yes": {
                    "title": "Allowed",
                    "description": "Access permitted by law; a right of way"
                },
                "no": {
                    "title": "Prohibited",
                    "description": "Access not permitted to the general public"
                },
                "permissive": {
                    "title": "Permissive",
                    "description": "Access permitted until such time as the owner revokes the permission"
                },
                "private": {
                    "title": "Private",
                    "description": "Access permitted only with permission of the owner on an individual basis"
                },
                "designated": {
                    "title": "Designated",
                    "description": "Access permitted according to signs or specific local laws"
                },
                "destination": {
                    "title": "Destination",
                    "description": "Access permitted only to reach a destination"
                }
            }
        }
    },
    "access_simple": {
        "key": "access",
        "type": "combo",
        "label": "Access",
        "placeholder": "yes",
        "options": [
            "permissive",
            "private",
            "customers",
            "no"
        ]
    },
    "access_toilets": {
        "key": "access",
        "type": "combo",
        "label": "Access",
        "options": [
            "public",
            "permissive",
            "private",
            "customers"
        ]
    },
    "address": {
        "type": "address",
        "keys": [
            "addr:housename",
            "addr:housenumber",
            "addr:street",
            "addr:city",
            "addr:postcode"
        ],
        "reference": {
            "key": "addr"
        },
        "icon": "address",
        "universal": true,
        "label": "Address",
        "strings": {
            "placeholders": {
                "housename": "Housename",
                "housenumber": "123",
                "street": "Street",
                "city": "City",
                "postcode": "Postcode",
                "place": "Place",
                "hamlet": "Hamlet",
                "suburb": "Suburb",
                "subdistrict": "Subdistrict",
                "district": "District",
                "province": "Province",
                "state": "State",
                "country": "Country"
            }
        }
    },
    "admin_level": {
        "key": "admin_level",
        "type": "number",
        "label": "Admin Level"
    },
    "aerialway": {
        "key": "aerialway",
        "type": "typeCombo",
        "label": "Type"
    },
    "aerialway/access": {
        "key": "aerialway:access",
        "type": "combo",
        "label": "Access",
        "strings": {
            "options": {
                "entry": "Entry",
                "exit": "Exit",
                "both": "Both"
            }
        }
    },
    "aerialway/bubble": {
        "key": "aerialway:bubble",
        "type": "check",
        "label": "Bubble"
    },
    "aerialway/capacity": {
        "key": "aerialway:capacity",
        "type": "number",
        "label": "Capacity (per hour)",
        "placeholder": "500, 2500, 5000..."
    },
    "aerialway/duration": {
        "key": "aerialway:duration",
        "type": "number",
        "label": "Duration (minutes)",
        "placeholder": "1, 2, 3..."
    },
    "aerialway/heating": {
        "key": "aerialway:heating",
        "type": "check",
        "label": "Heated"
    },
    "aerialway/occupancy": {
        "key": "aerialway:occupancy",
        "type": "number",
        "label": "Occupancy",
        "placeholder": "2, 4, 8..."
    },
    "aerialway/summer/access": {
        "key": "aerialway:summer:access",
        "type": "combo",
        "label": "Access (summer)",
        "strings": {
            "options": {
                "entry": "Entry",
                "exit": "Exit",
                "both": "Both"
            }
        }
    },
    "aeroway": {
        "key": "aeroway",
        "type": "typeCombo",
        "label": "Type"
    },
    "amenity": {
        "key": "amenity",
        "type": "typeCombo",
        "label": "Type"
    },
    "artist": {
        "key": "artist_name",
        "type": "text",
        "label": "Artist"
    },
    "artwork_type": {
        "key": "artwork_type",
        "type": "combo",
        "label": "Type"
    },
    "atm": {
        "key": "atm",
        "type": "check",
        "label": "ATM"
    },
    "backrest": {
        "key": "backrest",
        "type": "check",
        "label": "Backrest"
    },
    "barrier": {
        "key": "barrier",
        "type": "typeCombo",
        "label": "Type"
    },
    "bicycle_parking": {
        "key": "bicycle_parking",
        "type": "combo",
        "label": "Type"
    },
    "boundary": {
        "key": "boundary",
        "type": "combo",
        "label": "Type"
    },
    "building": {
        "key": "building",
        "type": "typeCombo",
        "label": "Building"
    },
    "building_area": {
        "key": "building",
        "type": "defaultcheck",
        "default": "yes",
        "geometry": "area",
        "label": "Building"
    },
    "capacity": {
        "key": "capacity",
        "type": "number",
        "label": "Capacity",
        "placeholder": "50, 100, 200..."
    },
    "cardinal_direction": {
        "key": "direction",
        "type": "combo",
        "label": "Direction",
        "strings": {
            "options": {
                "N": "North",
                "E": "East",
                "S": "South",
                "W": "West",
                "NE": "Northeast",
                "SE": "Southeast",
                "SW": "Southwest",
                "NW": "Northwest",
                "NNE": "North-northeast",
                "ENE": "East-northeast",
                "ESE": "East-southeast",
                "SSE": "South-southeast",
                "SSW": "South-southwest",
                "WSW": "West-southwest",
                "WNW": "West-northwest",
                "NNW": "North-northwest"
            }
        }
    },
    "clock_direction": {
        "key": "direction",
        "type": "combo",
        "label": "Direction",
        "strings": {
            "options": {
                "clockwise": "Clockwise",
                "anticlockwise": "Counterclockwise"
            }
        }
    },
    "collection_times": {
        "key": "collection_times",
        "type": "text",
        "label": "Collection Times"
    },
    "construction": {
        "key": "construction",
        "type": "combo",
        "label": "Type"
    },
    "country": {
        "key": "country",
        "type": "combo",
        "label": "Country"
    },
    "covered": {
        "key": "covered",
        "type": "check",
        "label": "Covered"
    },
    "crop": {
        "key": "crop",
        "type": "combo",
        "label": "Crop"
    },
    "crossing": {
        "key": "crossing",
        "type": "combo",
        "label": "Type"
    },
    "cuisine": {
        "key": "cuisine",
        "type": "combo",
        "label": "Cuisine"
    },
    "denomination": {
        "key": "denomination",
        "type": "combo",
        "label": "Denomination"
    },
    "denotation": {
        "key": "denotation",
        "type": "combo",
        "label": "Denotation"
    },
    "description": {
        "key": "description",
        "type": "textarea",
        "label": "Description"
    },
    "electrified": {
        "key": "electrified",
        "type": "combo",
        "label": "Electrification",
        "placeholder": "Contact Line, Electrified Rail...",
        "strings": {
            "options": {
                "contact_line": "Contact Line",
                "rail": "Electrified Rail",
                "yes": "Yes (unspecified)",
                "no": "No"
            }
        }
    },
    "elevation": {
        "key": "ele",
        "type": "number",
        "icon": "elevation",
        "universal": true,
        "label": "Elevation"
    },
    "emergency": {
        "key": "emergency",
        "type": "check",
        "label": "Emergency"
    },
    "entrance": {
        "key": "entrance",
        "type": "typeCombo",
        "label": "Type"
    },
    "except": {
        "key": "except",
        "type": "combo",
        "label": "Exceptions"
    },
    "fax": {
        "key": "fax",
        "type": "tel",
        "label": "Fax",
        "placeholder": "+31 42 123 4567"
    },
    "fee": {
        "key": "fee",
        "type": "check",
        "label": "Fee"
    },
    "fire_hydrant/type": {
        "key": "fire_hydrant:type",
        "type": "combo",
        "label": "Type",
        "strings": {
            "options": {
                "pillar": "Pillar/Aboveground",
                "underground": "Underground",
                "wall": "Wall",
                "pond": "Pond"
            }
        }
    },
    "fixme": {
        "key": "fixme",
        "type": "textarea",
        "label": "Fix Me"
    },
    "fuel": {
        "key": "fuel",
        "type": "combo",
        "label": "Fuel"
    },
    "fuel/biodiesel": {
        "key": "fuel:biodiesel",
        "type": "check",
        "label": "Sells Biodiesel"
    },
    "fuel/diesel": {
        "key": "fuel:diesel",
        "type": "check",
        "label": "Sells Diesel"
    },
    "fuel/e10": {
        "key": "fuel:e10",
        "type": "check",
        "label": "Sells E10"
    },
    "fuel/e85": {
        "key": "fuel:e85",
        "type": "check",
        "label": "Sells E85"
    },
    "fuel/lpg": {
        "key": "fuel:lpg",
        "type": "check",
        "label": "Sells Propane"
    },
    "fuel/octane_100": {
        "key": "fuel:octane_100",
        "type": "check",
        "label": "Sells Racing Gasoline"
    },
    "fuel/octane_91": {
        "key": "fuel:octane_91",
        "type": "check",
        "label": "Sells Regular Gasoline"
    },
    "fuel/octane_95": {
        "key": "fuel:octane_95",
        "type": "check",
        "label": "Sells Midgrade Gasoline"
    },
    "fuel/octane_98": {
        "key": "fuel:octane_98",
        "type": "check",
        "label": "Sells Premium Gasoline"
    },
    "gauge": {
        "key": "gauge",
        "type": "combo",
        "label": "Gauge"
    },
    "generator/method": {
        "key": "generator:method",
        "type": "combo",
        "label": "Method"
    },
    "generator/source": {
        "key": "generator:source",
        "type": "combo",
        "label": "Source"
    },
    "generator/type": {
        "key": "generator:type",
        "type": "combo",
        "label": "Type"
    },
    "golf_hole": {
        "key": "ref",
        "type": "text",
        "label": "Reference",
        "placeholder": "Hole number (1-18)"
    },
    "handicap": {
        "key": "handicap",
        "type": "number",
        "label": "Handicap",
        "placeholder": "1-18"
    },
    "highway": {
        "key": "highway",
        "type": "typeCombo",
        "label": "Type"
    },
    "historic": {
        "key": "historic",
        "type": "typeCombo",
        "label": "Type"
    },
    "hoops": {
        "key": "hoops",
        "type": "number",
        "label": "Hoops",
        "placeholder": "1, 2, 4..."
    },
    "iata": {
        "key": "iata",
        "type": "text",
        "label": "IATA"
    },
    "icao": {
        "key": "icao",
        "type": "text",
        "label": "ICAO"
    },
    "incline": {
        "key": "incline",
        "type": "combo",
        "label": "Incline"
    },
    "information": {
        "key": "information",
        "type": "typeCombo",
        "label": "Type"
    },
    "internet_access": {
        "key": "internet_access",
        "type": "combo",
        "label": "Internet Access",
        "strings": {
            "options": {
                "yes": "Yes",
                "no": "No",
                "wlan": "Wifi",
                "wired": "Wired",
                "terminal": "Terminal"
            }
        }
    },
    "lamp_type": {
        "key": "lamp_type",
        "type": "combo",
        "label": "Type"
    },
    "landuse": {
        "key": "landuse",
        "type": "typeCombo",
        "label": "Type"
    },
    "lanes": {
        "key": "lanes",
        "type": "number",
        "label": "Lanes",
        "placeholder": "1, 2, 3..."
    },
    "layer": {
        "key": "layer",
        "type": "combo",
        "label": "Layer"
    },
    "leisure": {
        "key": "leisure",
        "type": "typeCombo",
        "label": "Type"
    },
    "length": {
        "key": "length",
        "type": "number",
        "label": "Length (Meters)"
    },
    "levels": {
        "key": "building:levels",
        "type": "number",
        "label": "Levels",
        "placeholder": "2, 4, 6..."
    },
    "lit": {
        "key": "lit",
        "type": "check",
        "label": "Lit"
    },
    "location": {
        "key": "location",
        "type": "combo",
        "label": "Location"
    },
    "man_made": {
        "key": "man_made",
        "type": "typeCombo",
        "label": "Type"
    },
    "maxspeed": {
        "key": "maxspeed",
        "type": "maxspeed",
        "label": "Speed Limit",
        "placeholder": "40, 50, 60..."
    },
    "mtb/scale": {
        "key": "mtb:scale",
        "type": "combo",
        "label": "Mountain Biking Difficulty",
        "placeholder": "0, 1, 2, 3...",
        "strings": {
            "options": {
                "0": "0: Solid gravel/packed earth, no obstacles, wide curves",
                "1": "1: Some loose surface, small obstacles, wide curves",
                "2": "2: Much loose surface, large obstacles, easy hairpins",
                "3": "3: Slippery surface, large obstacles, tight hairpins",
                "4": "4: Loose surface or boulders, dangerous hairpins",
                "5": "5: Maximum difficulty, boulder fields, landslides",
                "6": "6: Not rideable except by the very best mountain bikers"
            }
        }
    },
    "mtb/scale/imba": {
        "key": "mtb:scale:imba",
        "type": "combo",
        "label": "IMBA Trail Difficulty",
        "placeholder": "Easy, Medium, Difficult...",
        "strings": {
            "options": {
                "0": "Easiest (white circle)",
                "1": "Easy (green circle)",
                "2": "Medium (blue square)",
                "3": "Difficult (black diamond)",
                "4": "Extremely Difficult (double black diamond)"
            }
        }
    },
    "mtb/scale/uphill": {
        "key": "mtb:scale:uphill",
        "type": "combo",
        "label": "Mountain Biking Uphill Difficulty",
        "placeholder": "0, 1, 2, 3...",
        "strings": {
            "options": {
                "0": "0: Avg. incline <10%, gravel/packed earth, no obstacles",
                "1": "1: Avg. incline <15%, gravel/packed earth, few small objects",
                "2": "2: Avg. incline <20%, stable surface, fistsize rocks/roots",
                "3": "3: Avg. incline <25%, variable surface, fistsize rocks/branches",
                "4": "4: Avg. incline <30%, poor condition, big rocks/branches",
                "5": "5: Very steep, bike generally needs to be pushed or carried"
            }
        }
    },
    "name": {
        "key": "name",
        "type": "localized",
        "label": "Name",
        "placeholder": "Common name (if any)"
    },
    "natural": {
        "key": "natural",
        "type": "typeCombo",
        "label": "Natural"
    },
    "network": {
        "key": "network",
        "type": "text",
        "label": "Network"
    },
    "note": {
        "key": "note",
        "type": "textarea",
        "universal": true,
        "icon": "note",
        "label": "Note"
    },
    "office": {
        "key": "office",
        "type": "typeCombo",
        "label": "Type"
    },
    "oneway": {
        "key": "oneway",
        "type": "check",
        "label": "One Way",
        "strings": {
            "options": {
                "undefined": "Assumed to be No",
                "yes": "Yes",
                "no": "No"
            }
        }
    },
    "oneway_yes": {
        "key": "oneway",
        "type": "check",
        "label": "One Way",
        "strings": {
            "options": {
                "undefined": "Assumed to be Yes",
                "yes": "Yes",
                "no": "No"
            }
        }
    },
    "opening_hours": {
        "key": "opening_hours",
        "type": "text",
        "label": "Hours"
    },
    "operator": {
        "key": "operator",
        "type": "text",
        "label": "Operator"
    },
    "par": {
        "key": "par",
        "type": "number",
        "label": "Par",
        "placeholder": "3, 4, 5..."
    },
    "park_ride": {
        "key": "park_ride",
        "type": "check",
        "label": "Park and Ride"
    },
    "parking": {
        "key": "parking",
        "type": "combo",
        "label": "Type",
        "strings": {
            "options": {
                "surface": "Surface",
                "multi-storey": "Multilevel",
                "underground": "Underground",
                "sheds": "Sheds",
                "carports": "Carports",
                "garage_boxes": "Garage Boxes",
                "lane": "Roadside Lane"
            }
        }
    },
    "phone": {
        "key": "phone",
        "type": "tel",
        "icon": "telephone",
        "universal": true,
        "label": "Phone",
        "placeholder": "+31 42 123 4567"
    },
    "piste/difficulty": {
        "key": "piste:difficulty",
        "type": "combo",
        "label": "Difficulty",
        "placeholder": "Easy, Intermediate, Advanced...",
        "strings": {
            "options": {
                "novice": "Novice (instructional)",
                "easy": "Easy (green circle)",
                "intermediate": "Intermediate (blue square)",
                "advanced": "Advanced (black diamond)",
                "expert": "Expert (double black diamond)",
                "freeride": "Freeride (off-piste)",
                "extreme": "Extreme (climbing equipment required)"
            }
        }
    },
    "piste/grooming": {
        "key": "piste:grooming",
        "type": "combo",
        "label": "Grooming",
        "strings": {
            "options": {
                "classic": "Classic",
                "mogul": "Mogul",
                "backcountry": "Backcountry",
                "classic+skating": "Classic and Skating",
                "scooter": "Scooter/Snowmobile",
                "skating": "Skating"
            }
        }
    },
    "piste/type": {
        "key": "piste:type",
        "type": "typeCombo",
        "label": "Type",
        "strings": {
            "options": {
                "downhill": "Downhill",
                "nordic": "Nordic",
                "skitour": "Skitour",
                "sled": "Sled",
                "hike": "Hike",
                "sleigh": "Sleigh",
                "ice_skate": "Ice Skate",
                "snow_park": "Snow Park",
                "playground": "Playground"
            }
        }
    },
    "place": {
        "key": "place",
        "type": "typeCombo",
        "label": "Type"
    },
    "population": {
        "key": "population",
        "type": "text",
        "label": "Population"
    },
    "power": {
        "key": "power",
        "type": "typeCombo",
        "label": "Type"
    },
    "railway": {
        "key": "railway",
        "type": "typeCombo",
        "label": "Type"
    },
    "recycling/cans": {
        "key": "recycling:cans",
        "type": "check",
        "label": "Accepts Cans"
    },
    "recycling/clothes": {
        "key": "recycling:clothes",
        "type": "check",
        "label": "Accepts Clothes"
    },
    "recycling/glass": {
        "key": "recycling:glass",
        "type": "check",
        "label": "Accepts Glass"
    },
    "recycling/paper": {
        "key": "recycling:paper",
        "type": "check",
        "label": "Accepts Paper"
    },
    "ref": {
        "key": "ref",
        "type": "text",
        "label": "Reference"
    },
    "relation": {
        "key": "type",
        "type": "combo",
        "label": "Type"
    },
    "religion": {
        "key": "religion",
        "type": "combo",
        "label": "Religion"
    },
    "restriction": {
        "key": "restriction",
        "type": "combo",
        "label": "Type"
    },
    "restrictions": {
        "type": "restrictions",
        "geometry": "vertex",
        "icon": "restrictions",
        "reference": {
            "rtype": "restriction"
        },
        "label": "Turn Restrictions"
    },
    "route": {
        "key": "route",
        "type": "combo",
        "label": "Type"
    },
    "route_master": {
        "key": "route_master",
        "type": "combo",
        "label": "Type"
    },
    "sac_scale": {
        "key": "sac_scale",
        "type": "combo",
        "label": "Hiking Difficulty",
        "placeholder": "Mountain Hiking, Alpine Hiking...",
        "strings": {
            "options": {
                "hiking": "T1: Hiking",
                "mountain_hiking": "T2: Mountain Hiking",
                "demanding_mountain_hiking": "T3: Demanding Mountain Hiking",
                "alpine_hiking": "T4: Alpine Hiking",
                "demanding_alpine_hiking": "T5: Demanding Alpine Hiking",
                "difficult_alpine_hiking": "T6: Difficult Alpine Hiking"
            }
        }
    },
    "seasonal": {
        "key": "seasonal",
        "type": "check",
        "label": "Seasonal"
    },
    "service": {
        "key": "service",
        "type": "combo",
        "label": "Type",
        "options": [
            "parking_aisle",
            "driveway",
            "alley",
            "emergency_access",
            "drive-through"
        ]
    },
    "shelter": {
        "key": "shelter",
        "type": "check",
        "label": "Shelter"
    },
    "shelter_type": {
        "key": "shelter_type",
        "type": "combo",
        "label": "Type"
    },
    "shop": {
        "key": "shop",
        "type": "typeCombo",
        "label": "Type"
    },
    "sloped_curb": {
        "key": "sloped_curb",
        "type": "combo",
        "label": "Sloped Curb"
    },
    "smoking": {
        "key": "smoking",
        "type": "combo",
        "label": "Smoking",
        "placeholder": "No, Separated, Yes...",
        "strings": {
            "options": {
                "no": "No smoking anywhere",
                "separated": "In smoking areas, not physically isolated",
                "isolated": "In smoking areas, physically isolated",
                "outside": "Allowed outside",
                "yes": "Allowed everywhere",
                "dedicated": "Dedicated to smokers (e.g. smokers' club)"
            }
        }
    },
    "smoothness": {
        "key": "smoothness",
        "type": "combo",
        "label": "Smoothness",
        "placeholder": "Thin Rollers, Wheels, Off-Road...",
        "strings": {
            "options": {
                "excellent": "Thin Rollers: rollerblade, skateboard",
                "good": "Thin Wheels: racing bike",
                "intermediate": "Wheels: city bike, wheelchair, scooter",
                "bad": "Robust Wheels: trekking bike, car, rickshaw",
                "very_bad": "High Clearance: light duty off-road vehicle",
                "horrible": "Off-Road: heavy duty off-road vehicle",
                "very_horrible": "Specialized off-road: tractor, ATV",
                "impassible": "Impassible / No wheeled vehicle"
            }
        }
    },
    "social_facility_for": {
        "key": "social_facility:for",
        "type": "radio",
        "label": "People served",
        "placeholder": "Homeless, Disabled, Child, etc",
        "options": [
            "abused",
            "child",
            "disabled",
            "diseased",
            "drug_addicted",
            "homeless",
            "juvenile",
            "mental_health",
            "migrant",
            "orphan",
            "senior",
            "underprivileged",
            "unemployed",
            "victim"
        ]
    },
    "source": {
        "key": "source",
        "type": "text",
        "icon": "source",
        "universal": true,
        "label": "Source"
    },
    "sport": {
        "key": "sport",
        "type": "combo",
        "label": "Sport"
    },
    "sport_ice": {
        "key": "sport",
        "type": "combo",
        "label": "Sport",
        "options": [
            "skating",
            "hockey",
            "multi",
            "curling",
            "ice_stock"
        ]
    },
    "structure": {
        "type": "radio",
        "keys": [
            "bridge",
            "tunnel",
            "embankment",
            "cutting",
            "ford"
        ],
        "label": "Structure",
        "placeholder": "Unknown",
        "strings": {
            "options": {
                "bridge": "Bridge",
                "tunnel": "Tunnel",
                "embankment": "Embankment",
                "cutting": "Cutting",
                "ford": "Ford"
            }
        }
    },
    "studio_type": {
        "key": "type",
        "type": "combo",
        "label": "Type",
        "options": [
            "audio",
            "video"
        ]
    },
    "supervised": {
        "key": "supervised",
        "type": "check",
        "label": "Supervised"
    },
    "surface": {
        "key": "surface",
        "type": "combo",
        "label": "Surface"
    },
    "tactile_paving": {
        "key": "tactile_paving",
        "type": "check",
        "label": "Tactile Paving"
    },
    "toilets/disposal": {
        "key": "toilets:disposal",
        "type": "combo",
        "label": "Disposal",
        "strings": {
            "options": {
                "flush": "Flush",
                "pitlatrine": "Pit/Latrine",
                "chemical": "Chemical",
                "bucket": "Bucket"
            }
        }
    },
    "tourism": {
        "key": "tourism",
        "type": "typeCombo",
        "label": "Type"
    },
    "towertype": {
        "key": "tower:type",
        "type": "combo",
        "label": "Tower type"
    },
    "tracktype": {
        "key": "tracktype",
        "type": "combo",
        "label": "Track Type",
        "placeholder": "Solid, Mostly Solid, Soft...",
        "strings": {
            "options": {
                "grade1": "Solid: paved or heavily compacted hardcore surface",
                "grade2": "Mostly Solid: gravel/rock with some soft material mixed in",
                "grade3": "Even mixture of hard and soft materials",
                "grade4": "Mostly Soft: soil/sand/grass with some hard material mixed in",
                "grade5": "Soft: soil/sand/grass"
            }
        }
    },
    "trail_visibility": {
        "key": "trail_visibility",
        "type": "combo",
        "label": "Trail Visibility",
        "placeholder": "Excellent, Good, Bad...",
        "strings": {
            "options": {
                "excellent": "Excellent: unambiguous path or markers everywhere",
                "good": "Good: markers visible, sometimes require searching",
                "intermediate": "Intermediate: few markers, path mostly visible",
                "bad": "Bad: no markers, path sometimes invisible/pathless",
                "horrible": "Horrible: often pathless, some orientation skills required",
                "no": "No: pathless, excellent orientation skills required"
            }
        }
    },
    "tree_type": {
        "key": "type",
        "type": "combo",
        "label": "Type",
        "options": [
            "broad_leaved",
            "conifer",
            "palm"
        ]
    },
    "trees": {
        "key": "trees",
        "type": "combo",
        "label": "Trees"
    },
    "tunnel": {
        "key": "tunnel",
        "type": "combo",
        "label": "Tunnel"
    },
    "vending": {
        "key": "vending",
        "type": "combo",
        "label": "Type of Goods"
    },
    "water": {
        "key": "water",
        "type": "combo",
        "label": "Type"
    },
    "waterway": {
        "key": "waterway",
        "type": "typeCombo",
        "label": "Type"
    },
    "website": {
        "key": "website",
        "type": "url",
        "icon": "website",
        "placeholder": "http://example.com/",
        "universal": true,
        "label": "Website"
    },
    "wetland": {
        "key": "wetland",
        "type": "combo",
        "label": "Type"
    },
    "wheelchair": {
        "key": "wheelchair",
        "type": "radio",
        "options": [
            "yes",
            "limited",
            "no"
        ],
        "icon": "wheelchair",
        "universal": true,
        "label": "Wheelchair Access"
    },
    "width": {
        "key": "width",
        "type": "number",
        "label": "Width (Meters)"
    },
    "wikipedia": {
        "key": "wikipedia",
        "type": "wikipedia",
        "icon": "wikipedia",
        "universal": true,
        "label": "Wikipedia"
    },
    "wood": {
        "key": "wood",
        "type": "combo",
        "label": "Type"
    }
}