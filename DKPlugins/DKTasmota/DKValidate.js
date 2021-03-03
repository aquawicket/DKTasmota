function IsValidVarName(name) {
    try {
        // Update, previoulsy it was
        // eval('(function() { var ' + name + '; })()');
        Function('var ' + name);
    } catch (e) {
        return false;
    }
    return true;
}
