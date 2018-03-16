

function isEmptyObject(e) {
    for (var t in e) {
        return false;
    }
    return true;
}

exports.isEmptyObject = isEmptyObject;