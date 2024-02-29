// Override module locateFile method
Module["locateFile"] = function (path, prefix) {
    return "./".concat(path);
};
