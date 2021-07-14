// https://www.oschina.net/question/565065_138923
function GeoPoint(x, y) {
    this.x = x;
    this.y = y;
}

function GeoRect(minX, maxX, minY, maxY) {
    this.minX = 0;
    this.minY = -2;
    this.maxX = 0;
    this.maxY = -2;
    if (arguments.length == 1 && minX instanceof GeoRect) {
        let envelope = minX;
        this.minX = envelope.minX;
        this.maxX = envelope.maxX;
        this.minY = envelope.minY;
        this.maxY = envelope.maxY;
    } else if (arguments.length == 2 && minX instanceof GeoPoint && maxX instanceof GeoPoint) {
        if (coord1.x < coord2.x) {
            this.minX = coord1.x;
            this.maxX = coord2.x;
        } else {
            this.minX = coord2.x;
            this.maxX = coord1.x;
        }
        if (coord1.y < coord2.y) {
            this.minY = coord1.y;
            this.maxY = coord2.y;
        } else {
            this.minY = coord2.y;
            this.maxY = coord1.y;
        }
    } else if (arguments.length == 4) {
        if (minX > maxX) {
            this.minX = maxX;
            this.maxX = minX;
        } else {
            this.minX = minX;
            this.maxX = maxX;
        }

        if (minY > maxY) {
            this.minY = maxY;
            this.maxY = minY;
        } else {
            this.minY = minY;
            this.maxY = maxY;
        }
    }
}

GeoRect.prototype.InterSects = function(otherEvp) {
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;
    //上下左右四个方向
    if (maxX < otherEvp.minX || minX > otherEvp.maxX ||
        maxY < otherEvp.minY || minY > otherEvp.maxY) {
        return 0;
    }

    //四个对角方向
    if (maxX < otherEvp.minX && maxY < otherEvp.minY) {
        return 0;
    }
    if (maxX < otherEvp.minX && minY > otherEvp.maxY) {
        return 0;
    }

    //在矩形内
    if (minX >= otherEvp.minX && maxX <= otherEvp.maxX &&
        minY >= otherEvp.minY && maxY <= otherEvp.maxY) {
        return 1;
    }

    return 2; //相交
}

GeoRect.prototype.ExpandToInclude = function(x, y) {
    if (x == null) return;
    if (x instanceof GeoRect) {
        let other = x;
        if (other.IsNull()) {
            return;
        }
        if (IsNull()) {
            this.minX = other.minX;
            this.maxX = other.maxX;
            this.minY = other.minY;
            this.maxY = other.maxY;
        } else {
            if (other.minX < minX) {
                this.minX = other.minX;
            }
            if (other.maxX > maxX) {
                this.maxX = other.maxX;
            }
            if (other.minY < minY) {
                this.minY = other.minY;
            }
            if (other.maxY > maxY) {
                this.maxY = other.maxY;
            }
        }
        return ;
    }
    if (x instanceof GeoPoint) {
        y = x.y;
        x = x.x;
    }
    if (this.IsNull()) {
        this.minX = x;
        this.maxX = x;
        this.minY = y;
        this.maxY = y;
    } else {
        if (x < minX) {
            this.minX = x;
        }
        if (x > maxX) {
            this.maxX = x;
        }
        if (y < minY) {
            this.minY = y;
        }
        if (y > maxY) {
            this.maxY = y;
        }
    }
}

GeoRect.prototype.IsNull = function() {
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;
    if (maxX < minX || maxY < minY) {
        return true;
    }
    return false;

}

GeoRect.prototype.GetWidth = function() {
    if (this.IsNull()) {
        return 0;
    }
    let minX = this.minX,
        maxX = this.maxX;
    return Math.abs(maxX - minX);
}
// 获取最小外界矩形的高度  
GeoRect.prototype.GetHeight = function() {
    if (this.IsNull()) {
        return 0;
    }
    let minY = this.minY,
        maxY = this.maxY;
    return Math.abs(maxY - minY);
}

GeoRect.prototype.Center = function() {
    if (this.IsNull()) {
        return null;
    }
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;

    return new GeoPoint((minX + maxX) / 2,
        (minY + maxY) / 2);
}

GeoRect.prototype.Contains = function(env) {
    if (this.IsNull() || this.IsNull()) {
        return false;
    }
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;
    return env.minX > minX &&
        env.maxX < maxX &&
        env.minY > minY &&
        env.maxY < maxY;
}

GeoRect.prototype.IsPointInRect = function(x, y) {
    if (this.IsNull()) {
        return false;
    }
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;

    if (x > minX && x < maxX && y > minY && y < maxY) {
        return 1;
    }
    return 0;
}

GeoRect.prototype.Intersection = function(env) {
    if (this.IsNull() || env.IsNull() || !this.InterSects(env)) return new GeoRect();
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;

    let intMinX = minX > env.minX ? minX : env.minX;
    let intMinY = minY > env.minY ? minY : env.minY;
    let intMaxX = maxX < env.maxX ? maxX : env.maxX;
    let intMaxY = maxY < env.maxY ? maxY : env.maxY;
    return new GeoRect(intMinX, intMaxX, intMinY, intMaxY);

}

GeoRect.prototype.DistanceTo = function(env) {
    //如果相交，距离则为0  
    if (this.InterSects(env)) {
        return 0;
    }
    let minX = this.minX,
        maxX = this.maxX,
        minY = this.minY,
        maxY = this.maxY;

    let dx = 0;
    if (maxX < env.minX) {
        dx = env.minX - maxX;
    }
    if (minX > env.maxX) {
        dx = minX - env.maxX;
    }

    let dy = 0;
    if (maxY < env.minY) {
        dy = env.minY - maxY;
    }
    if (minY > env.maxY) {
        dy = minY - env.maxY;
    }

    //如果其中之一为0，则计算水平或者垂直距离  
    if (0.0 == dx) {
        return dy;
    }
    if (0.0 == dy) {
        return dx;
    }
    return Math.sqrt(dx * dx + dy * dy);
}

GeoRect.prototype.Area = function() {
    if (this.IsNull()) {
        return 0;
    }
    return this.GetHeight() * this.GetWidth();
}

GeoRect.prototype.Perimeter = function() {
    if (this.IsNull()) {
        return 0;
    }
    return this.GetWidth() * 2 + this.GetHeight() * 2;
}

GeoRect.prototype.Translate = function(transX, transX) {
    if (this.IsNull()) {
        return;
    }
    this.minX += transX;
    this.maxX += transX;
    this.minY += transY;
    this.maxY += transY;
}