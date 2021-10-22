import sjcl from "sjcl";

function verifyPassword(password, storedPasswordHash) {
    const [_key, _salt] = storedPasswordHash.split("$");
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);

    if (_key != derivedBaseKey) {
        //TODO: Password Falsch

        return;
    }
    /// TODO: Password Richtig


}

verifyPassword(workerData.password, workerData.storedPassword);
