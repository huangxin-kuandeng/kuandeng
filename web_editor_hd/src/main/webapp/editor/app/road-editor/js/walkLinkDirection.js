/**
 * Created by wt on 2015/11/19.
 */
;;(function (iD) {
    var walkLinkDirectionFlag = false;
    iD = iD || {};
    iD.WalkLinkDirection = {
        getWalkLinkDirection: function () {
            return walkLinkDirectionFlag;
        },
        changeWalkLinkDirection: function () {
            if (walkLinkDirectionFlag == true)
                walkLinkDirectionFlag = false;
            else {
                walkLinkDirectionFlag = true;
            }
        },
    }
})(iD);