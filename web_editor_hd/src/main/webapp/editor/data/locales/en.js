iD.data.en = {
    "modes": {
        "add_area": {
            "title": "Area",
            "description": "Add parks, buildings, lakes or other areas to the map.",
            "tail": "Click on the map to start drawing an area, like a park, lake, or building."
        },
        "add_line": {
            "title": "Line",
            "description": "Add highways, streets, pedestrian paths, canals or other lines to the map.",
            "tail": "Click on the map to start drawing a road, path, or route."
        },
        "add_point": {
            "title": "Point",
            "description": "Add restaurants, monuments, postal boxes or other points to the map.",
            "tail": "Click on the map to add a point."
        },
        "browse": {
            "title": "Browse",
            "description": "Pan and zoom the map."
        },
        "draw_area": {
            "tail": "Click to add nodes to your area. Click the first node to finish the area."
        },
        "draw_line": {
            "tail": "Click to add more nodes to the line. Click on other lines to connect to them, and double-click to end the line."
        }
    },
    "operations": {
        "add": {
            "annotation": {
                "point": "Added a point.",
                "vertex": "Added a node to a way.",
                "relation": "Added a relation."
            }
        },
        "start": {
            "annotation": {
                "line": "Started a line.",
                "area": "Started an area."
            }
        },
        "continue": {
            "key": "A",
            "title": "Continue",
            "description": "Continue this line.",
            "not_eligible": "No line can be continued here.",
            "multiple": "Several lines can be continued here. To choose a line, press the Shift key and click on it to select it.",
            "annotation": {
                "line": "Continued a line.",
                "area": "Continued an area."
            }
        },
        "cancel_draw": {
            "annotation": "Canceled drawing."
        },
        "change_role": {
            "annotation": "Changed the role of a relation member."
        },
        "change_tags": {
            "annotation": "Changed tags."
        },
        "circularize": {
            "title": "Circularize",
            "description": {
                "line": "Make this line circular.",
                "area": "Make this area circular."
            },
            "key": "O",
            "annotation": {
                "line": "Made a line circular.",
                "area": "Made an area circular."
            },
            "not_closed": "This can't be made circular because it's not a loop.",
            "too_large": "This can't be made circular because not enough of it is currently visible."
        },
        "orthogonalize": {
            "title": "Square",
            "description": {
                "line": "Square the corners of this line.",
                "area": "Square the corners of this area."
            },
            "key": "S",
            "annotation": {
                "line": "Squared the corners of a line.",
                "area": "Squared the corners of an area."
            },
            "not_squarish": "This can't be made square because it is not squarish.",
            "too_large": "This can't be made square because not enough of it is currently visible."
        },
        "straighten": {
            "title": "Straighten",
            "description": "Straighten this line.",
            "key": "S",
            "annotation": "Straightened a line.",
            "too_bendy": "This can't be straightened because it bends too much."
        },
        "delete": {
            "title": "Delete",
            "description": "Remove this from the map.",
            "annotation": {
                "point": "Deleted a point.",
                "vertex": "Deleted a node from a way.",
                "line": "Deleted a line.",
                "area": "Deleted an area.",
                "relation": "Deleted a relation.",
                "multiple": "Deleted {n} objects."
            },
            "incomplete_relation": "This feature can't be deleted because it hasn't been fully downloaded."
        },
        "add_member": {
            "annotation": "Added a member to a relation."
        },
        "delete_member": {
            "annotation": "Removed a member from a relation."
        },
        "connect": {
            "annotation": {
                "point": "Connected a way to a point.",
                "vertex": "Connected a way to another.",
                "line": "Connected a way to a line.",
                "area": "Connected a way to an area."
            }
        },
        "clone":{
            "title":"Clone",
            "description":"Clone",
            "key":"",
            "annotation": "Clone lines/areas/points."
        },
        "disconnect": {
            "title": "Disconnect",
            "description": "Disconnect these lines/areas from each other.",
            "key": "D",
            "annotation": "Disconnected lines/areas.",
            "not_connected": "There aren't enough lines/areas here to disconnect."
        },
        "merge": {
            "title": "Merge",
            "description": "Merge these lines.",
            "key": "C",
            "annotation": "Merged {n} lines.",
            "not_eligible": "These features can't be merged.",
            "not_adjacent": "These lines can't be merged because they aren't connected.",
            "restriction": "These lines can't be merged because at least one is a member of a \"{relation}\" relation.",
            "incomplete_relation": "These features can't be merged because at least one hasn't been fully downloaded."
        },
        "move": {
            "title": "Move",
            "description": "Move this to a different location.",
            "key": "M",
            "annotation": {
                "point": "Moved a point.",
                "vertex": "Moved a node in a way.",
                "line": "Moved a line.",
                "area": "Moved an area.",
                "multiple": "Moved multiple objects."
            },
            "incomplete_relation": "This feature can't be moved because it hasn't been fully downloaded.",
            "too_large": "This can't be moved because not enough of it is currently visible."
        },
        "rotate": {
            "title": "Rotate",
            "description": "Rotate this object around its center point.",
            "key": "R",
            "annotation": {
                "line": "Rotated a line.",
                "area": "Rotated an area."
            },
            "too_large": "This can't be rotated because not enough of it is currently visible."
        },
        "reverse": {
            "title": "Reverse",
            "description": "Make this line go in the opposite direction.",
            "key": "V",
            "annotation": "Reversed a line."
        },
        "split": {
            "title": "Split",
            "description": {
                "line": "Split this line into two at this node.",
                "area": "Split the boundary of this area into two.",
                "multiple": "Split the lines/area boundaries at this node into two."
            },
            "key": "X",
            "annotation": {
                "line": "Split a line.",
                "area": "Split an area boundary.",
                "multiple": "Split {n} lines/area boundaries."
            },
            "not_eligible": "Lines can't be split at their beginning or end.",
            "multiple_ways": "There are too many lines here to split."
        },
        "restriction": {
            "help": {
                "select": "Click to select a road segment.",
                "toggle": "Click to toggle turn restrictions.",
                "toggle_on": "Click to add a \"{restriction}\" restriction.",
                "toggle_off": "Click to remove the \"{restriction}\" restriction."
            },
            "annotation": {
                "create": "Added a turn restriction",
                "delete": "Deleted a turn restriction"
            }
        }
    },
    "pagination":{
        "first":"First",
        "pre":"Pre",
        "next":"Next",
        "last":"Last",
        "total":"Total"
    },
    "undo": {
        "tooltip": "Undo: {action}",
        "nothing": "Nothing to undo."
    },
    "redo": {
        "tooltip": "Redo: {action}",
        "nothing": "Nothing to redo."
    },
    "tooltip_keyhint": "Shortcut:",
    "browser_notice": "This editor is supported in Firefox, Chrome, Safari, Opera, and Internet Explorer 9 and above. Please upgrade your browser or use Potlatch 2 to edit the map.",
    "translate": {
        "translate": "Translate",
        "localized_translation_label": "Multilingual name",
        "localized_translation_language": "Choose language",
        "localized_translation_name": "Name"
    },
    "zoom_in_edit": "Zoom in to Edit",
    "logout": "logout",
    "loading_auth": "Connecting to OpenStreetMap...",
    "report_a_bug": "report a bug",
    "status": {
        "error": "Unable to connect to API.",
        "offline": "The API is offline. Please try editing later.",
        "readonly": "The API is read-only. You will need to wait to save your changes."
    },
    "commit": {
        "title": "Save Changes",
        "description_placeholder": "Brief description of your contributions",
        "message_label": "Commit message",
        "upload_explanation": "The changes you upload will be visible on all maps that use OpenStreetMap data.",
        "upload_explanation_with_user": "The changes you upload as {user} will be visible on all maps that use OpenStreetMap data.",
        "save": "Save",
        "cancel": "Cancel",
        "warnings": "Warnings",
        "modified": "Modified",
        "deleted": "Deleted",
        "created": "Created"
    },
    "contributors": {
        "list": "Edits by {users}",
        "truncated_list": "Edits by {users} and {count} others"
    },
    "geocoder": {
        "search": "Search worldwide...",
        "no_results_visible": "No results in visible map area",
        "no_results_worldwide": "No results found"
    },
    "geolocate": {
        "title": "Show My Location"
    },
    "inspector": {
        "no_documentation_combination": "There is no documentation available for this tag combination",
        "no_documentation_key": "There is no documentation available for this key",
        "show_more": "Show More",
        "view_on_osm": "View on openstreetmap.org",
        "all_tags": "All tags",
        "all_members": "All members",
        "all_relations": "All relations",
        "new_relation": "New relation...",
        "role": "Role",
        "choose": "Select feature type",
        "results": "{n} results for {search}",
        "reference": "View on OpenStreetMap Wiki",
        "back_tooltip": "Change feature",
        "remove": "Remove",
        "search": "Search",
        "multiselect": "Selected items",
        "unknown": "Unknown",
        "incomplete": "<not downloaded>",
        "feature_list": "Search features",
        "edit": "Edit feature",
        "check": {
            "yes": "Yes",
            "no": "No"
        },
        "none": "None",
        "node": "Node",
        "way": "Way",
        "relation": "Relation",
        "location": "Location",
        "readonly_title": "ReadOnly",
        "input_placeholder_error":"error",
        "data_list_tab_name":"Data List",
        "style_setting_tab_name":"Style Setting"
    },
    "background": {
        "title": "Background",
        "description": "Background settings",
        "percent_brightness": "{opacity}% brightness",
        "none": "None",
        "custom": "Custom",
        "custom_button": "Edit custom background",
        "custom_prompt": "Enter a tile URL template. Valid tokens are {z}, {x}, {y} for Z/X/Y scheme and {u} for quadtile scheme.",
        "fix_misalignment": "Fix alignment",
        "reset": "reset"
    },
    "restore": {
        "heading": "You have unsaved changes",
        "description": "Do you wish to restore unsaved changes from a previous editing session?",
        "restore": "Restore",
        "reset": "Reset"
    },
    "save": {
        "title": "Save",
        "help": "Save changes to OpenStreetMap, making them visible to other users.",
        "no_changes": "No changes to save.",
        "error": "An error occurred while trying to save",
        "uploading": "Uploading changes to OpenStreetMap.",
        "unsaved_changes": "You have unsaved changes"
    },
    "success": {
        "edited_osm": "Edited OSM!",
        "just_edited": "You just edited OpenStreetMap!",
        "view_on_osm": "View on OSM",
        "facebook": "Share on Facebook",
        "twitter": "Share on Twitter",
        "google": "Share on Google+",
        "help_html": "Your changes should appear in the \"Standard\" layer in a few minutes. Other layers, and certain features, may take longer\n(<a href='https://help.openstreetmap.org/questions/4705/why-havent-my-changes-appeared-on-the-map' target='_blank'>details</a>).\n"
    },
    "confirm": {
        "okay": "Okay"
    },
    "splash": {
        "welcome": "Welcome to the iD OpenStreetMap editor",
        "text": "iD is a friendly but powerful tool for contributing to the world's best free world map. This is version {version}. For more information see {website} and report bugs at {github}.",
        "walkthrough": "Start the Walkthrough",
        "start": "Edit Now"
    },
    "source_switch": {
        "live": "live",
        "lose_changes": "You have unsaved changes. Switching the map server will discard them. Are you sure you want to switch servers?",
        "dev": "dev"
    },
    "tag_reference": {
        "description": "Description",
        "on_wiki": "{tag} on wiki.osm.org",
        "used_with": "used with {type}"
    },
    "validations": {
        "untagged_point": "Untagged point",
        "untagged_line": "Untagged line",
        "untagged_area": "Untagged area",
        "many_deletions": "You're deleting {n} objects. Are you sure you want to do this? This will delete them from the map that everyone else sees on openstreetmap.org.",
        "tag_suggests_area": "The tag {tag} suggests line should be area, but it is not an area",
        "untagged_point_tooltip": "Select a feature type that describes what this point is.",
        "untagged_line_tooltip": "Select a feature type that describes what this line is.",
        "untagged_area_tooltip": "Select a feature type that describes what this area is.",
        "deprecated_tags": "Deprecated tags: {tags}"
    },
    "zoom": {
        "in": "Zoom In",
        "out": "Zoom Out"
    },
    "cannot_zoom": "Cannot zoom out further in current mode.",
    "gpx": {
        "local_layer": "Local GPX file",
        "drag_drop": "Drag and drop a .gpx file on the page, or click the button to the right to browse",
        "zoom": "Zoom to GPX track",
        "browse": "Browse for a .gpx file"
    },
    "help": {
        "title": "Help",
        "help": "# Help\n\nThis is an editor for [OpenStreetMap](http://www.openstreetmap.org/), the\nfree and editable map of the world. You can use it to add and update\ndata in your area, making an open-source and open-data map of the world\nbetter for everyone.\n\nEdits that you make on this map will be visible to everyone who uses\nOpenStreetMap. In order to make an edit, you'll need a\n[free OpenStreetMap account](https://www.openstreetmap.org/user/new).\n\nThe [iD editor](http://ideditor.com/) is a collaborative project with [source\ncode available on GitHub](https://github.com/openstreetmap/iD).\n",
        "editing_saving": "# Editing & Saving\n\nThis editor is designed to work primarily online, and you're accessing\nit through a website right now.\n\n### Selecting Features\n\nTo select a map feature, like a road or point of interest, click\non it on the map. This will highlight the selected feature, open a panel with\ndetails about it, and show a menu of things you can do with the feature.\n\nTo select multiple features, hold down the 'Shift' key. Then either click\non the features you want to select, or drag on the map to draw a rectangle.\nThis will draw a box and select all the points within it.\n\n### Saving Edits\n\nWhen you make changes like editing roads, buildings, and places, these are\nstored locally until you save them to the server. Don't worry if you make\na mistake - you can undo changes by clicking the undo button, and redo\nchanges by clicking the redo button.\n\nClick 'Save' to finish a group of edits - for instance, if you've completed\nan area of town and would like to start on a new area. You'll have a chance\nto review what you've done, and the editor supplies helpful suggestions\nand warnings if something doesn't seem right about the changes.\n\nIf everything looks good, you can enter a short comment explaining the change\nyou made, and click 'Save' again to post the changes\nto [OpenStreetMap.org](http://www.openstreetmap.org/), where they are visible\nto all other users and available for others to build and improve upon.\n\nIf you can't finish your edits in one sitting, you can leave the editor\nwindow and come back (on the same browser and computer), and the\neditor application will offer to restore your work.\n",
        "roads": "# Roads\n\nYou can create, fix, and delete roads with this editor. Roads can be all\nkinds: paths, highways, trails, cycleways, and more - any often-crossed\nsegment should be mappable.\n\n### Selecting\n\nClick on a road to select it. An outline should become visible, along\nwith a small tools menu on the map and a sidebar showing more information\nabout the road.\n\n### Modifying\n\nOften you'll see roads that aren't aligned to the imagery behind them\nor to a GPS track. You can adjust these roads so they are in the correct\nplace.\n\nFirst click on the road you want to change. This will highlight it and show\ncontrol points along it that you can drag to better locations. If\nyou want to add new control points for more detail, double-click a part\nof the road without a node, and one will be added.\n\nIf the road connects to another road, but doesn't properly connect on\nthe map, you can drag one of its control points onto the other road in\norder to join them. Having roads connect is important for the map\nand essential for providing driving directions.\n\nYou can also click the 'Move' tool or press the `M` shortcut key to move the entire road at\none time, and then click again to save that movement.\n\n### Deleting\n\nIf a road is entirely incorrect - you can see that it doesn't exist in satellite\nimagery and ideally have confirmed locally that it's not present - you can delete\nit, which removes it from the map. Be cautious when deleting features -\nlike any other edit, the results are seen by everyone and satellite imagery\nis often out of date, so the road could simply be newly built.\n\nYou can delete a road by clicking on it to select it, then clicking the\ntrash can icon or pressing the 'Delete' key.\n\n### Creating\n\nFound somewhere there should be a road but there isn't? Click the 'Line'\nicon in the top-left of the editor or press the shortcut key `2` to start drawing\na line.\n\nClick on the start of the road on the map to start drawing. If the road\nbranches off from an existing road, start by clicking on the place where they connect.\n\nThen click on points along the road so that it follows the right path, according\nto satellite imagery or GPS. If the road you are drawing crosses another road, connect\nit by clicking on the intersection point. When you're done drawing, double-click\nor press 'Return' or 'Enter' on your keyboard.\n",
        "gps": "# GPS\n\nGPS data is the most trusted source of data for OpenStreetMap. This editor\nsupports local traces - `.gpx` files on your local computer. You can collect\nthis kind of GPS trace with a number of smartphone applications as well as\npersonal GPS hardware.\n\nFor information on how to perform a GPS survey, read\n[Surveying with a GPS](http://learnosm.org/en/beginner/using-gps/).\n\nTo use a GPX track for mapping, drag and drop the GPX file onto the map\neditor. If it's recognized, it will be added to the map as a bright green\nline. Click on the 'Background Settings' menu on the right side to enable,\ndisable, or zoom to this new GPX-powered layer.\n\nThe GPX track isn't directly uploaded to OpenStreetMap - the best way to\nuse it is to draw on the map, using it as a guide for the new features that\nyou add, and also to [upload it to OpenStreetMap](http://www.openstreetmap.org/trace/create)\nfor other users to use.\n",
        "imagery": "# Imagery\n\nAerial imagery is an important resource for mapping. A combination of\nairplane flyovers, satellite views, and freely-compiled sources are available\nin the editor under the 'Background Settings' menu on the right.\n\nBy default a [Bing Maps](http://www.bing.com/maps/) satellite layer is\npresented in the editor, but as you pan and zoom the map to new geographical\nareas, new sources will become available. Some countries, like the United\nStates, France, and Denmark have very high-quality imagery available for some areas.\n\nImagery is sometimes offset from the map data because of a mistake on the\nimagery provider's side. If you see a lot of roads shifted from the background,\ndon't immediately move them all to match the background. Instead you can adjust\nthe imagery so that it matches the existing data by clicking 'Fix alignment' at\nthe bottom of the Background Settings UI.\n",
        "addresses": "# Addresses\n\nAddresses are some of the most useful information for the map.\n\nAlthough addresses are often represented as parts of streets, in OpenStreetMap\nthey're recorded as attributes of buildings and places along streets.\n\nYou can add address information to places mapped as building outlines\nas well as those mapped as single points. The optimal source of address\ndata is from an on-the-ground survey or personal knowledge - as with any\nother feature, copying from commercial sources like Google Maps is strictly\nforbidden.\n",
        "inspector": "# Using the Inspector\n\nThe inspector is the section on the left side of the page that allows you to\nedit the details of the selected feature.\n\n### Selecting a Feature Type\n\nAfter you add a point, line, or area, you can choose what type of feature it\nis, like whether it's a highway or residential road, supermarket or cafe.\nThe inspector will display buttons for common feature types, and you can\nfind others by typing what you're looking for in the search box.\n\nClick the 'i' in the bottom-right-hand corner of a feature type button to\nlearn more about it. Click a button to choose that type.\n\n### Using Forms and Editing Tags\n\nAfter you choose a feature type, or when you select a feature that already\nhas a type assigned, the inspector will display fields with details about\nthe feature like its name and address.\n\nBelow the fields you see, you can click icons to add other details,\nlike [Wikipedia](http://www.wikipedia.org/) information, wheelchair\naccess, and more.\n\nAt the bottom of the inspector, click 'Additional tags' to add arbitrary\nother tags to the element. [Taginfo](http://taginfo.openstreetmap.org/) is a\ngreat resource for learn more about popular tag combinations.\n\nChanges you make in the inspector are automatically applied to the map.\nYou can undo them at any time by clicking the 'Undo' button.\n",
        "buildings": "# Buildings\n\nOpenStreetMap is the world's largest database of buildings. You can create\nand improve this database.\n\n### Selecting\n\nYou can select a building by clicking on its border. This will highlight the\nbuilding and open a small tools menu and a sidebar showing more information\nabout the building.\n\n### Modifying\n\nSometimes buildings are incorrectly placed or have incorrect tags.\n\nTo move an entire building, select it, then click the 'Move' tool. Move your\nmouse to shift the building, and click when it's correctly placed.\n\nTo fix the specific shape of a building, click and drag the nodes that form\nits border into better places.\n\n### Creating\n\nOne of the main questions around adding buildings to the map is that\nOpenStreetMap records buildings both as shapes and points. The rule of thumb\nis to _map a building as a shape whenever possible_, and map companies, homes,\namenities, and other things that operate out of buildings as points placed\nwithin the building shape.\n\nStart drawing a building as a shape by clicking the 'Area' button in the top\nleft of the interface, and end it either by pressing 'Return' on your keyboard\nor clicking on the first node drawn to close the shape.\n\n### Deleting\n\nIf a building is entirely incorrect - you can see that it doesn't exist in satellite\nimagery and ideally have confirmed locally that it's not present - you can delete\nit, which removes it from the map. Be cautious when deleting features -\nlike any other edit, the results are seen by everyone and satellite imagery\nis often out of date, so the building could simply be newly built.\n\nYou can delete a building by clicking on it to select it, then clicking the\ntrash can icon or pressing the 'Delete' key.\n",
        "relations": "# Relations\n\nA relation is a special type of feature in OpenStreetMap that groups together\nother features. For example, two common types of relations are *route relations*,\nwhich group together sections of road that belong to a specific freeway or\nhighway, and *multipolygons*, which group together several lines that define\na complex area (one with several pieces or holes in it like a donut).\n\nThe group of features in a relation are called *members*. In the sidebar, you can\nsee which relations a feature is a member of, and click on a relation there\nto select the it. When the relation is selected, you can see all of its\nmembers listed in the sidebar and highlighted on the map.\n\nFor the most part, iD will take care of maintaining relations automatically\nwhile you edit. The main thing you should be aware of is that if you delete a\nsection of road to redraw it more accurately, you should make sure that the\nnew section is a member of the same relations as the original.\n\n## Editing Relations\n\nIf you want to edit relations, here are the basics.\n\nTo add a feature to a relation, select the feature, click the \"+\" button in the\n\"All relations\" section of the sidebar, and select or type the name of the relation.\n\nTo create a new relation, select the first feature that should be a member,\nclick the \"+\" button in the \"All relations\" section, and select \"New relation...\".\n\nTo remove a feature from a relation, select the feature and click the trash\nbutton next to the relation you want to remove it from.\n\nYou can create multipolygons with holes using the \"Merge\" tool. Draw two areas (inner\nand outer), hold the Shift key and click on each of them to select them both, and then\nclick the \"Merge\" (+) button.\n"
    },
    "intro": {
        "navigation": {
            "title": "Navigation",
            "drag": "The main map area shows OpenStreetMap data on top of a background. You can navigate by dragging and scrolling, just like any web map. **Drag the map!**",
            "select": "Map features are represented three ways: using points, lines or areas. All features can be selected by clicking on them. **Click on the point to select it.**",
            "header": "The header shows us the feature type.",
            "pane": "When a feature is selected, the feature editor is displayed. The header shows us the feature type and the main pane shows the feature's attributes, such as its name and address. **Close the feature editor with the close button in the top right.**"
        },
        "points": {
            "title": "Points",
            "add": "Points can be used to represent features such as shops, restaurants and monuments. They mark a specific location, and describe what's there. **Click the Point button to add a new point.**",
            "place": "The point can be placed by clicking on the map. **Place the point on top of the building.**",
            "search": "There are many different features that can be represented by points. The point you just added is a Cafe. **Search for '{name}'**",
            "choose": "**Choose Cafe from the list.**",
            "describe": "The point is now marked as a cafe. Using the feature editor, we can add more information about the feature. **Add a name**",
            "close": "The feature editor can be closed by clicking on the close button. **Close the feature editor**",
            "reselect": "Often points will already exist, but have mistakes or be incomplete. We can edit existing points. **Select the point you just created.**",
            "fixname": "**Change the name and close the feature editor.**",
            "reselect_delete": "All features on the map can be deleted. **Click on the point you created.**",
            "delete": "The menu around the point contains operations that can be performed on it, including delete. **Delete the point.**"
        },
        "areas": {
            "title": "Areas",
            "add": "Areas are a more detailed way to represent features. They provide information on the boundaries of the feature. Areas can be used for most feature types points can be used for, and are often preferred. **Click the Area button to add a new area.**",
            "corner": "Areas are drawn by placing nodes that mark the boundary of the area. **Place the starting node on one of the corners of the playground.**",
            "place": "Draw the area by placing more nodes. Finish the area by clicking on the starting node. **Draw an area for the playground.**",
            "search": "**Search for '{name}'.**",
            "choose": "**Choose Playground from the list.**",
            "describe": "**Add a name, and close the feature editor**"
        },
        "lines": {
            "title": "Lines",
            "add": "Lines are used to represent features such as roads, railroads and rivers. **Click the Line button to add a new line.**",
            "start": "**Start the line by clicking on the end of the road.**",
            "intersect": "Click to add more nodes to the line. You can drag the map while drawing if necessary. Roads, and many other types of lines, are part of a larger network. It is important for these lines to be connected properly in order for routing applications to work. **Click on Flower Street, to create an intersection connecting the two lines.**",
            "finish": "Lines can be finished by clicking on the last node again. **Finish drawing the road.**",
            "road": "**Select Road from the list**",
            "residential": "There are different types of roads, the most common of which is Residential. **Choose the Residential road type**",
            "describe": "**Name the road and close the feature editor.**",
            "restart": "The road needs to intersect Flower Street.",
            "wrong_preset": "You didn't select the Residential road type. **Click here to choose again**"
        },
        "startediting": {
            "title": "Start Editing",
            "help": "More documentation and this walkthrough are available here.",
            "save": "Don't forget to regularly save your changes!",
            "start": "Start mapping!"
        }
    },
    "presets": {
        "categories": {
            "category-building": {
                "name": "Building"
            },
            "category-golf": {
                "name": "Golf"
            },
            "category-landuse": {
                "name": "Land Use"
            },
            "category-path": {
                "name": "Path"
            },
            "category-rail": {
                "name": "Rail"
            },
            "category-restriction": {
                "name": "Restriction"
            },
            "category-road": {
                "name": "Road"
            },
            "category-route": {
                "name": "Route"
            },
            "category-water-area": {
                "name": "Water"
            },
            "category-water-line": {
                "name": "Water"
            }
        },
        "fields": {
            "access": {
                "label": "Access",
                "placeholder": "Unknown",
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
            },
            "access_simple": {
                "label": "Access",
                "placeholder": "yes"
            },
            "access_toilets": {
                "label": "Access"
            },
            "address": {
                "label": "Address",
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
            },
            "admin_level": {
                "label": "Admin Level"
            },
            "aerialway": {
                "label": "Type"
            },
            "aerialway/access": {
                "label": "Access",
                "options": {
                    "entry": "Entry",
                    "exit": "Exit",
                    "both": "Both"
                }
            },
            "aerialway/bubble": {
                "label": "Bubble"
            },
            "aerialway/capacity": {
                "label": "Capacity (per hour)",
                "placeholder": "500, 2500, 5000..."
            },
            "aerialway/duration": {
                "label": "Duration (minutes)",
                "placeholder": "1, 2, 3..."
            },
            "aerialway/heating": {
                "label": "Heated"
            },
            "aerialway/occupancy": {
                "label": "Occupancy",
                "placeholder": "2, 4, 8..."
            },
            "aerialway/summer/access": {
                "label": "Access (summer)",
                "options": {
                    "entry": "Entry",
                    "exit": "Exit",
                    "both": "Both"
                }
            },
            "aeroway": {
                "label": "Type"
            },
            "amenity": {
                "label": "Type"
            },
            "artist": {
                "label": "Artist"
            },
            "artwork_type": {
                "label": "Type"
            },
            "atm": {
                "label": "ATM"
            },
            "backrest": {
                "label": "Backrest"
            },
            "barrier": {
                "label": "Type"
            },
            "bicycle_parking": {
                "label": "Type"
            },
            "boundary": {
                "label": "Type"
            },
            "building": {
                "label": "Building"
            },
            "building_area": {
                "label": "Building"
            },
            "capacity": {
                "label": "Capacity",
                "placeholder": "50, 100, 200..."
            },
            "cardinal_direction": {
                "label": "Direction",
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
            },
            "clock_direction": {
                "label": "Direction",
                "options": {
                    "clockwise": "Clockwise",
                    "anticlockwise": "Counterclockwise"
                }
            },
            "collection_times": {
                "label": "Collection Times"
            },
            "construction": {
                "label": "Type"
            },
            "country": {
                "label": "Country"
            },
            "covered": {
                "label": "Covered"
            },
            "crop": {
                "label": "Crop"
            },
            "crossing": {
                "label": "Type"
            },
            "cuisine": {
                "label": "Cuisine"
            },
            "denomination": {
                "label": "Denomination"
            },
            "denotation": {
                "label": "Denotation"
            },
            "description": {
                "label": "Description"
            },
            "electrified": {
                "label": "Electrification",
                "placeholder": "Contact Line, Electrified Rail...",
                "options": {
                    "contact_line": "Contact Line",
                    "rail": "Electrified Rail",
                    "yes": "Yes (unspecified)",
                    "no": "No"
                }
            },
            "elevation": {
                "label": "Elevation"
            },
            "emergency": {
                "label": "Emergency"
            },
            "entrance": {
                "label": "Type"
            },
            "except": {
                "label": "Exceptions"
            },
            "fax": {
                "label": "Fax",
                "placeholder": "+31 42 123 4567"
            },
            "fee": {
                "label": "Fee"
            },
            "fire_hydrant/type": {
                "label": "Type",
                "options": {
                    "pillar": "Pillar/Aboveground",
                    "underground": "Underground",
                    "wall": "Wall",
                    "pond": "Pond"
                }
            },
            "fixme": {
                "label": "Fix Me"
            },
            "fuel": {
                "label": "Fuel"
            },
            "fuel/biodiesel": {
                "label": "Sells Biodiesel"
            },
            "fuel/diesel": {
                "label": "Sells Diesel"
            },
            "fuel/e10": {
                "label": "Sells E10"
            },
            "fuel/e85": {
                "label": "Sells E85"
            },
            "fuel/lpg": {
                "label": "Sells Propane"
            },
            "fuel/octane_100": {
                "label": "Sells Racing Gasoline"
            },
            "fuel/octane_91": {
                "label": "Sells Regular Gasoline"
            },
            "fuel/octane_95": {
                "label": "Sells Midgrade Gasoline"
            },
            "fuel/octane_98": {
                "label": "Sells Premium Gasoline"
            },
            "gauge": {
                "label": "Gauge"
            },
            "generator/method": {
                "label": "Method"
            },
            "generator/source": {
                "label": "Source"
            },
            "generator/type": {
                "label": "Type"
            },
            "golf_hole": {
                "label": "Reference",
                "placeholder": "Hole number (1-18)"
            },
            "handicap": {
                "label": "Handicap",
                "placeholder": "1-18"
            },
            "highway": {
                "label": "Type"
            },
            "historic": {
                "label": "Type"
            },
            "hoops": {
                "label": "Hoops",
                "placeholder": "1, 2, 4..."
            },
            "iata": {
                "label": "IATA"
            },
            "icao": {
                "label": "ICAO"
            },
            "incline": {
                "label": "Incline"
            },
            "information": {
                "label": "Type"
            },
            "internet_access": {
                "label": "Internet Access",
                "options": {
                    "yes": "Yes",
                    "no": "No",
                    "wlan": "Wifi",
                    "wired": "Wired",
                    "terminal": "Terminal"
                }
            },
            "lamp_type": {
                "label": "Type"
            },
            "landuse": {
                "label": "Type"
            },
            "lanes": {
                "label": "Lanes",
                "placeholder": "1, 2, 3..."
            },
            "layer": {
                "label": "Layer"
            },
            "leisure": {
                "label": "Type"
            },
            "length": {
                "label": "Length (Meters)"
            },
            "levels": {
                "label": "Levels",
                "placeholder": "2, 4, 6..."
            },
            "lit": {
                "label": "Lit"
            },
            "location": {
                "label": "Location"
            },
            "man_made": {
                "label": "Type"
            },
            "maxspeed": {
                "label": "Speed Limit",
                "placeholder": "40, 50, 60..."
            },
            "mtb/scale": {
                "label": "Mountain Biking Difficulty",
                "placeholder": "0, 1, 2, 3...",
                "options": {
                    "0": "0: Solid gravel/packed earth, no obstacles, wide curves",
                    "1": "1: Some loose surface, small obstacles, wide curves",
                    "2": "2: Much loose surface, large obstacles, easy hairpins",
                    "3": "3: Slippery surface, large obstacles, tight hairpins",
                    "4": "4: Loose surface or boulders, dangerous hairpins",
                    "5": "5: Maximum difficulty, boulder fields, landslides",
                    "6": "6: Not rideable except by the very best mountain bikers"
                }
            },
            "mtb/scale/imba": {
                "label": "IMBA Trail Difficulty",
                "placeholder": "Easy, Medium, Difficult...",
                "options": {
                    "0": "Easiest (white circle)",
                    "1": "Easy (green circle)",
                    "2": "Medium (blue square)",
                    "3": "Difficult (black diamond)",
                    "4": "Extremely Difficult (double black diamond)"
                }
            },
            "mtb/scale/uphill": {
                "label": "Mountain Biking Uphill Difficulty",
                "placeholder": "0, 1, 2, 3...",
                "options": {
                    "0": "0: Avg. incline <10%, gravel/packed earth, no obstacles",
                    "1": "1: Avg. incline <15%, gravel/packed earth, few small objects",
                    "2": "2: Avg. incline <20%, stable surface, fistsize rocks/roots",
                    "3": "3: Avg. incline <25%, variable surface, fistsize rocks/branches",
                    "4": "4: Avg. incline <30%, poor condition, big rocks/branches",
                    "5": "5: Very steep, bike generally needs to be pushed or carried"
                }
            },
            "name": {
                "label": "Name",
                "placeholder": "Common name (if any)"
            },
            "natural": {
                "label": "Natural"
            },
            "network": {
                "label": "Network"
            },
            "note": {
                "label": "Note"
            },
            "office": {
                "label": "Type"
            },
            "oneway": {
                "label": "One Way",
                "options": {
                    "undefined": "Assumed to be No",
                    "yes": "Yes",
                    "no": "No"
                }
            },
            "oneway_yes": {
                "label": "One Way",
                "options": {
                    "undefined": "Assumed to be Yes",
                    "yes": "Yes",
                    "no": "No"
                }
            },
            "opening_hours": {
                "label": "Hours"
            },
            "operator": {
                "label": "Operator"
            },
            "par": {
                "label": "Par",
                "placeholder": "3, 4, 5..."
            },
            "park_ride": {
                "label": "Park and Ride"
            },
            "parking": {
                "label": "Type",
                "options": {
                    "surface": "Surface",
                    "multi-storey": "Multilevel",
                    "underground": "Underground",
                    "sheds": "Sheds",
                    "carports": "Carports",
                    "garage_boxes": "Garage Boxes",
                    "lane": "Roadside Lane"
                }
            },
            "phone": {
                "label": "Phone",
                "placeholder": "+31 42 123 4567"
            },
            "piste/difficulty": {
                "label": "Difficulty",
                "placeholder": "Easy, Intermediate, Advanced...",
                "options": {
                    "novice": "Novice (instructional)",
                    "easy": "Easy (green circle)",
                    "intermediate": "Intermediate (blue square)",
                    "advanced": "Advanced (black diamond)",
                    "expert": "Expert (double black diamond)",
                    "freeride": "Freeride (off-piste)",
                    "extreme": "Extreme (climbing equipment required)"
                }
            },
            "piste/grooming": {
                "label": "Grooming",
                "options": {
                    "classic": "Classic",
                    "mogul": "Mogul",
                    "backcountry": "Backcountry",
                    "classic+skating": "Classic and Skating",
                    "scooter": "Scooter/Snowmobile",
                    "skating": "Skating"
                }
            },
            "piste/type": {
                "label": "Type",
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
            },
            "place": {
                "label": "Type"
            },
            "population": {
                "label": "Population"
            },
            "power": {
                "label": "Type"
            },
            "railway": {
                "label": "Type"
            },
            "recycling/cans": {
                "label": "Accepts Cans"
            },
            "recycling/clothes": {
                "label": "Accepts Clothes"
            },
            "recycling/glass": {
                "label": "Accepts Glass"
            },
            "recycling/paper": {
                "label": "Accepts Paper"
            },
            "ref": {
                "label": "Reference"
            },
            "relation": {
                "label": "Type"
            },
            "religion": {
                "label": "Religion"
            },
            "restriction": {
                "label": "Type"
            },
            "restrictions": {
                "label": "Turn Restrictions"
            },
            "route": {
                "label": "Type"
            },
            "route_master": {
                "label": "Type"
            },
            "sac_scale": {
                "label": "Hiking Difficulty",
                "placeholder": "Mountain Hiking, Alpine Hiking...",
                "options": {
                    "hiking": "T1: Hiking",
                    "mountain_hiking": "T2: Mountain Hiking",
                    "demanding_mountain_hiking": "T3: Demanding Mountain Hiking",
                    "alpine_hiking": "T4: Alpine Hiking",
                    "demanding_alpine_hiking": "T5: Demanding Alpine Hiking",
                    "difficult_alpine_hiking": "T6: Difficult Alpine Hiking"
                }
            },
            "seasonal": {
                "label": "Seasonal"
            },
            "service": {
                "label": "Type"
            },
            "shelter": {
                "label": "Shelter"
            },
            "shelter_type": {
                "label": "Type"
            },
            "shop": {
                "label": "Type"
            },
            "sloped_curb": {
                "label": "Sloped Curb"
            },
            "smoking": {
                "label": "Smoking",
                "placeholder": "No, Separated, Yes...",
                "options": {
                    "no": "No smoking anywhere",
                    "separated": "In smoking areas, not physically isolated",
                    "isolated": "In smoking areas, physically isolated",
                    "outside": "Allowed outside",
                    "yes": "Allowed everywhere",
                    "dedicated": "Dedicated to smokers (e.g. smokers' club)"
                }
            },
            "smoothness": {
                "label": "Smoothness",
                "placeholder": "Thin Rollers, Wheels, Off-Road...",
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
            },
            "social_facility_for": {
                "label": "People served",
                "placeholder": "Homeless, Disabled, Child, etc"
            },
            "source": {
                "label": "Source"
            },
            "sport": {
                "label": "Sport"
            },
            "sport_ice": {
                "label": "Sport"
            },
            "structure": {
                "label": "Structure",
                "placeholder": "Unknown",
                "options": {
                    "bridge": "Bridge",
                    "tunnel": "Tunnel",
                    "embankment": "Embankment",
                    "cutting": "Cutting",
                    "ford": "Ford"
                }
            },
            "studio_type": {
                "label": "Type"
            },
            "supervised": {
                "label": "Supervised"
            },
            "surface": {
                "label": "Surface"
            },
            "tactile_paving": {
                "label": "Tactile Paving"
            },
            "toilets/disposal": {
                "label": "Disposal",
                "options": {
                    "flush": "Flush",
                    "pitlatrine": "Pit/Latrine",
                    "chemical": "Chemical",
                    "bucket": "Bucket"
                }
            },
            "tourism": {
                "label": "Type"
            },
            "towertype": {
                "label": "Tower type"
            },
            "tracktype": {
                "label": "Track Type",
                "placeholder": "Solid, Mostly Solid, Soft...",
                "options": {
                    "grade1": "Solid: paved or heavily compacted hardcore surface",
                    "grade2": "Mostly Solid: gravel/rock with some soft material mixed in",
                    "grade3": "Even mixture of hard and soft materials",
                    "grade4": "Mostly Soft: soil/sand/grass with some hard material mixed in",
                    "grade5": "Soft: soil/sand/grass"
                }
            },
            "trail_visibility": {
                "label": "Trail Visibility",
                "placeholder": "Excellent, Good, Bad...",
                "options": {
                    "excellent": "Excellent: unambiguous path or markers everywhere",
                    "good": "Good: markers visible, sometimes require searching",
                    "intermediate": "Intermediate: few markers, path mostly visible",
                    "bad": "Bad: no markers, path sometimes invisible/pathless",
                    "horrible": "Horrible: often pathless, some orientation skills required",
                    "no": "No: pathless, excellent orientation skills required"
                }
            },
            "tree_type": {
                "label": "Type"
            },
            "trees": {
                "label": "Trees"
            },
            "tunnel": {
                "label": "Tunnel"
            },
            "vending": {
                "label": "Type of Goods"
            },
            "water": {
                "label": "Type"
            },
            "waterway": {
                "label": "Type"
            },
            "website": {
                "label": "Website",
                "placeholder": "http://example.com/"
            },
            "wetland": {
                "label": "Type"
            },
            "wheelchair": {
                "label": "Wheelchair Access"
            },
            "width": {
                "label": "Width (Meters)"
            },
            "wikipedia": {
                "label": "Wikipedia"
            },
            "wood": {
                "label": "Type"
            }
        },
        "presets": {
            "address": {
                "name": "Address",
                "terms": ""
            },
            "aerialway": {
                "name": "Aerialway",
                "terms": "ski lift,funifor,funitel"
            },
            "aerialway/cable_car": {
                "name": "Cable Car",
                "terms": "tramway,ropeway"
            },
            "aerialway/chair_lift": {
                "name": "Chair Lift",
                "terms": ""
            },
            "aerialway/gondola": {
                "name": "Gondola",
                "terms": ""
            },
            "aerialway/magic_carpet": {
                "name": "Magic Carpet Lift",
                "terms": ""
            },
            "aerialway/platter": {
                "name": "Platter Lift",
                "terms": "button lift,poma lift"
            },
            "aerialway/pylon": {
                "name": "Aerialway Pylon",
                "terms": ""
            },
            "aerialway/rope_tow": {
                "name": "Rope Tow Lift",
                "terms": "handle tow,bugel lift"
            },
            "aerialway/station": {
                "name": "Aerialway Station",
                "terms": ""
            },
            "aerialway/t-bar": {
                "name": "T-bar Lift",
                "terms": ""
            },
            "aeroway": {
                "name": "Aeroway",
                "terms": ""
            },
            "aeroway/aerodrome": {
                "name": "Airport",
                "terms": "airplane,airport,aerodrome"
            },
            "aeroway/apron": {
                "name": "Apron",
                "terms": "ramp"
            },
            "aeroway/gate": {
                "name": "Airport gate",
                "terms": ""
            },
            "aeroway/hangar": {
                "name": "Hangar",
                "terms": ""
            },
            "aeroway/helipad": {
                "name": "Helipad",
                "terms": "helicopter,helipad,heliport"
            },
            "aeroway/runway": {
                "name": "Runway",
                "terms": "landing strip"
            },
            "aeroway/taxiway": {
                "name": "Taxiway",
                "terms": ""
            },
            "aeroway/terminal": {
                "name": "Airport terminal",
                "terms": "airport,aerodrome"
            },
            "amenity": {
                "name": "Amenity",
                "terms": ""
            },
            "amenity/arts_centre": {
                "name": "Arts Center",
                "terms": "arts,arts centre"
            },
            "amenity/atm": {
                "name": "ATM",
                "terms": ""
            },
            "amenity/bank": {
                "name": "Bank",
                "terms": "coffer,countinghouse,credit union,depository,exchequer,fund,hoard,investment firm,repository,reserve,reservoir,safe,savings,stock,stockpile,store,storehouse,thrift,treasury,trust company,vault"
            },
            "amenity/bar": {
                "name": "Bar",
                "terms": ""
            },
            "amenity/bbq": {
                "name": "Barbecue/Grill",
                "terms": "barbecue,bbq,grill"
            },
            "amenity/bench": {
                "name": "Bench",
                "terms": ""
            },
            "amenity/bicycle_parking": {
                "name": "Bicycle Parking",
                "terms": ""
            },
            "amenity/bicycle_rental": {
                "name": "Bicycle Rental",
                "terms": ""
            },
            "amenity/boat_rental": {
                "name": "Boat Rental",
                "terms": ""
            },
            "amenity/bus_station": {
                "name": "Bus Station",
                "terms": ""
            },
            "amenity/cafe": {
                "name": "Cafe",
                "terms": "coffee,tea,coffee shop"
            },
            "amenity/car_rental": {
                "name": "Car Rental",
                "terms": ""
            },
            "amenity/car_sharing": {
                "name": "Car Sharing",
                "terms": ""
            },
            "amenity/car_wash": {
                "name": "Car Wash",
                "terms": ""
            },
            "amenity/charging_station": {
                "name": "Charging Station",
                "terms": "EV,Electric Vehicle,Supercharger"
            },
            "amenity/childcare": {
                "name": "Childcare",
                "terms": "nursery,orphanage,playgroup"
            },
            "amenity/cinema": {
                "name": "Cinema",
                "terms": "big screen,bijou,cine,drive-in,film,flicks,motion pictures,movie house,movie theater,moving pictures,nabes,photoplay,picture show,pictures,playhouse,show,silver screen"
            },
            "amenity/clinic": {
                "name": "Clinic",
                "terms": "clinic,medical clinic"
            },
            "amenity/clock": {
                "name": "Clock",
                "terms": ""
            },
            "amenity/college": {
                "name": "College",
                "terms": ""
            },
            "amenity/compressed_air": {
                "name": "Compressed Air",
                "terms": ""
            },
            "amenity/courthouse": {
                "name": "Courthouse",
                "terms": ""
            },
            "amenity/dentist": {
                "name": "Dentist",
                "terms": "dentist,dentist's office"
            },
            "amenity/doctor": {
                "name": "Doctor",
                "terms": "doctor,doctor's office"
            },
            "amenity/dojo": {
                "name": "Dojo / Martial Arts Academy",
                "terms": "martial arts,dojo,dojang"
            },
            "amenity/drinking_water": {
                "name": "Drinking Water",
                "terms": "water fountain,potable water"
            },
            "amenity/embassy": {
                "name": "Embassy",
                "terms": ""
            },
            "amenity/fast_food": {
                "name": "Fast Food",
                "terms": ""
            },
            "amenity/fire_station": {
                "name": "Fire Station",
                "terms": ""
            },
            "amenity/fountain": {
                "name": "Fountain",
                "terms": ""
            },
            "amenity/fuel": {
                "name": "Gas Station",
                "terms": "petrol,fuel,propane,diesel,lng,cng,biodiesel"
            },
            "amenity/grave_yard": {
                "name": "Graveyard",
                "terms": ""
            },
            "amenity/hospital": {
                "name": "Hospital Grounds",
                "terms": "clinic,emergency room,health service,hospice,infirmary,institution,nursing home,rest home,sanatorium,sanitarium,sick bay,surgery,ward"
            },
            "amenity/kindergarten": {
                "name": "Kindergarten Grounds",
                "terms": "nursery,preschool"
            },
            "amenity/library": {
                "name": "Library",
                "terms": ""
            },
            "amenity/marketplace": {
                "name": "Marketplace",
                "terms": ""
            },
            "amenity/nightclub": {
                "name": "Nightclub",
                "terms": "disco*,night club,dancing,dance club"
            },
            "amenity/parking": {
                "name": "Car Parking",
                "terms": ""
            },
            "amenity/parking_entrance": {
                "name": "Parking Garage Entrance/Exit",
                "terms": ""
            },
            "amenity/pharmacy": {
                "name": "Pharmacy",
                "terms": ""
            },
            "amenity/place_of_worship": {
                "name": "Place of Worship",
                "terms": "abbey,basilica,bethel,cathedral,chancel,chantry,chapel,church,fold,house of God,house of prayer,house of worship,minster,mission,mosque,oratory,parish,sacellum,sanctuary,shrine,synagogue,tabernacle,temple"
            },
            "amenity/place_of_worship/buddhist": {
                "name": "Buddhist Temple",
                "terms": "stupa,vihara,monastery,temple,pagoda,zendo,dojo"
            },
            "amenity/place_of_worship/christian": {
                "name": "Church",
                "terms": "christian,abbey,basilica,bethel,cathedral,chancel,chantry,chapel,church,fold,house of God,house of prayer,house of worship,minster,mission,oratory,parish,sacellum,sanctuary,shrine,tabernacle,temple"
            },
            "amenity/place_of_worship/jewish": {
                "name": "Synagogue",
                "terms": "jewish,synagogue"
            },
            "amenity/place_of_worship/muslim": {
                "name": "Mosque",
                "terms": "muslim,mosque"
            },
            "amenity/police": {
                "name": "Police",
                "terms": "badge,bear,blue,bluecoat,bobby,boy scout,bull,constable,constabulary,cop,copper,corps,county mounty,detective,fed,flatfoot,force,fuzz,gendarme,gumshoe,heat,law,law enforcement,man,narc,officers,patrolman,police"
            },
            "amenity/post_box": {
                "name": "Mailbox",
                "terms": "letter drop,letterbox,mail drop,mailbox,pillar box,postbox"
            },
            "amenity/post_office": {
                "name": "Post Office",
                "terms": ""
            },
            "amenity/pub": {
                "name": "Pub",
                "terms": ""
            },
            "amenity/ranger_station": {
                "name": "Ranger Station",
                "terms": "visitor center,visitor centre,permit center,permit centre,backcountry office,warden office,warden center"
            },
            "amenity/recycling": {
                "name": "Recycling",
                "terms": ""
            },
            "amenity/restaurant": {
                "name": "Restaurant",
                "terms": "bar,cafeteria,café,canteen,chophouse,coffee shop,diner,dining room,dive*,doughtnut shop,drive-in,eatery,eating house,eating place,fast-food place,fish and chips,greasy spoon,grill,hamburger stand,hashery,hideaway,hotdog stand,inn,joint*,luncheonette,lunchroom,night club,outlet*,pizzeria,saloon,soda fountain,watering hole"
            },
            "amenity/school": {
                "name": "School Grounds",
                "terms": "academy,alma mater,blackboard,college,department,discipline,establishment,faculty,hall,halls of ivy,institute,institution,jail*,schoolhouse,seminary,university"
            },
            "amenity/shelter": {
                "name": "Shelter",
                "terms": "lean-to"
            },
            "amenity/social_facility": {
                "name": "Social Facility",
                "terms": ""
            },
            "amenity/social_facility/food_bank": {
                "name": "Food Bank",
                "terms": ""
            },
            "amenity/social_facility/group_home": {
                "name": "Group Home",
                "terms": "elderly,old,senior living"
            },
            "amenity/social_facility/homeless_shelter": {
                "name": "Homeless Shelter",
                "terms": "houseless,unhoused,displaced"
            },
            "amenity/studio": {
                "name": "Studio",
                "terms": "recording studio,studio,radio,radio studio,television,television studio"
            },
            "amenity/swimming_pool": {
                "name": "Swimming Pool",
                "terms": ""
            },
            "amenity/taxi": {
                "name": "Taxi Stand",
                "terms": "cab"
            },
            "amenity/telephone": {
                "name": "Telephone",
                "terms": "phone"
            },
            "amenity/theatre": {
                "name": "Theater",
                "terms": "theatre,performance,play,musical"
            },
            "amenity/toilets": {
                "name": "Toilets",
                "terms": "bathroom,restroom,outhouse,privy,head,lavatory,latrine,water closet,WC,W.C."
            },
            "amenity/townhall": {
                "name": "Town Hall",
                "terms": "village hall,city government,courthouse,municipal building,municipal center,municipal centre"
            },
            "amenity/university": {
                "name": "University",
                "terms": "college"
            },
            "amenity/vending_machine": {
                "name": "Vending Machine",
                "terms": ""
            },
            "amenity/veterinary": {
                "name": "Veterinary",
                "terms": "pet clinic,veterinarian,animal hospital,pet doctor"
            },
            "amenity/waste_basket": {
                "name": "Waste Basket",
                "terms": "rubbish bin,litter bin,trash can,garbage can"
            },
            "area": {
                "name": "Area",
                "terms": ""
            },
            "barrier": {
                "name": "Barrier",
                "terms": ""
            },
            "barrier/block": {
                "name": "Block",
                "terms": ""
            },
            "barrier/bollard": {
                "name": "Bollard",
                "terms": ""
            },
            "barrier/cattle_grid": {
                "name": "Cattle Grid",
                "terms": ""
            },
            "barrier/city_wall": {
                "name": "City Wall",
                "terms": ""
            },
            "barrier/cycle_barrier": {
                "name": "Cycle Barrier",
                "terms": ""
            },
            "barrier/ditch": {
                "name": "Ditch",
                "terms": ""
            },
            "barrier/entrance": {
                "name": "Entrance",
                "terms": ""
            },
            "barrier/fence": {
                "name": "Fence",
                "terms": ""
            },
            "barrier/gate": {
                "name": "Gate",
                "terms": ""
            },
            "barrier/hedge": {
                "name": "Hedge",
                "terms": ""
            },
            "barrier/kissing_gate": {
                "name": "Kissing Gate",
                "terms": ""
            },
            "barrier/lift_gate": {
                "name": "Lift Gate",
                "terms": ""
            },
            "barrier/retaining_wall": {
                "name": "Retaining Wall",
                "terms": ""
            },
            "barrier/stile": {
                "name": "Stile",
                "terms": ""
            },
            "barrier/toll_booth": {
                "name": "Toll Booth",
                "terms": ""
            },
            "barrier/wall": {
                "name": "Wall",
                "terms": ""
            },
            "boundary/administrative": {
                "name": "Administrative Boundary",
                "terms": ""
            },
            "building": {
                "name": "Building",
                "terms": ""
            },
            "building/apartments": {
                "name": "Apartments",
                "terms": ""
            },
            "building/barn": {
                "name": "Barn",
                "terms": ""
            },
            "building/bunker": {
                "name": "Bunker",
                "terms": ""
            },
            "building/cabin": {
                "name": "Cabin",
                "terms": ""
            },
            "building/cathedral": {
                "name": "Cathedral",
                "terms": ""
            },
            "building/chapel": {
                "name": "Chapel",
                "terms": ""
            },
            "building/church": {
                "name": "Church",
                "terms": ""
            },
            "building/commercial": {
                "name": "Commercial Building",
                "terms": ""
            },
            "building/construction": {
                "name": "Building Under Construction",
                "terms": ""
            },
            "building/detached": {
                "name": "Detached Home",
                "terms": ""
            },
            "building/dormitory": {
                "name": "Dormitory",
                "terms": ""
            },
            "building/entrance": {
                "name": "Entrance/Exit",
                "terms": ""
            },
            "building/garage": {
                "name": "Garage",
                "terms": ""
            },
            "building/garages": {
                "name": "Garages",
                "terms": ""
            },
            "building/greenhouse": {
                "name": "Greenhouse",
                "terms": ""
            },
            "building/hospital": {
                "name": "Hospital Building",
                "terms": ""
            },
            "building/hotel": {
                "name": "Hotel Building",
                "terms": ""
            },
            "building/house": {
                "name": "House",
                "terms": ""
            },
            "building/hut": {
                "name": "Hut",
                "terms": ""
            },
            "building/industrial": {
                "name": "Industrial Building",
                "terms": ""
            },
            "building/public": {
                "name": "Public Building",
                "terms": ""
            },
            "building/residential": {
                "name": "Residential Building",
                "terms": ""
            },
            "building/retail": {
                "name": "Retail Building",
                "terms": ""
            },
            "building/roof": {
                "name": "Roof",
                "terms": ""
            },
            "building/school": {
                "name": "School Building",
                "terms": ""
            },
            "building/shed": {
                "name": "Shed",
                "terms": ""
            },
            "building/stable": {
                "name": "Stable",
                "terms": ""
            },
            "building/static_caravan": {
                "name": "Static Mobile Home",
                "terms": ""
            },
            "building/terrace": {
                "name": "Row Houses",
                "terms": ""
            },
            "building/train_station": {
                "name": "Train Station",
                "terms": ""
            },
            "building/university": {
                "name": "University Building",
                "terms": ""
            },
            "building/warehouse": {
                "name": "Warehouse",
                "terms": ""
            },
            "craft/basket_maker": {
                "name": "Basket Maker",
                "terms": "basket,basketry,basket maker,basket weaver"
            },
            "craft/beekeeper": {
                "name": "Beekeeper",
                "terms": "bees,beekeeper,bee box"
            },
            "craft/blacksmith": {
                "name": "Blacksmith",
                "terms": "blacksmith"
            },
            "craft/boatbuilder": {
                "name": "Boat Builder",
                "terms": "boat builder"
            },
            "craft/bookbinder": {
                "name": "Bookbinder",
                "terms": "bookbinder,book repair"
            },
            "craft/brewery": {
                "name": "Brewery",
                "terms": "brewery"
            },
            "craft/carpenter": {
                "name": "Carpenter",
                "terms": "carpenter,woodworker"
            },
            "craft/carpet_layer": {
                "name": "Carpet Layer",
                "terms": "carpet layer"
            },
            "craft/caterer": {
                "name": "Caterer",
                "terms": "Caterer,Catering"
            },
            "craft/clockmaker": {
                "name": "Clockmaker",
                "terms": "clock,clockmaker,clock repair"
            },
            "craft/confectionary": {
                "name": "Confectionary",
                "terms": "confectionary,sweets,candy"
            },
            "craft/dressmaker": {
                "name": "Dressmaker",
                "terms": "dress,dressmaker"
            },
            "craft/electrician": {
                "name": "Electrician",
                "terms": "electrician"
            },
            "craft/gardener": {
                "name": "Gardener",
                "terms": "gardener,landscaper,grounds keeper"
            },
            "craft/glaziery": {
                "name": "Glaziery",
                "terms": "glass,glass foundry,stained-glass,window"
            },
            "craft/handicraft": {
                "name": "Handicraft",
                "terms": "handicraft"
            },
            "craft/hvac": {
                "name": "HVAC",
                "terms": "heating,ventilating,air-conditioning,air conditioning"
            },
            "craft/insulator": {
                "name": "Insulator",
                "terms": "insulation,insulator"
            },
            "craft/jeweler": {
                "name": "Jeweler",
                "terms": "jeweler,gem,diamond"
            },
            "craft/key_cutter": {
                "name": "Key Cutter",
                "terms": "key,key cutter"
            },
            "craft/locksmith": {
                "name": "Locksmith",
                "terms": "locksmith,lock"
            },
            "craft/metal_construction": {
                "name": "Metal Construction",
                "terms": "metal construction"
            },
            "craft/optician": {
                "name": "Optician",
                "terms": "glasses,optician"
            },
            "craft/painter": {
                "name": "Painter",
                "terms": "painter"
            },
            "craft/photographer": {
                "name": "Photographer",
                "terms": "photographer"
            },
            "craft/photographic_laboratory": {
                "name": "Photographic Laboratory",
                "terms": "photographic laboratory,film developer"
            },
            "craft/plasterer": {
                "name": "Plasterer",
                "terms": "plasterer"
            },
            "craft/plumber": {
                "name": "Plumber",
                "terms": "pumber"
            },
            "craft/pottery": {
                "name": "Pottery",
                "terms": "pottery,potter"
            },
            "craft/rigger": {
                "name": "Rigger",
                "terms": "rigger"
            },
            "craft/roofer": {
                "name": "Roofer",
                "terms": "roofer"
            },
            "craft/saddler": {
                "name": "Saddler",
                "terms": "saddler"
            },
            "craft/sailmaker": {
                "name": "Sailmaker",
                "terms": "sailmaker"
            },
            "craft/sawmill": {
                "name": "Sawmill",
                "terms": "sawmill,lumber"
            },
            "craft/scaffolder": {
                "name": "Scaffolder",
                "terms": "scaffolder"
            },
            "craft/sculpter": {
                "name": "Sculpter",
                "terms": "sculpter"
            },
            "craft/shoemaker": {
                "name": "Shoemaker",
                "terms": "shoe repair,shoemaker"
            },
            "craft/stonemason": {
                "name": "Stonemason",
                "terms": "stonemason,masonry"
            },
            "craft/sweep": {
                "name": "Chimney Sweep",
                "terms": "sweep,chimney sweep"
            },
            "craft/tailor": {
                "name": "Tailor",
                "terms": "tailor,clothes"
            },
            "craft/tiler": {
                "name": "Tiler",
                "terms": "tiler"
            },
            "craft/tinsmith": {
                "name": "Tinsmith",
                "terms": "tinsmith"
            },
            "craft/upholsterer": {
                "name": "Upholsterer",
                "terms": "upholsterer"
            },
            "craft/watchmaker": {
                "name": "Watchmaker",
                "terms": "watch,watchmaker,watch repair"
            },
            "craft/window_construction": {
                "name": "Window Construction",
                "terms": "window,window maker,window construction"
            },
            "embankment": {
                "name": "Embankment",
                "terms": ""
            },
            "emergency/ambulance_station": {
                "name": "Ambulance Station",
                "terms": ""
            },
            "emergency/fire_hydrant": {
                "name": "Fire Hydrant",
                "terms": ""
            },
            "emergency/phone": {
                "name": "Emergency Phone",
                "terms": ""
            },
            "entrance": {
                "name": "Entrance/Exit",
                "terms": ""
            },
            "footway/crossing": {
                "name": "Crossing",
                "terms": ""
            },
            "footway/crosswalk": {
                "name": "Crosswalk",
                "terms": "crosswalk,zebra crossing"
            },
            "footway/sidewalk": {
                "name": "Sidewalk",
                "terms": ""
            },
            "ford": {
                "name": "Ford",
                "terms": ""
            },
            "golf/bunker": {
                "name": "Sand Trap",
                "terms": "hazard,bunker"
            },
            "golf/fairway": {
                "name": "Fairway",
                "terms": ""
            },
            "golf/green": {
                "name": "Putting Green",
                "terms": "putting green"
            },
            "golf/hole": {
                "name": "Golf Hole",
                "terms": ""
            },
            "golf/lateral_water_hazard": {
                "name": "Lateral Water Hazard",
                "terms": ""
            },
            "golf/rough": {
                "name": "Rough",
                "terms": ""
            },
            "golf/tee": {
                "name": "Tee Box",
                "terms": "teeing ground"
            },
            "golf/water_hazard": {
                "name": "Water Hazard",
                "terms": ""
            },
            "highway": {
                "name": "Highway",
                "terms": ""
            },
            "highway/bridleway": {
                "name": "Bridle Path",
                "terms": "bridleway,equestrian trail,horse riding path,bridle road,horse trail"
            },
            "highway/bus_stop": {
                "name": "Bus Stop",
                "terms": ""
            },
            "highway/crossing": {
                "name": "Crossing",
                "terms": ""
            },
            "highway/crosswalk": {
                "name": "Crosswalk",
                "terms": "crosswalk,zebra crossing"
            },
            "highway/cycleway": {
                "name": "Cycle Path",
                "terms": ""
            },
            "highway/footway": {
                "name": "Foot Path",
                "terms": "beaten path,boulevard,clearing,course,cut*,drag*,footpath,highway,lane,line,orbit,passage,pathway,rail,rails,road,roadway,route,street,thoroughfare,trackway,trail,trajectory,walk"
            },
            "highway/living_street": {
                "name": "Living Street",
                "terms": ""
            },
            "highway/mini_roundabout": {
                "name": "Mini-Roundabout",
                "terms": ""
            },
            "highway/motorway": {
                "name": "Motorway",
                "terms": ""
            },
            "highway/motorway_junction": {
                "name": "Motorway Junction / Exit",
                "terms": ""
            },
            "highway/motorway_link": {
                "name": "Motorway Link",
                "terms": "ramp,on ramp,off ramp"
            },
            "highway/path": {
                "name": "Path",
                "terms": ""
            },
            "highway/pedestrian": {
                "name": "Pedestrian",
                "terms": ""
            },
            "highway/primary": {
                "name": "Primary Road",
                "terms": ""
            },
            "highway/primary_link": {
                "name": "Primary Link",
                "terms": "ramp,on ramp,off ramp"
            },
            "highway/residential": {
                "name": "Residential Road",
                "terms": ""
            },
            "highway/rest_area": {
                "name": "Rest Area",
                "terms": "rest stop,turnout,lay-by"
            },
            "highway/road": {
                "name": "Unknown Road",
                "terms": ""
            },
            "highway/secondary": {
                "name": "Secondary Road",
                "terms": ""
            },
            "highway/secondary_link": {
                "name": "Secondary Link",
                "terms": "ramp,on ramp,off ramp"
            },
            "highway/service": {
                "name": "Service Road",
                "terms": ""
            },
            "highway/service/alley": {
                "name": "Alley",
                "terms": ""
            },
            "highway/service/drive-through": {
                "name": "Drive-Through",
                "terms": ""
            },
            "highway/service/driveway": {
                "name": "Driveway",
                "terms": ""
            },
            "highway/service/emergency_access": {
                "name": "Emergency Access",
                "terms": ""
            },
            "highway/service/parking_aisle": {
                "name": "Parking Aisle",
                "terms": ""
            },
            "highway/services": {
                "name": "Service Area",
                "terms": "services,travel plaza,service station"
            },
            "highway/steps": {
                "name": "Steps",
                "terms": "stairs,staircase"
            },
            "highway/stop": {
                "name": "Stop Sign",
                "terms": "stop sign"
            },
            "highway/street_lamp": {
                "name": "Street Lamp",
                "terms": "streetlight,street light,lamp,light,gaslight"
            },
            "highway/tertiary": {
                "name": "Tertiary Road",
                "terms": ""
            },
            "highway/tertiary_link": {
                "name": "Tertiary Link",
                "terms": "ramp,on ramp,off ramp"
            },
            "highway/track": {
                "name": "Track",
                "terms": ""
            },
            "highway/traffic_signals": {
                "name": "Traffic Signals",
                "terms": "light,stoplight,traffic light"
            },
            "highway/trunk": {
                "name": "Trunk Road",
                "terms": ""
            },
            "highway/trunk_link": {
                "name": "Trunk Link",
                "terms": "ramp,on ramp,off ramp"
            },
            "highway/turning_circle": {
                "name": "Turning Circle",
                "terms": ""
            },
            "highway/unclassified": {
                "name": "Unclassified Road",
                "terms": ""
            },
            "historic": {
                "name": "Historic Site",
                "terms": ""
            },
            "historic/archaeological_site": {
                "name": "Archaeological Site",
                "terms": ""
            },
            "historic/boundary_stone": {
                "name": "Boundary Stone",
                "terms": ""
            },
            "historic/castle": {
                "name": "Castle",
                "terms": ""
            },
            "historic/memorial": {
                "name": "Memorial",
                "terms": ""
            },
            "historic/monument": {
                "name": "Monument",
                "terms": ""
            },
            "historic/ruins": {
                "name": "Ruins",
                "terms": ""
            },
            "historic/wayside_cross": {
                "name": "Wayside Cross",
                "terms": ""
            },
            "historic/wayside_shrine": {
                "name": "Wayside Shrine",
                "terms": ""
            },
            "landuse": {
                "name": "Landuse",
                "terms": ""
            },
            "landuse/allotments": {
                "name": "Allotments",
                "terms": ""
            },
            "landuse/basin": {
                "name": "Basin",
                "terms": ""
            },
            "landuse/cemetery": {
                "name": "Cemetery",
                "terms": ""
            },
            "landuse/churchyard": {
                "name": "Churchyard",
                "terms": ""
            },
            "landuse/commercial": {
                "name": "Commercial",
                "terms": ""
            },
            "landuse/construction": {
                "name": "Construction",
                "terms": ""
            },
            "landuse/farm": {
                "name": "Farm",
                "terms": ""
            },
            "landuse/farmland": {
                "name": "Farmland",
                "terms": ""
            },
            "landuse/farmyard": {
                "name": "Farmyard",
                "terms": ""
            },
            "landuse/forest": {
                "name": "Forest",
                "terms": ""
            },
            "landuse/grass": {
                "name": "Grass",
                "terms": ""
            },
            "landuse/industrial": {
                "name": "Industrial",
                "terms": ""
            },
            "landuse/landfill": {
                "name": "Landfill",
                "terms": "dump"
            },
            "landuse/meadow": {
                "name": "Meadow",
                "terms": ""
            },
            "landuse/military": {
                "name": "Military",
                "terms": ""
            },
            "landuse/orchard": {
                "name": "Orchard",
                "terms": ""
            },
            "landuse/quarry": {
                "name": "Quarry",
                "terms": ""
            },
            "landuse/residential": {
                "name": "Residential",
                "terms": ""
            },
            "landuse/retail": {
                "name": "Retail",
                "terms": ""
            },
            "landuse/vineyard": {
                "name": "Vineyard",
                "terms": ""
            },
            "leisure": {
                "name": "Leisure",
                "terms": ""
            },
            "leisure/common": {
                "name": "Common",
                "terms": "open space"
            },
            "leisure/dog_park": {
                "name": "Dog Park",
                "terms": ""
            },
            "leisure/firepit": {
                "name": "Firepit",
                "terms": "fireplace,campfire"
            },
            "leisure/garden": {
                "name": "Garden",
                "terms": ""
            },
            "leisure/golf_course": {
                "name": "Golf Course",
                "terms": "links"
            },
            "leisure/ice_rink": {
                "name": "Ice Rink",
                "terms": "hockey,skating,curling"
            },
            "leisure/marina": {
                "name": "Marina",
                "terms": ""
            },
            "leisure/park": {
                "name": "Park",
                "terms": "esplanade,estate,forest,garden,grass,green,grounds,lawn,lot,meadow,parkland,place,playground,plaza,pleasure garden,recreation area,square,tract,village green,woodland"
            },
            "leisure/picnic_table": {
                "name": "Picnic Table",
                "terms": "bench,table"
            },
            "leisure/pitch": {
                "name": "Sport Pitch",
                "terms": ""
            },
            "leisure/pitch/american_football": {
                "name": "American Football Field",
                "terms": ""
            },
            "leisure/pitch/baseball": {
                "name": "Baseball Diamond",
                "terms": ""
            },
            "leisure/pitch/basketball": {
                "name": "Basketball Court",
                "terms": ""
            },
            "leisure/pitch/skateboard": {
                "name": "Skate Park",
                "terms": ""
            },
            "leisure/pitch/soccer": {
                "name": "Soccer Field",
                "terms": ""
            },
            "leisure/pitch/tennis": {
                "name": "Tennis Court",
                "terms": ""
            },
            "leisure/pitch/volleyball": {
                "name": "Volleyball Court",
                "terms": ""
            },
            "leisure/playground": {
                "name": "Playground",
                "terms": "jungle gym,play area"
            },
            "leisure/slipway": {
                "name": "Slipway",
                "terms": ""
            },
            "leisure/sports_center": {
                "name": "Sports Center / Gym",
                "terms": "gym"
            },
            "leisure/stadium": {
                "name": "Stadium",
                "terms": ""
            },
            "leisure/swimming_pool": {
                "name": "Swimming Pool",
                "terms": ""
            },
            "leisure/track": {
                "name": "Race Track",
                "terms": ""
            },
            "line": {
                "name": "Line",
                "terms": ""
            },
            "man_made": {
                "name": "Man Made",
                "terms": ""
            },
            "man_made/breakwater": {
                "name": "Breakwater",
                "terms": ""
            },
            "man_made/cutline": {
                "name": "Cut line",
                "terms": ""
            },
            "man_made/embankment": {
                "name": "Embankment",
                "terms": ""
            },
            "man_made/flagpole": {
                "name": "Flagpole",
                "terms": ""
            },
            "man_made/lighthouse": {
                "name": "Lighthouse",
                "terms": ""
            },
            "man_made/observation": {
                "name": "Observation Tower",
                "terms": "lookout tower,fire tower"
            },
            "man_made/pier": {
                "name": "Pier",
                "terms": ""
            },
            "man_made/pipeline": {
                "name": "Pipeline",
                "terms": ""
            },
            "man_made/survey_point": {
                "name": "Survey Point",
                "terms": ""
            },
            "man_made/tower": {
                "name": "Tower",
                "terms": ""
            },
            "man_made/wastewater_plant": {
                "name": "Wastewater Plant",
                "terms": "sewage works,sewage treatment plant,water treatment plant,reclamation plant"
            },
            "man_made/water_tower": {
                "name": "Water Tower",
                "terms": ""
            },
            "man_made/water_well": {
                "name": "Water well",
                "terms": ""
            },
            "man_made/water_works": {
                "name": "Water Works",
                "terms": ""
            },
            "military/airfield": {
                "name": "Airfield",
                "terms": ""
            },
            "military/barracks": {
                "name": "Barracks",
                "terms": ""
            },
            "military/bunker": {
                "name": "Bunker",
                "terms": ""
            },
            "military/range": {
                "name": "Military Range",
                "terms": ""
            },
            "natural": {
                "name": "Natural",
                "terms": ""
            },
            "natural/bay": {
                "name": "Bay",
                "terms": ""
            },
            "natural/beach": {
                "name": "Beach",
                "terms": ""
            },
            "natural/cliff": {
                "name": "Cliff",
                "terms": ""
            },
            "natural/coastline": {
                "name": "Coastline",
                "terms": "shore"
            },
            "natural/fell": {
                "name": "Fell",
                "terms": ""
            },
            "natural/glacier": {
                "name": "Glacier",
                "terms": ""
            },
            "natural/grassland": {
                "name": "Grassland",
                "terms": ""
            },
            "natural/heath": {
                "name": "Heath",
                "terms": ""
            },
            "natural/peak": {
                "name": "Peak",
                "terms": "acme,aiguille,alp,climax,crest,crown,hill,mount,mountain,pinnacle,summit,tip,top"
            },
            "natural/scree": {
                "name": "Scree",
                "terms": "loose rocks"
            },
            "natural/scrub": {
                "name": "Scrub",
                "terms": ""
            },
            "natural/spring": {
                "name": "Spring",
                "terms": ""
            },
            "natural/tree": {
                "name": "Tree",
                "terms": ""
            },
            "natural/water": {
                "name": "Water",
                "terms": ""
            },
            "natural/water/lake": {
                "name": "Lake",
                "terms": "lakelet,loch,mere"
            },
            "natural/water/pond": {
                "name": "Pond",
                "terms": "lakelet,millpond,tarn,pool,mere"
            },
            "natural/water/reservoir": {
                "name": "Reservoir",
                "terms": ""
            },
            "natural/wetland": {
                "name": "Wetland",
                "terms": ""
            },
            "natural/wood": {
                "name": "Wood",
                "terms": ""
            },
            "office": {
                "name": "Office",
                "terms": ""
            },
            "office/accountant": {
                "name": "Accountant",
                "terms": ""
            },
            "office/administrative": {
                "name": "Administrative Office",
                "terms": ""
            },
            "office/architect": {
                "name": "Architect",
                "terms": ""
            },
            "office/company": {
                "name": "Company Office",
                "terms": ""
            },
            "office/educational_institution": {
                "name": "Educational Institution",
                "terms": ""
            },
            "office/employment_agency": {
                "name": "Employment Agency",
                "terms": ""
            },
            "office/estate_agent": {
                "name": "Real Estate Office",
                "terms": ""
            },
            "office/financial": {
                "name": "Financial Office",
                "terms": ""
            },
            "office/government": {
                "name": "Government Office",
                "terms": ""
            },
            "office/insurance": {
                "name": "Insurance Office",
                "terms": ""
            },
            "office/it": {
                "name": "IT Office",
                "terms": ""
            },
            "office/lawyer": {
                "name": "Law Office",
                "terms": ""
            },
            "office/newspaper": {
                "name": "Newspaper",
                "terms": ""
            },
            "office/ngo": {
                "name": "NGO Office",
                "terms": ""
            },
            "office/physician": {
                "name": "Physician",
                "terms": ""
            },
            "office/political_party": {
                "name": "Political Party",
                "terms": ""
            },
            "office/research": {
                "name": "Research Office",
                "terms": ""
            },
            "office/telecommunication": {
                "name": "Telecom Office",
                "terms": ""
            },
            "office/therapist": {
                "name": "Therapist",
                "terms": ""
            },
            "office/travel_agent": {
                "name": "Travel Agency",
                "terms": ""
            },
            "piste": {
                "name": "Piste/Ski Trail",
                "terms": "ski,sled,sleigh,snowboard,nordic,downhill,snowmobile"
            },
            "place": {
                "name": "Place",
                "terms": ""
            },
            "place/city": {
                "name": "City",
                "terms": ""
            },
            "place/hamlet": {
                "name": "Hamlet",
                "terms": ""
            },
            "place/island": {
                "name": "Island",
                "terms": "archipelago,atoll,bar,cay,isle,islet,key,reef"
            },
            "place/isolated_dwelling": {
                "name": "Isolated Dwelling",
                "terms": ""
            },
            "place/locality": {
                "name": "Locality",
                "terms": ""
            },
            "place/neighbourhood": {
                "name": "Neighborhood",
                "terms": "neighbourhood"
            },
            "place/suburb": {
                "name": "Borough",
                "terms": "Boro,Quarter"
            },
            "place/town": {
                "name": "Town",
                "terms": ""
            },
            "place/village": {
                "name": "Village",
                "terms": ""
            },
            "point": {
                "name": "Point",
                "terms": ""
            },
            "power": {
                "name": "Power",
                "terms": ""
            },
            "power/generator": {
                "name": "Power Generator",
                "terms": ""
            },
            "power/line": {
                "name": "Power Line",
                "terms": ""
            },
            "power/minor_line": {
                "name": "Minor Power Line",
                "terms": ""
            },
            "power/pole": {
                "name": "Power Pole",
                "terms": ""
            },
            "power/sub_station": {
                "name": "Substation",
                "terms": ""
            },
            "power/tower": {
                "name": "High-Voltage Tower",
                "terms": ""
            },
            "power/transformer": {
                "name": "Transformer",
                "terms": ""
            },
            "public_transport/platform": {
                "name": "Platform",
                "terms": ""
            },
            "public_transport/stop_position": {
                "name": "Stop Position",
                "terms": ""
            },
            "railway": {
                "name": "Railway",
                "terms": ""
            },
            "railway/abandoned": {
                "name": "Abandoned Railway",
                "terms": ""
            },
            "railway/disused": {
                "name": "Disused Railway",
                "terms": ""
            },
            "railway/funicular": {
                "name": "Funicular",
                "terms": "venicular,cliff railway,cable car,cable railway,funicular railway"
            },
            "railway/halt": {
                "name": "Railway Halt",
                "terms": "break,interrupt,rest,wait,interruption"
            },
            "railway/level_crossing": {
                "name": "Level Crossing",
                "terms": "crossing,railroad crossing,railway crossing,grade crossing,road through railroad,train crossing"
            },
            "railway/monorail": {
                "name": "Monorail",
                "terms": ""
            },
            "railway/narrow_gauge": {
                "name": "Narrow Gauge Rail",
                "terms": "narrow gauge railway,narrow gauge railroad"
            },
            "railway/platform": {
                "name": "Railway Platform",
                "terms": ""
            },
            "railway/rail": {
                "name": "Rail",
                "terms": ""
            },
            "railway/station": {
                "name": "Railway Station",
                "terms": "train station,station"
            },
            "railway/subway": {
                "name": "Subway",
                "terms": ""
            },
            "railway/subway_entrance": {
                "name": "Subway Entrance",
                "terms": ""
            },
            "railway/tram": {
                "name": "Tram",
                "terms": "streetcar"
            },
            "relation": {
                "name": "Relation",
                "terms": ""
            },
            "route/ferry": {
                "name": "Ferry Route",
                "terms": ""
            },
            "shop": {
                "name": "Shop",
                "terms": ""
            },
            "shop/alcohol": {
                "name": "Liquor Store",
                "terms": "alcohol"
            },
            "shop/art": {
                "name": "Art Shop",
                "terms": "art store,art gallery"
            },
            "shop/bakery": {
                "name": "Bakery",
                "terms": ""
            },
            "shop/beauty": {
                "name": "Beauty Shop",
                "terms": "nail spa,spa,salon,tanning"
            },
            "shop/beverages": {
                "name": "Beverage Store",
                "terms": ""
            },
            "shop/bicycle": {
                "name": "Bicycle Shop",
                "terms": ""
            },
            "shop/bookmaker": {
                "name": "Bookmaker",
                "terms": ""
            },
            "shop/books": {
                "name": "Bookstore",
                "terms": ""
            },
            "shop/boutique": {
                "name": "Boutique",
                "terms": ""
            },
            "shop/butcher": {
                "name": "Butcher",
                "terms": ""
            },
            "shop/car": {
                "name": "Car Dealership",
                "terms": ""
            },
            "shop/car_parts": {
                "name": "Car Parts Store",
                "terms": ""
            },
            "shop/car_repair": {
                "name": "Car Repair Shop",
                "terms": ""
            },
            "shop/chemist": {
                "name": "Chemist",
                "terms": ""
            },
            "shop/clothes": {
                "name": "Clothing Store",
                "terms": ""
            },
            "shop/computer": {
                "name": "Computer Store",
                "terms": ""
            },
            "shop/confectionery": {
                "name": "Confectionery",
                "terms": ""
            },
            "shop/convenience": {
                "name": "Convenience Store",
                "terms": ""
            },
            "shop/deli": {
                "name": "Deli",
                "terms": ""
            },
            "shop/department_store": {
                "name": "Department Store",
                "terms": ""
            },
            "shop/doityourself": {
                "name": "DIY Store",
                "terms": ""
            },
            "shop/dry_cleaning": {
                "name": "Dry Cleaners",
                "terms": ""
            },
            "shop/electronics": {
                "name": "Electronics Store",
                "terms": ""
            },
            "shop/farm": {
                "name": "Produce Stand",
                "terms": "farm shop,farm stand"
            },
            "shop/fishmonger": {
                "name": "Fishmonger",
                "terms": ""
            },
            "shop/florist": {
                "name": "Florist",
                "terms": ""
            },
            "shop/funeral_directors": {
                "name": "Funeral Home",
                "terms": "undertaker,funeral parlour,funeral parlor,memorial home"
            },
            "shop/furniture": {
                "name": "Furniture Store",
                "terms": ""
            },
            "shop/garden_centre": {
                "name": "Garden Center",
                "terms": "garden centre"
            },
            "shop/gift": {
                "name": "Gift Shop",
                "terms": ""
            },
            "shop/greengrocer": {
                "name": "Greengrocer",
                "terms": ""
            },
            "shop/hairdresser": {
                "name": "Hairdresser",
                "terms": ""
            },
            "shop/hardware": {
                "name": "Hardware Store",
                "terms": ""
            },
            "shop/hifi": {
                "name": "Hifi Store",
                "terms": ""
            },
            "shop/jewelry": {
                "name": "Jeweler",
                "terms": ""
            },
            "shop/kiosk": {
                "name": "Kiosk",
                "terms": ""
            },
            "shop/laundry": {
                "name": "Laundry",
                "terms": ""
            },
            "shop/locksmith": {
                "name": "Locksmith",
                "terms": "keys"
            },
            "shop/lottery": {
                "name": "Lottery Shop",
                "terms": ""
            },
            "shop/mall": {
                "name": "Mall",
                "terms": ""
            },
            "shop/mobile_phone": {
                "name": "Mobile Phone Store",
                "terms": ""
            },
            "shop/motorcycle": {
                "name": "Motorcycle Dealership",
                "terms": ""
            },
            "shop/music": {
                "name": "Music Store",
                "terms": ""
            },
            "shop/newsagent": {
                "name": "Newsagent",
                "terms": ""
            },
            "shop/optician": {
                "name": "Optician",
                "terms": ""
            },
            "shop/outdoor": {
                "name": "Outdoor Store",
                "terms": ""
            },
            "shop/pet": {
                "name": "Pet Store",
                "terms": ""
            },
            "shop/photo": {
                "name": "Photography Store",
                "terms": ""
            },
            "shop/seafood": {
                "name": "Seafood Shop",
                "terms": "fishmonger"
            },
            "shop/shoes": {
                "name": "Shoe Store",
                "terms": ""
            },
            "shop/sports": {
                "name": "Sporting Goods Store",
                "terms": ""
            },
            "shop/stationery": {
                "name": "Stationery Store",
                "terms": ""
            },
            "shop/supermarket": {
                "name": "Supermarket",
                "terms": "bazaar,boutique,chain,co-op,cut-rate store,discount store,five-and-dime,flea market,galleria,grocery store,mall,mart,outlet,outlet store,shop,shopping center,shopping centre,shopping plaza,stand,store,supermarket,thrift shop"
            },
            "shop/tailor": {
                "name": "Tailor",
                "terms": "tailor,clothes"
            },
            "shop/toys": {
                "name": "Toy Store",
                "terms": ""
            },
            "shop/travel_agency": {
                "name": "Travel Agency",
                "terms": ""
            },
            "shop/tyres": {
                "name": "Tire Store",
                "terms": ""
            },
            "shop/vacant": {
                "name": "Vacant Shop",
                "terms": ""
            },
            "shop/variety_store": {
                "name": "Variety Store",
                "terms": ""
            },
            "shop/video": {
                "name": "Video Store",
                "terms": ""
            },
            "shop/wine": {
                "name": "Wine Shop",
                "terms": "winery"
            },
            "tourism": {
                "name": "Tourism",
                "terms": ""
            },
            "tourism/alpine_hut": {
                "name": "Alpine Hut",
                "terms": ""
            },
            "tourism/artwork": {
                "name": "Artwork",
                "terms": "mural,sculpture,statue"
            },
            "tourism/attraction": {
                "name": "Tourist Attraction",
                "terms": ""
            },
            "tourism/camp_site": {
                "name": "Camp Site",
                "terms": "camping"
            },
            "tourism/caravan_site": {
                "name": "RV Park",
                "terms": ""
            },
            "tourism/chalet": {
                "name": "Chalet",
                "terms": ""
            },
            "tourism/guest_house": {
                "name": "Guest House",
                "terms": "B&B,Bed & Breakfast,Bed and Breakfast"
            },
            "tourism/hostel": {
                "name": "Hostel",
                "terms": ""
            },
            "tourism/hotel": {
                "name": "Hotel",
                "terms": ""
            },
            "tourism/information": {
                "name": "Information",
                "terms": ""
            },
            "tourism/motel": {
                "name": "Motel",
                "terms": ""
            },
            "tourism/museum": {
                "name": "Museum",
                "terms": "exhibition,exhibits archive,foundation,gallery,hall,institution,library,menagerie,repository,salon,storehouse,treasury,vault"
            },
            "tourism/picnic_site": {
                "name": "Picnic Site",
                "terms": ""
            },
            "tourism/theme_park": {
                "name": "Theme Park",
                "terms": ""
            },
            "tourism/viewpoint": {
                "name": "Viewpoint",
                "terms": ""
            },
            "tourism/zoo": {
                "name": "Zoo",
                "terms": ""
            },
            "type/boundary": {
                "name": "Boundary",
                "terms": ""
            },
            "type/boundary/administrative": {
                "name": "Administrative Boundary",
                "terms": ""
            },
            "type/multipolygon": {
                "name": "Multipolygon",
                "terms": ""
            },
            "type/restriction": {
                "name": "Restriction",
                "terms": ""
            },
            "type/restriction/no_left_turn": {
                "name": "No Left Turn",
                "terms": ""
            },
            "type/restriction/no_right_turn": {
                "name": "No Right Turn",
                "terms": ""
            },
            "type/restriction/no_straight_on": {
                "name": "No Straight On",
                "terms": ""
            },
            "type/restriction/no_u_turn": {
                "name": "No U-turn",
                "terms": ""
            },
            "type/restriction/only_left_turn": {
                "name": "Left Turn Only",
                "terms": ""
            },
            "type/restriction/only_right_turn": {
                "name": "Right Turn Only",
                "terms": ""
            },
            "type/restriction/only_straight_on": {
                "name": "No Turns",
                "terms": ""
            },
            "type/route": {
                "name": "Route",
                "terms": ""
            },
            "type/route/bicycle": {
                "name": "Cycle Route",
                "terms": ""
            },
            "type/route/bus": {
                "name": "Bus Route",
                "terms": ""
            },
            "type/route/detour": {
                "name": "Detour Route",
                "terms": ""
            },
            "type/route/ferry": {
                "name": "Ferry Route",
                "terms": ""
            },
            "type/route/foot": {
                "name": "Foot Route",
                "terms": ""
            },
            "type/route/hiking": {
                "name": "Hiking Route",
                "terms": ""
            },
            "type/route/pipeline": {
                "name": "Pipeline Route",
                "terms": ""
            },
            "type/route/power": {
                "name": "Power Route",
                "terms": ""
            },
            "type/route/road": {
                "name": "Road Route",
                "terms": ""
            },
            "type/route/train": {
                "name": "Train Route",
                "terms": ""
            },
            "type/route/tram": {
                "name": "Tram Route",
                "terms": ""
            },
            "type/route_master": {
                "name": "Route Master",
                "terms": ""
            },
            "vertex": {
                "name": "Other",
                "terms": ""
            },
            "waterway": {
                "name": "Waterway",
                "terms": ""
            },
            "waterway/canal": {
                "name": "Canal",
                "terms": ""
            },
            "waterway/dam": {
                "name": "Dam",
                "terms": ""
            },
            "waterway/ditch": {
                "name": "Ditch",
                "terms": ""
            },
            "waterway/drain": {
                "name": "Drain",
                "terms": ""
            },
            "waterway/river": {
                "name": "River",
                "terms": "beck,branch,brook,course,creek,estuary,rill,rivulet,run,runnel,stream,tributary,watercourse"
            },
            "waterway/riverbank": {
                "name": "Riverbank",
                "terms": ""
            },
            "waterway/stream": {
                "name": "Stream",
                "terms": "beck,branch,brook,burn,course,creek,current,drift,flood,flow,freshet,race,rill,rindle,rivulet,run,runnel,rush,spate,spritz,surge,tide,torrent,tributary,watercourse"
            },
            "waterway/weir": {
                "name": "Weir",
                "terms": ""
            }
        }
    }
}